import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { auth0_id: session.user.sub },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await prisma.profile.findUnique({
      where: { user_id: user.id },
    });

    if (!profile || !profile.resume_data) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // Return PDF file
    return new NextResponse(profile.resume_data, {
      headers: {
        "Content-Type": profile.resume_type || "application/pdf",
        "Content-Disposition": `inline; filename="${profile.resume_name || "resume.pdf"}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
