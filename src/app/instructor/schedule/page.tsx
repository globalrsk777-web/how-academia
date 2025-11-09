"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddSessionDialog } from "@/components/instructor/AddSessionDialog";
import { LoadingSpinner } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { where } from "@/lib/firebase/hooks";
import type { Schedule } from "@/types";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { useState } from "react";

export default function InstructorSchedulePage() {
  const { userProfile } = useAuth();
  const instructorId = userProfile?.id;
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025

  const { data: schedules, loading } = useCollection<Schedule>(
    "schedule",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get first day of month to determine offset
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const getSessionsForDate = (date: Date) => {
    if (!schedules) return [];
    return schedules.filter(schedule => {
      const sessionDate = new Date(schedule.startTime);
      return isSameDay(sessionDate, date);
    });
  };

  // Default to November 9th, 2025 for demonstration
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 9));
  const selectedDateSessions = getSessionsForDate(selectedDate);

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Schedule</h1>
        </div>
        <AddSessionDialog />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}
              {daysInMonth.map((day) => {
                const daySessions = getSessionsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-1 border rounded-md text-sm cursor-pointer transition-colors
                      ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50'}
                      ${isToday && !isSelected ? 'border-primary/30' : ''}
                      ${daySessions.length > 0 && !isSelected ? 'border-primary/30' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center h-full">
                      {format(day, "d")}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sessions for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : selectedDateSessions.length > 0 ? (
              <div className="space-y-3">
                {selectedDateSessions.map((session) => (
                  <div key={session.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {format(new Date(session.startTime), "h:mm a")} - {format(new Date(session.endTime), "h:mm a")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No sessions scheduled for this day.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
