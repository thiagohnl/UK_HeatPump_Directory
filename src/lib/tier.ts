import { Installer } from '@/lib/types/database';

export type EffectiveTier = 'free' | 'premium';

export function getEffectiveTier(
  installer: Pick<Installer, 'subscription_tier'>
): EffectiveTier {
  return installer.subscription_tier === 'premium' ? 'premium' : 'free';
}

export function isPremium(
  installer: Pick<Installer, 'subscription_tier'>
): boolean {
  return installer.subscription_tier === 'premium';
}
