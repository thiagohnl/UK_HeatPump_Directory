import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const [{ data: cities }, { data: installers }] = await Promise.all([
    supabase.from('cities').select('slug, updated_at'),
    supabase.from('installers').select('slug, updated_at').eq('is_active', true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/installers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/grant-checker`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/guides/what-is-a-heat-pump`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/guides/heat-pump-costs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/for-installers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const cityPages: MetadataRoute.Sitemap = (cities || []).map((city) => ({
    url: `${SITE_URL}/installers/${city.slug}`,
    lastModified: new Date(city.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const installerPages: MetadataRoute.Sitemap = (installers || []).map((installer) => ({
    url: `${SITE_URL}/installer/${installer.slug}`,
    lastModified: new Date(installer.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...installerPages];
}
