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

    const profile = await prisma.profile.findUnique({
      where: { user_id: user.id },
    });

    if (!profile || !profile.resume_data) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Return PDF file (convert stored data to Uint8Array for body)
    const data = profile.resume_data;
    let bytes: Uint8Array;

    if (typeof data === "string") {
      // stored as base64 string
      const buf = Buffer.from(data, "base64");
      bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    } else if (ArrayBuffer.isView(data)) {
      // Buffer or TypedArray
      const view = data as any;
      bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    } else if ((data as any) instanceof ArrayBuffer) {
      bytes = new Uint8Array(data as ArrayBuffer);
    } else {
      // fallback: convert to string then buffer
      const buf = Buffer.from(String(data));
      bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    }

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": profile.resume_type || "application/pdf",
        "Content-Disposition": `inline; filename="${
          profile.resume_name || "resume.pdf"
        }"`,
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
