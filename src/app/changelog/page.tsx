"use client"; // Necessário para useState e handlers de clique

import React, { useState } from 'react'; // Removido 'useEffect' que não era usado
import Link from 'next/link';
import Timeline from '@/components/ui/Timeline'; // Ajuste o caminho se necessário

// Importar os componentes shadcn/ui que você instalou
import { Button } from "@/components/ui/button";
// Removidos Calendar, Popover
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from 'lucide-react'; // Removido CalendarIcon
import { cn } from "@/lib/utils"; // Utilitário do shadcn
// Removido format de date-fns

// Tags padrão para os filtros (deve corresponder ao seu adicionar_evento.html)
const defaultMainTags = ['ALL', 'DEV', 'DESIGN', 'DOCS', 'COMMUNITY', 'MARKETING', 'META'];
const defaultSecondaryTags = ['ALL', 'NEW', 'UPDATE', 'FIX', 'REFACTOR', 'RELEASE', 'POST', 'INIT', 'WIP'];


export default function ChangelogPage() {
  // --- Estados para os Filtros ---
  const [filterMainTag, setFilterMainTag] = useState<string | null>(null);
  const [filterSecondaryTag, setFilterSecondaryTag] = useState<string | null>(null);
  // const [filterDate, setFilterDate] = useState<Date | null>(null); // REMOVIDO
  // const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false); // REMOVIDO

  // --- Handlers para os Filtros ---
  const handleMainTagChange = (value: string) => {
    setFilterMainTag(value === 'ALL' ? null : value);
  };

  const handleSecondaryTagChange = (value: string) => {
    setFilterSecondaryTag(value === 'ALL' ? null : value);
  };

  // handleDateSelect REMOVIDO

  const clearFilters = () => {
    setFilterMainTag(null);
    setFilterSecondaryTag(null);
    // setFilterDate(null); // REMOVIDO
  };

  const hasActiveFilters = filterMainTag || filterSecondaryTag; // REMOVIDO filterDate

  return (
    // Fundo mais escuro e gradiente mais sutil
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-16 bg-gradient-to-br from-gray-900 via-black to-gray-900/80 text-gray-300">
      <div className="w-full max-w-3xl">
          <header className="text-center mb-12 md:mb-16">
              {/* Título com gradiente mais vibrante */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                LIT Changelog
              </h1>
              <p className="text-lg text-gray-400">Follow the project&apos;s evolution, step by step.</p>
                <Link href="/" className="mt-6 inline-block text-blue-400 hover:text-blue-300 transition duration-200 text-sm">
                  ← Back to Home
                </Link>
          </header>

          {/* --- SEÇÃO DE FILTROS (SIMPLIFICADA) --- */}
          <div className="mb-10 p-4 rounded-lg glass-card flex flex-wrap items-center justify-center gap-4 md:gap-6 bg-gray-800/30">
              <Filter size={20} className="text-gray-500 hidden md:block" />

              {/* Filtro Main Tag */}
              <Select onValueChange={handleMainTagChange} value={filterMainTag ?? 'ALL'}>
                  <SelectTrigger className="w-[150px] bg-gray-900/50 border-gray-700 text-gray-300 text-xs h-9">
                      <SelectValue placeholder="Main Tag" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-gray-300">
                      {defaultMainTags.map(tag => (
                          <SelectItem key={tag} value={tag} className="text-xs focus:bg-gray-700">{tag}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>

              {/* Filtro Secondary Tag */}
              <Select onValueChange={handleSecondaryTagChange} value={filterSecondaryTag ?? 'ALL'}>
                  <SelectTrigger className="w-[150px] bg-gray-900/50 border-gray-700 text-gray-300 text-xs h-9">
                      <SelectValue placeholder="Secondary Tag" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-gray-300">
                      {defaultSecondaryTags.map(tag => (
                          <SelectItem key={tag} value={tag} className="text-xs focus:bg-gray-700">{tag}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>

              {/* Filtro de Data Removido */}

              {/* Botão Limpar Filtros */}
              {hasActiveFilters && (
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 h-9 px-2 text-xs"
                      title="Clear Filters"
                  >
                      <X size={16} />
                  </Button>
              )}
          </div>
          {/* --- Fim da Seção de Filtros --- */}


          {/* Passa os estados dos filtros para o componente Timeline */}
          <Timeline
              filterTags={{ main: filterMainTag, secondary: filterSecondaryTag }}
              filterDate={null} // Passa null para o filtro de data
          />

      </div>
        <footer className="mt-16 text-center text-gray-500 text-xs">
            LIT Project - {new Date().getFullYear()}
        </footer>
    </main>
  );
}

