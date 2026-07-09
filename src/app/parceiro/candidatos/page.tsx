import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Star } from "lucide-react";

const mockCandidates = [
  { id: 1, name: "Maria Silva", job: "Analista de RH Pleno", stage: "Entrevista Cliente", rating: 5, notes: "Perfil muito alinhado com a cultura da empresa." },
  { id: 2, name: "João Santos", job: "Dev Frontend Senior", stage: "Shortlist", rating: 4, notes: "Boa experiência técnica, aguardando disponibilidade para entrevista." },
  { id: 3, name: "Carla Dias", job: "Coordenador Financeiro", stage: "Aprovado", rating: 5, notes: "Recomendada pela SuperAção RH. Excelente fit." },
];

export default function ParceiroCandidatosPage() {
  return (
    <>
      <DashboardHeader title="Candidatos" subtitle="Pré-selecionados para suas vagas" />

      <div className="p-6 space-y-4">
        {mockCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0">
                  {candidate.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-navy">{candidate.name}</h3>
                  <p className="text-sm text-gray">{candidate.job}</p>
                  <p className="text-sm text-gray mt-2">{candidate.notes}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < candidate.rating ? "text-gold fill-gold" : "text-gray/30"}`}
                    />
                  ))}
                </div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-gold/10 text-gold-dark">
                  {candidate.stage}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
