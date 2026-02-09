import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { prisma } from './db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        // TODO: Implement email sending
        console.log('Invitation email:', {
          email: data.email,
          inviteLink: `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`,
          organization: data.organization.name
        });
      }
    })
  ]
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
