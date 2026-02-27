import { Metadata } from 'next';
import { GrantCheckerForm } from '@/components/grants/GrantCheckerForm';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'BUS Grant Eligibility Checker — Am I Eligible for £7,500?',
  description:
    'Check if you qualify for the £7,500 Boiler Upgrade Scheme (BUS) grant toward a heat pump installation. Free, instant eligibility check.',
  alternates: { canonical: `${SITE_URL}/grant-checker` },
};

export default function GrantCheckerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        BUS Grant Eligibility Checker
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        The Boiler Upgrade Scheme (BUS) offers up to £7,500 toward an air source heat
        pump. Answer a few quick questions to see if you qualify.
      </p>

      <div className="mt-8">
        <GrantCheckerForm />
      </div>

      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold text-gray-900">
          About the Boiler Upgrade Scheme
        </h2>
        <div className="mt-4 space-y-4 text-gray-600">
          <p>
            The Boiler Upgrade Scheme is a UK Government initiative that provides
            grants to help homeowners in England and Wales switch from fossil fuel
            heating to low-carbon alternatives like heat pumps.
          </p>
          <p>
            The grant covers up to £7,500 toward the cost of installing an air source
            heat pump. The grant is deducted directly from your installation quote — so
            if a heat pump costs £13,000, you would pay around £5,500.
          </p>
          <p>
            To access the grant, your installation must be carried out by an
            MCS-certified installer. The installer applies for the grant on your behalf
            — you don&apos;t need to apply separately.
          </p>
        </div>
      </div>
    </div>
  );
}
