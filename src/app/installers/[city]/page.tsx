import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, createStaticClient } from '@/lib/supabase/server';
import { InstallerCard } from '@/components/search/InstallerCard';
import { PostcodeSearch } from '@/components/search/PostcodeSearch';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

type Props = {
  params: { city: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: city } = await supabase
    .from('cities')
    .select('name, meta_title, meta_description')
    .eq('slug', params.city)
    .single();

  if (!city) return { title: 'City Not Found' };

  return {
    title: city.meta_title || `Heat Pump Installers in ${city.name}`,
    description:
      city.meta_description ||
      `Find MCS-certified heat pump installers in ${city.name}. Compare quotes and check BUS grant eligibility.`,
    alternates: { canonical: `${SITE_URL}/installers/${params.city}` },
  };
}

// Pre-generate the top cities at build time
export async function generateStaticParams() {
  try {
    const supabase = createStaticClient();
    const { data: cities } = await supabase
      .from('cities')
      .select('slug')
      .order('installer_count', { ascending: false })
      .limit(50);

    return (cities || []).map((city) => ({ city: city.slug }));
  } catch {
    return [];
  }
}

export default async function CityPage({ params }: Props) {
  const supabase = createClient();

  // Get city data
  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', params.city)
    .single();

  if (!city) notFound();

  // Get installers in this city's region
  const { data: installers } = await supabase
    .from('installers')
    .select('*')
    .eq('is_active', true)
    .contains('coverage_regions', [city.region || ''])
    .order('is_claimed', { ascending: false })
    .order('company_name')
    .limit(50);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Heat Pump Installers in ${city.name}`,
    description: `MCS-certified heat pump installers serving ${city.name} and surrounding areas.`,
    numberOfItems: installers?.length || 0,
    itemListElement: (installers || []).slice(0, 10).map((installer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: installer.company_name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: installer.address_city || city.name,
          addressCountry: 'GB',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/installers" className="hover:text-primary-600">Installers</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{city.name}</span>
        </nav>

        {/* City Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Heat Pump Installers in {city.name}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            {installers?.length || 0} MCS-certified heat pump installers serving {city.name}
            {city.county ? ` and ${city.county}` : ''}. All eligible to apply for the £7,500 BUS
            grant on your behalf.
          </p>
          <div className="mt-4 max-w-xl">
            <PostcodeSearch size="small" />
          </div>
        </div>

        {/* Grant Banner */}
        <div className="mb-8 rounded-lg bg-primary-50 px-5 py-4">
          <p className="text-sm text-primary-800">
            <strong>Good news for {city.name} homeowners:</strong> The Boiler Upgrade
            Scheme offers up to £7,500 toward a heat pump installation.{' '}
            <Link href="/grant-checker" className="font-medium underline hover:text-primary-900">
              Check your eligibility →
            </Link>
          </p>
        </div>

        {/* Installer Grid */}
        {installers && installers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {installers.map((installer) => (
              <InstallerCard key={installer.id} installer={installer} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No installers listed for {city.name} yet
            </h2>
            <p className="mt-2 text-gray-600">
              Try searching by your full postcode for more accurate results.
            </p>
          </div>
        )}

        {/* City Content (SEO text) */}
        {city.content && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: city.content }}
            />
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Heat pumps in {city.name}: FAQs
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">
                How much does a heat pump cost in {city.name}?
              </h3>
              <p className="mt-2 text-gray-600">
                The average air source heat pump installation in the UK costs around £13,200
                before grants. With the £7,500 BUS grant, most homeowners in {city.name} pay
                between £5,000–£8,000 out of pocket.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Am I eligible for the BUS grant in {city.name}?
              </h3>
              <p className="mt-2 text-gray-600">
                {city.region === 'Scotland'
                  ? `Scotland has its own Home Energy Scotland grant scheme, separate from the BUS grant which covers England and Wales.`
                  : `If your property is in ${city.name} (England or Wales), you may be eligible for the £7,500 BUS grant. You'll need a valid EPC and must use an MCS-certified installer.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                How many MCS-certified installers are in {city.name}?
              </h3>
              <p className="mt-2 text-gray-600">
                We currently list {installers?.length || 0} MCS-certified heat pump
                installers serving the {city.name} area. New installers are added regularly
                as the market grows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
