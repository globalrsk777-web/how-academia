"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockDb, type Session } from "@/lib/mock-data";
import { Video, Calendar } from "lucide-react";
import Link from "next/link";

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const allSessions = await mockDb.getSessions();
    setSessions(allSessions);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Live Sessions</h1>
        <p className="text-muted-foreground">Browse available live coaching sessions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(session.scheduledAt).toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Instructor: {session.instructorName}</p>
                  <p className="text-sm text-muted-foreground">Duration: {session.duration} minutes</p>
                  <p className="text-sm text-muted-foreground">
                    Participants: {session.participants.length}/{session.maxParticipants}
                  </p>
                </div>
                <Link href={`/live-sessions/${session.id}`}>
                  <Button className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Join Session
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {sessions.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No live sessions available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

