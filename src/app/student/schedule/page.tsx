"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Schedule } from "@/types";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function StudentSchedulePage() {
  const { data: schedules, loading } = useCollection<Schedule>("schedule");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">My Schedule</h1>
        <p className="text-muted-foreground">View your scheduled sessions</p>
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
                    Instructor: {schedule.instructorName || "Unknown"}
                  </p>
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
            <p className="text-muted-foreground">No sessions scheduled</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

