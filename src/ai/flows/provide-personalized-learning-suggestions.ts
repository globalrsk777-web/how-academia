import { generate } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";

export async function providePersonalizedLearningSuggestions(
  studentName: string,
  enrolledCourses: string[],
  performanceData: { courseName: string; averageScore: number }[],
  learningGoals?: string
): Promise<string> {
  const performanceSummary = performanceData
    .map((p) => `${p.courseName}: ${p.averageScore}%`)
    .join("\n");

  const prompt = `Provide personalized learning suggestions for ${studentName}.

Current Enrollments:
${enrolledCourses.join(", ")}

Performance Summary:
${performanceSummary}

${learningGoals ? `Learning Goals: ${learningGoals}` : ""}

Generate personalized learning recommendations including:
1. Suggested study schedule
2. Recommended resources and materials
3. Areas to focus on based on performance
4. Learning strategies tailored to their needs
5. Next courses or topics to explore

Make the suggestions specific, actionable, and encouraging.`;

  const response = await generate({
    model: googleAI("gemini-1.5-flash"),
    prompt: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 1500,
    },
  });

  return response.text();
}

