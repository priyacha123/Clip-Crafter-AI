import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStatusCode = (error) =>
  error?.status ||
  error?.statusCode ||
  error?.response?.status ||
  error?.cause?.status;

const isRetryableError = (error) => {
  const status = getStatusCode(error);
  return status === 429 || status === 500 || status === 503;
};

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("script api", prompt);

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let lastError;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("script result", text);

        return NextResponse.json({
          result: JSON.parse(text),
        });
      } catch (error) {
        lastError = error;

        if (!isRetryableError(error) || attempt === MAX_RETRIES) {
          break;
        }

        await sleep(attempt * 1000);
      }
    }

    const statusCode = getStatusCode(lastError) || 500;
    const message =
      statusCode === 503
        ? "Gemini is currently overloaded. Please try again in a moment."
        : lastError?.message || "Failed to generate video script.";

    console.error(lastError);

    return NextResponse.json({ error: message }, { status: statusCode });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
