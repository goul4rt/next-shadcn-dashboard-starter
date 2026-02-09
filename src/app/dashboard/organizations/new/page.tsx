'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewOrganizationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug if not manually edited
    const autoSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.organization.create({
        name,
        slug
      });

      if (error) {
        toast.error(error.message || 'Failed to create organization');
      } else {
        toast.success('Organization created successfully');
        // Set as active organization
        await authClient.organization.setActive({
          organizationId: data?.id
        });
        router.push('/dashboard/overview');
        router.refresh();
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <div className='flex items-center gap-4'>
        <Link href='/dashboard/overview'>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold'>Create Organization</h1>
          <p className='text-muted-foreground text-sm'>
            Create a new organization to collaborate with your team
          </p>
        </div>
      </div>

      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Enter the details for your new organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Organization Name</Label>
              <Input
                id='name'
                type='text'
                placeholder='Acme Inc.'
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='slug'>Organization Slug</Label>
              <Input
                id='slug'
                type='text'
                placeholder='acme-inc'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className='text-muted-foreground text-xs'>
                This will be used in URLs and must be unique
              </p>
            </div>

            <div className='flex gap-2'>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Organization'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
