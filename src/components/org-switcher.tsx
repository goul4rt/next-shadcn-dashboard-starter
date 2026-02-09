'use client';

import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

export function OrgSwitcher() {
  const { isMobile, state } = useSidebar();
  const router = useRouter();

  // Get all organizations the user is member of
  const { data: organizations, isPending: isLoadingOrgs } =
    authClient.useListOrganizations();

  // Get the active organization
  const { data: activeOrg } = authClient.useActiveOrganization();

  // Revalidate memberships when active org changes
  useEffect(() => {
    console.log('Active organization changed:', activeOrg?.id);
  }, [activeOrg?.id]);

  // Handle organization switch
  const handleOrganizationSwitch = async (organizationId: string) => {
    if (activeOrg?.id === organizationId) {
      return; // Already active
    }
    try {
      await authClient.organization.setActive({ organizationId });
      router.refresh();
    } catch (error) {
      console.error('Failed to switch organization:', error);
    }
  };

  // Show loading state
  if (isLoadingOrgs) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            <div
              className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 overflow-hidden opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            >
              <span className='truncate font-medium'>Loading...</span>
              <span className='text-muted-foreground truncate text-xs'>
                Organizations
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Show create organization option if no organizations
  if (!organizations || organizations.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            onClick={() => router.push('/dashboard/organizations/new')}
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
              <Plus className='size-4' />
            </div>
            <div
              className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 overflow-hidden opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            >
              <span className='truncate font-medium'>Create organization</span>
              <span className='text-muted-foreground truncate text-xs'>
                Get started
              </span>
            </div>
            <ChevronsUpDown
              className={`ml-auto transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Use active organization or first organization as fallback
  const displayOrganization = activeOrg || organizations[0];

  if (!displayOrganization) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
                {displayOrganization.logo ? (
                  <img
                    src={displayOrganization.logo}
                    alt={displayOrganization.name}
                    className='size-full object-cover'
                  />
                ) : (
                  <span className='text-sm font-semibold'>
                    {displayOrganization.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div
                className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                  state === 'collapsed'
                    ? 'invisible max-w-0 overflow-hidden opacity-0'
                    : 'visible max-w-full opacity-100'
                }`}
              >
                <span className='truncate font-medium'>
                  {displayOrganization.name}
                </span>
                <span className='text-muted-foreground truncate text-xs'>
                  {displayOrganization.slug}
                </span>
              </div>
              <ChevronsUpDown
                className={`ml-auto transition-all duration-200 ease-in-out ${
                  state === 'collapsed'
                    ? 'invisible max-w-0 opacity-0'
                    : 'visible max-w-full opacity-100'
                }`}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org, index) => {
              const isActive = org.id === activeOrg?.id;
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrganizationSwitch(org.id)}
                  className='gap-2 p-2'
                >
                  <div className='flex size-6 items-center justify-center overflow-hidden rounded-md border'>
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className='size-full object-cover'
                      />
                    ) : (
                      <span className='text-xs font-semibold'>
                        {org.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {org.name}
                  {isActive && <Check className='ml-auto size-4' />}
                  {!isActive && (
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='gap-2 p-2'
              onClick={() => {
                router.push('/dashboard/organizations/new');
              }}
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>
                Add organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
