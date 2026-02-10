/**
 * seed-contractors.mjs
 *
 * Pulls real Portland-area businesses from Google Places Text Search API
 * and inserts them into Supabase as contractor seed data.
 *
 * Usage:
 *   cd handyhub-app
 *   node scripts/seed-contractors.mjs
 *
 * Reads from .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// ── Load env ────────────────────────────────────────────────────────────
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_KEY =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GOOGLE_KEY) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Category → search query mapping ─────────────────────────────────────
const CATEGORY_QUERIES = [
  { slug: "plumbing", query: "plumber in Portland OR" },
  { slug: "electrical", query: "electrician in Portland OR" },
  { slug: "painting", query: "house painter in Portland OR" },
  { slug: "carpentry", query: "carpenter in Portland OR" },
  { slug: "roofing", query: "roofing contractor in Portland OR" },
  { slug: "landscaping", query: "landscaping company in Portland OR" },
  { slug: "hvac", query: "HVAC contractor in Portland OR" },
  { slug: "flooring", query: "flooring installer in Portland OR" },
  { slug: "kitchen-remodel", query: "kitchen remodeling in Portland OR" },
  { slug: "bathroom-remodel", query: "bathroom remodeling in Portland OR" },
  { slug: "general-handyman", query: "handyman in Portland OR" },
  { slug: "cleaning", query: "house cleaning service in Portland OR" },
];

const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount";

// ── Helpers ─────────────────────────────────────────────────────────────

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRate() {
  return (Math.random() * (150 - 35) + 35).toFixed(2);
}

function weightedVerificationTier() {
  const r = Math.random();
  if (r < 0.1) return "fully_verified";
  if (r < 0.3) return "background_checked";
  if (r < 0.6) return "id_verified";
  return "new";
}

function splitName(displayName) {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "Services" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

function generateBio(businessName, categoryName) {
  const years = randomInt(2, 25);
  const templates = [
    `${businessName} has been proudly serving the Portland area for over ${years} years, specializing in ${categoryName.toLowerCase()}.`,
    `With ${years} years of experience in ${categoryName.toLowerCase()}, ${businessName} delivers quality work and exceptional customer service.`,
    `Portland's trusted ${categoryName.toLowerCase()} professionals. ${businessName} brings ${years} years of expertise to every job.`,
  ];
  return templates[randomInt(0, templates.length - 1)];
}

// ── Google Places Text Search ───────────────────────────────────────────

async function searchPlaces(textQuery) {
  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({ textQuery, maxResultCount: 20 }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`  Places API error (${res.status}): ${body}`);
    return [];
  }

  const data = await res.json();
  return data.places || [];
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed Contractors from Google Places ===\n");

  // 1. Fetch category IDs from Supabase
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, slug, name");

  if (catErr) {
    console.error("Failed to fetch categories:", catErr.message);
    process.exit(1);
  }

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.slug, { id: c.id, name: c.name }])
  );

  // Verify all expected slugs exist
  for (const { slug } of CATEGORY_QUERIES) {
    if (!categoryMap[slug]) {
      console.error(`Category slug "${slug}" not found in database. Run migrations first.`);
      process.exit(1);
    }
  }

  // 2. Search Google Places for each category, dedup by place_id
  // Map: place_id → { place, categorySlugs[] }
  const placeMap = new Map();

  for (const { slug, query } of CATEGORY_QUERIES) {
    console.log(`Searching: "${query}" ...`);
    const places = await searchPlaces(query);
    console.log(`  Found ${places.length} results`);

    for (const place of places) {
      const pid = place.id;
      if (!pid) continue;

      if (placeMap.has(pid)) {
        placeMap.get(pid).categorySlugs.push(slug);
      } else {
        placeMap.set(pid, { place, categorySlugs: [slug] });
      }
    }

    // Respectful rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nTotal unique businesses: ${placeMap.size}\n`);

  // 3. Insert into Supabase
  let inserted = 0;
  let skipped = 0;

  for (const [placeId, { place, categorySlugs }] of placeMap) {
    const displayName = place.displayName?.text || "Unknown Business";
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;

    if (lat == null || lng == null) {
      console.log(`  Skipping "${displayName}" — no coordinates`);
      skipped++;
      continue;
    }

    const clerkId = `places_seed_${placeId}`;
    const { first, last } = splitName(displayName);
    const primaryCategory = categoryMap[categorySlugs[0]]?.name || categorySlugs[0];

    // 3a. Upsert users_profile
    const { data: userRow, error: userErr } = await supabase
      .from("users_profile")
      .upsert(
        {
          clerk_id: clerkId,
          email: `${placeId.toLowerCase().replace(/[^a-z0-9]/g, "")}@seed.handyhub.local`,
          first_name: first,
          last_name: last,
          role: "contractor",
          latitude: lat,
          longitude: lng,
          onboarding_completed: true,
        },
        { onConflict: "clerk_id" }
      )
      .select("id")
      .single();

    if (userErr) {
      console.error(`  Failed to upsert user for "${displayName}":`, userErr.message);
      skipped++;
      continue;
    }

    const userId = userRow.id;

    // 3b. Upsert contractor
    const rating = place.rating ?? 0;
    const reviewCount = place.userRatingCount ?? 0;
    const yearsExp = randomInt(2, 25);

    const { data: contractorRow, error: conErr } = await supabase
      .from("contractors")
      .upsert(
        {
          user_id: userId,
          business_name: displayName,
          bio: generateBio(displayName, primaryCategory),
          years_experience: yearsExp,
          hourly_rate: randomRate(),
          service_radius_miles: randomInt(10, 50),
          verification_tier: weightedVerificationTier(),
          rating_avg: rating,
          review_count: reviewCount,
          latitude: lat,
          longitude: lng,
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (conErr) {
      console.error(`  Failed to upsert contractor for "${displayName}":`, conErr.message);
      skipped++;
      continue;
    }

    const contractorId = contractorRow.id;

    // 3c. Insert contractor_skills (ON CONFLICT DO NOTHING via ignoreDuplicates)
    const skillRows = categorySlugs
      .filter((slug) => categoryMap[slug])
      .map((slug) => ({
        contractor_id: contractorId,
        category_id: categoryMap[slug].id,
      }));

    if (skillRows.length > 0) {
      const { error: skillErr } = await supabase
        .from("contractor_skills")
        .upsert(skillRows, {
          onConflict: "contractor_id,category_id",
          ignoreDuplicates: true,
        });

      if (skillErr) {
        console.error(`  Failed to upsert skills for "${displayName}":`, skillErr.message);
      }
    }

    inserted++;
    if (inserted % 10 === 0) {
      console.log(`  Inserted ${inserted} contractors...`);
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Inserted/updated: ${inserted}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total unique places: ${placeMap.size}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
