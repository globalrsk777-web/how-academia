import { generate } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";

export async function analyzeAssessmentEffectiveness(
  examName: string,
  submissions: Array<{
    studentName: string;
    score: number;
    totalPoints: number;
    questionBreakdown: Record<string, number>;
  }>,
  examQuestions: Array<{ id: string; question: string; points: number }>
): Promise<string> {
  const averageScore =
    submissions.reduce((sum, s) => sum + (s.score / s.totalPoints) * 100, 0) / submissions.length;
  const passRate = submissions.filter((s) => (s.score / s.totalPoints) * 100 >= 60).length / submissions.length;

  const questionStats = examQuestions.map((q) => {
    const correctAnswers = submissions.filter((s) => s.questionBreakdown[q.id] === q.points).length;
    const difficulty = correctAnswers / submissions.length < 0.5 ? "Hard" : correctAnswers / submissions.length > 0.8 ? "Easy" : "Medium";
    return { question: q.question, correctRate: (correctAnswers / submissions.length) * 100, difficulty };
  });

  const prompt = `Analyze the effectiveness of the exam "${examName}".

Overall Statistics:
- Average Score: ${averageScore.toFixed(1)}%
- Pass Rate: ${(passRate * 100).toFixed(1)}%
- Total Submissions: ${submissions.length}

Question Analysis:
${questionStats.map((q) => `- ${q.question}: ${q.correctRate.toFixed(1)}% correct (${q.difficulty})`).join("\n")}

Provide an analysis including:
1. Overall exam effectiveness assessment
2. Question difficulty analysis
3. Areas where students struggled most
4. Recommendations for exam improvement
5. Suggestions for question revision or curriculum adjustment

Format as a professional assessment report.`;

  const response = await generate({
    model: googleAI("gemini-1.5-flash"),
    prompt: prompt,
    config: {
      temperature: 0.5,
      maxOutputTokens: 1500,
    },
  });

  return response.text();
}

