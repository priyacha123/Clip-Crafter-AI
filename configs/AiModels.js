// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

// import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function main() {
  const ai = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
