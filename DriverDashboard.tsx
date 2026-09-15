import { useState } from "react";
import { Sidebar, type SidebarItem } from "../components/Sidebar";
import { MapBg, MapPin, VanIcon } from "../components/map";
import { Avatar, Btn, Checkbox, StatusBadge } from "../components/ui";
import { students } from "../data/mockData";
import type { AbsenceNotice, Payment } from "../types";
import { getMonthSummary } from "../lib/finance";
import { formatBRL } from "../lib/currency";
import { DEMO_TODAY, formatFullWeekday, toISODate } from "../lib/dates";

const CURRENT_MONTH = "2026-08";
const initialCheckins = { 2: true, 4: true, 5: true } as Record<number, boolean>;

export const DriverDashboard = ({
  onNav, onSidebarNav, payments, absences, dark, onToggleDark,
}: {
  onNav: (s: number) => void;
  onSidebarNav: (item: SidebarItem) => void;
  payments: Payment[];
  absences: AbsenceNotice[];
  dark: boolean;
  onToggleDark: () => void;
}) => {
  const [checkins, setCheckins] = useState<Record<number, boolean>>(
    Object.fromEntries(students.map((s) => [s.id, initialCheckins[s.id] ?? false])),
  );
  const [routeActive, setRouteActive] = useState(true);
  const activeCount = Object.values(checkins).filter(Boolean).length;
  const finance = getMonthSummary(payments, CURRENT_MONTH);
  const todayISO = toISODate(DEMO_TODAY);
  const todaysAbsences = absences.filter((a) => a.date === todayISO);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ width: 1440, fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar active="inicio" onNavigate={onSidebarNav} dark={dark} onToggleDark={onToggleDark} />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-700 text-slate-900">Painel do Motorista</h1>
            <p className="text-sm text-slate-500">{formatFullWeekday(DEMO_TODAY)} — Rota matutina</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge label={routeActive ? "Rota ativa" : "Rota pausada"} active={routeActive} />
            <Btn variant="green" size="lg" onClick={() => { setRouteActive(!routeActive); onNav(2); }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-2">
                <polygon points="3,2 13,8 3,14" fill="white" />
              </svg>
              {routeActive ? "Em andamento" : "Iniciar Rota"}
            </Btn>
          </div>
        </div>

        {/* Finance alert strip — real numbers from the same data Financeiro uses */}
        {finance.atrasadoCount > 0 && (
          <button
            onClick={() => onSidebarNav("financeiro")}
            className="w-full flex items-center justify-between px-8 py-2.5 bg-red-50 border-b border-red-100 text-left cursor-pointer border-0"
          >
            <span className="text-sm text-red-700">
              <span className="font-700">{finance.atrasadoCount} mensalidade{finance.atrasadoCount > 1 ? "s" : ""} em atraso</span>
              {" "}— {formatBRL(finance.atrasado)} em aberto
            </span>
            <span className="text-sm font-600 text-red-700">Ver Financeiro →</span>
          </button>
        )}
        {todaysAbsences.length > 0 && (
          <div className="w-full flex items-center gap-2 px-8 py-2 bg-blue-50 border-b border-blue-100 text-sm text-blue-700">
            <span>ℹ️</span>
            {todaysAbsences.map((a) => students.find((s) => s.id === a.studentId)?.name).join(", ")} avisou que não vai de van hoje — rota pode pular essa parada.
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Map area */}
          <div className="flex-1 relative">
            <div className="absolute inset-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <MapBg />
              <VanIcon style={{ top: "44%", left: "40%" }} />
              <MapPin n={1} style={{ top: "22%", left: "58%" }} color="#10B981" />
              <MapPin n={2} style={{ top: "60%", left: "22%" }} color="#1A3FD4" />
              <MapPin n={3} style={{ top: "70%", left: "65%" }} color="#1A3FD4" />
              <MapPin n={4} style={{ top: "18%", left: "25%" }} color="#10B981" />
              <svg className="absolute inset-0 w-full h-full z-5" viewBox="0 0 700 500" preserveAspectRatio="none">
                <path d="M 175 90 Q 250 130 280 220 Q 310 300 420 320 Q 490 335 455 350" stroke="#10B981" strokeWidth="3" fill="none" opacity="0.8" />
                <path d="M 175 90 Q 250 130 280 220 Q 310 300 420 320 Q 490 335 455 350" stroke="#10B981" strokeWidth="8" fill="none" opacity="0.15" />
              </svg>
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {["+", "−", "⊕"].map((c) => (
                  <button key={c} className="w-9 h-9 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 font-600 hover:bg-slate-50 flex items-center justify-center text-sm cursor-pointer border-0">{c}</button>
                ))}
              </div>
              {/* Route info pill */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-md border border-slate-100 flex items-center gap-4">
                <div>
                  <div className="text-xs text-slate-500">Distância</div>
                  <div className="text-sm font-700 text-slate-900">12,4 km</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-xs text-slate-500">Tempo est.</div>
                  <div className="text-sm font-700 text-slate-900">28 min</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-xs text-slate-500">Alunos</div>
                  <div className="text-sm font-700 text-green-600">{activeCount}/{students.length} embarcados</div>
                </div>
              </div>
            </div>
          </div>

          {/* Students panel */}
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-700 text-slate-900">Lista de alunos</h2>
                <span className="text-xs bg-blue-50 text-blue-600 font-600 px-2.5 py-1 rounded-full">{students.length} alunos</span>
              </div>
              <p className="text-xs text-slate-400">{activeCount} embarcados — {students.length - activeCount} aguardando</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {students.map((s) => {
                const absentToday = todaysAbsences.some((a) => a.studentId === s.id);
                return (
                  <div key={s.id} className={`flex items-start gap-3 px-5 py-4 border-b border-slate-50 transition-colors ${absentToday ? "opacity-50" : checkins[s.id] ? "bg-green-50/50" : "hover:bg-slate-50"}`}>
                    <Avatar initials={s.avatar} tone={checkins[s.id] ? "green" : "blue"} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-600 text-slate-900 leading-tight">{s.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{absentToday ? "Não vai hoje (avisou)" : s.pickupAddress}</div>
                    </div>
                    {!absentToday && (
                      <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                        <Checkbox checked={checkins[s.id]} onChange={() => setCheckins((prev) => ({ ...prev, [s.id]: !prev[s.id] }))} />
                        <span className={`text-xs font-500 ${checkins[s.id] ? "text-green-600" : "text-slate-400"}`}>
                          {checkins[s.id] ? "Embarcou" : "Embarcar"}
                        </span>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Btn variant="secondary" size="sm" className="w-full justify-center" onClick={() => onNav(4)}>
                Ver otimização de rota →
              </Btn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
