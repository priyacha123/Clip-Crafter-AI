import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("script api", prompt);
    

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // ✅ FREE MODEL
    });

    const result = await model.generateContent(prompt);

    console.log("script result", result.response.text());

    return NextResponse.json({
      'result': JSON.parse(result.response.text()),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
