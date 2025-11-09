"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddSessionDialog } from "@/components/instructor/AddSessionDialog";
import { where } from "@/lib/firebase/hooks";
import type { Schedule } from "@/types";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function InstructorSchedulePage() {
  const { userProfile } = useAuth();
  const instructorId = userProfile?.id;

  const { data: schedules, loading } = useCollection<Schedule>(
    "schedule",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Schedule</h1>
          <p className="text-muted-foreground">Manage your live sessions</p>
        </div>
        <AddSessionDialog />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : schedules && schedules.length > 0 ? (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>{schedule.title}</CardTitle>
                </div>
                <CardDescription>{schedule.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Start: {format(new Date(schedule.startTime), "PPp")}
                  </p>
                  <p className="text-muted-foreground">
                    End: {format(new Date(schedule.endTime), "PPp")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No sessions scheduled yet. Add your first session!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

