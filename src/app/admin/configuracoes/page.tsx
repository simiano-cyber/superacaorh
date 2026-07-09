"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserPlus, Shield, Loader2, Copy, Check, X } from "lucide-react";

export default function ConfiguracoesPage() {
  const supabase = createClient();
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [result, setResult] = useState<{ success?: boolean; message?: string; tempPassword?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCollaborators();
  }, []);

  async function loadCollaborators() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (data) setCollaborators(data);
    setLoading(false);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);

    const res = await fetch("/api/admin/invite-collaborator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, full_name: newName }),
    });

    const data = await res.json();

    if (res.ok) {
      setResult({ success: true, message: data.message, tempPassword: data.tempPassword });
      setNewName("");
      setNewEmail("");
      loadCollaborators();
    } else {
      setResult({ success: false, message: data.error });
    }
    setSaving(false);
  }

  function copyPassword() {
    if (result?.tempPassword) {
      navigator.clipboard.writeText(result.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <DashboardHeader title="Configurações" subtitle="Gerencie colaboradores e configurações" />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Colaboradores */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-navy text-lg">Colaboradores</h2>
              <p className="text-sm text-gray">Equipe com acesso ao painel administrativo</p>
            </div>
            <Button size="sm" onClick={() => setShowForm(true)}>
              <UserPlus className="w-4 h-4" />
              Adicionar colaborador
            </Button>
          </div>

          {/* Formulário de convite */}
          {showForm && (
            <div className="mb-6 p-4 border border-gold/30 rounded-lg bg-gold/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-navy">Novo Colaborador</h3>
                <button onClick={() => { setShowForm(false); setResult(null); }} className="cursor-pointer">
                  <X className="w-5 h-5 text-gray" />
                </button>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="colabName"
                    label="Nome completo *"
                    placeholder="Nome do colaborador"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                  <Input
                    id="colabEmail"
                    label="E-mail *"
                    type="email"
                    placeholder="colaborador@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" loading={saving} size="sm">
                  Criar conta de colaborador
                </Button>
              </form>

              {/* Resultado */}
              {result && (
                <div className={`mt-4 p-4 rounded-lg ${result.success ? "bg-green/10" : "bg-red-50"}`}>
                  <p className={`text-sm font-semibold ${result.success ? "text-green" : "text-red-600"}`}>
                    {result.message}
                  </p>
                  {result.tempPassword && (
                    <div className="mt-3 p-3 bg-white rounded border border-line">
                      <p className="text-xs text-gray mb-1">Senha temporária (passe para o colaborador):</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-navy bg-soft px-2 py-1 rounded flex-1">
                          {result.tempPassword}
                        </code>
                        <button onClick={copyPassword} className="cursor-pointer p-1.5 rounded hover:bg-soft">
                          {copied ? <Check className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4 text-gray" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray mt-2">
                        O colaborador deve trocar a senha no primeiro acesso em Meu Perfil.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Lista de colaboradores */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray" />
            </div>
          )}

          {!loading && (
            <div className="space-y-3">
              {collaborators.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between p-4 border border-line rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm">
                      {collab.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">{collab.full_name}</p>
                      <p className="text-xs text-gray">{collab.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-navy/5 text-navy">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
