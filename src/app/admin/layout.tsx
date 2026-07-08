"use client";

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

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Vagas", href: "/admin/vagas", icon: <Briefcase className="w-5 h-5" /> },
  { label: "Candidatos", href: "/admin/candidatos", icon: <Users className="w-5 h-5" /> },
  { label: "Parceiros", href: "/admin/parceiros", icon: <Building2 className="w-5 h-5" /> },
  { label: "Entrevistas", href: "/admin/entrevistas", icon: <Calendar className="w-5 h-5" /> },
  { label: "Relatórios", href: "/admin/relatorios", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Configurações", href: "/admin/configuracoes", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-soft">
      <Sidebar items={adminNav} portalName="Administração" />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
