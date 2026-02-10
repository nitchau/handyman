-- ============================================================
-- Migration 00010: PostGIS + spatial columns + nearby search RPC
-- ============================================================

-- 1. Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add geography column to contractors + sync trigger
ALTER TABLE contractors
  ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

CREATE OR REPLACE FUNCTION sync_contractor_location()
RETURNS trigger AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.location = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_contractor_location ON contractors;
CREATE TRIGGER trg_sync_contractor_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON contractors
  FOR EACH ROW EXECUTE FUNCTION sync_contractor_location();

-- Back-fill existing rows
UPDATE contractors
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NULL;

-- 3. Add lat/lng + geography to users_profile
ALTER TABLE users_profile
  ADD COLUMN IF NOT EXISTS latitude  double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS location  geography(Point, 4326);

CREATE OR REPLACE FUNCTION sync_user_location()
RETURNS trigger AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.location = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_user_location ON users_profile;
CREATE TRIGGER trg_sync_user_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON users_profile
  FOR EACH ROW EXECUTE FUNCTION sync_user_location();

-- 4. GIST spatial indexes
CREATE INDEX IF NOT EXISTS idx_contractors_location_gist ON contractors USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_users_profile_location_gist ON users_profile USING GIST (location);

-- 5. nearby_contractors RPC function
CREATE OR REPLACE FUNCTION nearby_contractors(
  search_lat     double precision,
  search_lng     double precision,
  radius_miles   int DEFAULT 25,
  category_slug  text DEFAULT NULL,
  min_rating     numeric DEFAULT 0,
  sort_by        text DEFAULT 'distance',
  page_limit     int DEFAULT 20,
  page_offset    int DEFAULT 0
)
RETURNS TABLE (
  id                   uuid,
  user_id              uuid,
  business_name        text,
  bio                  text,
  years_experience     int,
  hourly_rate          numeric,
  service_radius_miles int,
  verification_tier    verification_tier,
  license_number       text,
  insurance_verified   boolean,
  rating_avg           numeric,
  review_count         int,
  latitude             double precision,
  longitude            double precision,
  distance_miles       double precision,
  display_name         text,
  avatar_url           text,
  categories           text[],
  total_count          bigint
) AS $$
DECLARE
  search_point geography;
  radius_meters double precision;
BEGIN
  search_point := ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography;
  radius_meters := radius_miles * 1609.344;

  RETURN QUERY
  WITH filtered AS (
    SELECT
      c.id,
      c.user_id,
      c.business_name,
      c.bio,
      c.years_experience,
      c.hourly_rate,
      c.service_radius_miles,
      c.verification_tier,
      c.license_number,
      c.insurance_verified,
      c.rating_avg,
      c.review_count,
      c.latitude,
      c.longitude,
      ST_Distance(c.location, search_point) / 1609.344 AS distance_miles,
      (u.first_name || ' ' || u.last_name) AS display_name,
      u.avatar_url,
      ARRAY(
        SELECT cat.slug
        FROM contractor_skills cs
        JOIN categories cat ON cat.id = cs.category_id
        WHERE cs.contractor_id = c.id
      ) AS categories
    FROM contractors c
    JOIN users_profile u ON u.id = c.user_id
    WHERE c.location IS NOT NULL
      AND ST_DWithin(c.location, search_point, radius_meters)
      AND c.rating_avg >= min_rating
      AND (
        category_slug IS NULL
        OR EXISTS (
          SELECT 1
          FROM contractor_skills cs
          JOIN categories cat ON cat.id = cs.category_id
          WHERE cs.contractor_id = c.id AND cat.slug = category_slug
        )
      )
  ),
  counted AS (
    SELECT count(*) AS cnt FROM filtered
  )
  SELECT
    f.id,
    f.user_id,
    f.business_name,
    f.bio,
    f.years_experience,
    f.hourly_rate,
    f.service_radius_miles,
    f.verification_tier,
    f.license_number,
    f.insurance_verified,
    f.rating_avg,
    f.review_count,
    f.latitude,
    f.longitude,
    f.distance_miles,
    f.display_name,
    f.avatar_url,
    f.categories,
    counted.cnt AS total_count
  FROM filtered f, counted
  ORDER BY
    CASE WHEN sort_by = 'distance' THEN f.distance_miles END ASC,
    CASE WHEN sort_by = 'rating' THEN f.rating_avg END DESC,
    CASE WHEN sort_by = 'price_low' THEN f.hourly_rate END ASC,
    CASE WHEN sort_by = 'price_high' THEN f.hourly_rate END DESC,
    CASE WHEN sort_by = 'reviews' THEN f.review_count END DESC,
    f.distance_miles ASC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql STABLE;
