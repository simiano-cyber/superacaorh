"use client";

import Sidebar from "@/components/layout/Sidebar";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";

const parceiroNav = [
  { label: "Dashboard", href: "/parceiro", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Minhas Vagas", href: "/parceiro/vagas", icon: <Briefcase className="w-5 h-5" /> },
  { label: "Candidatos", href: "/parceiro/candidatos", icon: <Users className="w-5 h-5" /> },
  { label: "SLA & Métricas", href: "/parceiro/metricas", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Histórico", href: "/parceiro/historico", icon: <Clock className="w-5 h-5" /> },
];

export default function ParceiroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-soft">
      <Sidebar items={parceiroNav} portalName="Portal do Parceiro" />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
