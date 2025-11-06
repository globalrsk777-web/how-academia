import { generate } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";

export async function summarizeStudentPerformance(
  studentName: string,
  examResults: Array<{ examName: string; score: number; totalPoints: number }>,
  courseEnrollments: string[]
): Promise<string> {
  const resultsSummary = examResults
    .map((r) => `${r.examName}: ${r.score}/${r.totalPoints} (${Math.round((r.score / r.totalPoints) * 100)}%)`)
    .join("\n");

  const prompt = `Analyze the performance of student ${studentName}.

Exam Results:
${resultsSummary}

Enrolled Courses: ${courseEnrollments.join(", ")}

Provide a comprehensive performance summary including:
1. Overall performance assessment
2. Strengths and areas of improvement
3. Recommendations for further learning
4. Suggested next steps

Format as a clear, concise report.`;

  const response = await generate({
    model: googleAI("gemini-1.5-flash"),
    prompt: prompt,
    config: {
      temperature: 0.5,
      maxOutputTokens: 1000,
    },
  });

  return response.text();
}

