import { NextResponse } from "next/server";
import { db } from "configs/db";
import { VideoData } from "configs/schema";
import { and, desc, eq, isNull, or, sql } from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const videos = await db
      .select()
      .from(VideoData)
      .where(
        and(
          sql`lower(${VideoData.createdBy}) = ${normalizedEmail}`,
          sql`${VideoData.createdBy} is not null`
        )
      )
      .orderBy(desc(VideoData.createdAt));

    if (videos.length > 0) {
      return NextResponse.json({ success: true, videos, legacyFallbackUsed: false });
    }

    const legacyVideos = await db
      .select()
      .from(VideoData)
      .where(
        or(isNull(VideoData.createdBy), eq(VideoData.createdBy, ""))
      )
      .orderBy(desc(VideoData.createdAt));

    return NextResponse.json({
      success: true,
      videos: legacyVideos,
      legacyFallbackUsed: true,
    });
  } catch (err) {
    console.error("Failed to load videos:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { script, audioFileUrl, captions, imageList, createdBy } = body;

    if (!script || !audioFileUrl || !captions || !createdBy) {
      return NextResponse.json(
        { error: "script, audioFileUrl, captions, and createdBy are required" },
        { status: 400 }
      );
    }

    const normalizedCreatedBy = createdBy.trim().toLowerCase();

    const result = await db
      .insert(VideoData)
      .values({
        script,
        audioFileUrl,
        captions,
        imageList: Array.isArray(imageList) ? imageList : [],
        createdBy: normalizedCreatedBy,
      })
      .returning({ id: VideoData.id });

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (err) {
    console.error("Failed to save video:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
