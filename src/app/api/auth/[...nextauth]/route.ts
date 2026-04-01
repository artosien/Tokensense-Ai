import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { AuthOptions } from "next-auth";

/**
 * NextAuth Configuration Options
 * 
 * This object defines the providers, callbacks, and security settings for
 * the authentication system.
 */
export const authOptions: AuthOptions = {
  // Use Google and GitHub as authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      // Supporting both GITHUB_ID (guide) and GITHUB_CLIENT_ID (common practice)
      clientId: (process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID) as string,
      clientSecret: (process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET) as string,
    }),
  ],
  
  // The secret used to sign the session token (must be set in .env)
  secret: process.env.NEXTAUTH_SECRET,

  // Session configuration using JSON Web Tokens (JWT)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages for the auth flow
  pages: {
    signIn: "/login", 
    error: "/auth/error", // Error page for auth failures
  },

  // Callbacks for custom logic during the auth lifecycle
  callbacks: {
    async jwt({ token, account, user }) {
      try {
        // If this is the initial sign-in, add the user ID to the token
        if (account && user) {
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        // Transfer the user ID from the token to the session object
        if (session.user) {
          (session.user as any).id = token.id;
        }
        return session;
      } catch (error) {
        console.error("Session Callback Error:", error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // Simple and safe redirect logic
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },

  // Enable debug messages in development to help troubleshoot auth issues
  debug: process.env.NODE_ENV === "development",
};

// NextAuth handler for App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
