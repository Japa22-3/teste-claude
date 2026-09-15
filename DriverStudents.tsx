import { useState, type Dispatch, type SetStateAction } from "react";
import { Sidebar, type SidebarItem } from "../components/Sidebar";
import { Avatar, Btn, Card, EmptyState, Field, Select, StarRating, TextInput } from "../components/ui";
import { driverProfile, ratings, waitlist as seedWaitlist } from "../data/mockData";
import { SHIFT_LABEL, type RouteShift, type Student, type WaitlistEntry } from "../types";
import { formatPhoneBR } from "../lib/finance";
import { formatBRL } from "../lib/currency";
import { formatDateBR } from "../lib/dates";

type SetStudents = Dispatch<SetStateAction<Student[]>>;

const emptyForm = {
  name: "", guardianName: "", phone: "", school: "", shift: "matutino" as RouteShift,
  pickupAddress: "", dropoffAddress: "", pickupTime: "07:00", dropoffTime: "07:30",
  planValue: "300", dueDay: "10",
};

const StudentCard = ({ student }: { student: Student }) => {
  const [open, setOpen] = useState(false);
  const myRatings = ratings.filter((r) => r.studentId === student.id);
  const avgRating = myRatings.length > 0 ? myRatings.reduce((s, r) => s + r.score, 0) / myRatings.length : null;

  return (
    <Card className="overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer border-0 bg-transparent text-left hover:bg-slate-50/60">
        <Avatar initials={student.avatar} tone="blue" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-600 text-slate-900">{student.name}</div>
          <div className="text-xs text-slate-400">{student.school} · {SHIFT_LABEL[student.shift]} · {formatBRL(student.planValue)}/mês</div>
        </div>
        {avgRating && <span className="text-xs font-600 text-amber-600 flex-shrink-0">★ {avgRating.toFixed(1)}</span>}
        <span className={`text-slate-300 text-xs transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}>▸</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-50 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-xs text-slate-400 mb-0.5">Responsável</div><div className="text-slate-700">{student.guardianName}</div></div>
            <div><div className="text-xs text-slate-400 mb-0.5">Telefone</div><div className="text-slate-700">{formatPhoneBR(student.phone)}</div></div>
            <div><div className="text-xs text-slate-400 mb-0.5">Embarque</div><div className="text-slate-700">{student.pickupAddress} · {student.pickupTime}</div></div>
            <div><div className="text-xs text-slate-400 mb-0.5">Desembarque</div><div className="text-slate-700">{student.dropoffAddress} · {student.dropoffTime}</div></div>
            <div><div className="text-xs text-slate-400 mb-0.5">Aluno desde</div><div className="text-slate-700">{formatDateBR(student.joinedAt)}</div></div>
            <div><div className="text-xs text-slate-400 mb-0.5">Mensalidade</div><div className="text-slate-700">{formatBRL(student.planValue)} · vence dia {student.dueDay}</div></div>
          </div>

          <div>
            <div className="text-xs font-600 text-slate-500 mb-2">Documentos</div>
            <div className="flex flex-wrap gap-2">
              {student.documents.map((d) => (
                <span key={d.id} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">📎 {d.name}</span>
              ))}
            </div>
          </div>

          {myRatings.length > 0 && (
            <div>
              <div className="text-xs font-600 text-slate-500 mb-2">Avaliações do responsável</div>
              {myRatings.map((r) => (
                <div key={r.id} className="text-xs text-slate-500 mb-1">
                  <StarRating value={r.score} size={12} /> <span className="ml-1">{r.comment}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export const DriverStudents = ({
  onSidebarNav, students, setStudents, dark, onToggleDark,
}: {
  onSidebarNav: (i: SidebarItem) => void;
  students: Student[];
  setStudents: SetStudents;
  dark: boolean;
  onToggleDark: () => void;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(seedWaitlist);
  const activeCount = students.filter((s) => s.status === "ativo").length;

  const handleAdd = () => {
    if (!form.name || !form.guardianName) return;
    const newStudent: Student = {
      id: Date.now(),
      name: form.name,
      avatar: form.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
      guardianName: form.guardianName,
      phone: form.phone.replace(/\D/g, "") || "5511900000000",
      pickupAddress: form.pickupAddress,
      dropoffAddress: form.dropoffAddress,
      pickupTime: form.pickupTime,
      dropoffTime: form.dropoffTime,
      school: form.school,
      shift: form.shift,
      planValue: parseFloat(form.planValue) || 300,
      dueDay: parseInt(form.dueDay, 10) || 10,
      preferredMethod: "pix",
      status: "ativo",
      joinedAt: new Date().toISOString().slice(0, 10),
      documents: [],
    };
    setStudents((prev) => [...prev, newStudent]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handlePromote = (entry: WaitlistEntry) => {
    setWaitlist((prev) => prev.filter((w) => w.id !== entry.id));
    setStudents((prev) => [...prev, {
      id: Date.now(), name: entry.name, avatar: entry.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
      guardianName: entry.guardianName, phone: entry.phone.replace(/\D/g, ""),
      pickupAddress: "", dropoffAddress: "", pickupTime: "07:00", dropoffTime: "07:30",
      school: "", shift: entry.desiredShift, planValue: 300, dueDay: 10, preferredMethod: "pix",
      status: "ativo", joinedAt: new Date().toISOString().slice(0, 10), documents: [],
    }]);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ width: 1440, fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar active="alunos" onNavigate={onSidebarNav} dark={dark} onToggleDark={onToggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-700 text-slate-900">Alunos</h1>
            <p className="text-sm text-slate-500">{activeCount} de {driverProfile.capacity} vagas ocupadas</p>
          </div>
          <Btn variant="primary" onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "+ Novo aluno"}</Btn>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              {showForm && (
                <Card className="p-5">
                  <h3 className="text-sm font-700 text-slate-700 mb-4">Cadastro completo</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nome do aluno"><TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
                    <Field label="Responsável"><TextInput value={form.guardianName} onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))} /></Field>
                    <Field label="Telefone (WhatsApp)"><TextInput value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="5511987654321" /></Field>
                    <Field label="Escola / Faculdade"><TextInput value={form.school} onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))} /></Field>
                    <Field label="Turno">
                      <Select value={form.shift} onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value as RouteShift }))}>
                        {(Object.entries(SHIFT_LABEL) as [RouteShift, string][]).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </Select>
                    </Field>
                    <Field label="Mensalidade (R$)"><TextInput type="number" value={form.planValue} onChange={(e) => setForm((f) => ({ ...f, planValue: e.target.value }))} /></Field>
                    <Field label="Endereço de embarque"><TextInput value={form.pickupAddress} onChange={(e) => setForm((f) => ({ ...f, pickupAddress: e.target.value }))} /></Field>
                    <Field label="Horário de embarque"><TextInput type="time" value={form.pickupTime} onChange={(e) => setForm((f) => ({ ...f, pickupTime: e.target.value }))} /></Field>
                    <Field label="Endereço de desembarque"><TextInput value={form.dropoffAddress} onChange={(e) => setForm((f) => ({ ...f, dropoffAddress: e.target.value }))} /></Field>
                    <Field label="Dia de vencimento"><TextInput type="number" min={1} max={28} value={form.dueDay} onChange={(e) => setForm((f) => ({ ...f, dueDay: e.target.value }))} /></Field>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Btn variant="primary" onClick={handleAdd}>Salvar aluno</Btn>
                  </div>
                </Card>
              )}
              {students.length === 0
                ? <EmptyState icon="🧒" title="Nenhum aluno cadastrado" />
                : students.map((s) => <StudentCard key={s.id} student={s} />)}
            </div>

            <div>
              <Card className="p-5">
                <h3 className="text-sm font-700 text-slate-700 mb-1">Lista de espera</h3>
                <p className="text-xs text-slate-400 mb-4">{waitlist.length} candidato{waitlist.length !== 1 ? "s" : ""} aguardando vaga</p>
                {waitlist.length === 0
                  ? <p className="text-xs text-slate-400">Nenhum candidato na fila.</p>
                  : waitlist.map((w) => (
                      <div key={w.id} className="flex items-center justify-between gap-2 py-2.5 border-b border-slate-50 last:border-0">
                        <div className="min-w-0">
                          <div className="text-sm font-500 text-slate-800 truncate">{w.name}</div>
                          <div className="text-xs text-slate-400">{SHIFT_LABEL[w.desiredShift]} · desde {formatDateBR(w.requestedAt.slice(0, 10))}</div>
                        </div>
                        <Btn variant="secondary" size="sm" onClick={() => handlePromote(w)} className="flex-shrink-0">Chamar</Btn>
                      </div>
                    ))}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
