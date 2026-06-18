import { NextResponse } from "next/server";
import { db } from "configs/db";
import { VideoData } from "configs/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const summaryOnly = searchParams.get("summary") === "1";

    if (summaryOnly) {
      const videos = await db
        .select({
          id: VideoData.id,
          createdAt: VideoData.createdAt,
          imageList: VideoData.imageList,
        })
        .from(VideoData)
        .where(eq(VideoData.createdBy, normalizedEmail))
        .orderBy(desc(VideoData.createdAt));

      return NextResponse.json({
        success: true,
        videos,
        legacyFallbackUsed: false,
      });
    }

    const videos = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.createdBy, normalizedEmail))
      .orderBy(desc(VideoData.createdAt));

    return NextResponse.json({
      success: true,
      videos,
      legacyFallbackUsed: false,
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
