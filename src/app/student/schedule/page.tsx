"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type Session } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

export default function StudentSchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    const allSessions = await mockDb.getSessions();
    setSessions(allSessions);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">My Schedule</h1>
        <p className="text-muted-foreground">View all scheduled sessions from instructors</p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(session.scheduledAt).toLocaleString()}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Instructor: {session.instructorName}
                </span>
                <span className="text-sm text-muted-foreground">
                  Duration: {session.duration} minutes
                </span>
                <span className="text-sm text-muted-foreground">
                  Participants: {session.participants.length}/{session.maxParticipants}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {sessions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No scheduled sessions</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

