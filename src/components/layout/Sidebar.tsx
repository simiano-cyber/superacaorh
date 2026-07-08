"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-navy-deep text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/">
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
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? "bg-gold/20 text-gold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              {item.icon}
              {item.label}
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
    </aside>
  );
}
