"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { mockDb, type Exam, type ExamSubmission } from "@/lib/mock-data";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    const examData = await mockDb.getExamById(examId);
    setExam(examData);
    if (examData) {
      // Initialize answers object
      const initialAnswers: Record<string, number> = {};
      examData.questions.forEach((q) => {
        initialAnswers[q.id] = -1; // -1 means not answered
      });
      setAnswers(initialAnswers);
    }
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = async () => {
    if (!exam) return;

    setIsSubmitting(true);
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    exam.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
      }
    });

    // Create submission
    await mockDb.createExamSubmission({
      examId: exam.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      answers,
      score,
      totalPoints,
      status: "completed",
    });

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (!exam) {
    return <div className="p-8">Loading...</div>;
  }

  if (submitted) {
    const score = exam.questions.reduce((sum, q) => {
      if (answers[q.id] === q.correctAnswer) {
        return sum + q.points;
      }
      return sum;
    }, 0);
    const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

    return (
      <div className="space-y-8 p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Exam Submitted Successfully!
            </CardTitle>
            <CardDescription>Your exam has been submitted and graded</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="text-3xl font-bold mb-2">
                {score}/{totalPoints}
              </p>
              <p className="text-lg text-muted-foreground">
                {Math.round((score / totalPoints) * 100)}%
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/student/exams">
                <Button>Back to Exams</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link href="/student/exams">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">{exam.title}</h1>
          <p className="text-muted-foreground">{exam.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Questions</CardTitle>
          <CardDescription>
            Duration: {exam.duration} minutes | Questions: {exam.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {exam.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Question {index + 1} ({question.points} points)
                </h3>
                <p className="text-base">{question.question}</p>
              </div>
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                    <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href="/student/exams">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Exam"}
        </Button>
      </div>
    </div>
  );
}

