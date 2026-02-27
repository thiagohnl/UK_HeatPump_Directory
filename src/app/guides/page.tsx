import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Heat Pump Guides & Resources',
  description: 'Everything you need to know about heat pumps in the UK. Learn about costs, types, grants, and how to find MCS-certified installers.',
  alternates: { canonical: `${SITE_URL}/guides` },
};

const guides = [
  {
    title: 'What is a Heat Pump?',
    description: 'A complete guide to how heat pumps work, the different types available, and whether one is right for your home.',
    href: '/guides/what-is-a-heat-pump',
    icon: (
      <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: 'Heat Pump Costs in 2025',
    description: 'How much does a heat pump cost to install? We break down prices, running costs, and the £7,500 BUS grant.',
    href: '/guides/heat-pump-costs',
    icon: (
      <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Guides</span>
      </nav>

      <div className="mb-12 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Heat Pump Guides & Resources
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Everything you need to know about switching to a heat pump. From understanding
          how they work to calculating costs and checking grant eligibility.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
          >
            <div className="mb-4">{guide.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">
              {guide.title}
            </h2>
            <p className="mt-2 text-gray-600">{guide.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-primary-600">
              Read guide
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      {/* Grant CTA */}
      <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Could you get £7,500 towards a heat pump?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-primary-100">
          The Boiler Upgrade Scheme (BUS) offers grants of up to £7,500 for homeowners
          in England and Wales. Check your eligibility in 60 seconds.
        </p>
        <Link
          href="/grant-checker"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-primary-700 shadow-sm hover:bg-primary-50"
        >
          Check Eligibility
        </Link>
      </div>
    </div>
  );
}
