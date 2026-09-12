"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Header } from "./Header";
import { SafeUser } from "@/types/user";

interface AppShellProps {
  children: React.ReactNode;
  initialUser?: SafeUser | null;
}

export function AppShell({ children, initialUser }: AppShellProps) {
  const [user, setUser] = useState<SafeUser | null>(initialUser || null);

  useEffect(() => {
    if (!initialUser) {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, [initialUser]);

  return (
    <div className="flex min-h-screen bg-background cyber-grid">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Header user={user} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
