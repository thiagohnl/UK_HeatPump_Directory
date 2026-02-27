import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'What is a Heat Pump? Complete Homeowner\'s Guide',
  description: 'Learn how heat pumps work, the different types (air source, ground source), benefits, costs, and whether a heat pump is right for your UK home.',
  alternates: { canonical: `${SITE_URL}/guides/what-is-a-heat-pump` },
};

export default function WhatIsAHeatPumpPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is a Heat Pump? Complete Homeowner\'s Guide',
    description: 'Learn how heat pumps work, the different types available, and whether a heat pump is right for your UK home.',
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
          <span className="text-gray-900">What is a Heat Pump?</span>
        </nav>

        <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          <h1>What is a Heat Pump?</h1>

          <p className="lead text-lg text-gray-600">
            A heat pump is a highly efficient heating system that extracts warmth from the outside
            air or ground and transfers it into your home. Think of it as a refrigerator working
            in reverse — instead of removing heat from inside, it brings heat in from outside.
          </p>

          <h2>How Does a Heat Pump Work?</h2>
          <p>
            Heat pumps use a small amount of electricity to move heat from one place to another,
            rather than generating heat directly like a gas boiler. Even when it&apos;s cold outside,
            there&apos;s still heat energy in the air and ground. A heat pump captures this energy
            and concentrates it to heat your home and hot water.
          </p>
          <p>
            The process works through a cycle of evaporation and condensation using a refrigerant
            fluid. The outdoor unit absorbs heat, the compressor increases its temperature, and
            the indoor unit releases the heat into your central heating system.
          </p>
          <p>
            For every 1 kW of electricity used, a heat pump typically produces 3–4 kW of heat.
            This ratio is called the Coefficient of Performance (COP), and it&apos;s what makes
            heat pumps so much more efficient than traditional boilers.
          </p>

          <h2>Types of Heat Pumps</h2>

          <h3>Air Source Heat Pumps (ASHP)</h3>
          <p>
            The most popular choice in the UK. An air source heat pump sits outside your home
            (similar in size to an air conditioning unit) and extracts heat from the outdoor air.
            They work effectively even at temperatures as low as -15°C.
          </p>
          <ul>
            <li><strong>Cost:</strong> £8,000–£15,000 installed</li>
            <li><strong>Installation:</strong> Typically 2–3 days, minimal disruption</li>
            <li><strong>Best for:</strong> Most UK homes, especially those with good insulation</li>
            <li><strong>Space needed:</strong> Outdoor unit roughly 1m × 1m × 0.5m</li>
          </ul>

          <h3>Ground Source Heat Pumps (GSHP)</h3>
          <p>
            Ground source heat pumps extract heat from underground via buried pipes (called a
            ground loop). The ground temperature stays relatively constant at 10–12°C year-round,
            making GSHPs slightly more efficient than ASHPs.
          </p>
          <ul>
            <li><strong>Cost:</strong> £15,000–£35,000 installed</li>
            <li><strong>Installation:</strong> Requires garden space for ground loops or a borehole</li>
            <li><strong>Best for:</strong> Homes with large gardens, new builds, rural properties</li>
            <li><strong>Space needed:</strong> Significant garden area or borehole drilling</li>
          </ul>

          <h3>Hybrid Heat Pumps</h3>
          <p>
            A hybrid system combines an air source heat pump with a traditional gas boiler.
            The heat pump handles most of the heating, with the boiler kicking in during the
            coldest days. This can be a good transitional option for homes that aren&apos;t
            fully insulated yet.
          </p>

          <h2>Benefits of Heat Pumps</h2>
          <ul>
            <li><strong>Lower running costs:</strong> 3–4x more efficient than gas boilers, saving £200–£500 per year on heating bills</li>
            <li><strong>Lower carbon emissions:</strong> Significantly reduces your home&apos;s carbon footprint, especially as the UK grid gets greener</li>
            <li><strong>Government grants:</strong> The Boiler Upgrade Scheme offers up to £7,500 towards installation in England and Wales</li>
            <li><strong>Cooling in summer:</strong> Many heat pumps can reverse to provide cooling during hot weather</li>
            <li><strong>Long lifespan:</strong> 20–25 years with proper maintenance, compared to 10–15 for a gas boiler</li>
            <li><strong>Low maintenance:</strong> Annual service recommended, but fewer moving parts than a boiler</li>
          </ul>

          <h2>Is My Home Suitable?</h2>
          <p>Most UK homes can have a heat pump installed, but some factors affect suitability:</p>
          <ul>
            <li><strong>Insulation:</strong> Well-insulated homes get the best results. Consider upgrading insulation first if your EPC rating is D or below.</li>
            <li><strong>Space:</strong> You&apos;ll need outdoor space for the unit (ASHP) or garden space for ground loops (GSHP).</li>
            <li><strong>Radiators:</strong> Heat pumps run at lower temperatures than boilers, so you may need larger radiators or underfloor heating.</li>
            <li><strong>Electricity supply:</strong> Your electrical supply should be adequate — most homes won&apos;t need an upgrade.</li>
          </ul>

          <h2>The BUS Grant</h2>
          <p>
            The <strong>Boiler Upgrade Scheme (BUS)</strong> provides grants of up to £7,500
            for homeowners in England and Wales to help cover the cost of installing a heat pump.
            Scotland has its own grant scheme through Home Energy Scotland.
          </p>
          <p>
            To qualify, your home must have an EPC (Energy Performance Certificate) and the
            installation must be carried out by an MCS-certified installer.
          </p>
        </article>

        {/* CTAs */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Link
            href="/grant-checker"
            className="rounded-xl border border-primary-200 bg-primary-50 p-6 text-center hover:bg-primary-100"
          >
            <p className="text-lg font-semibold text-primary-700">Check Your Grant Eligibility</p>
            <p className="mt-1 text-sm text-primary-600">60-second eligibility check for the £7,500 BUS grant</p>
          </Link>
          <Link
            href="/installers"
            className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center hover:bg-gray-100"
          >
            <p className="text-lg font-semibold text-gray-900">Find MCS Installers Near You</p>
            <p className="mt-1 text-sm text-gray-600">Search 2,200+ certified heat pump installers</p>
          </Link>
        </div>

        {/* Related */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900">Related Guides</h2>
          <Link
            href="/guides/heat-pump-costs"
            className="mt-4 block rounded-lg border border-gray-200 p-4 hover:border-primary-200 hover:bg-primary-50"
          >
            <p className="font-medium text-gray-900">Heat Pump Costs in 2025</p>
            <p className="text-sm text-gray-600">Installation prices, running costs, and how to save with the BUS grant</p>
          </Link>
        </div>
      </div>
    </>
  );
}
