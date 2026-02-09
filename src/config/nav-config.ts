import { NavItem } from '@/types';

/**
 * Navigation configuration (simplified for Better Auth)
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 * All authenticated users have access to all dashboard features.
 */
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Organizations',
    url: '/dashboard/organizations',
    icon: 'billing',
    shortcut: ['o', 'o'],
    isActive: false,
    items: []
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'account',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'profile',
        shortcut: ['m', 'm']
      }
    ]
  }
];
