"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type User } from "@/lib/mock-data";
import { User as UserIcon } from "lucide-react";

export default function StudentTutorsPage() {
  const [instructors, setInstructors] = useState<User[]>([]);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    const allInstructors = await mockDb.getUsers({ role: "instructor" });
    setInstructors(allInstructors);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Tutors</h1>
        <p className="text-muted-foreground">Browse available instructors and tutors</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <Card key={instructor.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {instructor.profilePicture ? (
                    <img
                      src={instructor.profilePicture}
                      alt={instructor.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle>{instructor.name}</CardTitle>
                  <CardDescription>{instructor.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {instructor.bio && (
                <p className="text-sm text-muted-foreground mb-4">{instructor.bio}</p>
              )}
              <div className="space-y-2">
                {instructor.subjectSpecialization && (
                  <p className="text-sm">
                    <span className="font-medium">Subject:</span> {instructor.subjectSpecialization}
                  </p>
                )}
                {instructor.pricePerSession && (
                  <p className="text-sm">
                    <span className="font-medium">Price per session:</span> ${instructor.pricePerSession}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {instructors.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No instructors available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

