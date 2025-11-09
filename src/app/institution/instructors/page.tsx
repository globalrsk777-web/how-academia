"use client";

import { AddInstructorDialog } from "@/components/institution/AddInstructorDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authStore } from "@/lib/store/authStore";
import { Users, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/store/authStore";

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Instructors</h1>
          <p className="text-muted-foreground">Manage instructors</p>
        </div>
        <AddInstructorDialog />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : instructors && instructors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <Card key={instructor.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{instructor.name}</CardTitle>
                    <CardDescription>{instructor.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {instructor.bio && (
                  <p className="text-sm text-muted-foreground">{instructor.bio}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No instructors yet. Add your first instructor!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

