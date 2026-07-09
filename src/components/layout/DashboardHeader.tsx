"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, X } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

export default function DashboardHeader({ title, subtitle, showSearch = true }: DashboardHeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    // Redirecionar para candidatos com busca (principal uso case)
    router.push(`/admin/candidatos?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header className="h-16 bg-white border-b border-line flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-xs text-gray">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {showSearch && (
          <>
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar candidato, vaga..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-64 h-9 px-3 rounded-lg border border-line bg-soft text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="cursor-pointer">
                  <X className="w-4 h-4 text-gray" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-lg border border-line flex items-center justify-center hover:bg-soft transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-gray" />
              </button>
            )}
          </>
        )}
        <button className="w-9 h-9 rounded-lg border border-line flex items-center justify-center hover:bg-soft transition-colors cursor-pointer">
          <Bell className="w-4 h-4 text-gray" />
        </button>
      </div>
    </header>
  );
}
