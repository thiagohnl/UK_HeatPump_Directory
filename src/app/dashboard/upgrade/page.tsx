'use client';

import { useState } from 'react';

type Plan = {
  id: string;
  name: string;
  price: string;
  interval: string;
  description: string;
  badge?: string;
};

const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '£29',
    interval: '/month',
    description: 'Flexible monthly billing. Cancel anytime.',
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '£249',
    interval: '/year',
    description: 'Best value — save 28% compared to monthly.',
    badge: 'Save 28%',
  },
];

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(plan: string) {
    setLoading(plan);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Upgrade to Premium
        </h1>
        <p className="mt-2 text-gray-600">
          Unlock full access to homeowner contact details and respond to
          enquiries directly.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border-2 bg-white p-6 ${
              plan.badge
                ? 'border-primary-500 shadow-md'
                : 'border-gray-200'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-semibold text-white">
                {plan.badge}
              </span>
            )}

            <h2 className="text-lg font-semibold text-gray-900">
              {plan.name}
            </h2>

            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-500">{plan.interval}</span>
            </div>

            <p className="mt-2 text-sm text-gray-600">{plan.description}</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                Full homeowner contact details
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                Email and phone access
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                Homeowner messages
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                Unlimited lead access
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                plan.badge
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              {loading === plan.id ? 'Redirecting…' : `Subscribe ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      <p className="mt-8 text-center text-xs text-gray-500">
        Payments are securely processed by Stripe. You can cancel your
        subscription at any time from your dashboard.
      </p>
    </div>
  );
}
