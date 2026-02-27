import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">
            HeatPump<span className="text-primary-600">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/installers"
            className="text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            Find Installers
          </Link>
          <Link
            href="/grant-checker"
            className="text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            Grant Checker
          </Link>
          <Link
            href="/guides"
            className="text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            Guides
          </Link>
          <Link
            href="/for-installers"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            For Installers
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
