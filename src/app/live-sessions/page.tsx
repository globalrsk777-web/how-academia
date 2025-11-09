"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LiveSession } from "@/types";
import { Video } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function LiveSessionsPage() {
  const { data: sessions, loading } = useCollection<LiveSession>("liveSessions");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Live Sessions</h1>
        <p className="text-muted-foreground">Join live coaching sessions</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : sessions && sessions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <CardTitle>{session.title}</CardTitle>
                </div>
                <CardDescription>{session.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      Instructor: {session.instructorName || "Unknown"}
                    </p>
                    <p className="text-muted-foreground">
                      Start: {format(new Date(session.startTime), "PPp")}
                    </p>
                    <p className="text-muted-foreground">
                      Status: <span className="font-medium">{session.status}</span>
                    </p>
                  </div>
                  <Link href={`/live-sessions/${session.id}`}>
                    <Button className="w-full">Join Session</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No live sessions available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

