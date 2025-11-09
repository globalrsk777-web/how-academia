"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoc } from "@/lib/firebase/hooks";
import { dataStore } from "@/lib/store/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LiveSession, Message } from "@/types";
import { Video, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function LiveSessionDetailPage() {
  const params = useParams();
  const sessionId = typeof params.id === "string" ? params.id : "";
  const { userProfile } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useDoc<LiveSession>("liveSessions", sessionId);

  useEffect(() => {
    if (!sessionId) return;

    const loadMessages = async () => {
      try {
        const allMessages = await dataStore.getCollection("messages", [
          { field: "sessionId", operator: "==", value: sessionId },
        ]);
        setMessages(allMessages as Message[]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading messages:", error);
        setLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const unsubscribe = dataStore.subscribeMessages(sessionId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [sessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userProfile || !sessionId) return;

    try {
      await dataStore.addMessage({
        sessionId,
        userId: userProfile.id,
        userName: userProfile.name,
        userAvatar: userProfile.avatar,
        text: message,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">{session?.title || "Live Session"}</h1>
        <p className="text-muted-foreground">{session?.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Video Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Video className="h-16 w-16 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-[400px]">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-2 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(msg.createdAt), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message... (e.g., Hello! How does this relate to Uganda's agriculture?)"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
                <Button type="submit" size="icon" className="hover:scale-110 transition-transform duration-200">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

