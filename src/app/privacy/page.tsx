import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How HeatPumpHub collects, uses, and protects your personal data.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Privacy Policy</span>
      </nav>

      <article className="prose prose-gray max-w-none prose-headings:text-gray-900">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: February 2025</p>

        <p>
          HeatPumpHub (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting
          your privacy. This policy explains how we collect, use, and safeguard your personal data
          when you use our website.
        </p>

        <h2>What Data We Collect</h2>
        <h3>When you search for installers</h3>
        <p>
          We collect the postcode you enter to find installers in your area. This data is used
          solely to provide search results and is not stored long-term.
        </p>

        <h3>When you submit an enquiry</h3>
        <p>We collect the information you provide in our lead form, including:</p>
        <ul>
          <li>Your name and contact details (email, phone number)</li>
          <li>Your postcode</li>
          <li>Property details (type, age, EPC rating)</li>
          <li>Your current heating system and installation timeline</li>
          <li>Any message you include</li>
        </ul>

        <h3>Automatic data collection</h3>
        <p>
          Like most websites, we collect basic usage data including your IP address,
          browser type, pages visited, and referring website. This helps us improve
          our service.
        </p>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>To match you with relevant heat pump installers in your area</li>
          <li>To share your enquiry with the installer(s) you&apos;ve selected</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>
          When you submit an enquiry, your contact details and property information are
          shared with the installer(s) you&apos;ve selected so they can provide a quote.
          We do not sell your data to third parties.
        </p>

        <h2>Third-Party Services</h2>
        <p>We use the following services to operate our website:</p>
        <ul>
          <li><strong>Supabase</strong> — database hosting (EU region)</li>
          <li><strong>Vercel</strong> — website hosting</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use essential cookies to ensure the website functions correctly. We do not
          currently use advertising or tracking cookies.
        </p>

        <h2>Your Rights</h2>
        <p>Under UK GDPR, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Request data portability</li>
        </ul>

        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy or wish to exercise your rights,
          please contact us at privacy@heatpumphub.co.uk.
        </p>
      </article>
    </div>
  );
}
