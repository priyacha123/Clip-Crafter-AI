// import { NextResponse } from "next/server";
// import { storage } from "configs/FirebaseConfig";
// import { getDownloadURL, ref, uploadString } from "firebase/storage";

// export async function POST(req) {
//   try {
//     const { prompt } = await req.json();

//     const form = new FormData();
//     form.append("prompt", prompt);

//     const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
//       method: "POST",
//       headers: {
//         "x-api-key": process.env.CLIPDROP_API_KEY,
//       },
//       body: form,
//     });

//     if (!response.ok) {
//       throw new Error(`Clipdrop API error: ${response.status} ${response.statusText}`);
//     }

//     const buffer = await response.arrayBuffer();

//     // Convert buffer to base64
//     const base64Image = Buffer.from(buffer).toString("base64");
//     const dataUrl = `data:image/png;base64,${base64Image}`;

//     console.log("Generated image data URL:", dataUrl);

//     // Upload to Firebase
//     const fileName = `ai-short-video-files/${Date.now()}.png`;
//     const storageRef = ref(storage, fileName);
//     await uploadString(storageRef, dataUrl, "data_url");

//     const downloadUrl = await getDownloadURL(storageRef);
//     console.log("Uploaded image URL:", downloadUrl);

//     return NextResponse.json({ result: downloadUrl });
//   } catch (e) {
//     console.error("API error:", e);
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
);

const getReferencePrompt = async (referenceImages) => {
  if (!Array.isArray(referenceImages) || referenceImages.length === 0 || !genAI) {
    return "";
  }

  const imageParts = referenceImages
    .slice(0, 1)
    .map((image) => {
      if (!image?.dataUrl || typeof image.dataUrl !== "string") {
        return null;
      }

      const matches = image.dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return null;
      }

      const [, mimeType, data] = matches;
      return {
        inlineData: {
          mimeType,
          data,
        },
      };
    })
    .filter(Boolean);

  if (imageParts.length === 0) {
    return "";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent([
    {
      text: [
        "Analyze these user reference images for AI scene generation.",
        "Respond with a short single paragraph only.",
        "Focus on reusable visual guidance: subject traits, wardrobe, colors, mood, composition, art style, and recurring details.",
        "Do not mention camera metadata or speculate about hidden context.",
      ].join(" "),
    },
    ...imageParts,
  ]);

  return result.response.text().trim();
};

export async function POST(req) {
  try {
    const { prompt, referenceImages = [] } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const referencePrompt = await getReferencePrompt(referenceImages);
    const finalPrompt = referencePrompt
      ? `${prompt}\n\nReference guidance from the user's uploaded images: ${referencePrompt}\n\nKeep the generated scene aligned with this reference guidance while still following the scene description.`
      : prompt;

    // ---- Call Clipdrop ----
    const form = new FormData();
    form.append("prompt", finalPrompt);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Clipdrop API error: ${response.status} - ${text}`);
    }

    // ---- Convert image to base64 ----
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const dataUrl = `data:image/png;base64,${base64Image}`;

    // ✅ SERVER LOG
    console.log("✅ Image generated successfully");

    // ✅ RETURN IMAGE DIRECTLY
    return NextResponse.json({
      success: true,
      image: dataUrl,
      promptUsed: finalPrompt,
    });

  } catch (e) {
    console.error("❌ API error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
