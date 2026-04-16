import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth handler for App Router
 * 
 * In Next.js 15+, the handler returned by NextAuth(authOptions) is already
 * compatible with App Router GET and POST exports.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
