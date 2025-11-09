// Mock implementation for prototype
// In production, this would use Genkit AI to generate exam questions
export async function generateExamQuestions(
  topic: string,
  difficulty: string = "medium",
  numberOfQuestions: number = 5
): Promise<string> {
  // Return mock questions for prototype
  return JSON.stringify([
    {
      question: `Sample question about ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "A",
      explanation: "This is a sample question. In production, AI would generate contextual questions.",
    },
  ]);
}

