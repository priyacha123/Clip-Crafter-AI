// import { NextResponse } from "next/server";
// import axios from "axios";
// import { storage } from "configs/FirebaseConfig";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// export async function POST(req) {
//   try {
//     const { text, id, voiceStyle } = await req.json();

//     if (!text || !id) {
//       return NextResponse.json(
//         { error: "Missing text or id" },
//         { status: 400 }
//       );
//     }

//     // 🔹 Map your voiceStyle to Speechify voice IDs
//     const voiceMap = {
//       Female: "alloy",
//       Male: "default",
//       Robotic: "cyborg",
//       Child: "luna",
//       Narrator: "ryan",
//     };
//     const selectedVoice = voiceMap[voiceStyle] || "alloy";

//     // 🔊 Generate speech using Speechify API
//     const ttsResponse = await axios.post(
//       "https://api.sws.speechify.com/v1/audio/speech",
//       {
//         input: text,
//         voice_id: selectedVoice,
//         audio_format: "mp3",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.SPEECHIFY_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         responseType: "arraybuffer", // Important for binary MP3
//       }
//     );

//     // Convert response to buffer
//     const audioBuffer = Buffer.from(ttsResponse.data);

//     // 🔥 Upload MP3 to Firebase
//     const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);
//     await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mpeg" });

//     const downloadURL = await getDownloadURL(storageRef);

//     return NextResponse.json({ result: downloadURL });
//   } catch (error) {
//     console.error("Audio generation error:", error);
//     return NextResponse.json(
//       { error: "TTS generation failed" },
//       { status: 500 }
//     );
//   }
// }
 

// app/api/generate-audio/route.js (or route.jsx)
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { text, id, voiceStyle } = await req.json();

    if (!text || !id) {
      return NextResponse.json(
        { error: "Missing text or id" },
        { status: 400 }
      );
    }

    const BASE_URL = "https://aigurulab.tech";
    const apiKey = process.env.AIGURU_API_KEY; // set in .env.local

    // 🔊 Call external TTS API
    const ttsResponse = await axios.post(
      `${BASE_URL}/api/text-to-speech`,
      {
        input: text,
        voice: voiceStyle || "am_michael", // default voice
      },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!ttsResponse.data || !ttsResponse.data.audio) {
      console.error("TTS API did not return audio:", ttsResponse.data);
      return NextResponse.json(
        { error: "TTS generation failed" },
        { status: 500 }
      );
    }

    // 🔥 Return the MP3 URL directly
    return NextResponse.json({ result: ttsResponse.data.audio });
  } catch (err) {
    console.error("Audio generation error:", err.response || err);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 500 }
    );
  }
}
