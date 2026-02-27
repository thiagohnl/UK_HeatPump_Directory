import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PostcodeSearch } from '@/components/search/PostcodeSearch';
import { InstallerCard } from '@/components/search/InstallerCard';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

type Props = {
  searchParams: { postcode?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const postcode = searchParams.postcode;
  if (postcode) {
    return {
      title: `Heat Pump Installers Near ${postcode}`,
      description: `Find MCS-certified heat pump installers near ${postcode}. Compare quotes and check BUS grant eligibility.`,
      alternates: { canonical: `${SITE_URL}/installers` },
    };
  }
  return {
    title: 'Find Heat Pump Installers',
    description: 'Search MCS-certified heat pump installers across the UK by postcode.',
    alternates: { canonical: `${SITE_URL}/installers` },
  };
}

export default async function InstallersPage({ searchParams }: Props) {
  const supabase = createClient();
  const postcode = searchParams.postcode?.trim().toUpperCase();

  // Extract postcode area (e.g. "SW1A 1AA" → "SW")
  const postcodeArea = postcode
    ? postcode.match(/^([A-Z]{1,2})/)?.[1] || ''
    : '';

  // Search installers by matching postcode prefix in coverage_postcodes,
  // or by matching the postcode area against the installer's own postcode
  let installers = [];
  if (postcode) {
    // Strategy: find installers whose address postcode starts with same area
    const { data } = await supabase
      .from('installers')
      .select('*')
      .eq('is_active', true)
      .ilike('address_postcode', `${postcodeArea}%`)
      .order('is_claimed', { ascending: false })
      .order('company_name')
      .limit(50);

    installers = data || [];
  }

  // Also fetch cities for browsing
  const { data: cities } = await supabase
    .from('cities')
    .select('name, slug, installer_count')
    .order('installer_count', { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {postcode
            ? `Heat pump installers near ${postcode}`
            : 'Find heat pump installers'}
        </h1>
        <div className="mt-4 max-w-xl">
          <PostcodeSearch size="small" />
        </div>
      </div>

      {postcode ? (
        <>
          {/* Results */}
          {installers.length > 0 ? (
            <div>
              <p className="mb-6 text-sm text-gray-600">
                Showing {installers.length} MCS-certified installer
                {installers.length !== 1 ? 's' : ''} near {postcode}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {installers.map((installer) => (
                  <InstallerCard key={installer.id} installer={installer} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No installers found near {postcode}
              </h2>
              <p className="mt-2 text-gray-600">
                Try searching with a broader area or browse by city below.
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600">
          Enter your postcode above to find MCS-certified heat pump installers in your area.
        </p>
      )}

      {/* Browse by City */}
      {cities && cities.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900">Browse by city</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/installers/${city.slug}`}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition hover:border-primary-300 hover:shadow-sm"
              >
                <span className="font-medium text-gray-900">{city.name}</span>
                <span className="ml-1 text-gray-500">({city.installer_count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
