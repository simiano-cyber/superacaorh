"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function AuthButtons() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) setRole(profile.role);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <span className="h-10 w-20 rounded-lg bg-soft animate-pulse" />
        <span className="h-10 w-24 rounded-lg bg-soft animate-pulse" />
      </div>
    );
  }

  if (user) {
    const portalUrl = role === "admin" ? "/admin" : role === "parceiro" ? "/parceiro" : "/candidato";
    return (
      <div className="flex items-center gap-3">
        <Link
          href={portalUrl}
          className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-lg border border-navy text-navy text-sm font-bold hover:bg-navy hover:text-white transition-all"
        >
          Meu portal
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-lg border border-navy text-navy text-sm font-bold hover:bg-navy hover:text-white transition-all"
      >
        Entrar
      </Link>
      <Link
        href="/registro"
        className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-all"
      >
        Cadastre-se
      </Link>
    </div>
  );
}
