'use client';

import { useState } from 'react';
import Link from 'next/link';

type Answers = {
  location: 'england' | 'wales' | 'scotland' | 'ni' | '';
  propertyType: 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'bungalow' | '';
  hasEpc: 'yes' | 'no' | 'unsure' | '';
  currentHeating: 'gas' | 'oil' | 'electric' | 'lpg' | 'other' | '';
  hasHeatPump: 'yes' | 'no' | '';
};

type EligibilityResult = {
  eligible: boolean;
  message: string;
  details: string[];
  grantAmount: string;
};

export function GrantCheckerForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    location: '',
    propertyType: '',
    hasEpc: '',
    currentHeating: '',
    hasHeatPump: '',
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);

  function setAnswer(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // Auto-advance to next step
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate result
      calculateEligibility({ ...answers, [key]: value });
    }
  }

  function calculateEligibility(a: Answers) {
    const issues: string[] = [];
    let eligible = true;

    if (a.location === 'scotland') {
      eligible = false;
      issues.push(
        'The BUS grant covers England and Wales only. Scotland has its own Home Energy Scotland scheme — you may still qualify for support there.'
      );
    } else if (a.location === 'ni') {
      eligible = false;
      issues.push(
        'The BUS grant covers England and Wales only. Northern Ireland has separate energy efficiency schemes.'
      );
    }

    if (a.hasHeatPump === 'yes') {
      eligible = false;
      issues.push(
        'The BUS grant is for replacing existing heating with a heat pump. Properties that already have a heat pump are not eligible.'
      );
    }

    if (a.hasEpc === 'no') {
      issues.push(
        'You will need a valid Energy Performance Certificate (EPC) for your property. You can commission one from a local assessor — typical cost is £60–120.'
      );
    }

    if (a.flat === 'flat') {
      issues.push(
        'Flats may face additional planning considerations for external heat pump units. Check with your freeholder/management company.'
      );
    }

    const positives: string[] = [];
    if (eligible) {
      positives.push('Your property appears to be in England or Wales ✓');
      positives.push('You don\'t already have a heat pump ✓');
      if (a.hasEpc === 'yes') positives.push('You have a valid EPC ✓');
      if (['gas', 'oil', 'lpg'].includes(a.currentHeating)) {
        positives.push('Replacing a fossil fuel system qualifies for the full grant ✓');
      }
    }

    setResult({
      eligible,
      message: eligible
        ? 'Great news — you likely qualify for the BUS grant!'
        : 'You may not be eligible for the BUS grant',
      details: eligible ? positives : issues,
      grantAmount: eligible ? '£7,500' : '£0',
    });
  }

  function reset() {
    setStep(0);
    setAnswers({
      location: '',
      propertyType: '',
      hasEpc: '',
      currentHeating: '',
      hasHeatPump: '',
    });
    setResult(null);
  }

  const steps = [
    {
      question: 'Where is your property?',
      key: 'location' as keyof Answers,
      options: [
        { value: 'england', label: 'England' },
        { value: 'wales', label: 'Wales' },
        { value: 'scotland', label: 'Scotland' },
        { value: 'ni', label: 'Northern Ireland' },
      ],
    },
    {
      question: 'What type of property is it?',
      key: 'propertyType' as keyof Answers,
      options: [
        { value: 'detached', label: 'Detached house' },
        { value: 'semi-detached', label: 'Semi-detached' },
        { value: 'terraced', label: 'Terraced' },
        { value: 'bungalow', label: 'Bungalow' },
        { value: 'flat', label: 'Flat / apartment' },
      ],
    },
    {
      question: 'Do you have a valid Energy Performance Certificate (EPC)?',
      key: 'hasEpc' as keyof Answers,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      question: 'What is your current heating system?',
      key: 'currentHeating' as keyof Answers,
      options: [
        { value: 'gas', label: 'Gas boiler' },
        { value: 'oil', label: 'Oil boiler' },
        { value: 'electric', label: 'Electric heating' },
        { value: 'lpg', label: 'LPG' },
        { value: 'other', label: 'Other / none' },
      ],
    },
    {
      question: 'Does your property already have a heat pump?',
      key: 'hasHeatPump' as keyof Answers,
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ],
    },
  ];

  // Show result
  if (result) {
    return (
      <div
        className={`rounded-xl border-2 p-6 sm:p-8 ${
          result.eligible
            ? 'border-primary-200 bg-primary-50'
            : 'border-amber-200 bg-amber-50'
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              result.eligible ? 'bg-primary-100' : 'bg-amber-100'
            }`}
          >
            {result.eligible ? (
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{result.message}</h2>
          {result.eligible && (
            <p className="mt-2 text-lg text-gray-600">
              You could receive up to <strong className="text-primary-700">{result.grantAmount}</strong> toward
              your heat pump installation.
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {result.details.map((detail, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 shrink-0">
                {result.eligible ? '✓' : '•'}
              </span>
              {detail}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {result.eligible && (
            <Link
              href="/installers"
              className="rounded-lg bg-primary-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-primary-700"
            >
              Find Installers Near You
            </Link>
          )}
          <button
            onClick={reset}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  // Show current step
  const currentStep = steps[step];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      {/* Progress */}
      <div className="mb-6 flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500">
        Question {step + 1} of {steps.length}
      </p>

      <h2 className="mt-2 text-xl font-semibold text-gray-900">
        {currentStep.question}
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {currentStep.options.map((option) => (
          <button
            key={option.value}
            onClick={() => setAnswer(currentStep.key, option.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 transition hover:border-primary-300 hover:bg-primary-50"
          >
            {option.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
