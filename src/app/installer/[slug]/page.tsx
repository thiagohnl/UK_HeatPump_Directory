import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/constants';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: installer } = await supabase
    .from('installers')
    .select('company_name, address_city, address_postcode')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!installer) return { title: 'Installer Not Found' };

  const location = installer.address_city || installer.address_postcode || 'UK';
  return {
    title: `${installer.company_name} — MCS Heat Pump Installer in ${location}`,
    description: `${installer.company_name} is an MCS-certified heat pump installer in ${location}. Get a free quote and check BUS grant eligibility.`,
    alternates: { canonical: `${SITE_URL}/installer/${params.slug}` },
  };
}

export default async function InstallerProfilePage({ params }: Props) {
  const supabase = createClient();

  const { data: installer } = await supabase
    .from('installers')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!installer) notFound();

  const technologies = [
    installer.has_ashp && 'Air Source Heat Pump',
    installer.has_gshp && 'Ground Source Heat Pump',
    installer.has_solar_pv && 'Solar PV',
    installer.has_battery && 'Battery Storage',
  ].filter(Boolean);

  const location = installer.address_city || installer.address_postcode || 'UK';

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: installer.company_name,
    description: installer.description || `MCS-certified heat pump installer in ${location}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: installer.address_city || undefined,
      addressRegion: installer.address_county || undefined,
      postalCode: installer.address_postcode || undefined,
      addressCountry: 'GB',
    },
    telephone: installer.phone || undefined,
    url: installer.website || undefined,
    ...(installer.latitude && installer.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: installer.latitude,
            longitude: installer.longitude,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/installers" className="hover:text-primary-600">Installers</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{installer.company_name}</span>
        </nav>

        {/* Header */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {installer.company_name}
              </h1>
              <p className="mt-1 text-gray-600">
                MCS-certified heat pump installer in {location}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              {installer.mcs_certified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  MCS Certified
                </span>
              )}
              {installer.trustmark && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  TrustMark Registered
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {installer.description && (
            <p className="mt-6 text-gray-600">{installer.description}</p>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-900">Technologies</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            {installer.phone && (
              <div>
                <span className="text-sm font-medium text-gray-500">Phone</span>
                <p className="mt-0.5 text-gray-900">{installer.phone}</p>
              </div>
            )}
            {installer.email && (
              <div>
                <span className="text-sm font-medium text-gray-500">Email</span>
                <p className="mt-0.5 text-gray-900">{installer.email}</p>
              </div>
            )}
            {installer.website && (
              <div>
                <span className="text-sm font-medium text-gray-500">Website</span>
                <p className="mt-0.5">
                  <a
                    href={installer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {installer.website.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              </div>
            )}
            {installer.address_postcode && (
              <div>
                <span className="text-sm font-medium text-gray-500">Location</span>
                <p className="mt-0.5 text-gray-900">
                  {[installer.address_city, installer.address_county, installer.address_postcode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            )}
            {installer.mcs_number && (
              <div>
                <span className="text-sm font-medium text-gray-500">MCS Number</span>
                <p className="mt-0.5 text-gray-900">{installer.mcs_number}</p>
              </div>
            )}
            {installer.coverage_regions.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500">Regions Covered</span>
                <p className="mt-0.5 text-gray-900">
                  {installer.coverage_regions.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA: Get a Quote */}
        <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Interested in a heat pump from {installer.company_name}?
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Check your BUS grant eligibility and request a free quote.
          </p>
          <Link
            href="/grant-checker"
            className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Check Grant Eligibility
          </Link>
        </div>

        {/* Claim Profile CTA (for unclaimed profiles) */}
        {!installer.is_claimed && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <h3 className="font-semibold text-gray-900">
              Is this your business?
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Claim this profile to manage your listing, respond to leads, and
              appear higher in search results.
            </p>
            <Link
              href="/for-installers"
              className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Claim this profile →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
