"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Search, Building2, Mail, Phone } from "lucide-react";

const mockPartners = [
  { id: 1, company: "Tech Corp", contact: "Carlos Mendes", email: "carlos@techcorp.com", phone: "(11) 99999-1111", jobs: 3, city: "São Paulo, SP" },
  { id: 2, company: "Inova SA", contact: "Fernanda Lima", email: "fernanda@inovasa.com", phone: "(11) 98888-2222", jobs: 2, city: "São Paulo, SP" },
  { id: 3, company: "Grupo Beta", contact: "Ricardo Alves", email: "ricardo@grupobeta.com", phone: "(19) 97777-3333", jobs: 1, city: "Campinas, SP" },
  { id: 4, company: "Alpha Ltda", contact: "Marina Costa", email: "marina@alpha.com", phone: "(11) 96666-4444", jobs: 2, city: "São Paulo, SP" },
];

export default function ParceirosPage() {
  return (
    <>
      <DashboardHeader title="Parceiros" subtitle="Empresas clientes da SuperAção RH" />

      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
            <input
              type="text"
              placeholder="Buscar parceiros..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Novo parceiro
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPartners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy">{partner.company}</h3>
                  <p className="text-sm text-gray">{partner.contact}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="flex items-center gap-2 text-xs text-gray">
                      <Mail className="w-3 h-3" /> {partner.email}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray">
                      <Phone className="w-3 h-3" /> {partner.phone}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-line flex justify-between items-center">
                    <span className="text-xs text-gray">{partner.city}</span>
                    <span className="text-xs font-bold text-navy">{partner.jobs} vagas ativas</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
