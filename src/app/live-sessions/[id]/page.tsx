"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockDb, type Session, type Message } from "@/lib/mock-data";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LiveSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    loadSession();
    loadMessages();
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const loadSession = async () => {
    const sessionData = await mockDb.getSessionById(sessionId);
    setSession(sessionData);
  };

  const loadMessages = async () => {
    const sessionMessages = await mockDb.getMessages(sessionId);
    setMessages(sessionMessages);
  };

  const handleSendMessage = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser || !newMessage.trim()) return;

    await mockDb.createMessage({
      sessionId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: newMessage,
    });

    setNewMessage("");
    loadMessages();
  };

  if (!session) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link href="/live-sessions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">{session.title}</h1>
          <p className="text-muted-foreground">{session.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Video</CardTitle>
              <CardDescription>Video placeholder for live session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">📹</div>
                  <p className="text-muted-foreground">Live Video Stream</p>
                  <p className="text-sm text-muted-foreground">Session: {new Date(session.scheduledAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
              <CardDescription>Real-time messages</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{message.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

