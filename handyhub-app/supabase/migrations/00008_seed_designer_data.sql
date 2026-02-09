-- Migration: Seed designer gallery data
-- Inserts 4 designers, 16 design ideas, product tags, and 6 services
-- Uses deterministic UUIDs for idempotency

-- ── 1. Seed users_profile for designers ──────────────────────────────

INSERT INTO users_profile (id, clerk_id, email, first_name, last_name, avatar_url, role, onboarding_completed, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000d01', 'clerk_seed_designer_01', 'sarah@handyhub.test', 'Sarah', 'Chen', 'https://i.pravatar.cc/96?u=sarah', 'designer', TRUE, '2024-01-15'),
  ('00000000-0000-0000-0000-000000000d02', 'clerk_seed_designer_02', 'mike@handyhub.test', 'Mike', 'Rodriguez', 'https://i.pravatar.cc/96?u=mike', 'designer', TRUE, '2025-01-20'),
  ('00000000-0000-0000-0000-000000000d03', 'clerk_seed_designer_03', 'studio@handyhub.test', 'Studio', 'Nook', 'https://i.pravatar.cc/96?u=studionook', 'designer', TRUE, '2023-01-18'),
  ('00000000-0000-0000-0000-000000000d04', 'clerk_seed_designer_04', 'amy@handyhub.test', 'Amy', 'Liu', 'https://i.pravatar.cc/96?u=amy', 'designer', TRUE, '2025-01-25')
ON CONFLICT (id) DO NOTHING;

-- ── 2. Seed designer_profiles ────────────────────────────────────────

INSERT INTO designer_profiles (
  id, user_id, display_name, bio, avatar_url, cover_photo_url,
  designer_tier, specialties, room_types, style_tags,
  portfolio_url, instagram_handle, tiktok_handle, pinterest_handle,
  credentials, credential_verified, years_experience,
  location_city, location_state, accepts_remote_clients,
  rating_avg, review_count, total_ideas_posted, total_likes,
  response_time_hours, is_accepting_clients, created_at, updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-00000000dd01',
    '00000000-0000-0000-0000-000000000d01',
    'Sarah Chen',
    'Modern farmhouse enthusiast with 8 years of experience. I help DIYers create magazine-worthy rooms on realistic budgets. Every design includes a complete shopping list with real prices.',
    'https://i.pravatar.cc/96?u=sarah',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&h=400&fit=crop',
    'verified_designer',
    ARRAY['farmhouse','scandinavian','minimalist'],
    ARRAY['bathroom','kitchen','living_room'],
    ARRAY['farmhouse','scandinavian','minimalist'],
    NULL, 'sarahchen_design', 'sarahchen_design', 'sarahchen_design',
    ARRAY['B.A. Interior Design, SCAD','NCIDQ Certified','ASID Member'],
    TRUE, 8,
    'Portland', 'OR', TRUE,
    4.90, 47, 127, 3200,
    2, TRUE, '2024-01-15', '2026-02-01'
  ),
  (
    '00000000-0000-0000-0000-00000000dd02',
    '00000000-0000-0000-0000-000000000d02',
    'Mike Rodriguez',
    'Industrial and rustic specialist. I turn ordinary spaces into character-filled rooms.',
    'https://i.pravatar.cc/96?u=mike',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&h=400&fit=crop',
    'verified_designer',
    ARRAY['industrial','farmhouse'],
    ARRAY['kitchen','living_room'],
    ARRAY['industrial','farmhouse'],
    NULL, NULL, NULL, NULL,
    ARRAY['10 years residential design'],
    FALSE, 10,
    'Austin', 'TX', TRUE,
    4.70, 32, 84, 1800,
    4, TRUE, '2025-01-20', '2026-02-01'
  ),
  (
    '00000000-0000-0000-0000-00000000dd03',
    '00000000-0000-0000-0000-000000000d03',
    'Studio Nook',
    'Minimalist design studio focused on small-space living. We believe less is more.',
    'https://i.pravatar.cc/96?u=studionook',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1280&h=400&fit=crop',
    'featured_designer',
    ARRAY['minimalist','modern','scandinavian'],
    ARRAY['living_room','bedroom','home_office'],
    ARRAY['minimalist','modern','scandinavian'],
    NULL, 'studionook', NULL, NULL,
    ARRAY['Award-winning studio','Published in Dwell'],
    TRUE, 12,
    'Brooklyn', 'NY', TRUE,
    4.90, 61, 203, 8500,
    6, TRUE, '2023-01-18', '2026-02-01'
  ),
  (
    '00000000-0000-0000-0000-00000000dd04',
    '00000000-0000-0000-0000-000000000d04',
    'Amy Liu',
    'DIY enthusiast sharing my home renovation journey. Budget-friendly ideas for renters and first-time homeowners.',
    'https://i.pravatar.cc/96?u=amy',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&h=400&fit=crop',
    'community_creator',
    ARRAY['scandinavian','bohemian'],
    ARRAY['bedroom','nursery'],
    ARRAY['scandinavian','bohemian'],
    NULL, 'amyliu_diy', NULL, NULL,
    ARRAY[]::text[],
    FALSE, 2,
    'Seattle', 'WA', FALSE,
    4.50, 8, 23, 567,
    12, TRUE, '2025-01-25', '2026-02-01'
  )
ON CONFLICT (id) DO NOTHING;

-- ── 3. Seed design_ideas ─────────────────────────────────────────────

INSERT INTO design_ideas (
  id, designer_id, title, description, room_type, style, budget_tier,
  estimated_cost, difficulty_level, is_diy_friendly,
  media_urls, primary_photo_url, before_photo_url,
  tags, view_count, like_count, save_count, share_count,
  is_published, is_featured, created_at, updated_at
)
VALUES
  -- di1: Luxury Marble Bathroom (Sarah Chen)
  (
    '00000000-0000-0000-0000-0000000000a1',
    '00000000-0000-0000-0000-00000000dd01',
    'Luxury Marble Bathroom',
    E'This design transforms a dated 1990s bathroom into a modern farmhouse retreat. The key moves: replacing the vanity with a floating oak piece, switching from small ceramic floor tiles to large-format marble hex, and adding matte black fixtures throughout.\n\nThe total material cost came in under $2,800 — which is remarkable for a bathroom that looks like it cost $10K+. The secret is strategic splurging: the marble hex tile IS real marble but at a builder-grade price point from Lowe''s.',
    'bathroom', 'modern', 'premium_5000_15000',
    8500, 'intermediate', TRUE,
    ARRAY['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=1000&fit=crop','https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=1000&fit=crop',
    NULL,
    ARRAY['marble','matte black','floating vanity','hex tile'],
    12400, 2400, 890, 0,
    TRUE, TRUE, '2026-01-15', '2026-01-15'
  ),
  -- di2: Rustic Farmhouse Kitchen (Mike Rodriguez)
  (
    '00000000-0000-0000-0000-0000000000a2',
    '00000000-0000-0000-0000-00000000dd02',
    'Rustic Farmhouse Kitchen',
    'Open shelving, butcher block counters, and a farmhouse sink transform this basic kitchen into a warm, inviting space.',
    'kitchen', 'farmhouse', 'mid_1000_5000',
    4200, 'intermediate', TRUE,
    ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    NULL,
    ARRAY['open shelving','butcher block','farmhouse sink'],
    8900, 1800, 456, 0,
    TRUE, FALSE, '2026-01-20', '2026-01-20'
  ),
  -- di3: Minimalist Living Room (Studio Nook)
  (
    '00000000-0000-0000-0000-0000000000a3',
    '00000000-0000-0000-0000-00000000dd03',
    'Minimalist Living Room',
    'A lesson in restraint. Every piece in this living room was chosen for both form and function.',
    'living_room', 'minimalist', 'mid_1000_5000',
    3100, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=1000&fit=crop'],
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=1000&fit=crop',
    NULL,
    ARRAY['minimal','neutral palette','clean lines'],
    15600, 3100, 1200, 0,
    TRUE, TRUE, '2026-01-18', '2026-01-18'
  ),
  -- di4: Scandi Bedroom Refresh (Amy Liu)
  (
    '00000000-0000-0000-0000-0000000000a4',
    '00000000-0000-0000-0000-00000000dd04',
    'Scandi Bedroom Refresh',
    'Light woods, white linens, and simple accents create a calm sleeping space.',
    'bedroom', 'scandinavian', 'mid_1000_5000',
    1200, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=500&fit=crop'],
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=500&fit=crop',
    NULL,
    ARRAY['scandinavian','white','light wood'],
    3400, 567, 234, 0,
    TRUE, FALSE, '2026-01-25', '2026-01-25'
  ),
  -- di5: Industrial Home Office (Mike Rodriguez)
  (
    '00000000-0000-0000-0000-0000000000a5',
    '00000000-0000-0000-0000-00000000dd02',
    'Industrial Home Office',
    'Exposed brick, metal shelving, and a reclaimed wood desk make this home office feel like a creative studio.',
    'home_office', 'industrial', 'mid_1000_5000',
    2100, 'intermediate', TRUE,
    ARRAY['https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=700&fit=crop'],
    'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=700&fit=crop',
    NULL,
    ARRAY['industrial','reclaimed wood','metal'],
    5200, 892, 345, 0,
    TRUE, FALSE, '2026-01-22', '2026-01-22'
  ),
  -- di6: Bohemian Patio Oasis (Amy Liu)
  (
    '00000000-0000-0000-0000-0000000000a6',
    '00000000-0000-0000-0000-00000000dd04',
    'Bohemian Patio Oasis',
    'Transform a plain concrete patio into a boho retreat with layered rugs, hanging plants, and string lights.',
    'outdoor', 'bohemian', 'mid_1000_5000',
    1800, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1600566753086-00f18f6b0896?w=800&h=1000&fit=crop'],
    'https://images.unsplash.com/photo-1600566753086-00f18f6b0896?w=800&h=1000&fit=crop',
    NULL,
    ARRAY['bohemian','outdoor','string lights','plants'],
    7200, 1500, 678, 0,
    TRUE, FALSE, '2026-02-01', '2026-02-01'
  ),
  -- di7: Kitchen Before/After (Mike Rodriguez)
  (
    '00000000-0000-0000-0000-0000000000a7',
    '00000000-0000-0000-0000-00000000dd02',
    'Kitchen Before/After',
    'A complete kitchen transformation. From dark cabinets and laminate to bright white shaker and quartz.',
    'kitchen', 'transitional', 'premium_5000_15000',
    12000, 'advanced', FALSE,
    ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop'],
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop',
    ARRAY['before after','shaker cabinets','quartz'],
    22000, 4200, 1800, 0,
    TRUE, FALSE, '2026-01-10', '2026-01-10'
  ),
  -- di8: Coastal Dining Room (Studio Nook)
  (
    '00000000-0000-0000-0000-0000000000a8',
    '00000000-0000-0000-0000-00000000dd03',
    'Coastal Dining Room',
    'Whitewashed wood, blue accents, and natural textures bring the beach indoors.',
    'dining_room', 'coastal', 'mid_1000_5000',
    3400, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
    NULL,
    ARRAY['coastal','blue','natural texture'],
    9800, 2100, 890, 0,
    TRUE, TRUE, '2026-01-28', '2026-01-28'
  ),
  -- di9: Mid-Century Entryway (Amy Liu)
  (
    '00000000-0000-0000-0000-0000000000a9',
    '00000000-0000-0000-0000-00000000dd04',
    'Mid-Century Entryway',
    'A statement credenza, round mirror, and geometric wallpaper make this entry unforgettable.',
    'entryway', 'mid_century', 'budget_under_1000',
    900, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=700&fit=crop'],
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=700&fit=crop',
    NULL,
    ARRAY['mid-century','wallpaper','credenza'],
    2800, 456, 189, 0,
    TRUE, FALSE, '2026-02-02', '2026-02-02'
  ),
  -- di10: Woodland Nursery (Sarah Chen)
  (
    '00000000-0000-0000-0000-0000000000b0',
    '00000000-0000-0000-0000-00000000dd01',
    'Woodland Nursery',
    'A whimsical woodland theme with forest wall mural, natural wood crib, and soft earthy tones.',
    'nursery', 'scandinavian', 'mid_1000_5000',
    2200, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop'],
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop',
    NULL,
    ARRAY['nursery','woodland','natural wood'],
    5400, 1100, 567, 0,
    TRUE, FALSE, '2026-01-30', '2026-01-30'
  ),
  -- di11: Bright Laundry Room (Amy Liu)
  (
    '00000000-0000-0000-0000-0000000000b1',
    '00000000-0000-0000-0000-00000000dd04',
    'Bright Laundry Room',
    'White cabinets, colorful tile backsplash, and clever storage turn a chore room into a cheerful space.',
    'laundry', 'modern', 'mid_1000_5000',
    1500, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=500&fit=crop'],
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=500&fit=crop',
    NULL,
    ARRAY['laundry','colorful tile','storage'],
    2100, 345, 156, 0,
    TRUE, FALSE, '2026-02-03', '2026-02-03'
  ),
  -- di12: Spa Bathroom (Sarah Chen)
  (
    '00000000-0000-0000-0000-0000000000b2',
    '00000000-0000-0000-0000-00000000dd01',
    'Spa Bathroom',
    'Large format tile, rain shower, and eucalyptus accents create a spa-like retreat at home.',
    'bathroom', 'modern', 'premium_5000_15000',
    5600, 'advanced', FALSE,
    ARRAY['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=800&fit=crop'],
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=800&fit=crop',
    NULL,
    ARRAY['spa','rain shower','large format tile'],
    7800, 1500, 670, 0,
    TRUE, FALSE, '2026-01-12', '2026-01-12'
  ),
  -- di13: Transitional Living Room (Studio Nook)
  (
    '00000000-0000-0000-0000-0000000000b3',
    '00000000-0000-0000-0000-00000000dd03',
    'Transitional Living Room',
    'Classic meets contemporary with tailored furniture, a mix of metals, and layered neutral textiles.',
    'living_room', 'transitional', 'mid_1000_5000',
    4800, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
    NULL,
    ARRAY['transitional','neutral','layered'],
    4500, 890, 345, 0,
    TRUE, FALSE, '2026-01-26', '2026-01-26'
  ),
  -- di14: Chef's Kitchen (Studio Nook)
  (
    '00000000-0000-0000-0000-0000000000b4',
    '00000000-0000-0000-0000-00000000dd03',
    E'Chef''s Kitchen',
    'Professional-grade appliances, marble waterfall island, and custom cabinetry for the serious home cook.',
    'kitchen', 'modern', 'luxury_15000_plus',
    15000, 'advanced', FALSE,
    ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop'],
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop',
    NULL,
    ARRAY['professional','marble island','custom'],
    18000, 3400, 1500, 0,
    TRUE, TRUE, '2026-01-08', '2026-01-08'
  ),
  -- di15: Zen Bedroom (Amy Liu)
  (
    '00000000-0000-0000-0000-0000000000b5',
    '00000000-0000-0000-0000-00000000dd04',
    'Zen Bedroom',
    'Platform bed, floor-to-ceiling curtains, and absolutely nothing extra.',
    'bedroom', 'minimalist', 'budget_under_1000',
    800, 'beginner', TRUE,
    ARRAY['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&h=500&fit=crop'],
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&h=500&fit=crop',
    NULL,
    ARRAY['zen','minimal','platform bed'],
    1900, 345, 134, 0,
    TRUE, FALSE, '2026-02-04', '2026-02-04'
  ),
  -- di16: Cedar Deck Build (Mike Rodriguez)
  (
    '00000000-0000-0000-0000-0000000000b6',
    '00000000-0000-0000-0000-00000000dd02',
    'Cedar Deck Build',
    'A beautiful cedar deck with built-in bench seating and integrated planters. A true outdoor living room.',
    'outdoor', 'modern', 'premium_5000_15000',
    6200, 'advanced', TRUE,
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    NULL,
    ARRAY['cedar','deck','outdoor living','DIY'],
    4100, 789, 345, 0,
    TRUE, FALSE, '2026-02-05', '2026-02-05'
  )
ON CONFLICT (id) DO NOTHING;

-- ── 4. Seed design_idea_products (product tags for di1) ──────────────

INSERT INTO design_idea_products (
  id, design_idea_id, product_name, product_brand, product_category,
  estimated_price, retailer_name, product_url, product_image_url,
  quantity_needed, notes, position_x, position_y, sort_order
)
VALUES
  (
    '00000000-0000-0000-0000-000000000e01',
    '00000000-0000-0000-0000-0000000000a1',
    'Carrara Marble Hex Floor Tile', 'MSI', 'flooring',
    4.15, E'Lowe''s', '#',
    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=100&h=100&fit=crop',
    '130 sqft', NULL, 35.00, 70.00, 0
  ),
  (
    '00000000-0000-0000-0000-000000000e02',
    '00000000-0000-0000-0000-0000000000a1',
    'Floating Oak Vanity 36in', 'Signature Hardware', 'furniture',
    589.00, 'Build.com', '#',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop',
    '1', NULL, 55.00, 45.00, 1
  ),
  (
    '00000000-0000-0000-0000-000000000e03',
    '00000000-0000-0000-0000-0000000000a1',
    'Matte Black Widespread Faucet', 'Delta', 'fixtures',
    129.00, 'Amazon', '#',
    'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=100&h=100&fit=crop',
    '1', 'I used matte finish; glossy also works', 60.00, 38.00, 2
  ),
  (
    '00000000-0000-0000-0000-000000000e04',
    '00000000-0000-0000-0000-0000000000a1',
    'Round Black Frame Mirror 28in', 'Kate and Laurel', 'decor',
    89.00, 'Amazon', '#',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?w=100&h=100&fit=crop',
    '1', NULL, 50.00, 20.00, 3
  ),
  (
    '00000000-0000-0000-0000-000000000e05',
    '00000000-0000-0000-0000-0000000000a1',
    'White Subway Tile 3x6', 'Daltile', 'tile',
    1.29, 'Home Depot', '#',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=100&h=100&fit=crop',
    '45 sqft', NULL, 30.00, 30.00, 4
  )
ON CONFLICT (id) DO NOTHING;

-- ── 5. Seed designer_services (6 services for Sarah Chen) ────────────

INSERT INTO designer_services (
  id, designer_id, service_type, title, description,
  price, price_type, estimated_delivery_days, max_revisions,
  is_virtual, includes_shopping_list, includes_bom,
  is_active, sort_order, created_at, updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000f01',
    '00000000-0000-0000-0000-00000000dd01',
    'consultation', 'Quick Style Consultation',
    '30-minute video call to discuss your space, style preferences, and goals.',
    75.00, 'fixed', 0, 0,
    TRUE, FALSE, FALSE, TRUE, 0, '2026-01-15', '2026-01-15'
  ),
  (
    '00000000-0000-0000-0000-000000000f02',
    '00000000-0000-0000-0000-00000000dd01',
    'mood_board', 'Custom Mood Board + Shopping List',
    'Personalized design concept based on your space, style preferences, and budget. Includes a complete shopping list with links.',
    150.00, 'fixed', 5, 1,
    TRUE, TRUE, FALSE, TRUE, 1, '2026-01-15', '2026-01-15'
  ),
  (
    '00000000-0000-0000-0000-000000000f03',
    '00000000-0000-0000-0000-00000000dd01',
    'full_room_redesign', 'Full Room Design Package',
    'Complete floor plan, 3D concept rendering, shopping list, and contractor-ready specs.',
    399.00, 'per_room', 14, 2,
    TRUE, TRUE, TRUE, TRUE, 2, '2026-01-15', '2026-01-15'
  ),
  (
    '00000000-0000-0000-0000-000000000f04',
    '00000000-0000-0000-0000-00000000dd01',
    'styling_session', 'Virtual Room Makeover',
    'Transform your existing room with new styling and arrangement recommendations.',
    125.00, 'fixed', 3, 1,
    TRUE, TRUE, FALSE, TRUE, 3, '2026-01-15', '2026-01-15'
  ),
  (
    '00000000-0000-0000-0000-000000000f05',
    '00000000-0000-0000-0000-00000000dd01',
    'consultation', 'DIY Project Review',
    'Expert review of your DIY plan before you start. Get feedback on materials, approach, and potential issues.',
    50.00, 'fixed', 1, 0,
    TRUE, FALSE, FALSE, TRUE, 4, '2026-01-15', '2026-01-15'
  ),
  (
    '00000000-0000-0000-0000-000000000f06',
    '00000000-0000-0000-0000-00000000dd01',
    'full_room_redesign', 'Full Home Consultation',
    'Multi-room design strategy for your entire home. Cohesive vision across all spaces.',
    899.00, 'fixed', 21, 3,
    TRUE, TRUE, TRUE, TRUE, 5, '2026-01-15', '2026-01-15'
  )
ON CONFLICT (id) DO NOTHING;
