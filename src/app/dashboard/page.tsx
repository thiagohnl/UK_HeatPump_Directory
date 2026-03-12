import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isPremium } from '@/lib/tier';
import { UpgradeCTA } from '@/components/dashboard/UpgradeCTA';
import { ManageSubscriptionButton } from '@/components/dashboard/ManageSubscriptionButton';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: installer } = await supabase
    .from('installers')
    .select('*')
    .eq('claimed_by', user.id)
    .single();

  if (!installer) redirect('/installers?notice=claim_first');

  // Fetch leads for this installer
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('installer_id', installer.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const newLeadsCount = leads?.filter((l) => l.status === 'new').length ?? 0;
  const totalLeads = leads?.length ?? 0;
  const hasPremium = isPremium(installer);

  return (
    <div className="space-y-8">
      {/* Upgrade success toast */}
      {searchParams.upgraded === 'true' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800">
          Welcome to Premium! You now have full access to all lead details.
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">New Leads</p>
          <p className="mt-1 text-3xl font-bold text-primary-600">{newLeadsCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Total Leads</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalLeads}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Plan</p>
            {hasPremium ? (
              <ManageSubscriptionButton />
            ) : (
              <Link
                href="/dashboard/upgrade"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Upgrade
              </Link>
            )}
          </div>
          <p className="mt-1 text-lg font-semibold capitalize text-gray-900">
            {hasPremium ? 'Premium' : 'Free'}
          </p>
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Enquiries</h2>
          <Link
            href="/dashboard/leads"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all &rarr;
          </Link>
        </div>

        {!leads || leads.length === 0 ? (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No enquiries yet.</p>
            <p className="mt-1 text-sm text-gray-400">
              When homeowners request quotes, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 sm:table-cell">Postcode</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Timeline</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {lead.homeowner_name}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                      {lead.postcode}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                      {formatTimeline(lead.timeline)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade CTA for free tier */}
      {!hasPremium && totalLeads > 0 && (
        <UpgradeCTA
          title="Unlock your enquiries"
          message={`You have ${totalLeads} enquir${totalLeads === 1 ? 'y' : 'ies'} waiting. Upgrade to Premium to see full contact details and respond directly.`}
        />
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/profile"
          className="rounded-xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:bg-primary-50"
        >
          <h3 className="font-semibold text-gray-900">Edit Profile</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update your company description, contact details, and services.
          </p>
        </Link>
        <Link
          href={`/installer/${installer.slug}`}
          className="rounded-xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:bg-primary-50"
        >
          <h3 className="font-semibold text-gray-900">View Public Profile</h3>
          <p className="mt-1 text-sm text-gray-500">
            See how your listing appears to homeowners.
          </p>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700',
    viewed: 'bg-gray-100 text-gray-700',
    contacted: 'bg-yellow-50 text-yellow-700',
    converted: 'bg-green-50 text-green-700',
    expired: 'bg-red-50 text-red-600',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status] || styles.new}`}
    >
      {status}
    </span>
  );
}

function formatTimeline(timeline: string | null): string {
  const map: Record<string, string> = {
    asap: 'ASAP',
    '1-3months': '1–3 months',
    '3-6months': '3–6 months',
    '6-12months': '6–12 months',
    researching: 'Researching',
  };
  return timeline ? map[timeline] || timeline : '—';
}
