import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">For Homeowners</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/installers" className="text-sm text-gray-600 hover:text-primary-600">
                  Find Installers
                </Link>
              </li>
              <li>
                <Link href="/grant-checker" className="text-sm text-gray-600 hover:text-primary-600">
                  BUS Grant Checker
                </Link>
              </li>
              <li>
                <Link href="/guides/what-is-a-heat-pump" className="text-sm text-gray-600 hover:text-primary-600">
                  What is a Heat Pump?
                </Link>
              </li>
              <li>
                <Link href="/guides/heat-pump-costs" className="text-sm text-gray-600 hover:text-primary-600">
                  Installation Costs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Popular Cities</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/installers/london" className="text-sm text-gray-600 hover:text-primary-600">
                  London
                </Link>
              </li>
              <li>
                <Link href="/installers/manchester" className="text-sm text-gray-600 hover:text-primary-600">
                  Manchester
                </Link>
              </li>
              <li>
                <Link href="/installers/birmingham" className="text-sm text-gray-600 hover:text-primary-600">
                  Birmingham
                </Link>
              </li>
              <li>
                <Link href="/installers/bristol" className="text-sm text-gray-600 hover:text-primary-600">
                  Bristol
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">For Installers</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/for-installers" className="text-sm text-gray-600 hover:text-primary-600">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/for-installers#pricing" className="text-sm text-gray-600 hover:text-primary-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-600">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HeatPumpHub. All rights reserved. Not affiliated with MCS or the UK Government.
          </p>
        </div>
      </div>
    </footer>
  );
}
