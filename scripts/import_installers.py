"""
Import MCS installer data into Supabase.

Usage:
  1. Set your Supabase credentials in .env:
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_SERVICE_KEY=your-service-role-key

  2. Run: python import_installers.py
     (CSV is auto-found from scraper output directory)

  Options:
     --yes    Skip confirmation prompt

This script:
  - Reads the CSV from the MCS scraper output
  - Maps fields to the Supabase schema
  - Cleans data (nan values, phone numbers, URLs)
  - Inserts in batches of 100
  - Updates city installer counts
  - Reports success/failure counts
"""

import csv
import os
import re
import sys
from pathlib import Path

try:
    from supabase import create_client, Client
    from dotenv import load_dotenv
except ImportError:
    print("Missing dependencies. Install with:")
    print("  pip install supabase python-dotenv")
    sys.exit(1)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env")
    sys.exit(1)

# Use service role key to bypass RLS for bulk import
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def clean_value(value: str) -> str:
    """Clean a CSV value — treat 'nan' and empty strings as None."""
    if value is None:
        return None
    v = str(value).strip()
    if v.lower() in ('nan', 'none', ''):
        return None
    return v


def get_vertical_id() -> str:
    """Get the heat-pump vertical ID."""
    result = supabase.table("verticals").select("id").eq("slug", "heat-pump").execute()
    if not result.data:
        print("ERROR: 'heat-pump' vertical not found. Run schema.sql first.")
        sys.exit(1)
    return result.data[0]["id"]


def make_slug(company_name: str) -> str:
    """Generate URL-friendly slug from company name."""
    slug = company_name.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug[:100]  # Cap length


def parse_bool(value: str) -> bool:
    """Parse boolean from CSV value."""
    if isinstance(value, bool):
        return value
    return str(value).lower().strip() in ('true', '1', 'yes', 'y')


def parse_float(value: str):
    """Parse a float value, returning None if invalid."""
    v = clean_value(value)
    if not v:
        return None
    try:
        return float(v)
    except (ValueError, TypeError):
        return None


def parse_regions(regions_str: str) -> list:
    """Parse comma-separated regions into array."""
    v = clean_value(regions_str)
    if not v:
        return []
    return [r.strip() for r in v.split(',') if r.strip()]


def extract_postcode_prefix(postcode: str) -> list:
    """Extract postcode area prefix (e.g., 'SW1' from 'SW1A 1AA')."""
    if not postcode:
        return []
    match = re.match(r'^([A-Z]{1,2}\d{1,2}[A-Z]?)', postcode.upper().strip())
    if match:
        return [match.group(1)]
    return []


def clean_phone(phone: str) -> str:
    """Normalize UK phone number."""
    v = clean_value(phone)
    if not v:
        return None
    # Remove common formatting
    v = re.sub(r'[^\d+]', '', v)
    # Ensure starts with 0 or +44
    if v.startswith('44') and not v.startswith('+'):
        v = '+' + v
    return v if v else None


def clean_website(url: str) -> str:
    """Ensure website has protocol."""
    v = clean_value(url)
    if not v:
        return None
    if not v.startswith(('http://', 'https://')):
        v = 'https://' + v
    return v


def read_csv(filepath: str) -> list:
    """Read the installer CSV and return list of dicts."""
    rows = []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def map_row_to_installer(row: dict, vertical_id: str, existing_slugs: set) -> dict:
    """Map a CSV row to the Supabase installer schema."""
    company_name = clean_value(row.get('company_name', ''))
    if not company_name:
        return None

    # Generate unique slug
    slug = clean_value(row.get('slug', '')) or make_slug(company_name)
    base_slug = slug
    counter = 2
    while slug in existing_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    existing_slugs.add(slug)

    # Parse regions/coverage
    regions = parse_regions(row.get('coverage_regions', '') or row.get('regions', ''))

    # Parse postcode
    postcode = clean_value(row.get('postcode', '')) or clean_value(row.get('address_postcode', ''))
    coverage_postcodes = extract_postcode_prefix(postcode) if postcode else []

    installer = {
        'vertical_id': vertical_id,
        'company_name': company_name,
        'slug': slug,
        'phone': clean_phone(row.get('phone', '')),
        'email': clean_value(row.get('email', '')),
        'website': clean_website(row.get('website', '')),
        'address_line_1': clean_value(row.get('address', '')),
        'address_county': clean_value(row.get('county', '')),
        'address_postcode': postcode.strip().upper() if postcode else None,
        'address_city': clean_value(row.get('city', '')),
        'latitude': parse_float(row.get('lat', '')),
        'longitude': parse_float(row.get('lng', '')),
        'mcs_number': clean_value(row.get('mcs_number', '')),
        'mcs_certified': True,
        'certification_body': clean_value(row.get('certification_body', '')),
        'coverage_regions': regions,
        'coverage_postcodes': coverage_postcodes,
        'has_ashp': parse_bool(row.get('has_ashp', 'false')),
        'has_gshp': parse_bool(row.get('has_gshp', 'false')),
        'has_wshp': parse_bool(row.get('has_wshp', 'false')),
        'has_eahp': parse_bool(row.get('has_eahp', 'false')),
        'has_sahp': parse_bool(row.get('has_sahp', 'false')),
        'has_solar_pv': parse_bool(row.get('has_solar_pv', 'false')),
        'has_battery': parse_bool(row.get('has_battery', 'false')),
        'boiler_upgrade_scheme': parse_bool(row.get('boiler_upgrade_scheme', 'false')),
        'trustmark': parse_bool(row.get('trustmark', 'false')),
        'source': clean_value(row.get('source', '')) or 'MCS',
        'is_claimed': False,
        'is_verified': False,
        'is_active': True,
        'subscription_tier': 'free',
    }

    return installer


