import Link from 'next/link';

type Props = {
  title?: string;
  message?: string;
};

export function UpgradeCTA({
  title = 'Upgrade to view contact details',
  message = 'Get full access to homeowner names, emails, phone numbers, and messages so you can respond to enquiries directly.',
}: Props) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{message}</p>
      <Link
        href="/dashboard/upgrade"
        className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-700"
      >
        View Plans
      </Link>
    </div>
  );
}
