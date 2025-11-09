"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarItemProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  icon?: React.ReactNode;
}

export function Sidebar({ children, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "relative border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold font-heading">How Academia</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">{children}</nav>
      </div>
    </aside>
  );
}

export function SidebarItem({
  children,
  href,
  className,
  icon,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isActive && "bg-accent text-accent-foreground font-semibold",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}

