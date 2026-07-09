"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

interface SidebarProps {
  items: NavItem[];
  portalName: string;
  userName?: string;
}

export default function Sidebar({ items, portalName, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const navContent = (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <img
            src="/images/logo-superacao-rh-horizontal.png"
            alt="SuperAção RH"
            className="h-10 brightness-0 invert"
          />
        </Link>
        <p className="text-xs text-white/50 mt-2 font-semibold uppercase tracking-wide">
          {portalName}
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? "bg-gold/20 text-gold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-gold/30 text-gold text-xs font-bold">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Usuário + Logout */}
      <div className="p-4 border-t border-white/10">
        {userName && (
          <p className="text-sm text-white/70 mb-3 truncate">{userName}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-white lg:hidden cursor-pointer shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-navy-deep text-white flex flex-col z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-navy-deep text-white hidden lg:flex flex-col z-40">
        {navContent}
      </aside>
    </>
  );
}
