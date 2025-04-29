// File: app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { pool } from "@/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in database
        let userResult = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [user.email]
        );

        if (userResult.rows.length === 0) {
          console.log("Creating new user for email:", user.email);
          // Insert new user
          const newUser = await pool.query(
            `INSERT INTO users (email, name, provider_id, provider_name, role, google_sub)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
              user.email,
              user.name,
              account.providerAccountId,
              account.provider,
              "candidate", // Default role
              profile.sub,
            ]
          );

          // If the email is in recruiter list, create recruiter profile
          const recruiterEmails = [
            "recruiter1@company.com",
            "recruiter2@company.com",
            "shivrajpawar0077@gmail.com",
          ];
          if (recruiterEmails.includes(user.email)) {
            console.log("Assigning recruiter role to:", user.email);
            await pool.query(
              `UPDATE users SET role = 'recruiter' WHERE email = $1`,
              [user.email]
            );

            console.log("Creating recruiter profile for user_id:", newUser.rows[0].user_id);
            await pool.query(
              `INSERT INTO recruiters (user_id, company_name)
               VALUES ($1, $2)
               RETURNING *`,
              [newUser.rows[0].user_id, "Default Company"]
            );
          }

          // Refresh user data after potential role update
          userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [user.email]
          );
        }

        // Store role in user object for redirect
        user.role = userResult.rows[0].role;
        console.log("User role after signIn:", user.role);

        return true;
      } catch (error) {
        console.error("Error in signIn callback for email:", user.email, error);
        return false;
      }
    },
    async redirect({ url, baseUrl, user }) {
      console.log("Redirect callback - User:", user, "URL:", url);
      if (user && user.role) {
        if (user.role === "recruiter") {
          return `${baseUrl}/recruiter/dashboard`;
        } else {
          return `${baseUrl}/candidate/dashboard`;
        }
      }
      return url || `${baseUrl}/candidate/dashboard`;
    },
    async jwt({ token, user }) {
      if (user && user.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true, // Enable debug logs for troubleshooting
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };