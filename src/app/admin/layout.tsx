"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/layout/Sidebar";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [counts, setCounts] = useState({ jobs: 0, candidates: 0, interviews: 0 });

  useEffect(() => {
    loadCounts();
  }, []);

  async function loadCounts() {
    const { count: jobs } = await supabase
      .from("jobs").select("*", { count: "exact", head: true }).eq("status", "aberta");
    const { count: candidates } = await supabase
      .from("candidates").select("*", { count: "exact", head: true });
    const { count: interviews } = await supabase
      .from("interviews").select("*", { count: "exact", head: true })
      .gte("scheduled_at", new Date().toISOString());

    setCounts({
      jobs: jobs || 0,
      candidates: candidates || 0,
      interviews: interviews || 0,
    });
  }

  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Vagas", href: "/admin/vagas", icon: <Briefcase className="w-5 h-5" />, count: counts.jobs },
    { label: "Candidatos", href: "/admin/candidatos", icon: <Users className="w-5 h-5" />, count: counts.candidates },
    { label: "Parceiros", href: "/admin/parceiros", icon: <Building2 className="w-5 h-5" /> },
    { label: "Entrevistas", href: "/admin/entrevistas", icon: <Calendar className="w-5 h-5" />, count: counts.interviews },
    { label: "Relatórios", href: "/admin/relatorios", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Configurações", href: "/admin/configuracoes", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-soft">
      <Sidebar items={adminNav} portalName="Administração" />
      <main className="flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
