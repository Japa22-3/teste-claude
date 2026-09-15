import { useState, type Dispatch, type SetStateAction } from "react";
import { Sidebar, type SidebarItem } from "../components/Sidebar";
import { Btn, Card, Field, Select, StarRating, Textarea, TextInput } from "../components/ui";
import { driverProfile, maintenanceItems, ratings, students, vehicleDocuments } from "../data/mockData";
import { SHIFT_LABEL, type Notice, type RouteShift } from "../types";
import { getMaintenanceAlerts } from "../lib/finance";
import { formatBRL } from "../lib/currency";
import { DEMO_TODAY, daysBetweenISO, formatDateBR, toISODate } from "../lib/dates";

const todayISO = toISODate(DEMO_TODAY);

export const DriverNotices = ({
  onSidebarNav, notices, setNotices, dark, onToggleDark,
}: {
  onSidebarNav: (i: SidebarItem) => void;
  notices: Notice[];
  setNotices: Dispatch<SetStateAction<Notice[]>>;
  dark: boolean;
  onToggleDark: () => void;
}) => {
  const [form, setForm] = useState({ title: "", message: "", audience: "todos" as Notice["audience"] });
  const alerts = getMaintenanceAlerts(maintenanceItems, driverProfile.odometerKm, DEMO_TODAY);
  const avgRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length : null;

  const handlePublish = () => {
    if (!form.title || !form.message) return;
    setNotices((prev) => [{ id: Date.now(), title: form.title, message: form.message, audience: form.audience, createdAt: todayISO }, ...prev]);
    setForm({ title: "", message: "", audience: "todos" });
  };

  const audienceLabel = (a: Notice["audience"]) => (a === "todos" ? "Todos os alunos" : SHIFT_LABEL[a as RouteShift]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ width: 1440, fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar active="avisos" onNavigate={onSidebarNav} dark={dark} onToggleDark={onToggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <h1 className="text-xl font-700 text-slate-900">Avisos & Van</h1>
          <p className="text-sm text-slate-500">Mural de recados, manutenção e o que os responsáveis estão achando do serviço</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Mural */}
            <div className="col-span-2 space-y-5">
              <Card className="p-5">
                <h3 className="text-sm font-700 text-slate-700 mb-4">Publicar aviso</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Field label="Título"><TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex: Troca de horário na sexta" /></Field>
                    </div>
                    <Field label="Para quem">
                      <Select value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value as Notice["audience"] }))}>
                        <option value="todos">Todos os alunos</option>
                        <option value="matutino">Turno matutino</option>
                        <option value="vespertino">Turno vespertino</option>
                        <option value="integral">Turno integral</option>
                      </Select>
                    </Field>
                  </div>
                  <Field label="Mensagem"><Textarea rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="O que os responsáveis precisam saber..." /></Field>
                  <div className="flex justify-end"><Btn variant="primary" onClick={handlePublish}>Publicar no mural</Btn></div>
                </div>
              </Card>

              {notices.map((n) => (
                <Card key={n.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {n.pinned && <span className="text-xs">📌</span>}
                      <h4 className="text-sm font-700 text-slate-900">{n.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{audienceLabel(n.audience)}</span>
                      <button onClick={() => setNotices((prev) => prev.filter((x) => x.id !== n.id))} className="text-slate-300 hover:text-red-500 cursor-pointer border-0 bg-transparent text-lg leading-none">×</button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-3">Publicado em {formatDateBR(n.createdAt)}</p>
                </Card>
              ))}
            </div>

            {/* Van health */}
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="text-sm font-700 text-slate-700 mb-1">A van</h3>
                <p className="text-xs text-slate-400 mb-4">{driverProfile.vehicleModel} · {driverProfile.plate}</p>
                <div className="text-2xl font-700 text-slate-900 tabular-nums">{driverProfile.odometerKm.toLocaleString("pt-BR")} km</div>
                <p className="text-xs text-slate-400">Odômetro atual</p>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-700 text-slate-700 mb-3">Manutenção</h3>
                <div className="space-y-3">
                  {alerts.map(({ item, dueInKm, dueInDays, urgent }) => (
                    <div key={item.id} className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-500 text-slate-700">{item.name}</div>
                        <div className="text-[11px] text-slate-400">Última: {formatDateBR(item.lastDoneDate)}</div>
                      </div>
                      <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full flex-shrink-0 ${urgent ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                        {dueInKm != null ? `${Math.max(0, dueInKm).toLocaleString("pt-BR")} km` : `${dueInDays} dias`}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-700 text-slate-700 mb-3">Documentos</h3>
                <div className="space-y-3">
                  {vehicleDocuments.map((doc) => {
                    const days = daysBetweenISO(todayISO, doc.dueDate);
                    return (
                      <div key={doc.id} className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-500 text-slate-700 truncate">{doc.name}</div>
                          <div className="text-[11px] text-slate-400">{formatDateBR(doc.dueDate)}{doc.renewalCost ? ` · ${formatBRL(doc.renewalCost)}` : ""}</div>
                        </div>
                        <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full flex-shrink-0 ${days < 0 ? "bg-red-50 text-red-700" : days <= 30 ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                          {days < 0 ? "Vencido" : `${days}d`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-700 text-slate-700 mb-1">Avaliações</h3>
                {avgRating && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating value={Math.round(avgRating)} size={16} />
                    <span className="text-sm font-700 text-slate-900">{avgRating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">({ratings.length})</span>
                  </div>
                )}
                <div className="space-y-3">
                  {ratings.map((r) => {
                    const student = students.find((s) => s.id === r.studentId);
                    return (
                      <div key={r.id} className="border-b border-slate-50 last:border-0 pb-2.5 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating value={r.score} size={11} />
                          <span className="text-[11px] text-slate-400">{student?.guardianName}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{r.comment}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
