"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu de opções */}
      {open && (
        <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl border border-line p-4 w-64 animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-navy text-sm">Fale conosco</p>
            <button onClick={() => setOpen(false)} className="cursor-pointer text-gray hover:text-navy">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray mb-3">Escolha o setor:</p>
          <div className="space-y-2">
            <a
              href="https://wa.me/5511994167331?text=Olá! Gostaria de informações sobre os serviços da SuperAção RH."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-green/5 hover:bg-green/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-navy">Comercial</p>
                <p className="text-xs text-gray">(11) 99416-7331</p>
              </div>
            </a>

            <a
              href="https://wa.me/5511954042488?text=Olá! Gostaria de informações sobre processos de contratação."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-green/5 hover:bg-green/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-navy">Contratação</p>
                <p className="text-xs text-gray">(11) 95404-2488</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5C] shadow-lg flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      </button>
    </div>
  );
}
