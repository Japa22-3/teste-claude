import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sidebar, type SidebarItem } from "../components/Sidebar";
import { Avatar, Btn, Card, EmptyState, Field, FileDropSim, PaymentStatusPill, Select, TextInput } from "../components/ui";
import { PixPayment } from "../components/PixPayment";
import { driverProfile, maintenanceItems, vehicleDocuments } from "../data/mockData";
import { EXPENSE_CATEGORY_META, PAYMENT_METHOD_LABEL, type Expense, type ExpenseCategory, type Payment, type PaymentMethod, type Student } from "../types";
import {
  buildChargeWhatsAppLink, formatPhoneBR, getAvailableMonths, getCategoryBreakdown, getCostSplitSuggestion,
  getExpensesForMonth, getFinancialTrend, getForecast, getFuelEfficiency, getMaintenanceAlerts,
  getMonthSummary, getOccupancy, getStudentPayments, estimateFuelSavingsSoFar, sumExpenses,
} from "../lib/finance";
import { formatBRL, formatSigned } from "../lib/currency";
import { DEMO_TODAY, daysBetweenISO, formatDateBR, formatMonthLabel, formatMonthShort, toISODate } from "../lib/dates";

export type FinanceTab = "overview" | "mensalidades" | "despesas";

type SetPayments = Dispatch<SetStateAction<Payment[]>>;
type SetExpenses = Dispatch<SetStateAction<Expense[]>>;
type SetStudents = Dispatch<SetStateAction<Student[]>>;

const todayISO = toISODate(DEMO_TODAY);

// ─── Small shared pieces ────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, tone = "slate" }: { label: string; value: string; sub?: string; tone?: "green" | "amber" | "red" | "slate" }) => {
  const tones = { green: "text-green-700 bg-green-50", amber: "text-amber-700 bg-amber-50", red: "text-red-700 bg-red-50", slate: "text-slate-500 bg-slate-100" };
  return (
    <Card className="p-5">
      <div className="text-xs font-600 text-slate-500 mb-2">{label}</div>
      <div className="text-2xl font-700 text-slate-900 tabular-nums truncate">{value}</div>
      {sub && <div className={`inline-block mt-2 text-xs font-600 px-2 py-0.5 rounded-full ${tones[tone]}`}>{sub}</div>}
    </Card>
  );
};

