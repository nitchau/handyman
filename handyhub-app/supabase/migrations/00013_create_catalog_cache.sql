-- ============================================================
-- Migration 00013: Create catalog_cache table with seed data
-- ============================================================

CREATE TABLE catalog_cache (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku           text NOT NULL,
  name          text NOT NULL,
  brand         text,
  category      text NOT NULL,
  retailer      text NOT NULL,
  price         numeric(10,2) NOT NULL,
  unit          text NOT NULL,
  url           text NOT NULL DEFAULT '',
  in_stock      boolean NOT NULL DEFAULT true,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Trigram index for fuzzy name matching (pg_trgm enabled in 00012)
CREATE INDEX idx_catalog_cache_name_trgm ON catalog_cache USING gin (name gin_trgm_ops);
CREATE INDEX idx_catalog_cache_category ON catalog_cache (category);
CREATE INDEX idx_catalog_cache_retailer ON catalog_cache (retailer);

-- RPC for fuzzy matching
CREATE OR REPLACE FUNCTION match_catalog_item(
  p_name text,
  p_category text DEFAULT NULL,
  p_limit int DEFAULT 3
)
RETURNS TABLE(
  id uuid,
  sku text,
  name text,
  brand text,
  category text,
  retailer text,
  price numeric,
  unit text,
  url text,
  in_stock boolean,
  similarity_score real
)
LANGUAGE sql STABLE
AS $$
  SELECT
    c.id, c.sku, c.name, c.brand, c.category, c.retailer,
    c.price, c.unit, c.url, c.in_stock,
    similarity(c.name, p_name) AS similarity_score
  FROM catalog_cache c
  WHERE (p_category IS NULL OR c.category = p_category)
    AND similarity(c.name, p_name) > 0.15
  ORDER BY similarity(c.name, p_name) DESC
  LIMIT p_limit;
$$;

-- ============================================================
-- Seed ~50 real SKUs across common home improvement categories
-- ============================================================

INSERT INTO catalog_cache (sku, name, brand, category, retailer, price, unit, url, in_stock) VALUES
-- Paint (interior/exterior, primer)
('PPG1025-3', 'Interior Latex Paint - Eggshell White (1 gal)', 'PPG Diamond', 'paint', 'home_depot', 38.98, 'gallon', '', true),
('?"7GHIJ1', 'Interior Paint + Primer - Semi-Gloss White (1 gal)', 'Behr Premium Plus', 'paint', 'home_depot', 33.98, 'gallon', '', true),
('SWP-7006', 'Interior Latex Paint - Extra White Flat (1 gal)', 'Sherwin-Williams', 'lowes', 36.98, 'gallon', '', true),
('BEHR-7100', 'Exterior Paint + Primer - Flat Ultra Pure White (1 gal)', 'Behr Ultra', 'paint', 'home_depot', 43.98, 'gallon', '', true),
('ZIN-01501', 'Bulls Eye 1-2-3 Primer Sealer (1 gal)', 'Zinsser', 'paint', 'home_depot', 24.98, 'gallon', '', true),
('KIL-10041', 'Original Interior Primer (1 gal)', 'Kilz', 'paint', 'lowes', 22.98, 'gallon', '', true),
('PUR-2500', 'Painters Tape 1.88 in x 60 yd', 'ScotchBlue', 'paint', 'home_depot', 7.98, 'each', '', true),
('WRF-1830', '9 in. Paint Roller Cover (3-Pack)', 'Wooster', 'paint', 'lowes', 12.48, 'each', '', true),
('DRP-4X12', 'Canvas Drop Cloth 4 ft x 12 ft', 'HDX', 'paint', 'home_depot', 11.97, 'each', '', true),

-- Lumber
('LUM-2448', 'Kiln-Dried Whitewood Stud 2x4x96 in', 'Generic', 'lumber', 'home_depot', 3.98, 'each', '', true),
('LUM-2408', 'Kiln-Dried Whitewood Stud 2x4x8 ft', 'Generic', 'lumber', 'lowes', 4.28, 'each', '', true),
('LUM-2610', 'Pressure-Treated Lumber 2x6x10 ft', 'Generic', 'lumber', 'home_depot', 9.87, 'each', '', true),
('PLY-2348', 'Sanded Plywood 3/4 in x 4 ft x 8 ft', 'Columbia Forest', 'lumber', 'home_depot', 54.98, 'each', '', true),
('PLY-0248', 'OSB Sheathing 7/16 in x 4 ft x 8 ft', 'LP', 'lumber', 'lowes', 18.48, 'each', '', true),
('SMP-1X48', 'Common Board 1x4x8 ft', 'Generic', 'lumber', 'home_depot', 5.28, 'each', '', true),

-- Drywall
('DRY-4812', 'Drywall Panel 1/2 in x 4 ft x 8 ft', 'Gold Bond', 'drywall', 'home_depot', 12.98, 'each', '', true),
('DRY-5812', 'Mold-Resistant Drywall 5/8 in x 4 ft x 8 ft', 'National Gypsum', 'drywall', 'lowes', 16.48, 'each', '', true),
('JCP-3610', 'All Purpose Joint Compound 3.5 qt', 'DAP', 'drywall', 'home_depot', 9.97, 'each', '', true),
('MTP-0190', 'Drywall Joint Tape 1-7/8 in x 300 ft', 'FibaTape', 'drywall', 'home_depot', 5.47, 'each', '', true),
('DRS-0100', 'Drywall Screws 1-1/4 in (1 lb box)', 'Grip-Rite', 'drywall', 'lowes', 8.98, 'each', '', true),

-- Flooring (LVP, hardwood, tile)
('LVP-4836', 'Luxury Vinyl Plank Flooring - Oak 7 in x 48 in (23.8 sq ft/case)', 'LifeProof', 'flooring', 'home_depot', 52.98, 'sq ft', '', true),
('LVP-1224', 'Luxury Vinyl Plank - Walnut 6 in x 36 in (24 sq ft/case)', 'TrafficMaster', 'flooring', 'home_depot', 29.98, 'sq ft', '', true),
('HWF-0534', 'Engineered Hardwood Flooring - White Oak 5 in (22 sq ft/case)', 'Bruce', 'flooring', 'lowes', 89.98, 'sq ft', '', true),
('FLR-ULAY', 'Standard Foam Underlayment 100 sq ft Roll', 'QuietWalk', 'flooring', 'home_depot', 24.97, 'each', '', true),

-- Tile
('TIL-1212', 'Ceramic Floor Tile 12 in x 12 in White (11 sq ft/case)', 'Daltile', 'tile', 'home_depot', 18.98, 'sq ft', '', true),
('TIL-3636', 'Porcelain Floor Tile 18 in x 18 in Gray (15.3 sq ft/case)', 'MSI', 'tile', 'lowes', 28.98, 'sq ft', '', true),
('TIL-SUB3', 'Subway Tile 3 in x 6 in White (12.5 sq ft/case)', 'Daltile', 'tile', 'home_depot', 16.48, 'sq ft', '', true),
('GRT-0025', 'Sanded Grout 25 lb - Delorean Gray', 'Polyblend', 'tile', 'home_depot', 18.98, 'each', '', true),
('TNS-0050', 'Large Format Thinset Mortar 50 lb', 'Versabond', 'tile', 'home_depot', 19.97, 'each', '', true),
('TIL-SPAC', 'Tile Spacers 1/8 in (200-Pack)', 'QEP', 'tile', 'home_depot', 3.47, 'each', '', true),

-- Plumbing basics
('PLB-FXVL', 'Single-Handle Bathroom Faucet - Chrome', 'Glacier Bay', 'plumbing', 'home_depot', 49.98, 'each', '', true),
('PLB-TOLX', 'Wax Ring Toilet Seal Kit', 'Fluidmaster', 'plumbing', 'home_depot', 5.98, 'each', '', true),
('PLB-SUPL', 'Braided Faucet Supply Lines 3/8 in x 20 in (2-Pack)', 'SharkBite', 'plumbing', 'lowes', 12.98, 'each', '', true),
('PLB-PTFE', 'PTFE Thread Seal Tape 1/2 in x 520 in', 'Harvey', 'plumbing', 'home_depot', 1.28, 'each', '', true),

-- Electrical basics
('ELC-GFCI', 'GFCI Outlet 15A - White', 'Leviton', 'electrical', 'home_depot', 17.97, 'each', '', true),
('ELC-SW15', 'Single Pole Light Switch 15A - White', 'Leviton', 'electrical', 'lowes', 2.48, 'each', '', true),
('ELC-NM14', 'NM-B Wire 14/2 AWG 250 ft', 'Southwire', 'electrical', 'home_depot', 74.97, 'each', '', true),
('ELC-JBOX', 'Old Work Electrical Box 1-Gang', 'Carlon', 'electrical', 'home_depot', 3.14, 'each', '', true),
('ELC-PLAT', 'Wall Plate 1-Gang - White', 'Leviton', 'electrical', 'home_depot', 0.62, 'each', '', true),

-- Fasteners
('FST-WDS3', 'Wood Screws #8 x 3 in (1 lb box)', 'Grip-Rite', 'fasteners', 'home_depot', 9.97, 'each', '', true),
('FST-NL16', 'Finish Nails 16-Gauge 2-1/2 in (1000-Pack)', 'Hitachi', 'fasteners', 'lowes', 14.98, 'each', '', true),
('FST-ANKR', 'Drywall Anchors Self-Drilling (50-Pack)', 'E-Z Ancor', 'fasteners', 'home_depot', 8.97, 'each', '', true),

-- Adhesives & Caulk
('ADH-CK10', 'Silicone Caulk - White 10.1 oz', 'GE', 'adhesives', 'home_depot', 7.98, 'each', '', true),
('ADH-LN90', 'Heavy Duty Construction Adhesive 10 oz', 'Liquid Nails', 'adhesives', 'home_depot', 5.98, 'each', '', true),
('ADH-WG32', 'Wood Glue 32 oz', 'Titebond III', 'adhesives', 'lowes', 15.98, 'each', '', true),

-- Safety gear
('SAF-GGLE', 'Safety Glasses - Clear', '3M', 'safety', 'home_depot', 3.97, 'each', '', true),
('SAF-GLVL', 'Nitrile-Coated Work Gloves - Large', 'HDX', 'safety', 'home_depot', 5.97, 'each', '', true),
('SAF-N95M', 'N95 Respirator Mask (10-Pack)', '3M', 'safety', 'home_depot', 16.97, 'each', '', true),
('SAF-EARM', 'Hearing Protection Earmuffs NRR 30dB', '3M Peltor', 'safety', 'amazon', 24.99, 'each', '', true),
('SAF-KNEE', 'Knee Pads - Professional Gel', 'Custom LeatherCraft', 'safety', 'amazon', 27.99, 'each', '', true);
