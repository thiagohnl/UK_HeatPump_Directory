import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using the HeatPumpHub website and services.',
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Terms of Use</span>
      </nav>

      <article className="prose prose-gray max-w-none prose-headings:text-gray-900">
        <h1>Terms of Use</h1>
        <p className="text-sm text-gray-500">Last updated: February 2025</p>

        <p>
          By using HeatPumpHub (&quot;the website&quot;), you agree to these terms of use.
          Please read them carefully.
        </p>

        <h2>Use of the Service</h2>
        <p>
          HeatPumpHub provides a directory of MCS-certified heat pump installers and related
          information. You may use the website to search for installers, read guides, check
          grant eligibility, and submit enquiries.
        </p>

        <h2>Installer Information</h2>
        <p>
          The installer data displayed on HeatPumpHub is sourced from the MCS (Microgeneration
          Certification Scheme) register and other public sources. While we make every effort
          to keep this information accurate and up-to-date:
        </p>
        <ul>
          <li>We do not guarantee the accuracy or completeness of installer listings</li>
          <li>MCS certification status may change — always verify directly with the installer</li>
          <li>We do not endorse or recommend any specific installer</li>
          <li>We are not responsible for the quality of work performed by any installer</li>
        </ul>

        <h2>Grant Information</h2>
        <p>
          Our BUS grant eligibility checker provides general guidance only. Eligibility is
          determined by the UK Government and your MCS-certified installer. We do not
          guarantee grant eligibility or amounts. Always confirm with your installer and
          check the latest Government guidance.
        </p>

        <h2>Enquiries and Leads</h2>
        <p>
          When you submit an enquiry through our website, your information is shared with
          the relevant installer(s). We facilitate the connection but are not a party to
          any agreement between you and an installer.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          HeatPumpHub is provided &quot;as is&quot; without warranties of any kind. To the
          fullest extent permitted by law, we are not liable for any damages arising from
          your use of the website, reliance on information provided, or any transaction
          with an installer found through our service.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          The content, design, and branding of HeatPumpHub are owned by us. You may not
          reproduce, distribute, or create derivative works without our written permission.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the website after
          changes constitutes acceptance of the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these terms, please contact us at
          legal@heatpumphub.co.uk.
        </p>
      </article>
    </div>
  );
}