const AlertRow = ({ tone, text }: { tone: "red" | "amber" | "green" | "blue"; text: string }) => {
  const dots = { red: "bg-red-500", amber: "bg-amber-500", green: "bg-green-500", blue: "bg-blue-500" };
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-slate-50 last:border-0">
      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dots[tone]}`} />
      <span className="text-sm text-slate-600 leading-snug">{text}</span>
    </div>
  );
};

// ─── Visão geral ────────────────────────────────────────────────────────────

const OverviewPanel = ({ students, payments, expenses, selectedMonth, isCurrentMonth }: {
  students: Student[]; payments: Payment[]; expenses: Expense[]; selectedMonth: string; isCurrentMonth: boolean;
}) => {
  const summary = getMonthSummary(payments, selectedMonth);
  const monthExpenses = getExpensesForMonth(expenses, selectedMonth);
  const monthExpenseTotal = sumExpenses(monthExpenses);
  const forecast = getForecast(summary);
  const activeStudents = students.filter((s) => s.status === "ativo");
  const occupancy = getOccupancy(activeStudents.length, driverProfile.capacity);
  const trend = getFinancialTrend(payments, expenses);
  const efficiency = getFuelEfficiency(expenses);
  const maintenanceAlerts = getMaintenanceAlerts(maintenanceItems, driverProfile.odometerKm, DEMO_TODAY).filter((a) => a.urgent);
  const fuelSavings = estimateFuelSavingsSoFar(`${selectedMonth}-01`, isCurrentMonth ? todayISO : `${selectedMonth}-28`);

  const alerts: { tone: "red" | "amber" | "green" | "blue"; text: string }[] = [];
  if (summary.atrasadoCount > 0) {
    alerts.push({ tone: "red", text: `${summary.atrasadoCount} aluno${summary.atrasadoCount > 1 ? "s" : ""} inadimplente${summary.atrasadoCount > 1 ? "s" : ""} somando ${formatBRL(summary.atrasado)} em atraso.` });
  }
  for (const doc of vehicleDocuments) {
    const days = daysBetweenISO(todayISO, doc.dueDate);
    if (days < 0) alerts.push({ tone: "red", text: `${doc.name} está vencido desde ${formatDateBR(doc.dueDate)}.` });
    else if (days <= 30) alerts.push({ tone: "amber", text: `${doc.name} vence em ${days} dias (${formatDateBR(doc.dueDate)}).` });
  }
  for (const m of maintenanceAlerts) {
    alerts.push({ tone: "amber", text: `${m.item.name}: ${m.dueInKm != null ? `faltam ${Math.max(0, m.dueInKm).toLocaleString("pt-BR")} km` : `vence em ${m.dueInDays} dias`}.` });
  }
  alerts.push({ tone: "green", text: `Rotas otimizadas já pouparam cerca de ${formatBRL(fuelSavings)} em combustível neste mês.` });
  if (efficiency) alerts.push({ tone: "blue", text: `Consumo médio da van: ${efficiency.avgKmPerLiter.toFixed(1)} km/l (${formatBRL(efficiency.avgCostPerKm)} por km rodado).` });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <KpiCard label="Recebido" value={formatBRL(summary.recebido)} sub={`${summary.pagoCount} de ${summary.studentCount} alunos`} tone="green" />
        <KpiCard label="A receber" value={formatBRL(summary.pendente)} sub={`${summary.pendenteCount} não vencidos`} tone="amber" />
        <KpiCard label="Inadimplentes" value={formatBRL(summary.atrasado)} sub={summary.atrasadoCount > 0 ? `${summary.atrasadoCount} alunos` : "Nenhum 🎉"} tone={summary.atrasadoCount > 0 ? "red" : "green"} />
        <KpiCard label="Despesas do mês" value={formatBRL(monthExpenseTotal)} tone="slate" />
        <KpiCard label="Saldo até agora" value={formatSigned(summary.recebido - monthExpenseTotal)} sub={isCurrentMonth ? "mês em andamento" : "mês fechado"} tone={summary.recebido - monthExpenseTotal >= 0 ? "green" : "red"} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-5">
          <h3 className="text-sm font-700 text-slate-700 mb-1">Previsão de recebimento — {formatMonthLabel(selectedMonth)}</h3>
          <p className="text-xs text-slate-400 mb-4">Dois cenários, não um número "mágico" único</p>
          <div className="flex gap-8">
            <div>
              <div className="text-xs text-slate-500 mb-1">Conservadora (recebido + a receber)</div>
              <div className="text-xl font-700 text-slate-900 tabular-nums">{formatBRL(forecast.conservative)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Otimista (se ninguém ficar em atraso)</div>
              <div className="text-xl font-700 text-green-600 tabular-nums">{formatBRL(forecast.optimistic)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-700 text-slate-700 mb-3">Ocupação da van</h3>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-700 text-slate-900">{occupancy.occupied}<span className="text-sm text-slate-400">/{occupancy.capacity}</span></span>
            <span className="text-xs font-600 text-blue-600">{occupancy.percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${occupancy.percent}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-2">{occupancy.vacancies} vaga{occupancy.vacancies !== 1 ? "s" : ""} livre{occupancy.vacancies !== 1 ? "s" : ""}</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-5">
          <h3 className="text-sm font-700 text-slate-700 mb-4">Avisos e oportunidades</h3>
          <div>{alerts.map((a, i) => <AlertRow key={i} tone={a.tone} text={a.text} />)}</div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-700 text-slate-700 mb-3">Documentos do veículo</h3>
          <div className="space-y-3">
            {vehicleDocuments.map((doc) => {
              const days = daysBetweenISO(todayISO, doc.dueDate);
              const status = days < 0 ? { label: "Vencido", tone: "bg-red-500" } : days <= 30 ? { label: "Vence em breve", tone: "bg-amber-500" } : { label: "Em dia", tone: "bg-green-500" };
              return (
                <div key={doc.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-500 text-slate-700 truncate">{doc.name}</div>
                    <div className="text-[11px] text-slate-400">Vence {formatDateBR(doc.dueDate)}</div>
                  </div>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status.tone}`} title={status.label} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-700 text-slate-700 mb-1">Recebido vs. despesas</h3>
        <p className="text-xs text-slate-400 mb-2">Evolução mensal — {trend.length} meses de histórico</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trend} margin={{ left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} tickFormatter={(v: number) => formatBRL(v, { compact: true })} width={70} />
            <Tooltip formatter={(v) => formatBRL(Number(v) || 0)} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="recebido" name="Recebido" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={48} />
            <Bar dataKey="despesas" name="Despesas" fill="#94A3B8" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

// ─── Mensalidades ───────────────────────────────────────────────────────────

const StudentPaymentRow = ({ student, payment, history, expanded, onToggleExpand, onMarkPaid, onSavePlan }: {
  student: Student; payment: Payment; history: Payment[]; expanded: boolean;
  onToggleExpand: () => void; onMarkPaid: () => void;
  onSavePlan: (planValue: number, dueDay: number, method: PaymentMethod) => void;
}) => {
  const [editValue, setEditValue] = useState(String(student.planValue));
  const [editDueDay, setEditDueDay] = useState(String(student.dueDay));
  const [editMethod, setEditMethod] = useState<PaymentMethod>(student.preferredMethod);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSavePlan(parseFloat(editValue) || student.planValue, parseInt(editDueDay, 10) || student.dueDay, editMethod);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="border-b border-slate-50 last:border-0">
      <div className="grid [grid-template-columns:2fr_1fr_1fr_1fr_1.6fr] gap-4 px-5 py-3.5 items-center hover:bg-slate-50/60 transition-colors">
        <button onClick={onToggleExpand} className="flex items-center gap-3 text-left cursor-pointer border-0 bg-transparent min-w-0">
          <span className={`text-slate-300 text-xs transition-transform inline-block ${expanded ? "rotate-90" : ""}`}>▸</span>
          <Avatar initials={student.avatar} tone={payment.status === "pago" ? "green" : "blue"} size="sm" />
          <span className="text-sm font-600 text-slate-800 truncate">{student.name}</span>
        </button>
        <span className="text-sm text-slate-600 tabular-nums">{formatBRL(student.planValue)}</span>
        <span className="text-sm text-slate-500 tabular-nums">{formatDateBR(payment.dueDate)}</span>
        <PaymentStatusPill status={payment.status} />
        <div className="flex justify-end gap-2">
          {payment.status === "pago" ? (
            <span className="text-xs text-slate-400">via {payment.method ? PAYMENT_METHOD_LABEL[payment.method] : "—"} · {payment.paidDate ? formatDateBR(payment.paidDate) : ""}</span>
          ) : (
            <>
              <a href={buildChargeWhatsAppLink(student, payment, driverProfile)} target="_blank" rel="noreferrer" className="text-xs font-600 text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full no-underline">Enviar lembrete</a>
              <button onClick={onMarkPaid} className="text-xs font-600 text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full cursor-pointer border-0">Marcar pago</button>
            </>
          )}
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-5 pl-12 bg-slate-50/50">
          <div className="text-xs font-600 text-slate-500 mb-2 pt-3">Histórico mês a mês</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {history.map((h) => <PaymentStatusPill key={h.referenceMonth} status={h.status} detail={formatMonthShort(h.referenceMonth)} />)}
          </div>
          <div className="text-xs text-slate-400 mb-4">{student.guardianName} · {formatPhoneBR(student.phone)}</div>

          <div className="text-xs font-600 text-slate-500 mb-2">Cadastro de mensalidade</div>
          <div className="grid grid-cols-4 gap-3 items-end max-w-xl">
            <Field label="Valor (R$)"><TextInput type="number" step="0.01" value={editValue} onChange={(e) => setEditValue(e.target.value)} /></Field>
            <Field label="Dia de vencimento">
              <Select value={editDueDay} onChange={(e) => setEditDueDay(e.target.value)}>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Forma preferida">
              <Select value={editMethod} onChange={(e) => setEditMethod(e.target.value as PaymentMethod)}>
                {(Object.entries(PAYMENT_METHOD_LABEL) as [PaymentMethod, string][]).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </Select>
            </Field>
            <Btn variant={saved ? "green" : "secondary"} size="sm" onClick={handleSave}>{saved ? "Salvo ✓" : "Salvar"}</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

const MensalidadesPanel = ({ students, payments, selectedMonth, setPayments, setStudents }: {
  students: Student[]; payments: Payment[]; selectedMonth: string; setPayments: SetPayments; setStudents: SetStudents;
}) => {
  const [statusFilter, setStatusFilter] = useState<"todos" | "pago" | "pendente" | "atrasado">("todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [pixConfig, setPixConfig] = useState({ pixKey: driverProfile.pixKey, merchantName: driverProfile.name, merchantCity: driverProfile.city });

  const summary = getMonthSummary(payments, selectedMonth);
  const rows = students
    .map((student) => ({ student, payment: payments.find((p) => p.studentId === student.id && p.referenceMonth === selectedMonth) }))
    .filter((r): r is { student: Student; payment: Payment } => !!r.payment)
    .filter((r) => statusFilter === "todos" || r.payment.status === statusFilter)
    .filter((r) => r.student.name.toLowerCase().includes(search.toLowerCase()));

  const handleMarkPaid = (paymentId: number) => {
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "pago", paidDate: todayISO, method: p.method ?? "pix" } : p)));
  };

  const handleSavePlan = (studentId: number, planValue: number, dueDay: number, method: PaymentMethod) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, planValue, dueDay, preferredMethod: method } : s)));
  };

  const handleExportCsv = () => {
    const header = "Aluno;Responsável;Valor;Vencimento;Status;Pago em;Forma\n";
    const csvRows = rows.map(({ student, payment }) =>
      `${student.name};${student.guardianName};${payment.amount.toFixed(2).replace(".", ",")};${formatDateBR(payment.dueDate)};${payment.status};${payment.paidDate ? formatDateBR(payment.paidDate) : ""};${payment.method ? PAYMENT_METHOD_LABEL[payment.method] : ""}`
    ).join("\n");
    downloadCsv(`mensalidades-${selectedMonth}.csv`, header + csvRows);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <h3 className="text-sm font-700 text-slate-700 mb-3">Dados para receber no Pix</h3>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Chave Pix"><TextInput value={pixConfig.pixKey} onChange={(e) => setPixConfig((c) => ({ ...c, pixKey: e.target.value }))} /></Field>
              <Field label="Nome do recebedor"><TextInput value={pixConfig.merchantName} onChange={(e) => setPixConfig((c) => ({ ...c, merchantName: e.target.value }))} /></Field>
              <Field label="Cidade"><TextInput value={pixConfig.merchantCity} onChange={(e) => setPixConfig((c) => ({ ...c, merchantCity: e.target.value }))} /></Field>
            </div>
            <p className="text-xs text-slate-400 mt-2">Essa chave é usada para gerar o QR code que os alunos veem na hora de pagar — é a sua chave real, o dinheiro cai direto na sua conta.</p>
          </div>
          <div className="w-[220px] flex-shrink-0">
            <PixPayment pixKey={pixConfig.pixKey} merchantName={pixConfig.merchantName} merchantCity={pixConfig.merchantCity} amount={rows[0]?.payment.amount ?? 300} txid="PREVIEW" />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          {([["todos", "Todos", students.length], ["pago", "Pagos", summary.pagoCount], ["pendente", "Pendentes", summary.pendenteCount], ["atrasado", "Atrasados", summary.atrasadoCount]] as const).map(([key, label, count]) => (
            <button key={key} onClick={() => setStatusFilter(key)} className={`px-3.5 py-1.5 rounded-full text-xs font-600 cursor-pointer border-0 transition-colors ${statusFilter === key ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
              {label} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <TextInput placeholder="Buscar aluno..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-[200px]" />
          <Btn variant="secondary" size="sm" onClick={handleExportCsv}>Exportar CSV</Btn>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid [grid-template-columns:2fr_1fr_1fr_1fr_1.6fr] gap-4 px-5 py-3 border-b border-slate-100 text-xs font-600 text-slate-400">
          <span>ALUNO</span><span>PLANO</span><span>VENCIMENTO</span><span>STATUS</span><span className="text-right">AÇÃO</span>
        </div>
        {rows.length === 0
          ? <EmptyState icon="🔍" title="Nenhum aluno encontrado" desc="Ajuste os filtros ou o termo de busca." />
          : rows.map(({ student, payment }) => (
              <StudentPaymentRow
                key={student.id}
                student={student}
                payment={payment}
                history={getStudentPayments(payments, student.id)}
                expanded={expandedId === student.id}
                onToggleExpand={() => setExpandedId((id) => (id === student.id ? null : student.id))}
                onMarkPaid={() => handleMarkPaid(payment.id)}
                onSavePlan={(v, d, m) => handleSavePlan(student.id, v, d, m)}
              />
            ))}
      </Card>
    </div>
  );
};

// ─── Despesas ───────────────────────────────────────────────────────────────

function downloadCsv(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const emptyExpenseForm = { category: "combustivel" as ExpenseCategory, amount: "", date: todayISO, description: "", odometerKm: "", liters: "", receiptFileName: undefined as string | undefined };

const ExpenseRow = ({ expense, onDelete }: { expense: Expense; onDelete: () => void }) => {
  const meta = EXPENSE_CATEGORY_META[expense.category];
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ backgroundColor: `${meta.color}1A` }}>{meta.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-500 text-slate-800 truncate">{expense.description}</div>
        <div className="text-xs text-slate-400">
          {formatDateBR(expense.date)} · {meta.label}
          {expense.odometerKm ? ` · ${expense.odometerKm.toLocaleString("pt-BR")} km` : ""}
          {expense.receiptFileName ? ` · 📎 ${expense.receiptFileName}` : ""}
        </div>
      </div>
      <span className="text-sm font-600 text-slate-700 tabular-nums flex-shrink-0">{formatBRL(expense.amount)}</span>
      <button onClick={onDelete} title="Remover" className="text-slate-300 hover:text-red-500 cursor-pointer border-0 bg-transparent flex-shrink-0 text-lg leading-none px-1">×</button>
    </div>
  );
};

const DespesasPanel = ({ students, expenses, setExpenses, selectedMonth }: {
  students: Student[]; expenses: Expense[]; setExpenses: SetExpenses; selectedMonth: string;
}) => {
  const [form, setForm] = useState(emptyExpenseForm);
  const monthExpenses = getExpensesForMonth(expenses, selectedMonth).sort((a, b) => b.date.localeCompare(a.date));
  const monthTotal = sumExpenses(monthExpenses);
  const breakdown = getCategoryBreakdown(monthExpenses);
  const efficiency = getFuelEfficiency(expenses);
  const activeStudents = students.filter((s) => s.status === "ativo");
  const variableCosts = monthExpenses.filter((e) => e.category === "combustivel" || e.category === "pedagio" || e.category === "manutencao").reduce((s, e) => s + e.amount, 0);
  const currentAvg = activeStudents.length > 0 ? activeStudents.reduce((s, st) => s + st.planValue, 0) / activeStudents.length : 0;
  const split = getCostSplitSuggestion(variableCosts, activeStudents.length, currentAvg);
  const pieData = breakdown.map((b) => ({ name: EXPENSE_CATEGORY_META[b.category].label, value: b.total, color: EXPENSE_CATEGORY_META[b.category].color }));

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount.replace(",", "."));
    if (!amount || !form.description) return;
    setExpenses((prev) => [
      { id: Date.now(), category: form.category, description: form.description, amount, date: form.date, odometerKm: form.odometerKm ? Number(form.odometerKm) : undefined, liters: form.liters ? Number(form.liters) : undefined, receiptFileName: form.receiptFileName },
      ...prev,
    ]);
    setForm(emptyExpenseForm);
  };

  const handleExportCsv = () => {
    const header = "Data;Categoria;Descrição;Valor\n";
    const rows = monthExpenses.map((e) => `${formatDateBR(e.date)};${EXPENSE_CATEGORY_META[e.category].label};"${e.description.replace(/"/g, '""')}";${e.amount.toFixed(2).replace(".", ",")}`).join("\n");
    downloadCsv(`despesas-${selectedMonth}.csv`, header + rows);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card className="p-5">
          <h3 className="text-sm font-700 text-slate-700 mb-4">Nova despesa</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
            <Field label="Categoria">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}>
                {(Object.entries(EXPENSE_CATEGORY_META) as [ExpenseCategory, typeof EXPENSE_CATEGORY_META[ExpenseCategory]][]).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.icon} {meta.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Valor (R$)"><TextInput type="number" min="0" step="0.01" required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0,00" /></Field>
            <Field label="Data"><TextInput type="date" required value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></Field>
            <Field label="Descrição"><TextInput required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Ex: Abastecimento no posto..." /></Field>
            {form.category === "combustivel" && (
              <>
                <Field label="Odômetro (km)" hint="opcional — calcula consumo"><TextInput type="number" value={form.odometerKm} onChange={(e) => setForm((f) => ({ ...f, odometerKm: e.target.value }))} /></Field>
                <Field label="Litros" hint="opcional"><TextInput type="number" step="0.1" value={form.liters} onChange={(e) => setForm((f) => ({ ...f, liters: e.target.value }))} /></Field>
              </>
            )}
            <div className="col-span-2">
              <FileDropSim label="Comprovante / nota fiscal" fileName={form.receiptFileName} onSelect={(file) => setForm((f) => ({ ...f, receiptFileName: file.name }))} />
            </div>
            <div className="col-span-2 flex justify-end">
              <Btn type="submit" variant="primary">Adicionar despesa</Btn>
            </div>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-700 text-slate-700">Despesas — {formatMonthLabel(selectedMonth)}</h3>
            <Btn variant="secondary" size="sm" onClick={handleExportCsv}>Exportar CSV</Btn>
          </div>
          {monthExpenses.length === 0
            ? <EmptyState icon="🧾" title="Nenhuma despesa neste mês" />
            : monthExpenses.map((e) => <ExpenseRow key={e.id} expense={e} onDelete={() => setExpenses((prev) => prev.filter((x) => x.id !== e.id))} />)}
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="text-sm font-700 text-slate-700 mb-3">Por categoria</h3>
          {pieData.length === 0 ? <p className="text-xs text-slate-400">Sem dados neste mês.</p> : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatBRL(Number(v) || 0)} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {breakdown.map((b) => {
                  const meta = EXPENSE_CATEGORY_META[b.category];
                  return (
                    <div key={b.category} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />{meta.label}</span>
                      <span className="font-600 text-slate-700 tabular-nums">{formatBRL(b.total)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-sm font-600 text-slate-700">Total</span>
                <span className="text-sm font-700 text-slate-900 tabular-nums">{formatBRL(monthTotal)}</span>
              </div>
            </>
          )}
        </Card>

        {efficiency && (
          <Card className="p-5">
            <h3 className="text-sm font-700 text-slate-700 mb-3">Eficiência da van</h3>
            <div className="flex gap-5">
              <div><div className="text-xl font-700 text-slate-900">{efficiency.avgKmPerLiter.toFixed(1)}</div><div className="text-xs text-slate-400">km/l médio</div></div>
              <div><div className="text-xl font-700 text-slate-900">{formatBRL(efficiency.avgCostPerKm)}</div><div className="text-xs text-slate-400">custo por km</div></div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Calculado a partir dos abastecimentos com odômetro registrado.</p>
          </Card>
        )}

        {split && (
          <Card className="p-5">
            <h3 className="text-sm font-700 text-slate-700 mb-1">Rateio sugerido</h3>
            <p className="text-xs text-slate-400 mb-3">Combustível + pedágio + manutenção ÷ {activeStudents.length} alunos, com margem de {formatBRL(60)}</p>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-500">Mensalidade média hoje</span>
              <span className="font-600 text-slate-700 tabular-nums">{formatBRL(split.currentAvgPlanValue)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-slate-500">Sugerido para cobrir custos</span>
              <span className="font-700 text-slate-900 tabular-nums">{formatBRL(split.suggestedPlanValue)}</span>
            </div>
            <div className={`text-xs font-600 px-3 py-2 rounded-lg ${split.difference > 0 ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
              {split.difference > 0
                ? `Reajustar ${formatBRL(split.difference)} manteria a mesma margem por aluno.`
                : "Sua mensalidade atual já cobre os custos variáveis com folga."}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── Main ───────────────────────────────────────────────────────────────────

export const DriverFinance = ({
  onSidebarNav, initialTab = "overview", students, setStudents, payments, setPayments, expenses, setExpenses, dark, onToggleDark,
}: {
  onSidebarNav: (item: SidebarItem) => void;
  initialTab?: FinanceTab;
  dark: boolean;
  onToggleDark: () => void;
  students: Student[]; setStudents: SetStudents;
  payments: Payment[]; setPayments: SetPayments;
  expenses: Expense[]; setExpenses: SetExpenses;
}) => {
  const [tab, setTab] = useState<FinanceTab>(initialTab);
  const months = useMemo(() => getAvailableMonths(payments), [payments]);
  const [monthIndex, setMonthIndex] = useState(months.length - 1);
  const selectedMonth = months[monthIndex] ?? months[months.length - 1] ?? "2026-08";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ width: 1440, fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar active="financeiro" onNavigate={onSidebarNav} dark={dark} onToggleDark={onToggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-700 text-slate-900">Financeiro</h1>
            <p className="text-sm text-slate-500">Mensalidades, despesas e o quanto sobra no fim do mês</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
            <button disabled={monthIndex === 0} onClick={() => setMonthIndex((i) => Math.max(0, i - 1))} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 disabled:opacity-30 cursor-pointer border-0 bg-transparent hover:bg-white">‹</button>
            <span className="text-sm font-600 text-slate-700 px-2 w-36 text-center inline-block">{formatMonthLabel(selectedMonth)}</span>
            <button disabled={monthIndex === months.length - 1} onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 disabled:opacity-30 cursor-pointer border-0 bg-transparent hover:bg-white">›</button>
          </div>
        </div>

        <div className="bg-white border-b border-slate-200 px-8 flex gap-1">
          {([["overview", "Visão geral"], ["mensalidades", "Mensalidades"], ["despesas", "Despesas"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-3 text-sm font-600 border-b-2 cursor-pointer bg-transparent transition-colors ${tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
          {tab === "overview" && <OverviewPanel students={students} payments={payments} expenses={expenses} selectedMonth={selectedMonth} isCurrentMonth={monthIndex === months.length - 1} />}
          {tab === "mensalidades" && <MensalidadesPanel students={students} payments={payments} selectedMonth={selectedMonth} setPayments={setPayments} setStudents={setStudents} />}
          {tab === "despesas" && <DespesasPanel students={students} expenses={expenses} setExpenses={setExpenses} selectedMonth={selectedMonth} />}
        </div>
      </main>
    </div>
  );
};
