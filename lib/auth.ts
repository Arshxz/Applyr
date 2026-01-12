import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function getAuthUser(req: NextRequest) {
  const res = new NextResponse();
  const session = await getSession(req, res);
  return session?.user;
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
