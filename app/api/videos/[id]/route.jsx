import { NextResponse } from "next/server";
import { db } from "configs/db";
import { VideoData } from "configs/schema";
import { eq } from "drizzle-orm";

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const videoId = Number(id);

    if (!Number.isInteger(videoId)) {
      return NextResponse.json({ error: "valid id is required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoId));

    if (!result[0]) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, video: result[0] });
  } catch (err) {
    console.error("Failed to load video:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
