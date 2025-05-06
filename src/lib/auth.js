import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getSession } from 'next-auth/react';
import { pool } from '@/lib/db';

// Hardcoded admin emails for ticket system
const ADMIN_EMAILS = [
  'admin1@example.com',
  'admin2@example.com',
  'shivrajpawar0077@gmail.com',
];

// Hardcoded recruiter emails for job system
const RECRUITER_EMAILS = [
  'recruiter1@example.com',
  'recruiter2@example.com',
  'recruiter3@example.com',
  'shivrajpawar7700@gmail.com',
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          // Determine role based on email
          let role;
          if (ADMIN_EMAILS.includes(user.email)) {
            role = 'admin';
          } else if (RECRUITER_EMAILS.includes(user.email)) {
            role = 'recruiter';
          } else {
            role = 'user';
          }

          // Check if user exists
          const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [user.email]
          );

          let userId;

          if (userResult.rows.length === 0) {
            // Create new user
            const newUserResult = await pool.query(
              'INSERT INTO users (email, name, provider_id, provider_name, role, google_sub) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id',
              [user.email, user.name, account.providerAccountId, 'google', role, user.id]
            );

            userId = newUserResult.rows[0].user_id;

            // Create role-specific record
            if (role === 'admin') {
              await pool.query(
                'INSERT INTO admins (user_id, name, email) VALUES ($1, $2, $3)',
                [userId, user.name, user.email]
              );
            } else if (role === 'recruiter') {
              await pool.query(
                'INSERT INTO recruiters (user_id) VALUES ($1)',
                [userId]
              );
            } else {
              await pool.query(
                'INSERT INTO applicants (user_id) VALUES ($1)',
                [userId]
              );
            }
          } else {
            // Update existing user
            userId = userResult.rows[0].user_id;
            await pool.query(
              'UPDATE users SET name = $1, google_sub = $2, role = $3 WHERE email = $4',
              [user.name, user.id, role, user.email]
            );

            // Ensure role-specific record exists
            if (role === 'admin') {
              const adminResult = await pool.query(
                'SELECT admin_id FROM admins WHERE user_id = $1',
                [userId]
              );
              if (adminResult.rows.length === 0) {
                await pool.query(
                  'INSERT INTO admins (user_id, name, email) VALUES ($1, $2, $3)',
                  [userId, user.name, user.email]
                );
              }
            } else if (role === 'recruiter') {
              const recruiterResult = await pool.query(
                'SELECT recruiter_id FROM recruiters WHERE user_id = $1',
                [userId]
              );
              if (recruiterResult.rows.length === 0) {
                await pool.query(
                  'INSERT INTO recruiters (user_id) VALUES ($1)',
                  [userId]
                );
              }
            } else {
              const applicantResult = await pool.query(
                'SELECT applicant_id FROM applicants WHERE user_id = $1',
                [userId]
              );
              if (applicantResult.rows.length === 0) {
                await pool.query(
                  'INSERT INTO applicants (user_id) VALUES ($1)',
                  [userId]
                );
              }
            }
          }

          return true;
        } catch (error) {
          console.error('Error during sign-in:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = ADMIN_EMAILS.includes(user.email)
          ? 'admin'
          : RECRUITER_EMAILS.includes(user.email)
          ? 'recruiter'
          : 'user';
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = ADMIN_EMAILS.includes(session.user.email)
          ? 'admin'
          : RECRUITER_EMAILS.includes(session.user.email)
          ? 'recruiter'
          : 'user';
        session.user.id = token.id;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return '/auth/signin';
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);