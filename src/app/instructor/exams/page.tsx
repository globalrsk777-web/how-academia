"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateExamDialog } from "@/components/instructor/CreateExamDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { where } from "@/lib/firebase/hooks";
import type { Exam, ExamSubmission } from "@/types";
import { MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InstructorExamsPage() {
  const { userProfile } = useAuth();
  const instructorId = userProfile?.id;

  const { data: exams, loading } = useCollection<Exam>(
    "exams",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  const { data: submissions } = useCollection<ExamSubmission>("examSubmissions");

  // Mock exams data
  const mockExams = [
    { id: "1", title: "Physics Midterm", status: "Graded" as const },
    { id: "2", title: "History Pop Quiz", status: "Graded" as const },
    { id: "3", title: "Algebra II Final", status: "In Progress" as const },
    { id: "4", title: "Art History Paper", status: "Pending" as const },
  ];

  const getExamStatus = (examId: string): "Graded" | "In Progress" | "Pending" => {
    const examSubmissions = submissions?.filter(s => s.examId === examId) || [];
    if (examSubmissions.length === 0) {
      return "Pending";
    }
    const allGraded = examSubmissions.every(s => s.score !== undefined);
    if (allGraded) {
      return "Graded";
    }
    return "In Progress";
  };

  const displayExams = exams && exams.length > 0 
    ? exams.map(exam => ({
        id: exam.id,
        title: exam.title,
        status: getExamStatus(exam.id),
      }))
    : mockExams;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Graded":
        return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Graded</Badge>;
      case "In Progress":
        return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">In Progress</Badge>;
      case "Pending":
        return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Exams</h1>
        </div>
        <CreateExamDialog />
      </div>

      {loading && exams ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Exam List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayExams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <p className="text-muted-foreground">No exams available</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayExams.map((exam) => (
                    <TableRow key={exam.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>{getStatusBadge(exam.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Exam</DropdownMenuItem>
                            <DropdownMenuItem>View Results</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
