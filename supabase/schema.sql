-- ============================================================
-- UK Heat Pump Directory — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. VERTICALS — Multi-directory support from day one
-- ============================================================
CREATE TABLE verticals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed the first vertical
INSERT INTO verticals (slug, name) VALUES ('heat-pump', 'Heat Pump');

-- ============================================================
-- 2. INSTALLERS — Seeded from MCS data, claimable by businesses
-- ============================================================
CREATE TABLE installers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical_id UUID REFERENCES verticals(id) NOT NULL,
  company_name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address_line_1 TEXT,
  address_city TEXT,
  address_county TEXT,
  address_postcode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  mcs_number TEXT,
  mcs_certified BOOLEAN DEFAULT true,
  coverage_postcodes TEXT[] DEFAULT '{}',
  coverage_regions TEXT[] DEFAULT '{}',
  coverage_radius_km INT,
  logo_url TEXT,
  has_ashp BOOLEAN DEFAULT false,
  has_gshp BOOLEAN DEFAULT false,
  has_wshp BOOLEAN DEFAULT false,           -- Water Source Heat Pump
  has_eahp BOOLEAN DEFAULT false,           -- Exhaust Air Heat Pump
  has_sahp BOOLEAN DEFAULT false,           -- Solar Assisted Heat Pump
  has_solar_pv BOOLEAN DEFAULT false,
  has_battery BOOLEAN DEFAULT false,
  certification_body TEXT,                   -- e.g. 'NAPIT', 'MCS'
  boiler_upgrade_scheme BOOLEAN DEFAULT false, -- Eligible for BUS grant
  trustmark BOOLEAN DEFAULT false,
  source TEXT,                              -- 'IAA', 'MCS', etc.
  is_claimed BOOLEAN DEFAULT false,
  claimed_by UUID,                          -- FK → auth.users (added later)
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(vertical_id, slug)
);

-- Index for postcode-based search
CREATE INDEX idx_installers_postcode ON installers(address_postcode);
CREATE INDEX idx_installers_coverage ON installers USING GIN(coverage_regions);
CREATE INDEX idx_installers_vertical ON installers(vertical_id);
CREATE INDEX idx_installers_slug ON installers(slug);
CREATE INDEX idx_installers_active ON installers(is_active) WHERE is_active = true;

-- ============================================================
-- 3. LEADS — Homeowner enquiries
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical_id UUID REFERENCES verticals(id) NOT NULL,
  installer_id UUID REFERENCES installers(id),
  homeowner_name TEXT NOT NULL,
  homeowner_email TEXT NOT NULL,
  homeowner_phone TEXT,
  postcode TEXT NOT NULL,
  property_type TEXT CHECK (property_type IN ('detached', 'semi-detached', 'terraced', 'flat', 'bungalow', 'other')),
  property_age TEXT,
  has_epc BOOLEAN,
  epc_rating TEXT CHECK (epc_rating IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
  current_heating TEXT CHECK (current_heating IN ('gas_boiler', 'oil_boiler', 'electric', 'lpg', 'coal', 'none', 'other')),
  timeline TEXT CHECK (timeline IN ('asap', '1-3months', '3-6months', '6-12months', 'researching')),
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'contacted', 'converted', 'expired')),
  is_unlocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_installer ON leads(installer_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_postcode ON leads(postcode);

-- ============================================================
-- 4. CITIES — Pre-built SEO city pages
-- ============================================================
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical_id UUID REFERENCES verticals(id) NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  county TEXT,
  region TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT,
  installer_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(vertical_id, slug)
);

CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_vertical ON cities(vertical_id);

-- ============================================================
-- 5. CONTENT PAGES — CMS-lite for guides/FAQs
-- ============================================================
CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical_id UUID REFERENCES verticals(id) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  category TEXT DEFAULT 'guide' CHECK (category IN ('guide', 'faq', 'page')),
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(vertical_id, slug)
);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE installers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

-- Public read access for public-facing tables
CREATE POLICY "Public can read active verticals"
  ON verticals FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read active installers"
  ON installers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read cities"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY "Public can read published content"
  ON content_pages FOR SELECT
  USING (is_published = true);

-- Leads: public can insert, only matched installer can read
CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Installers can read their own leads"
  ON leads FOR SELECT
  USING (
    installer_id IN (
      SELECT id FROM installers WHERE claimed_by = auth.uid()
    )
  );

