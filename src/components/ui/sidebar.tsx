"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={cn("flex h-screen", className)}>
      <aside
        className={cn(
          "border-r bg-card transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className={cn("font-heading font-bold text-lg", !isOpen && "hidden")}>How Academia</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
          <nav className={cn("flex-1 p-4 space-y-2", !isOpen && "hidden")}>{children}</nav>
        </div>
      </aside>
      {!isOpen && (
        <div className="p-4 border-r">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function SidebarLink({ href, children, icon }: SidebarLinkProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </a>
  );
}

