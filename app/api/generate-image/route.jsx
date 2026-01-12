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



// code without firebase


import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // ---- Call Clipdrop ----
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
    });

  } catch (e) {
    console.error("❌ API error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
