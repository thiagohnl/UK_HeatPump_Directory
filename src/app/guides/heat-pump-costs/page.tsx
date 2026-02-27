import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Heat Pump Costs 2025: Installation Prices, Grants & Running Costs',
  description: 'How much does a heat pump cost in 2025? ASHP from £8,000, GSHP from £15,000. Learn about the £7,500 BUS grant, running costs vs gas, and factors affecting price.',
  alternates: { canonical: `${SITE_URL}/guides/heat-pump-costs` },
};

export default function HeatPumpCostsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Heat Pump Costs 2025: Installation Prices, Grants & Running Costs',
    description: 'A comprehensive breakdown of heat pump installation costs in the UK.',
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    datePublished: '2025-01-01',
    dateModified: '2025-06-01',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/guides" className="hover:text-primary-600">Guides</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Heat Pump Costs</span>
        </nav>

        <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          <h1>Heat Pump Costs in 2025</h1>

          <p className="lead text-lg text-gray-600">
            The average cost of installing a heat pump in the UK is around £13,200 before grants.
            With the £7,500 BUS grant, most homeowners pay between £5,500 and £7,500 for an
            air source heat pump installation.
          </p>

          <h2>Installation Cost Summary</h2>

          {/* Cost table */}
          <div className="not-prose my-8 overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-700 text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Heat Pump Type</th>
                  <th className="px-6 py-4 font-semibold">Cost (before grant)</th>
                  <th className="px-6 py-4 font-semibold">Cost (after BUS grant)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-6 py-4 font-medium text-gray-900">Air Source (ASHP)</td>
                  <td className="px-6 py-4 text-gray-600">£8,000 – £15,000</td>
                  <td className="px-6 py-4 font-medium text-primary-700">£500 – £7,500</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Ground Source (GSHP)</td>
                  <td className="px-6 py-4 text-gray-600">£15,000 – £35,000</td>
                  <td className="px-6 py-4 font-medium text-primary-700">£7,500 – £27,500</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 font-medium text-gray-900">Hybrid (ASHP + boiler)</td>
                  <td className="px-6 py-4 text-gray-600">£5,000 – £10,000</td>
                  <td className="px-6 py-4 text-gray-500">Not eligible for BUS</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>What&apos;s Included in the Price?</h2>
          <p>A typical heat pump installation cost includes:</p>
          <ul>
            <li><strong>The heat pump unit:</strong> £3,000–£8,000 depending on brand and capacity</li>
            <li><strong>Installation labour:</strong> £2,000–£4,000 for a typical 2–3 day install</li>
            <li><strong>Pipework and fittings:</strong> £500–£1,500 connecting to your heating system</li>
            <li><strong>Hot water cylinder:</strong> £500–£1,500 if you need a new one (most do)</li>
            <li><strong>Electrical work:</strong> £300–£800 for wiring and controls</li>
            <li><strong>MCS certification:</strong> Included in installer quotes (required for BUS grant)</li>
          </ul>

          <h2>The £7,500 BUS Grant</h2>
          <p>
            The <strong>Boiler Upgrade Scheme</strong> is a UK Government grant available
            in England and Wales. It provides:
          </p>
          <ul>
            <li><strong>£7,500</strong> for air source heat pumps</li>
            <li><strong>£7,500</strong> for ground source heat pumps</li>
          </ul>
          <p>
            The grant is applied directly by your MCS-certified installer — you don&apos;t
            need to apply separately. The installer deducts the grant from your total cost,
            so you only pay the difference.
          </p>
          <p>
            To qualify, your home must have a valid EPC and you must be replacing a fossil
            fuel heating system (gas, oil, LPG, or coal). The scheme currently runs until
            March 2028.
          </p>

          <h2>Running Costs: Heat Pump vs Gas Boiler</h2>

          <div className="not-prose my-8 overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">Heating System</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Efficiency</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Annual Cost (3-bed)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-6 py-4 font-medium text-gray-900">Air Source Heat Pump</td>
                  <td className="px-6 py-4 text-gray-600">300–400%</td>
                  <td className="px-6 py-4 font-medium text-primary-700">£500 – £800</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Gas Boiler (new)</td>
                  <td className="px-6 py-4 text-gray-600">90–95%</td>
                  <td className="px-6 py-4 text-gray-600">£800 – £1,200</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 font-medium text-gray-900">Oil Boiler</td>
                  <td className="px-6 py-4 text-gray-600">85–90%</td>
                  <td className="px-6 py-4 text-gray-600">£1,200 – £1,800</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Electric Storage Heaters</td>
                  <td className="px-6 py-4 text-gray-600">100%</td>
                  <td className="px-6 py-4 text-gray-600">£1,500 – £2,500</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Running costs depend on your tariff, home insulation, and usage patterns.
            Heat pump owners on time-of-use tariffs can reduce costs further by heating
            during off-peak hours.
          </p>

          <h2>Factors That Affect Cost</h2>
          <ul>
            <li><strong>Property size:</strong> Larger homes need higher-capacity (and more expensive) heat pumps</li>
            <li><strong>Insulation quality:</strong> Well-insulated homes need smaller, cheaper units</li>
            <li><strong>Existing heating system:</strong> If you already have radiators and a hot water cylinder, costs are lower</li>
            <li><strong>Location:</strong> Labour costs vary by region — London and the South East tend to be higher</li>
            <li><strong>Ground conditions (GSHP only):</strong> Rocky ground increases borehole drilling costs</li>
            <li><strong>Radiator upgrades:</strong> You may need larger radiators for lower-temperature heat pump operation</li>
          </ul>

          <h2>How to Reduce Your Costs</h2>
          <ol>
            <li><strong>Claim the BUS grant:</strong> £7,500 off — make sure your installer is MCS-certified</li>
            <li><strong>Improve insulation first:</strong> Better insulation means a smaller, cheaper heat pump</li>
            <li><strong>Get multiple quotes:</strong> Compare at least 3 quotes from different MCS installers</li>
            <li><strong>Consider timing:</strong> Spring and summer installations may be cheaper (less demand)</li>
            <li><strong>Check local authority grants:</strong> Some councils offer additional funding on top of BUS</li>
          </ol>
        </article>

        {/* CTAs */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Link
            href="/grant-checker"
            className="rounded-xl border border-primary-200 bg-primary-50 p-6 text-center hover:bg-primary-100"
          >
            <p className="text-lg font-semibold text-primary-700">Check Your Grant Eligibility</p>
            <p className="mt-1 text-sm text-primary-600">See if you qualify for £7,500 towards your heat pump</p>
          </Link>
          <Link
            href="/installers"
            className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center hover:bg-gray-100"
          >
            <p className="text-lg font-semibold text-gray-900">Get Quotes from MCS Installers</p>
            <p className="mt-1 text-sm text-gray-600">Compare prices from certified professionals near you</p>
          </Link>
        </div>

        {/* Related */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900">Related Guides</h2>
          <Link
            href="/guides/what-is-a-heat-pump"
            className="mt-4 block rounded-lg border border-gray-200 p-4 hover:border-primary-200 hover:bg-primary-50"
          >
            <p className="font-medium text-gray-900">What is a Heat Pump?</p>
            <p className="text-sm text-gray-600">How heat pumps work, types available, and whether one is right for your home</p>
          </Link>
        </div>
      </div>
    </>
  );
}
