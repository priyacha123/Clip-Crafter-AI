import textToSpeech from "@google-cloud/text-to-speech";
import { storage } from "configs/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";
// import fs from "fs";
// import util from "util";

const fs = require("fs");
const util = require("util");

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const { text, id, voiceStyle } = await req.json();
  const storageRef = ref(storage, "ai-short-video-files/" + id + ".mp3");

  const voiceMap = {
    Female: { ssmlGender: "FEMALE" },
    MALE: { ssmlGender: "MALE" },
    ROBOTIC: { ssmlGender: "NEUTRAL" },
    CHILD: { name: "en-US-Wavenet-A" },
    "DEEP VOICE": { name: "en-US-Wavenet-D" },
    ANIMATED: { name: "en-US-Wavenet-C" },
    NARRATOR: { name: "en-US-Wavenet-B" },
  };

  const selectedVoice = voiceMap[voiceStyle] || { ssmlGender: "FEMALE" };

  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-US", ...selectedVoice },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile('output.mp3', response.audioContent, 'binary');

  // store audio file in firebase storage
  const audioBuffer = Buffer.from(response.audioContent, "binary");

  await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });
  const downloadURL = await getDownloadURL(storageRef);
  console.log("Audio content written to file: output.mp3");

  console.log(downloadURL);

  return NextResponse.json({ result: downloadURL });
}
