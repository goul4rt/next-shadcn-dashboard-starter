'use client';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { signIn } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { InteractiveGridPattern } from './interactive-grid';

export default function SignInViewPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email,
        password
      });

      if (error) {
        toast.error(error.message || 'Failed to sign in');
      } else {
        toast.success('Signed in successfully');
        router.push('/dashboard/overview');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/auth/sign-up'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 md:top-8 md:right-8'
        )}
      >
        Sign Up
      </Link>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          Logo
        </div>
        <InteractiveGridPattern
          className={cn(
            'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[0%] h-full skew-y-12'
          )}
        />
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;This starter template has saved me countless hours of work
              and helped me deliver projects to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className='text-sm'>Random Dude</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <div className='w-full space-y-6'>
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Welcome back
              </h1>
              <p className='text-muted-foreground text-sm'>
                Enter your email and password to sign in
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className='border-border/60 bg-card/50 rounded-xl border p-6 shadow-sm backdrop-blur-sm transition-shadow focus-within:shadow-md sm:p-8'
            >
              <div className='space-y-5'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='email'
                    className='text-foreground text-sm font-medium'
                  >
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                    <Input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className='border-border/80 bg-background/80 placeholder:text-muted-foreground/70 focus-visible:bg-background h-11 rounded-lg pl-10 transition-colors'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='password'
                    className='text-foreground text-sm font-medium'
                  >
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                    <Input
                      id='password'
                      type='password'
                      placeholder='••••••••'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className='border-border/80 bg-background/80 placeholder:text-muted-foreground/70 focus-visible:bg-background h-11 rounded-lg pl-10 transition-colors'
                    />
                  </div>
                </div>
                <Button
                  type='submit'
                  className='mt-2 h-11 w-full rounded-lg font-medium shadow-sm transition-all hover:shadow-md disabled:opacity-70'
                  size='lg'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>

            <div className='text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link
                href='/auth/sign-up'
                className='hover:text-primary underline underline-offset-4'
              >
                Sign up
              </Link>
            </div>
          </div>

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
