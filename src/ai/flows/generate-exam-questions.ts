import { generate } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";

export async function generateExamQuestions(
  topic: string,
  difficulty: string = "medium",
  numberOfQuestions: number = 5
): Promise<string> {
  const prompt = `Generate ${numberOfQuestions} ${difficulty} difficulty exam questions about ${topic}. 
  Format each question with:
  1. Question text
  2. Four multiple choice options (A, B, C, D)
  3. The correct answer (A, B, C, or D)
  4. A brief explanation
  
  Format the output as a JSON array with objects containing: question, options (array), correctAnswer, explanation.`;

  const response = await generate({
    model: googleAI("gemini-1.5-flash"),
    prompt: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 2000,
    },
  });

  return response.text();
}

