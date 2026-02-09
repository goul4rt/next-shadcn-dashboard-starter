'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrganizationsPage() {
  const router = useRouter();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const handleSetActive = async (orgId: string) => {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  };

  if (isPending) {
    return (
      <div className='flex w-full flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
        <div>
          <h1 className='text-2xl font-bold'>Organizations</h1>
          <p className='text-muted-foreground text-sm'>
            Loading organizations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Organizations</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your organizations and switch between them
          </p>
        </div>
        <Link href='/dashboard/organizations/new'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            New Organization
          </Button>
        </Link>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {organizations?.map((org) => (
          <Card key={org.id} className='relative'>
            {activeOrg?.id === org.id && (
              <Badge className='absolute top-2 right-2' variant='default'>
                Active
              </Badge>
            )}
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className='h-full w-full rounded-lg object-cover'
                    />
                  ) : (
                    <span className='text-primary text-xl font-bold'>
                      {org.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className='flex-1'>
                  <CardTitle className='text-lg'>{org.name}</CardTitle>
                  <CardDescription className='text-xs'>
                    {org.slug}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='flex gap-2'>
                {activeOrg?.id !== org.id && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => handleSetActive(org.id)}
                  >
                    Set Active
                  </Button>
                )}
                <Link
                  href={`/dashboard/organizations/${org.id}/settings`}
                  className='flex-1'
                >
                  <Button variant='outline' size='sm' className='w-full'>
                    <Settings className='mr-2 h-3 w-3' />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!organizations || organizations.length === 0) && (
          <Card className='col-span-full'>
            <CardHeader>
              <CardTitle>No organizations yet</CardTitle>
              <CardDescription>
                Create your first organization to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/dashboard/organizations/new'>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Create Organization
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
