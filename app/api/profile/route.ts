import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
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

    // Get or create profile
    let profile = await prisma.profile.findUnique({
      where: { user_id: user.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          user_id: user.id,
          skills: [],
        },
      });
    }

    // Convert resume_data to base64 for client
    const profileResponse: any = {
      ...profile,
      resume_data: profile.resume_data
        ? profile.resume_data.toString("base64")
        : null,
    };

    return NextResponse.json(profileResponse);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const {
      resume_data,
      resume_name,
      resume_type,
      skills,
      experience,
      education,
      location,
      preferences,
    } = body;

    // Get or create profile
    let profile = await prisma.profile.findUnique({
      where: { user_id: user.id },
    });

    const profileData: any = {};

    // Only update resume if new data is provided
    if (
      resume_data !== undefined &&
      resume_data !== null &&
      resume_data !== ""
    ) {
      // Convert base64 string back to Buffer
      profileData.resume_data = Buffer.from(resume_data, "base64");
    }
    // Only update name/type if resume_data is being updated
    if (
      resume_data !== undefined &&
      resume_data !== null &&
      resume_data !== ""
    ) {
      if (resume_name !== undefined) profileData.resume_name = resume_name;
      if (resume_type !== undefined) profileData.resume_type = resume_type;
    }
    if (skills !== undefined) profileData.skills = skills;
    if (experience !== undefined) profileData.experience = experience;
    if (education !== undefined) profileData.education = education;
    if (location !== undefined) profileData.location = location;
    if (preferences !== undefined) profileData.preferences = preferences;

    if (profile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { user_id: user.id },
        data: profileData,
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          user_id: user.id,
          skills: skills || [],
          ...profileData,
        },
      });
    }

    // Convert resume_data to base64 for response
    const profileResponse: any = {
      ...profile,
      resume_data: profile.resume_data
        ? profile.resume_data.toString("base64")
        : null,
    };

    return NextResponse.json(profileResponse);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
