'use client';

/**
 * Simplified navigation hook for Better Auth
 *
 * Since we're using Better Auth without organizations or RBAC,
 * this hook simply returns all navigation items for authenticated users.
 *
 * All authenticated users have access to all dashboard features.
 */

import { useMemo } from 'react';
import { useSession } from '@/lib/auth-client';
import type { NavItem } from '@/types';

/**
 * Hook to filter navigation items (simplified for Better Auth)
 *
 * @param items - Array of navigation items
 * @returns Navigation items (all items for authenticated users)
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { data: session } = useSession();

  // Return all items for authenticated users
  // Filter out items that explicitly require organization or special access
  const filteredItems = useMemo(() => {
    if (!session?.user) {
      return [];
    }

    return items.filter((item) => {
      // Filter out items that explicitly require org or special access
      // (these are now removed from navigation config)
      if (
        item.access?.requireOrg ||
        item.access?.permission ||
        item.access?.role ||
        item.access?.plan
      ) {
        return false;
      }
      return true;
    });
  }, [items, session]);

  return filteredItems;
}
