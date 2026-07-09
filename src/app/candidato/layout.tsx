"use client";

import Sidebar from "@/components/layout/Sidebar";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  User,
} from "lucide-react";

const candidatoNav = [
  { label: "Início", href: "/candidato", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Meu Currículo", href: "/candidato/curriculo", icon: <FileText className="w-5 h-5" /> },
  { label: "Vagas", href: "/candidato/vagas", icon: <Briefcase className="w-5 h-5" /> },
  { label: "Minhas Candidaturas", href: "/candidato/candidaturas", icon: <ClipboardList className="w-5 h-5" /> },
  { label: "Meu Perfil", href: "/candidato/perfil", icon: <User className="w-5 h-5" /> },
];

export default function CandidatoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-soft">
      <Sidebar items={candidatoNav} portalName="Portal do Candidato" />
      <main className="flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
