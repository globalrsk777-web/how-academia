"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import type { LiveSession } from "@/types";
import { Video, Radio, ArrowRight, Users, Eye, Clock, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LiveSessionsPage() {
  const { data: sessions, loading } = useCollection<LiveSession>("liveSessions");
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Mock live sessions with enhanced data
  const mockSessions: Array<LiveSession & {
    image?: string;
    fullDescription?: string;
    viewers?: number;
    duration?: string;
    category?: string;
  }> = [
    {
      id: "1",
      title: "Live with Dr. Evelyn Reed",
      description: "Modern Physics Q&A",
      fullDescription: "Join the live Q&A session with Dr. Evelyn Reed. Get answers to your physics questions in real-time!",
      instructorId: "instructor1",
      instructorName: "Dr. Evelyn Reed",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
      status: "live",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewers: 124,
      duration: "45 min",
      category: "Physics",
    },
    {
      id: "2",
      title: "Live with Dr. Eleanor Vance",
      description: "Ask Me Anything: Ancient Rome",
      fullDescription: "Join the live Q&A session with Dr. Eleanor Vance. Explore ancient Roman history and culture!",
      instructorId: "instructor2",
      instructorName: "Dr. Eleanor Vance",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      status: "live",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewers: 89,
      duration: "30 min",
      category: "History",
    },
    {
      id: "3",
      title: "Live with Prof. Alan Turing",
      description: "Calculus Workshop",
      fullDescription: "Join the live Q&A session with Prof. Alan Turing. Master calculus concepts with interactive problem-solving!",
      instructorId: "instructor3",
      instructorName: "Prof. Alan Turing",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
      status: "live",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewers: 156,
      duration: "60 min",
      category: "Mathematics",
    },
  ];

  // Simulate real-time view count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCounts(prev => {
        const newCounts = { ...prev };
        mockSessions.forEach(session => {
          if (!newCounts[session.id]) {
            newCounts[session.id] = session.viewers || 0;
          }
          // Randomly increment view count
          if (Math.random() > 0.7) {
            newCounts[session.id] = (newCounts[session.id] || 0) + Math.floor(Math.random() * 3);
          }
        });
        return newCounts;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Combine real sessions with mock sessions, or use mock if no real sessions
  const displaySessions: Array<LiveSession & {
    image?: string;
    fullDescription?: string;
    viewers?: number;
    duration?: string;
    category?: string;
  }> = sessions && sessions.length > 0 
    ? sessions.map(s => ({
        ...s,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
        fullDescription: s.description || "Join the live session.",
        viewers: Math.floor(Math.random() * 200) + 50,
        duration: "45 min",
        category: "General",
      }))
    : mockSessions;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Live Sessions</h1>
          <p className="text-muted-foreground">Join interactive live sessions with expert instructors</p>
        </div>
        <Button className="hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg hover:shadow-xl">
          <Radio className="mr-2 h-4 w-4" />
          Go Live
        </Button>
      </div>

      {loading && sessions ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displaySessions.map((session, index) => {
            const sessionData = session;
            const currentViews = viewCounts[sessionData.id] || sessionData.viewers || 0;
            
            return (
              <Card 
                key={sessionData.id} 
                className="overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-2 animate-fade-in group border-2 border-transparent hover:border-red-500/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image with overlay */}
                <div className="relative h-56 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                  {sessionData.image && (
                    <img
                      src={sessionData.image}
                      alt={sessionData.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  {/* Live badge with pulse animation */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                      <div className="relative flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* View count badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-full text-xs font-medium">
                      <Eye className="h-3 w-3" />
                      <span>{currentViews.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Category badge */}
                  {sessionData.category && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        {sessionData.category}
                      </Badge>
                    </div>
                  )}

                  {/* Duration badge */}
                  {sessionData.duration && (
                    <div className="absolute bottom-3 right-3 z-10">
                      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-full text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{sessionData.duration}</span>
                      </div>
                    </div>
                  )}

                  {/* Play button overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                      {sessionData.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-base mt-2">
                    {sessionData.description}
                  </CardDescription>
                  <CardDescription className="line-clamp-2 mt-2 text-sm">
                    {sessionData.fullDescription}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Instructor info */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{sessionData.instructorName}</p>
                      <p className="text-xs text-muted-foreground">Live Instructor</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{currentViews} watching</span>
                    </div>
                  </div>

                  {/* Join button */}
                  <Link href={`/live-sessions/${sessionData.id}`} className="block">
                    <Button 
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl group/btn"
                    >
                      <Play className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      Join Session
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Additional info section */}
      {displaySessions.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{displaySessions.length}</span> live sessions available
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center md:text-right">
                Sessions update in real-time • Join anytime during the session
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
