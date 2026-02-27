import { Metadata } from 'next';
import Link from 'next/link';
import { PostcodeSearch } from '@/components/search/PostcodeSearch';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Find MCS-Certified Heat Pump Installers Near You`,
  description:
    'Search 2,200+ MCS-certified heat pump installers across the UK. Check your £7,500 BUS grant eligibility and get free quotes.',
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  const supabase = createClient();

  // Fetch city data for popular cities section
  const { data: cities } = await supabase
    .from('cities')
    .select('name, slug, installer_count')
    .order('installer_count', { ascending: false })
    .limit(12);

  // Total installer count
  const { count: totalInstallers } = await supabase
    .from('installers')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description:
        'HeatPumpHub helps UK homeowners find MCS-certified heat pump installers and check BUS grant eligibility.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/installers?postcode={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Find a trusted{' '}
              <span className="text-primary-600">heat pump installer</span>{' '}
              near you
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              Search {totalInstallers?.toLocaleString() || '2,200'}+ MCS-certified installers across the UK.
              Check your £7,500 BUS grant eligibility and get free quotes.
            </p>

            <div className="mt-10">
              <PostcodeSearch />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                All MCS Certified
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                £7,500 BUS Grant Eligible
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Free to Use
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Check your eligibility',
                description:
                  'Use our free BUS grant checker to see if you qualify for the £7,500 government grant toward your heat pump installation.',
              },
              {
                step: '2',
                title: 'Find local installers',
                description:
                  'Enter your postcode to see MCS-certified heat pump installers in your area. Every installer is verified.',
              },
              {
                step: '3',
                title: 'Get free quotes',
                description:
                  'Request quotes from up to 3 installers. Compare prices, read reviews, and choose the right fit for your home.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary-700 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { value: totalInstallers?.toLocaleString() || '2,200+', label: 'MCS Certified Installers' },
            { value: '£7,500', label: 'BUS Grant Available' },
            { value: '125,037', label: 'Heat Pumps Sold in 2025' },
            { value: '50+', label: 'Cities Covered' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-extrabold text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-primary-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Grant CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-12 sm:px-12 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white">
                Could you get £7,500 off your heat pump?
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                The Boiler Upgrade Scheme (BUS) gives homeowners in England &amp;
                Wales up to £7,500 toward an air source heat pump. Check if you
                qualify in 60 seconds.
              </p>
              <Link
                href="/grant-checker"
                className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary-700 shadow-sm hover:bg-primary-50"
              >
                Check My Eligibility →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      {cities && cities.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Find installers in your area
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/installers/${city.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white px-4 py-3 text-center transition hover:border-primary-300 hover:shadow-md"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-primary-600">
                    {city.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {city.installer_count} installer{city.installer_count !== 1 ? 's' : ''}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/installers"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all cities →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Block */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Why choose an MCS-certified heat pump installer?
          </h2>
          <div className="mt-6 space-y-4 text-gray-600">
            <p>
              MCS (Microgeneration Certification Scheme) is the UK&apos;s quality
              standard for heat pump installations. Only MCS-certified installers can
              apply for the £7,500 Boiler Upgrade Scheme (BUS) grant on your behalf.
            </p>
            <p>
              An MCS-certified installer has been independently assessed to ensure they
              design and install heat pump systems to the highest standards. This means
              proper heat loss calculations, correct sizing, and an installation that
              will keep your home warm for 20+ years.
            </p>
            <p>
              HeatPumpHub connects you exclusively with MCS-certified businesses. Every
              installer listed on our platform holds a valid MCS certificate, so you can
              be confident you&apos;re choosing a qualified professional — and that
              you&apos;ll be eligible for the BUS grant.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
