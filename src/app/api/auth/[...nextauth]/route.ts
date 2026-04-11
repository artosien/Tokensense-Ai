import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// Enable dynamic rendering for this route
export const dynamic = "force-dynamic";

// NextAuth handler for App Router
const handler = NextAuth(authOptions);

// For Next.js 15+, params in route handlers are asynchronous and must be awaited
// before being passed to the NextAuth handler.
export async function GET(req: NextRequest, { params }: { params: Promise<any> }) {
  try {
    const awaitedParams = await params;
    return await handler(req as any, { params: awaitedParams });
  } catch (error) {
    console.error("NextAuth GET Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<any> }) {
  try {
    const awaitedParams = await params;
    return await handler(req as any, { params: awaitedParams });
  } catch (error) {
    console.error("NextAuth POST Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
