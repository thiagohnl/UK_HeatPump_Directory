import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About HeatPumpHub',
  description: 'HeatPumpHub connects UK homeowners with MCS-certified heat pump installers. Learn about our mission to accelerate the UK\'s transition to low-carbon heating.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">About</span>
      </nav>

      <article className="prose prose-gray max-w-none prose-headings:text-gray-900">
        <h1>About HeatPumpHub</h1>

        <p>
          HeatPumpHub is the UK&apos;s directory for MCS-certified heat pump installers. We help
          homeowners find trusted, qualified professionals to install heat pumps in their homes.
        </p>

        <h2>Our Mission</h2>
        <p>
          The UK has committed to reaching net zero by 2050, and heating accounts for around
          a third of the country&apos;s carbon emissions. Heat pumps are a key part of the
          solution — they&apos;re 3–4 times more efficient than gas boilers and produce
          significantly fewer carbon emissions.
        </p>
        <p>
          We believe the biggest barrier to heat pump adoption isn&apos;t cost or technology —
          it&apos;s finding a trusted installer. HeatPumpHub makes it easy for homeowners to
          find MCS-certified professionals in their area, understand costs and grants, and
          take the first step towards low-carbon heating.
        </p>

        <h2>What We Do</h2>
        <ul>
          <li>List over 2,200 MCS-certified heat pump installers across the UK</li>
          <li>Help homeowners check their eligibility for the £7,500 BUS grant</li>
          <li>Provide clear, honest guides about heat pump costs and benefits</li>
          <li>Connect homeowners with installers in their local area</li>
        </ul>

        <h2>Our Data</h2>
        <p>
          Our installer directory is built from official MCS (Microgeneration Certification
          Scheme) data. Every installer listed on HeatPumpHub holds a valid MCS certificate,
          which is required to access the Boiler Upgrade Scheme grant.
        </p>

        <h2>Independence</h2>
        <p>
          HeatPumpHub is an independent service. We are not affiliated with MCS, the UK
          Government, or any specific heat pump manufacturer or installer. Our goal is to
          provide impartial information to help homeowners make informed decisions.
        </p>
      </article>

      <div className="mt-12">
        <Link
          href="/installers"
          className="inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
        >
          Find Installers Near You
        </Link>
      </div>
    </div>
  );
}