def batch_insert(table: str, records: list, batch_size: int = 100) -> tuple:
    """Insert records in batches. Returns (success_count, error_count)."""
    success = 0
    errors = 0

    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        try:
            result = supabase.table(table).insert(batch).execute()
            success += len(result.data)
            print(f"  Batch {i // batch_size + 1}: inserted {len(result.data)} records")
        except Exception as e:
            errors += len(batch)
            print(f"  Batch {i // batch_size + 1}: ERROR - {str(e)[:200]}")

    return success, errors


def main():
    auto_confirm = '--yes' in sys.argv or '-y' in sys.argv

    print("=" * 60)
    print("  MCS Installer Data -> Supabase Import")
    print("=" * 60)

    # Find the CSV file (search multiple likely locations)
    script_dir = Path(__file__).parent
    csv_candidates = [
        script_dir / 'supabase_import_installers.csv',
        script_dir / '..' / 'output' / 'supabase_import_installers.csv',
        script_dir / '..' / '..' / 'output' / 'supabase_import_installers.csv',
        Path('supabase_import_installers.csv'),
        Path('output/supabase_import_installers.csv'),
    ]

    csv_path = None
    for candidate in csv_candidates:
        resolved = candidate.resolve()
        if resolved.exists():
            csv_path = str(resolved)
            break

    if not csv_path:
        print(f"\nERROR: No CSV file found. Looked for:")
        for c in csv_candidates:
            print(f"  - {c}")
        print("\nRun parse_mcs_results.py first to generate the CSV.")
        sys.exit(1)

    print(f"\nReading: {csv_path}")
    rows = read_csv(csv_path)
    print(f"Found {len(rows)} rows in CSV")

    # Get vertical ID
    vertical_id = get_vertical_id()
    print(f"Vertical ID (heat-pump): {vertical_id}")

    # Check existing installers to avoid duplicates (paginate past 1000 row limit)
    existing_slugs = set()
    offset = 0
    page_size = 1000
    while True:
        page = supabase.table("installers").select("slug").eq("vertical_id", vertical_id) \
            .range(offset, offset + page_size - 1).execute()
        if not page.data:
            break
        existing_slugs.update(r['slug'] for r in page.data)
        if len(page.data) < page_size:
            break
        offset += page_size
    print(f"Existing installers in DB: {len(existing_slugs)}")

    # Map rows to installer records
    print("\nMapping CSV rows to installer schema...")
    installers = []
    skipped = 0
    for row in rows:
        installer = map_row_to_installer(row, vertical_id, existing_slugs)
        if installer:
            installers.append(installer)
        else:
            skipped += 1

    print(f"Mapped: {len(installers)} installers ({skipped} skipped - no company name)")

    if not installers:
        print("No installers to import. Check your CSV format.")
        sys.exit(1)

    # Preview first record
    print(f"\nSample record:")
    sample = installers[0]
    for key, value in sample.items():
        print(f"  {key}: {value}")

    # Confirm
    if not auto_confirm:
        response = input(f"\nImport {len(installers)} installers into Supabase? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled.")
            sys.exit(0)
    else:
        print(f"\nAuto-confirming import of {len(installers)} installers (--yes flag)")

    # Insert
    print(f"\nInserting {len(installers)} installers in batches of 100...")
    success, errors = batch_insert("installers", installers)

    print(f"\n{'=' * 60}")
    print(f"  Import complete!")
    print(f"  Success: {success}")
    print(f"  Errors:  {errors}")
    print(f"  Total:   {success + errors}")
    print(f"{'=' * 60}")

    # Update city installer counts
    print("\nUpdating city installer counts...")
    try:
        cities = supabase.table("cities").select("id, name, region").execute()
        for city in cities.data:
            # Count installers in this city's region
            count_result = supabase.table("installers") \
                .select("id", count="exact") \
                .eq("vertical_id", vertical_id) \
                .contains("coverage_regions", [city['region']]) \
                .execute()

            count = count_result.count if count_result.count else 0
            supabase.table("cities").update({"installer_count": count}).eq("id", city['id']).execute()
            print(f"  {city['name']}: {count} installers")
    except Exception as e:
        print(f"  Warning: Could not update city counts: {e}")
        print("  You can update these manually later.")

    print("\nDone! Your installers are now in Supabase.")


if __name__ == "__main__":
    main()
