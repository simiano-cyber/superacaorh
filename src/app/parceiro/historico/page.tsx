import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { CheckCircle, XCircle } from "lucide-react";

const mockHistory = [
  { id: 1, title: "Analista Financeiro", status: "contratado", hired: "Pedro Souza", closedAt: "15/06/2026", duration: "14 dias" },
  { id: 2, title: "Dev Backend Pleno", status: "contratado", hired: "Lucas Mendes", closedAt: "20/05/2026", duration: "21 dias" },
  { id: 3, title: "Coordenador de RH", status: "contratado", hired: "Ana Clara", closedAt: "10/04/2026", duration: "18 dias" },
  { id: 4, title: "Designer UX", status: "cancelada", hired: "-", closedAt: "01/04/2026", duration: "30 dias" },
  { id: 5, title: "Gerente Comercial", status: "contratado", hired: "Roberto Lima", closedAt: "15/03/2026", duration: "25 dias" },
];

export default function HistoricoPage() {
  return (
    <>
      <DashboardHeader title="Histórico" subtitle="Vagas anteriores e resultados" />

      <div className="p-6">
        <Card padding="sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Vaga</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Status</th>
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Contratado</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Duração</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Encerrada em</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((item) => (
                  <tr key={item.id} className="border-b border-line last:border-0 hover:bg-soft/50">
                    <td className="p-3 font-semibold text-navy text-sm">{item.title}</td>
                    <td className="p-3 text-center">
                      {item.status === "contratado" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green/10 text-green">
                          <CheckCircle className="w-3 h-3" />
                          Contratado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          <XCircle className="w-3 h-3" />
                          Cancelada
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm">{item.hired}</td>
                    <td className="p-3 text-center text-sm">{item.duration}</td>
                    <td className="p-3 text-center text-sm text-gray">{item.closedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
