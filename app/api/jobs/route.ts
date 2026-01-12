import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const CACHE_TTL = 60; // 1 minute

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Try cache first
    const cacheKey = `jobs:${page}:${limit}`;
    let cached = null;
    if (redis) {
      cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached as string));
      }
    }

    // Fetch from database
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        orderBy: { last_seen: "desc" },
      }),
      prisma.job.count(),
    ]);

    const result = {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
