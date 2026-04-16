import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";

/**
 * NextAuth Configuration Options
 * 
 * This object defines the providers, callbacks, and security settings for
 * the authentication system.
 */
export const authOptions: AuthOptions = {
  // Use Google, GitHub and Slack as authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      // Supporting both GITHUB_ID (guide) and GITHUB_CLIENT_ID (common practice)
      clientId: (process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID) as string,
      clientSecret: (process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET) as string,
    }),
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID as string,
      clientSecret: process.env.SLACK_CLIENT_SECRET as string,
      allowUntitledTeams: true,
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
        // If this is the initial sign-in, add the user ID and access token to the token
        if (account && user) {
          token.id = user.id;
          token.accessToken = account.access_token;
        }
        return token;
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        // Transfer the user ID and access token from the token to the session object
        if (session.user) {
          (session.user as any).id = token.id;
          (session.user as any).accessToken = token.accessToken;
        }
        return session;
      } catch (error) {
        console.error("Session Callback Error:", error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  // Enable debug messages in development to help troubleshoot auth issues
  debug: process.env.NODE_ENV === "development",
};
