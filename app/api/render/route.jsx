import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "configs/db";
import { VideoData } from "configs/schema";

export const runtime = "nodejs";

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

export async function POST(req) {
  let tempJsonPath;

  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, Number(videoId)));

    if (!result[0]) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = result[0];
    const publicRendersDir = path.join(process.cwd(), "public", "renders");
    fs.mkdirSync(publicRendersDir, { recursive: true });

    const outputFileName = `${videoId}.mp4`;
    const outputPath = path.join(publicRendersDir, outputFileName);
    const downloadUrl = `/renders/${outputFileName}`;

    if (fs.existsSync(outputPath)) {
      return NextResponse.json({ success: true, downloadUrl });
    }

    const captions = parseJsonArray(video.captions);
    const imageList = parseJsonArray(video.imageList);

    tempJsonPath = path.join(publicRendersDir, `${videoId}.json`);
    fs.writeFileSync(
      tempJsonPath,
      JSON.stringify(
        {
          script: video.script,
          imageList,
          audioFileUrl: video.audioFileUrl,
          captions,
        },
        null,
        2
      )
    );

    const remotionEntry = path.join(
      process.cwd(),
      "remotion-composition",
      "index.jsx"
    );
    const remotionArgs = [
      "remotion",
      "render",
      remotionEntry,
      "Empty",
      outputPath,
      `--props=${tempJsonPath}`,
    ];

    const command = process.platform === "win32" ? "cmd.exe" : "npx";
    const args =
      process.platform === "win32"
        ? ["/c", "npx", ...remotionArgs]
        : remotionArgs;

    await new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stderr = "";

      child.stdout.on("data", (data) => {
        console.log(data.toString());
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
        console.error(data.toString());
      });

      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        reject(new Error(stderr || `Remotion render failed with exit code ${code}`));
      });
    });

    return NextResponse.json({ success: true, downloadUrl });
  } catch (err) {
    console.error("Video rendering API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    try {
      if (tempJsonPath && fs.existsSync(tempJsonPath)) {
        fs.unlinkSync(tempJsonPath);
      }
    } catch (cleanupError) {
      console.warn("Failed to delete temp JSON props file:", cleanupError);
    }
  }
}
