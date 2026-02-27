'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PostcodeSearch({ size = 'large' }: { size?: 'large' | 'small' }) {
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const isLarge = size === 'large';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleaned = postcode.trim().toUpperCase();

    // Basic UK postcode validation (permissive — allows partial)
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d?[A-Z]{0,2}$/;
    if (!cleaned || !postcodeRegex.test(cleaned)) {
      setError('Please enter a valid UK postcode');
      return;
    }

    // Navigate to search results
    router.push(`/installers?postcode=${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl">
      <div
        className={`flex ${isLarge ? 'flex-col gap-3 sm:flex-row sm:gap-0' : 'flex-row gap-0'}`}
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value);
              setError('');
            }}
            placeholder="Enter your postcode, e.g. SW1A 1AA"
            className={`w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
              isLarge
                ? 'rounded-lg px-5 py-4 text-lg sm:rounded-l-lg sm:rounded-r-none'
                : 'rounded-l-lg px-4 py-2.5 text-sm'
            } ${error ? 'border-red-400' : ''}`}
          />
        </div>
        <button
          type="submit"
          className={`whitespace-nowrap bg-primary-600 font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            isLarge
              ? 'rounded-lg px-8 py-4 text-lg sm:rounded-l-none sm:rounded-r-lg'
              : 'rounded-r-lg px-5 py-2.5 text-sm'
          }`}
        >
          Find Installers
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}
