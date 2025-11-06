"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockDb, type Exam, type ExamSubmission } from "@/lib/mock-data";

export default function StudentExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    const allExams = await mockDb.getExams();
    const studentSubmissions = await mockDb.getExamSubmissions({ studentId: currentUser.id });
    
    setExams(allExams);
    setSubmissions(studentSubmissions);
  };

  const getSubmission = (examId: string) => {
    return submissions.find((s) => s.examId === examId);
  };

  const handleStartExam = (examId: string) => {
    // Navigate to exam taking page
    window.location.href = `/student/exams/${examId}`;
  };

  const handleViewResults = (examId: string) => {
    const submission = getSubmission(examId);
    if (submission) {
      // Show results (could be a dialog or separate page)
      alert(`Your score: ${submission.score}/${submission.totalPoints} (${Math.round((submission.score / submission.totalPoints) * 100)}%)`);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">My Exams</h1>
        <p className="text-muted-foreground">View and take available exams</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => {
          const submission = getSubmission(exam.id);
          const hasCompleted = submission && submission.status === "completed";
          
          return (
            <Card key={exam.id}>
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Course: {exam.courseName}</p>
                    <p className="text-sm text-muted-foreground">Duration: {exam.duration} minutes</p>
                    <p className="text-sm text-muted-foreground">Questions: {exam.questions.length}</p>
                  </div>
                  {hasCompleted ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Score: {submission.score}/{submission.totalPoints} ({Math.round((submission.score / submission.totalPoints) * 100)}%)
                      </p>
                      <Button variant="outline" className="w-full" onClick={() => handleViewResults(exam.id)}>
                        View Results
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleStartExam(exam.id)}>
                      Start Exam
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {exams.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No exams available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

