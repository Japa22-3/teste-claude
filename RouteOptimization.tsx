import { useState } from "react";
import { Sidebar, type SidebarItem } from "../components/Sidebar";
import { MapBg } from "../components/map";
import { Btn } from "../components/ui";
import type { Student } from "../types";

export const RouteOptimization = ({
  onSidebarNav, students, dark, onToggleDark,
}: {
  onSidebarNav: (item: SidebarItem) => void;
  students: Student[];
  dark: boolean;
  onToggleDark: () => void;
}) => {
  const [showManual, setShowManual] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ width: 1440, fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar active="rotas" onNavigate={onSidebarNav} dark={dark} onToggleDark={onToggleDark} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-700 text-slate-900">Otimização de Rota</h1>
            <p className="text-sm text-slate-500">Rota do dia — 20 ago 2026 · Turno matutino</p>
          </div>
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={showManual} onChange={() => setShowManual((v) => !v)} className="hidden" />
              <div className={`w-10 h-5 rounded-full transition-colors ${showManual ? "bg-slate-300" : "bg-blue-600"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${showManual ? "translate-x-0" : "translate-x-5"}`} />
              </div>
              Mostrar rota manual
            </label>
            <Btn variant="green" size="md">Usar rota otimizada</Btn>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative">
            <div className="absolute inset-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <MapBg />

              {/* Manual route (dashed gray) */}
              {showManual && (
                <svg className="absolute inset-0 w-full h-full z-5" viewBox="0 0 900 550" preserveAspectRatio="none">
                  <path d="M 100 80 L 200 80 L 200 180 L 500 180 L 500 280 L 700 280 L 700 420 L 550 480" stroke="#94A3B8" strokeWidth="3" fill="none" strokeDasharray="10 6" opacity="0.8" />
                  <path d="M 100 80 L 200 80 L 200 180 L 500 180 L 500 280 L 700 280 L 700 420 L 550 480" stroke="#94A3B8" strokeWidth="10" fill="none" opacity="0.08" />
                </svg>
              )}

              {/* Optimized route (solid green) */}
              <svg className="absolute inset-0 w-full h-full z-6" viewBox="0 0 900 550" preserveAspectRatio="none">
                <path d="M 100 80 Q 250 120 350 200 Q 450 280 550 340 Q 620 390 550 480" stroke="#10B981" strokeWidth="3.5" fill="none" opacity="0.9" />
                <path d="M 100 80 Q 250 120 350 200 Q 450 280 550 340 Q 620 390 550 480" stroke="#10B981" strokeWidth="12" fill="none" opacity="0.15" />
              </svg>

              {/* Pins */}
              <div className="absolute" style={{ top: "11%", left: "9%" }}>
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-700 text-xs shadow-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>S</div>
                  <div className="w-0.5 h-3 bg-slate-800" />
                  <div className="text-xs font-600 text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">Saída</div>
                </div>
              </div>

              {[
                { n: 1, top: "22%", left: "30%", name: "Ana C." },
                { n: 2, top: "40%", left: "52%", name: "Bruno F." },
                { n: 3, top: "55%", left: "68%", name: "Camila S." },
                { n: 4, top: "65%", left: "55%", name: "Diego M." },
                { n: 5, top: "75%", left: "40%", name: "Elena R." },
              ].map(({ n, top, left, name }) => (
                <div key={n} className="absolute z-10" style={{ top, left }}>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-700 text-xs shadow-md">{n}</div>
                    <div className="w-0.5 h-2 bg-blue-600" />
                    <div className="text-xs font-600 text-slate-700 bg-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">{name}</div>
                  </div>
                </div>
              ))}

              {/* University destination */}
              <div className="absolute" style={{ top: "82%", left: "57%" }}>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg text-sm">🎓</div>
                  <div className="text-xs font-600 text-purple-700 bg-white px-2 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap">Campus Central</div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute top-4 left-4 bg-white/95 rounded-xl p-3 shadow-md backdrop-blur space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-green-500" />
                  <span className="text-xs text-slate-700 font-500">Rota otimizada</span>
                </div>
                {showManual && (
                  <div className="flex items-center gap-2">
                    <svg width="32" height="4"><line x1="0" y1="2" x2="32" y2="2" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" /></svg>
                    <span className="text-xs text-slate-500">Rota manual</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optimization panel */}
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-y-auto scrollbar-hide">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-700 text-slate-900 mb-4">Comparativo de rotas</h2>

              {/* Optimized */}
              <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-700 text-green-700">✦ Rota otimizada</span>
                  <span className="text-xs bg-green-500 text-white px-2.5 py-0.5 rounded-full font-600">Recomendada</span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-2xl font-700 text-slate-900">12,4</div>
                    <div className="text-xs text-slate-500">km</div>
                  </div>
                  <div>
                    <div className="text-2xl font-700 text-slate-900">28</div>
                    <div className="text-xs text-slate-500">minutos</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 h-2 rounded-full bg-green-200 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "66%" }} />
                  </div>
                </div>
              </div>

              {/* Manual */}
              <div className={`rounded-2xl border border-slate-200 p-4 transition-opacity ${showManual ? "opacity-100" : "opacity-40"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-600 text-slate-600">Rota manual</span>
                  <svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 3" /></svg>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-2xl font-700 text-slate-400">18,7</div>
                    <div className="text-xs text-slate-400">km</div>
                  </div>
                  <div>
                    <div className="text-2xl font-700 text-slate-400">41</div>
                    <div className="text-xs text-slate-400">minutos</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-700 text-slate-700 mb-4">Economia estimada</h3>
              <div className="space-y-3">
                {[
                  { label: "Distância poupada", value: "6,3 km", sub: "−33,7%", color: "text-green-600" },
                  { label: "Tempo economizado", value: "13 min", sub: "−31,7%", color: "text-green-600" },
                  { label: "Combustível est.", value: "R$ 4,72", sub: "menos por corrida", color: "text-blue-600" },
                  { label: "CO₂ evitado", value: "0,9 kg", sub: "por trajeto", color: "text-emerald-600" },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">{label}</span>
                    <div className="text-right">
                      <div className={`text-sm font-700 ${color}`}>{value}</div>
                      <div className="text-xs text-slate-400">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Esses R$ 4,72 por corrida aparecem somados na aba <span className="font-600 text-slate-500">Financeiro → Visão geral</span> como economia real de combustível no mês.
              </p>
            </div>

            {/* Stop order */}
            <div className="p-6">
              <h3 className="text-sm font-700 text-slate-700 mb-4">Ordem das paradas</h3>
              <div className="space-y-3">
                {[
                  { n: "S", label: "Ponto de partida", sub: "R. Marechal Rondon, 88", color: "bg-slate-800" },
                  { n: "1", label: "Ana Carolina Lima", sub: "R. das Flores, 142", color: "bg-blue-600" },
                  { n: "2", label: "Bruno Ferreira", sub: "Av. Brasil, 880", color: "bg-blue-600" },
                  { n: "3", label: "Camila Souza", sub: "R. Dom Pedro, 55", color: "bg-blue-600" },
                  { n: "4", label: "Diego Martins", sub: "Av. Paulista, 1200", color: "bg-blue-600" },
                  { n: "5", label: "Elena Rocha", sub: "R. XV de Novembro, 300", color: "bg-blue-600" },
                  { n: "🎓", label: "Campus Central", sub: "Destino final", color: "bg-purple-600" },
                ].map(({ n, label, sub, color }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full ${color} text-white flex items-center justify-center text-xs font-700 flex-shrink-0 mt-0.5`}>{n}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-500 text-slate-800 leading-tight">{label}</div>
                      <div className="text-xs text-slate-400 truncate">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
