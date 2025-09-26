// import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log(prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    
    console.log("AI Script RESPONSE: ", text);

    return NextResponse.json({ result: JSON.parse(text) });
  } catch (e) {
    return NextResponse.json({ "Error:": e });
  }
}
