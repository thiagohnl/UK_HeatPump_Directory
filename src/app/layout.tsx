import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'HeatPumpHub — Find MCS-Certified Heat Pump Installers Near You',
    template: '%s | HeatPumpHub',
  },
  description:
    'Find trusted, MCS-certified heat pump installers in your area. Check your £7,500 BUS grant eligibility and get free quotes from verified professionals.',
  keywords: [
    'heat pump installer',
    'MCS certified',
    'air source heat pump',
    'BUS grant',
    'boiler upgrade scheme',
    'heat pump installation UK',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'HeatPumpHub',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="flex min-h-screen flex-col bg-white font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
