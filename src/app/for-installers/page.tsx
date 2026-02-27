import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'For Installers — List Your Business on HeatPumpHub',
  description: 'Grow your heat pump business with HeatPumpHub. Get found by homeowners, receive qualified leads, and build trust with a verified MCS-certified profile.',
  alternates: { canonical: `${SITE_URL}/for-installers` },
};

const benefits = [
  {
    title: 'Get Found by Homeowners',
    description: 'Your business appears in search results when homeowners in your area look for MCS-certified heat pump installers.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: 'Receive Qualified Leads',
    description: 'Connect with homeowners who are actively looking for heat pump installations and have checked their BUS grant eligibility.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'Build Trust & Credibility',
    description: 'Showcase your MCS certification, TrustMark accreditation, and customer reviews to stand out from the competition.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const tiers = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    description: 'Basic listing from MCS data',
    cta: 'Already Listed',
    ctaHref: '/installers',
    ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    features: [
      { text: 'Company name & location', included: true },
      { text: 'MCS certification badge', included: true },
      { text: 'Technology types listed', included: true },
      { text: 'Phone & email displayed', included: false },
      { text: 'Custom description', included: false },
      { text: 'Company logo', included: false },
      { text: 'Priority in search results', included: false },
      { text: 'Lead notifications', included: false },
    ],
  },
  {
    name: 'Basic',
    price: '£19',
    period: '/month',
    description: 'Claim and enhance your profile',
    cta: 'Coming Soon',
    ctaHref: null,
    ctaStyle: 'bg-primary-600 text-white hover:bg-primary-700',
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Phone & email displayed', included: true },
      { text: 'Custom description', included: true },
      { text: 'Company logo', included: true },
      { text: 'Website link', included: true },
      { text: 'Priority in search results', included: true },
      { text: 'Lead notifications', included: false },
      { text: 'Analytics dashboard', included: false },
    ],
  },
  {
    name: 'Premium',
    price: '£49',
    period: '/month',
    description: 'Maximum visibility & leads',
    cta: 'Coming Soon',
    ctaHref: null,
    ctaStyle: 'bg-gray-900 text-white hover:bg-gray-800',
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Featured badge', included: true },
      { text: 'Top placement in city pages', included: true },
      { text: 'Lead notifications', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated account manager', included: false },
      { text: 'Custom landing page', included: false },
    ],
  },
];

const faqs = [
  {
    q: 'Is my business already listed?',
    a: 'If you\'re MCS-certified for heat pump installations, your business is likely already listed. We\'ve imported data for over 2,200 MCS-certified installers across the UK. Search for your company name to find your listing.',
  },
  {
    q: 'How do I claim my profile?',
    a: 'Profile claiming will be available soon. When launched, you\'ll be able to verify your identity, update your business information, add a logo, and start receiving lead notifications.',
  },
  {
    q: 'What does the free listing include?',
    a: 'Every MCS-certified installer gets a free listing showing their company name, location, MCS certification status, and technology types. This data comes directly from the MCS register.',
  },
  {
    q: 'When will paid tiers be available?',
    a: 'We\'re planning to launch Basic and Premium tiers in early 2025. Sign up to be notified when they become available.',
  },
];

export default function ForInstallersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Grow Your Heat Pump Business
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            HeatPumpHub connects you with homeowners actively searching for MCS-certified
            heat pump installers. Get found, build trust, and receive qualified leads.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/installers"
              className="rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white hover:bg-primary-700"
            >
              Find Your Listing
            </Link>
            <a
              href="#pricing"
              className="rounded-lg border border-gray-500 px-8 py-3 font-semibold text-white hover:bg-gray-700"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-700">2,200+</p>
            <p className="text-sm text-gray-600">Installers listed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-700">50+</p>
            <p className="text-sm text-gray-600">UK cities covered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-700">Free</p>
            <p className="text-sm text-gray-600">Basic listing</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Why List on HeatPumpHub?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  {b.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{b.title}</h3>
                <p className="mt-2 text-gray-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Every MCS-certified installer gets a free listing. Upgrade to reach more homeowners.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl bg-white p-8 shadow-sm ${
                  tier.popular ? 'ring-2 ring-primary-600' : 'border border-gray-200'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-500">{tier.period}</span>
                </p>

                {tier.ctaHref ? (
                  <Link
                    href={tier.ctaHref}
                    className={`mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <button
                    disabled
                    className={`mt-8 block w-full cursor-not-allowed rounded-lg px-4 py-3 text-center text-sm font-semibold opacity-75 ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                  </button>
                )}

                <ul className="mt-8 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-3 text-sm">
                      {f.included ? (
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: '1', title: 'Find Your Listing', desc: 'Search for your company name — if you\'re MCS-certified, you\'re already listed.' },
              { step: '2', title: 'Claim Your Profile', desc: 'Verify your identity and take control of your business listing.' },
              { step: '3', title: 'Start Receiving Leads', desc: 'Homeowners in your area can find you and request quotes.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {s.step}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-700 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to Grow Your Business?</h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-100">
          Join over 2,200 MCS-certified installers already listed on HeatPumpHub.
        </p>
        <Link
          href="/installers"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-primary-700 hover:bg-primary-50"
        >
          Find Your Listing
        </Link>
      </section>
    </div>
  );
}
