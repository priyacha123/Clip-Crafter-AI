import { NextResponse } from "next/server";
import { storage } from "configs/FirebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Call Clipdrop API
    const form = new FormData();
    form.append("prompt", prompt);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Clipdrop API error: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();

    // Convert buffer to base64
    const base64Image = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Upload to Firebase
    const fileName = `ai-short-video-files/${Date.now()}.png`;
    const storageRef = ref(storage, fileName);
    await uploadString(storageRef, dataUrl, "data_url");

    const downloadUrl = await getDownloadURL(storageRef);
    console.log("Uploaded image URL:", downloadUrl);

    // Return download URL
    return NextResponse.json({ result: downloadUrl });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
