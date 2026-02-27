import Link from 'next/link';
import type { Installer } from '@/lib/types/database';

export function InstallerCard({ installer }: { installer: Installer }) {
  const technologies = [
    installer.has_ashp && 'Air Source',
    installer.has_gshp && 'Ground Source',
    installer.has_solar_pv && 'Solar PV',
    installer.has_battery && 'Battery',
  ].filter(Boolean);

  return (
    <Link
      href={`/installer/${installer.slug}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
            {installer.company_name}
          </h3>
          {installer.address_postcode && (
            <p className="mt-1 text-sm text-gray-500">
              {installer.address_city
                ? `${installer.address_city}, ${installer.address_postcode}`
                : installer.address_postcode}
            </p>
          )}
        </div>
        {installer.mcs_certified && (
          <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
            MCS ✓
          </span>
        )}
      </div>

      {/* Technologies */}
      {technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Trust signals */}
      <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
        {installer.mcs_number && (
          <span>MCS: {installer.mcs_number}</span>
        )}
        {installer.trustmark && (
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            TrustMark
          </span>
        )}
      </div>

      <div className="mt-3 text-sm font-medium text-primary-600 group-hover:text-primary-700">
        View profile →
      </div>
    </Link>
  );
}
