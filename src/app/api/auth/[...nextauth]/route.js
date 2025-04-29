import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { pool } from '@/lib/db';

// Hardcoded recruiter emails
const RECRUITER_EMAILS = [
  'recruiter1@example.com',
  'recruiter2@example.com',
  'recruiter3@example.com',
  'shivrajpawar7700@gmail.com',
  // Add more recruiter emails as needed
];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          // Determine role based on email
          const role = RECRUITER_EMAILS.includes(user.email)
            ? 'recruiter'
            : 'applicant';

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
              [
                user.email,
                user.name,
                account.providerAccountId,
                'google',
                role,
                user.id,
              ]
            );
            userId = newUserResult.rows[0].user_id;

            // Create role-specific record
            if (role === 'recruiter') {
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
            if (role === 'recruiter') {
              const recruiterCheck = await pool.query(
                'SELECT * FROM recruiters WHERE user_id = $1',
                [userId]
              );
              if (recruiterCheck.rows.length === 0) {
                await pool.query(
                  'INSERT INTO recruiters (user_id) VALUES ($1)',
                  [userId]
                );
              }
            } else {
              const applicantCheck = await pool.query(
                'SELECT * FROM applicants WHERE user_id = $1',
                [userId]
              );
              if (applicantCheck.rows.length === 0) {
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
        token.email = user.email;
        token.role = RECRUITER_EMAILS.includes(user.email)
          ? 'recruiter'
          : 'applicant';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };