"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection, where } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Exam, ExamSubmission } from "@/types";
import { FileText } from "lucide-react";

export default function StudentExamsPage() {
  const { userProfile } = useAuth();
  const studentId = userProfile?.id;

  const { data: exams, loading: examsLoading } = useCollection<Exam>("exams");
  const { data: submissions } = useCollection<ExamSubmission>(
    "examSubmissions",
    studentId ? [where("studentId", "==", studentId)] : undefined
  );

  const hasSubmission = (examId: string) => {
    return submissions?.some((s) => s.examId === examId);
  };

  const getSubmission = (examId: string) => {
    return submissions?.find((s) => s.examId === examId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">My Exams</h1>
        <p className="text-muted-foreground">Available exams and your results</p>
      </div>

      {examsLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : exams && exams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const submitted = hasSubmission(exam.id);
            const submission = getSubmission(exam.id);

            return (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>{exam.title}</CardTitle>
                  </div>
                  <CardDescription>{exam.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        Course: {exam.courseName || "Unknown"}
                      </p>
                      <p className="text-muted-foreground">
                        Duration: {exam.duration} minutes
                      </p>
                      {submitted && submission?.score !== undefined && (
                        <p className="font-medium">
                          Score: {submission.score}%
                        </p>
                      )}
                    </div>
                    {submitted ? (
                      <Button variant="outline" className="w-full" disabled>
                        View Results
                      </Button>
                    ) : (
                      <Button className="w-full">
                        Start Exam
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No exams available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

