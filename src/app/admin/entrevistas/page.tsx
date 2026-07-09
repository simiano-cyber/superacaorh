"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Calendar, Clock, MapPin, User, Loader2, X } from "lucide-react";

export default function EntrevistasPage() {
  const supabase = createClient();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationId, setApplicationId] = useState("");
  const [interviewType, setInterviewType] = useState("Entrevista RH");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("60");
  const [location, setLocation] = useState("");
  const [interviewer, setInterviewer] = useState("");

  useEffect(() => {
    loadInterviews();
  }, []);

  async function loadInterviews() {
    const { data } = await supabase
      .from("interviews")
      .select(`
        *,
        application:applications(
          id,
          candidate:candidates(profile:profiles(full_name)),
          job:jobs(title)
        )
      `)
      .order("scheduled_at", { ascending: true });

    if (data) setInterviews(data);
    setLoading(false);
  }

  async function loadApplications() {
    const { data } = await supabase
      .from("applications")
      .select("id, candidate:candidates(profile:profiles(full_name)), job:jobs(title)")
      .in("stage", ["triagem", "entrevista_rh", "entrevista_cliente", "teste_tecnico"]);

    if (data) setApplications(data);
  }

  function openForm() {
    loadApplications();
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!applicationId || !scheduledAt) return;
    setSaving(true);

    const { error } = await supabase.from("interviews").insert({
      application_id: applicationId,
      interview_type: interviewType,
      scheduled_at: scheduledAt,
      duration_minutes: parseInt(duration) || 60,
      location: location || null,
      interviewer_name: interviewer || null,
    });

    if (!error) {
      setShowForm(false);
      setApplicationId("");
      setScheduledAt("");
      setLocation("");
      setInterviewer("");
      loadInterviews();
    }
    setSaving(false);
  }

  const statusColor = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    if (d < now) return "bg-green/10 text-green";
    return "bg-gold/10 text-gold-dark";
  };

  const statusLabel = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    if (d < now) return "Realizada";
    return "Agendada";
  };

  return (
    <>
      <DashboardHeader title="Entrevistas" subtitle="Agende e acompanhe as entrevistas" />

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-navy">Todas as entrevistas</h2>
          <Button size="sm" onClick={openForm}>
            <Plus className="w-4 h-4" />
            Agendar entrevista
          </Button>
        </div>

        {/* Modal de agendamento */}
        {showForm && (
          <Card className="border-gold/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy">Nova Entrevista</h3>
              <button onClick={() => setShowForm(false)} className="cursor-pointer text-gray hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Candidato / Vaga *</label>
                <select
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  <option value="">Selecione...</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.candidate?.profile?.full_name} — {app.job?.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Tipo</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  <option>Entrevista RH</option>
                  <option>Entrevista Técnica</option>
                  <option>Entrevista Cliente</option>
                  <option>Entrevista Final</option>
                </select>
              </div>
              <Input
                id="scheduledAt"
                label="Data e hora *"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
              <Input
                id="duration"
                label="Duração (min)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Input
                id="location"
                label="Local / Link"
                placeholder="Google Meet, Presencial - Sala 3..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                id="interviewer"
                label="Entrevistador"
                placeholder="Nome do entrevistador"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
              />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" loading={saving} size="sm">
                  Agendar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray" />
          </div>
        )}

        {!loading && interviews.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray">Nenhuma entrevista agendada.</p>
          </Card>
        )}

        <div className="space-y-3">
          {interviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {interview.application?.candidate?.profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{interview.application?.candidate?.profile?.full_name || "Candidato"}</p>
                    <p className="text-xs text-gray">{interview.application?.job?.title || "Vaga"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {interview.interview_type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(interview.scheduled_at).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(interview.scheduled_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {interview.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {interview.location}
                    </span>
                  )}
                </div>

                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize shrink-0 ${statusColor(interview.scheduled_at)}`}>
                  {statusLabel(interview.scheduled_at)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
