'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/lib/auth-client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileViewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      toast.info('Profile update feature will be implemented');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className='flex w-full flex-col p-4'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>Profile</h1>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div>
            <p className='text-sm font-medium'>User ID</p>
            <p className='text-muted-foreground text-sm'>{user.id}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Email Verified</p>
            <p className='text-muted-foreground text-sm'>
              {user.emailVerified ? 'Yes' : 'No'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
