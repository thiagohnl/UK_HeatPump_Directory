import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { isPremium } from '@/lib/tier';
import { UpgradeCTA } from '@/components/dashboard/UpgradeCTA';

type Props = {
  params: { id: string };
};

export default async function LeadDetailPage({ params }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: installer } = await supabase
    .from('installers')
    .select('id, subscription_tier')
    .eq('claimed_by', user.id)
    .single();

  if (!installer) redirect('/installers?notice=claim_first');

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .eq('installer_id', installer.id)
    .single();

  if (!lead) notFound();

  // Mark as viewed if new
  if (lead.status === 'new') {
    await supabase
      .from('leads')
      .update({ status: 'viewed' })
      .eq('id', lead.id);
  }

  const hasPremium = isPremium(installer);

  const fields: { label: string; value: string | null; gated?: boolean }[] = [
    {
      label: 'Name',
      value: hasPremium
        ? lead.homeowner_name
        : `${lead.homeowner_name.charAt(0)}...`,
      gated: !hasPremium,
    },
    {
      label: 'Email',
      value: hasPremium ? lead.homeowner_email : '****@****.com',
      gated: !hasPremium,
    },
    {
      label: 'Phone',
      value: hasPremium
        ? lead.homeowner_phone
        : lead.homeowner_phone
          ? '07*** ******'
          : null,
      gated: !hasPremium && !!lead.homeowner_phone,
    },
    { label: 'Postcode', value: lead.postcode },
    { label: 'Property Type', value: lead.property_type },
    { label: 'Property Age', value: lead.property_age },
    { label: 'EPC Rating', value: lead.epc_rating },
    { label: 'Current Heating', value: formatHeating(lead.current_heating) },
    { label: 'Timeline', value: formatTimeline(lead.timeline) },
    {
      label: 'Submitted',
      value: new Date(lead.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
  ];

  const pageTitle = hasPremium
    ? `Enquiry from ${lead.homeowner_name}`
    : `Enquiry from ${lead.postcode}`;

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        &larr; Back to dashboard
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">{pageTitle}</h2>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map(
            (field) =>
              field.value && (
                <div key={field.label}>
                  <dt className="text-sm font-medium text-gray-500">
                    {field.label}
                  </dt>
                  <dd
                    className={`mt-0.5 ${
                      field.gated
                        ? 'select-none text-gray-400'
                        : 'text-gray-900'
                    }`}
                  >
                    {field.gated && (
                      <span className="mr-1 inline-block text-xs">
                        &#128274;
                      </span>
                    )}
                    {field.value}
                  </dd>
                </div>
              )
          )}
        </dl>

        {hasPremium && lead.message && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-500">Message</h3>
            <p className="mt-1 whitespace-pre-wrap text-gray-900">
              {lead.message}
            </p>
          </div>
        )}

        {!hasPremium && lead.message && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-500">Message</h3>
            <p className="mt-1 select-none text-gray-400">
              <span className="mr-1 inline-block text-xs">&#128274;</span>
              Upgrade to Premium to read this message
            </p>
          </div>
        )}

        {/* Contact actions */}
        {hasPremium ? (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
            {lead.homeowner_email && (
              <a
                href={`mailto:${lead.homeowner_email}?subject=Your heat pump enquiry`}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Reply by Email
              </a>
            )}
            {lead.homeowner_phone && (
              <a
                href={`tel:${lead.homeowner_phone}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Call {lead.homeowner_phone}
              </a>
            )}
          </div>
        ) : (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <UpgradeCTA
              title="Unlock this enquiry"
              message={`Upgrade to Premium to see ${lead.homeowner_name.charAt(0)}...'s full contact details and respond to their enquiry.`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function formatTimeline(timeline: string | null): string | null {
  if (!timeline) return null;
  const map: Record<string, string> = {
    asap: 'ASAP',
    '1-3months': '1\u20133 months',
    '3-6months': '3\u20136 months',
    '6-12months': '6\u201312 months',
    researching: 'Researching',
  };
  return map[timeline] || timeline;
}

function formatHeating(heating: string | null): string | null {
  if (!heating) return null;
  const map: Record<string, string> = {
    gas_boiler: 'Gas Boiler',
    oil_boiler: 'Oil Boiler',
    electric: 'Electric',
    lpg: 'LPG',
    coal: 'Coal',
    none: 'None',
    other: 'Other',
  };
  return map[heating] || heating;
}
