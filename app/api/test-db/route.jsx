import { NextResponse } from "next/server";
import { db } from "configs/db";
import { VideoData } from "configs/schema";

export async function GET() {
  try {
    const result = await db.select().from(VideoData);
    return NextResponse.json({
      success: true,
      count: result.length,
      videos: result.map((v) => ({
        id: v.id,
        createdBy: v.createdBy,
        hasScript: !!v.script,
        scriptType: typeof v.script,
        hasCaptions: !!v.captions,
        captionsType: typeof v.captions,
        captionsIsArray: Array.isArray(v.captions),
        hasImageList: !!v.imageList,
        imageListType: typeof v.imageList,
        imageListIsArray: Array.isArray(v.imageList),
        hasAudio: !!v.audioFileUrl,
      })),
    });
  } catch (err) {
    console.error("❌ DB test error:", err);
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}
