"use client";

import { Bell, Menu } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-line flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-xs text-gray">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg border border-line flex items-center justify-center hover:bg-soft transition-colors cursor-pointer">
          <Bell className="w-4 h-4 text-gray" />
        </button>
      </div>
    </header>
  );
}