-- Installers can update their own profile (after claiming)
CREATE POLICY "Installers can update own profile"
  ON installers FOR UPDATE
  USING (claimed_by = auth.uid())
  WITH CHECK (claimed_by = auth.uid());

-- ============================================================
-- 7. UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_verticals
  BEFORE UPDATE ON verticals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_installers
  BEFORE UPDATE ON installers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_leads
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_cities
  BEFORE UPDATE ON cities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_content_pages
  BEFORE UPDATE ON content_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 8. SEED CITIES (Top 50 UK cities for SEO pages)
-- ============================================================
INSERT INTO cities (vertical_id, name, slug, county, region, latitude, longitude, meta_title, meta_description) VALUES
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'London', 'london', 'Greater London', 'South East', 51.5074, -0.1278, 'Heat Pump Installers in London | MCS Certified', 'Find MCS-certified heat pump installers in London. Compare quotes, check BUS grant eligibility, and get your heat pump installed by trusted professionals.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Birmingham', 'birmingham', 'West Midlands', 'West Midlands', 52.4862, -1.8904, 'Heat Pump Installers in Birmingham | MCS Certified', 'Find MCS-certified heat pump installers in Birmingham. Compare quotes and check your £7,500 BUS grant eligibility.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Manchester', 'manchester', 'Greater Manchester', 'North West', 53.4808, -2.2426, 'Heat Pump Installers in Manchester | MCS Certified', 'Find MCS-certified heat pump installers in Manchester. Get quotes and check BUS grant eligibility.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Leeds', 'leeds', 'West Yorkshire', 'Yorkshire & Humberside', 53.8008, -1.5491, 'Heat Pump Installers in Leeds | MCS Certified', 'Find trusted MCS-certified heat pump installers in Leeds.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Glasgow', 'glasgow', 'Glasgow', 'Scotland', 55.8642, -4.2518, 'Heat Pump Installers in Glasgow | MCS Certified', 'Find MCS-certified heat pump installers in Glasgow.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Liverpool', 'liverpool', 'Merseyside', 'North West', 53.4084, -2.9916, 'Heat Pump Installers in Liverpool | MCS Certified', 'Find MCS-certified heat pump installers in Liverpool.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Bristol', 'bristol', 'Bristol', 'South West', 51.4545, -2.5879, 'Heat Pump Installers in Bristol | MCS Certified', 'Find MCS-certified heat pump installers in Bristol.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Edinburgh', 'edinburgh', 'Edinburgh', 'Scotland', 55.9533, -3.1883, 'Heat Pump Installers in Edinburgh | MCS Certified', 'Find MCS-certified heat pump installers in Edinburgh.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Sheffield', 'sheffield', 'South Yorkshire', 'Yorkshire & Humberside', 53.3811, -1.4701, 'Heat Pump Installers in Sheffield | MCS Certified', 'Find MCS-certified heat pump installers in Sheffield.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Leicester', 'leicester', 'Leicestershire', 'East Midlands', 52.6369, -1.1398, 'Heat Pump Installers in Leicester | MCS Certified', 'Find MCS-certified heat pump installers in Leicester.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Newcastle', 'newcastle', 'Tyne and Wear', 'North East', 54.9783, -1.6178, 'Heat Pump Installers in Newcastle | MCS Certified', 'Find MCS-certified heat pump installers in Newcastle.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Nottingham', 'nottingham', 'Nottinghamshire', 'East Midlands', 52.9548, -1.1581, 'Heat Pump Installers in Nottingham | MCS Certified', 'Find MCS-certified heat pump installers in Nottingham.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Cardiff', 'cardiff', 'Cardiff', 'Wales', 51.4816, -3.1791, 'Heat Pump Installers in Cardiff | MCS Certified', 'Find MCS-certified heat pump installers in Cardiff.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Belfast', 'belfast', 'Belfast', 'Northern Ireland', 54.5973, -5.9301, 'Heat Pump Installers in Belfast | MCS Certified', 'Find MCS-certified heat pump installers in Belfast.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Brighton', 'brighton', 'East Sussex', 'South East', 50.8225, -0.1372, 'Heat Pump Installers in Brighton | MCS Certified', 'Find MCS-certified heat pump installers in Brighton.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Southampton', 'southampton', 'Hampshire', 'South East', 50.9097, -1.4044, 'Heat Pump Installers in Southampton | MCS Certified', 'Find MCS-certified heat pump installers in Southampton.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Plymouth', 'plymouth', 'Devon', 'South West', 50.3755, -4.1427, 'Heat Pump Installers in Plymouth | MCS Certified', 'Find MCS-certified heat pump installers in Plymouth.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Reading', 'reading', 'Berkshire', 'South East', 51.4543, -0.9781, 'Heat Pump Installers in Reading | MCS Certified', 'Find MCS-certified heat pump installers in Reading.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Coventry', 'coventry', 'West Midlands', 'West Midlands', 52.4068, -1.5197, 'Heat Pump Installers in Coventry | MCS Certified', 'Find MCS-certified heat pump installers in Coventry.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Derby', 'derby', 'Derbyshire', 'East Midlands', 52.9225, -1.4746, 'Heat Pump Installers in Derby | MCS Certified', 'Find MCS-certified heat pump installers in Derby.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Wolverhampton', 'wolverhampton', 'West Midlands', 'West Midlands', 52.5870, -2.1288, 'Heat Pump Installers in Wolverhampton | MCS Certified', 'Find MCS-certified heat pump installers in Wolverhampton.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Portsmouth', 'portsmouth', 'Hampshire', 'South East', 50.8198, -1.0880, 'Heat Pump Installers in Portsmouth | MCS Certified', 'Find MCS-certified heat pump installers in Portsmouth.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'York', 'york', 'North Yorkshire', 'Yorkshire & Humberside', 53.9591, -1.0815, 'Heat Pump Installers in York | MCS Certified', 'Find MCS-certified heat pump installers in York.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Oxford', 'oxford', 'Oxfordshire', 'South East', 51.7520, -1.2577, 'Heat Pump Installers in Oxford | MCS Certified', 'Find MCS-certified heat pump installers in Oxford.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Cambridge', 'cambridge', 'Cambridgeshire', 'Eastern', 52.2053, 0.1218, 'Heat Pump Installers in Cambridge | MCS Certified', 'Find MCS-certified heat pump installers in Cambridge.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Norwich', 'norwich', 'Norfolk', 'Eastern', 52.6309, 1.2974, 'Heat Pump Installers in Norwich | MCS Certified', 'Find MCS-certified heat pump installers in Norwich.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Exeter', 'exeter', 'Devon', 'South West', 50.7184, -3.5339, 'Heat Pump Installers in Exeter | MCS Certified', 'Find MCS-certified heat pump installers in Exeter.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Bath', 'bath', 'Somerset', 'South West', 51.3811, -2.3590, 'Heat Pump Installers in Bath | MCS Certified', 'Find MCS-certified heat pump installers in Bath.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Cheltenham', 'cheltenham', 'Gloucestershire', 'South West', 51.8994, -2.0783, 'Heat Pump Installers in Cheltenham | MCS Certified', 'Find MCS-certified heat pump installers in Cheltenham.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Milton Keynes', 'milton-keynes', 'Buckinghamshire', 'South East', 52.0406, -0.7594, 'Heat Pump Installers in Milton Keynes | MCS Certified', 'Find MCS-certified heat pump installers in Milton Keynes.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Northampton', 'northampton', 'Northamptonshire', 'East Midlands', 52.2405, -0.9027, 'Heat Pump Installers in Northampton | MCS Certified', 'Find MCS-certified heat pump installers in Northampton.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Aberdeen', 'aberdeen', 'Aberdeen', 'Scotland', 57.1497, -2.0943, 'Heat Pump Installers in Aberdeen | MCS Certified', 'Find MCS-certified heat pump installers in Aberdeen.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Swansea', 'swansea', 'Swansea', 'Wales', 51.6214, -3.9436, 'Heat Pump Installers in Swansea | MCS Certified', 'Find MCS-certified heat pump installers in Swansea.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Bradford', 'bradford', 'West Yorkshire', 'Yorkshire & Humberside', 53.7960, -1.7594, 'Heat Pump Installers in Bradford | MCS Certified', 'Find MCS-certified heat pump installers in Bradford.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Bournemouth', 'bournemouth', 'Dorset', 'South West', 50.7192, -1.8808, 'Heat Pump Installers in Bournemouth | MCS Certified', 'Find MCS-certified heat pump installers in Bournemouth.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Ipswich', 'ipswich', 'Suffolk', 'Eastern', 52.0567, 1.1482, 'Heat Pump Installers in Ipswich | MCS Certified', 'Find MCS-certified heat pump installers in Ipswich.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Peterborough', 'peterborough', 'Cambridgeshire', 'Eastern', 52.5695, -0.2405, 'Heat Pump Installers in Peterborough | MCS Certified', 'Find MCS-certified heat pump installers in Peterborough.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Gloucester', 'gloucester', 'Gloucestershire', 'South West', 51.8642, -2.2382, 'Heat Pump Installers in Gloucester | MCS Certified', 'Find MCS-certified heat pump installers in Gloucester.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Canterbury', 'canterbury', 'Kent', 'South East', 51.2802, 1.0789, 'Heat Pump Installers in Canterbury | MCS Certified', 'Find MCS-certified heat pump installers in Canterbury.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Worcester', 'worcester', 'Worcestershire', 'West Midlands', 52.1936, -2.2216, 'Heat Pump Installers in Worcester | MCS Certified', 'Find MCS-certified heat pump installers in Worcester.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Chester', 'chester', 'Cheshire', 'North West', 53.1930, -2.8931, 'Heat Pump Installers in Chester | MCS Certified', 'Find MCS-certified heat pump installers in Chester.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Lincoln', 'lincoln', 'Lincolnshire', 'East Midlands', 53.2307, -0.5406, 'Heat Pump Installers in Lincoln | MCS Certified', 'Find MCS-certified heat pump installers in Lincoln.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Carlisle', 'carlisle', 'Cumbria', 'North West', 54.8951, -2.9382, 'Heat Pump Installers in Carlisle | MCS Certified', 'Find MCS-certified heat pump installers in Carlisle.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Inverness', 'inverness', 'Highland', 'Scotland', 57.4778, -4.2247, 'Heat Pump Installers in Inverness | MCS Certified', 'Find MCS-certified heat pump installers in Inverness.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Dundee', 'dundee', 'Dundee', 'Scotland', 56.4620, -2.9707, 'Heat Pump Installers in Dundee | MCS Certified', 'Find MCS-certified heat pump installers in Dundee.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Stoke-on-Trent', 'stoke-on-trent', 'Staffordshire', 'West Midlands', 53.0027, -2.1794, 'Heat Pump Installers in Stoke-on-Trent | MCS Certified', 'Find MCS-certified heat pump installers in Stoke-on-Trent.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Sunderland', 'sunderland', 'Tyne and Wear', 'North East', 54.9069, -1.3838, 'Heat Pump Installers in Sunderland | MCS Certified', 'Find MCS-certified heat pump installers in Sunderland.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Wakefield', 'wakefield', 'West Yorkshire', 'Yorkshire & Humberside', 53.6833, -1.4977, 'Heat Pump Installers in Wakefield | MCS Certified', 'Find MCS-certified heat pump installers in Wakefield.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Luton', 'luton', 'Bedfordshire', 'Eastern', 51.8787, -0.4200, 'Heat Pump Installers in Luton | MCS Certified', 'Find MCS-certified heat pump installers in Luton.'),
  ((SELECT id FROM verticals WHERE slug = 'heat-pump'), 'Middlesbrough', 'middlesbrough', 'North Yorkshire', 'North East', 54.5742, -1.2350, 'Heat Pump Installers in Middlesbrough | MCS Certified', 'Find MCS-certified heat pump installers in Middlesbrough.');

-- ============================================================
-- MIGRATION: Add columns for MCS API data (run on existing DB)
-- ============================================================
-- Run this block in Supabase SQL Editor if schema was already deployed:
--
-- ALTER TABLE installers ADD COLUMN IF NOT EXISTS certification_body TEXT;
-- ALTER TABLE installers ADD COLUMN IF NOT EXISTS boiler_upgrade_scheme BOOLEAN DEFAULT false;
-- ALTER TABLE installers ADD COLUMN IF NOT EXISTS has_wshp BOOLEAN DEFAULT false;
-- ALTER TABLE installers ADD COLUMN IF NOT EXISTS has_eahp BOOLEAN DEFAULT false;
-- ALTER TABLE installers ADD COLUMN IF NOT EXISTS has_sahp BOOLEAN DEFAULT false;
