'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/installers', label: 'Find Installers' },
  { href: '/grant-checker', label: 'Grant Checker' },
  { href: '/guides', label: 'Guides' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-72 max-w-[80vw] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <span className="text-lg font-bold text-gray-900">
                HeatPump<span className="text-primary-600">Hub</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 border-t border-gray-100 pt-4">
                <Link
                  href="/for-installers"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-primary-600 px-3 py-3 text-center text-base font-semibold text-white hover:bg-primary-700"
                >
                  For Installers
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
