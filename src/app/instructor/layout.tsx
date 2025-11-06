"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarLink } from "@/components/ui/sidebar";
import { mockDb } from "@/lib/mock-data";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  User,
  LogOut,
  Video,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(mockDb.getCurrentUser());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);
    
    if (!user || user.role !== "instructor") {
      router.push("/login");
    }
  }, [router]);

  const handleSignOut = async () => {
    await mockDb.signOut();
    setCurrentUser(null);
    router.push("/login");
  };

  if (!mounted || !currentUser || currentUser.role !== "instructor") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarLink href="/instructor" icon={<LayoutDashboard className="h-4 w-4" />}>
          Dashboard
        </SidebarLink>
        <SidebarLink href="/instructor/courses" icon={<BookOpen className="h-4 w-4" />}>
          Courses
        </SidebarLink>
        <SidebarLink href="/instructor/exams" icon={<FileText className="h-4 w-4" />}>
          Exams
        </SidebarLink>
        <SidebarLink href="/instructor/schedule" icon={<Calendar className="h-4 w-4" />}>
          Schedule
        </SidebarLink>
        <SidebarLink href="/live-sessions" icon={<Video className="h-4 w-4" />}>
          Live Sessions
        </SidebarLink>
        <SidebarLink href="/institutions" icon={<Building2 className="h-4 w-4" />}>
          Institutions
        </SidebarLink>
        <SidebarLink href="/instructor/profile" icon={<User className="h-4 w-4" />}>
          Profile
        </SidebarLink>
        <div className="mt-auto pt-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Sidebar>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

