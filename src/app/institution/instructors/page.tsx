"use client";

import { AddInstructorDialog } from "@/components/institution/AddInstructorDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/store/authStore";
import { Users, User, BookOpen, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/store/authStore";
import { LoadingSpinner } from "@/components/ui/loading";
import Link from "next/link";

export default function InstitutionInstructorsPage() {
  const [instructors, setInstructors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const allInstructors = await authStore.getUsersByRole("instructor");
        setInstructors(allInstructors);
      } catch (error) {
        console.error("Error loading instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, []);

  // Mock instructors with stats
  const mockInstructors = [
    {
      id: "inst1",
      name: "Dr. Evelyn Reed",
      email: "evelyn.reed@example.com",
      role: "instructor" as const,
      subject: "Physics",
      students: 147,
      courses: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst2",
      name: "Dr. Eleanor Vance",
      email: "eleanor.vance@example.com",
      role: "instructor" as const,
      subject: "History",
      students: 212,
      courses: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst3",
      name: "Prof. Alan Turing",
      email: "alan.turing@example.com",
      role: "instructor" as const,
      subject: "Mathematics",
      students: 98,
      courses: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst4",
      name: "Isabella Chen",
      email: "isabella.chen@example.com",
      role: "instructor" as const,
      subject: "Digital Art",
      students: 180,
      courses: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayInstructors = instructors && instructors.length > 0
    ? instructors.map(inst => ({
        ...inst,
        subject: inst.subject || "General",
        students: Math.floor(Math.random() * 200) + 50,
        courses: Math.floor(Math.random() * 5) + 1,
      }))
    : mockInstructors;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Instructors</h1>
        </div>
        <AddInstructorDialog />
      </div>

      {loading && instructors ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayInstructors.map((instructor) => (
            <Card 
              key={instructor.id}
              className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    <CardDescription>{instructor.subject || "General"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{(instructor as any).students || 0}</span>
                      <span className="text-muted-foreground">Students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{(instructor as any).courses || 0}</span>
                      <span className="text-muted-foreground">Courses</span>
                    </div>
                  </div>
                  <Link href={`/institution/instructors`}>
                    <Button className="w-full hover:scale-105 active:scale-95 transition-transform duration-200">
                      View Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
