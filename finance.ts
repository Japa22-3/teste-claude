import type { DriverProfile, Expense, ExpenseCategory, Payment, Student } from "../types";
import { formatBRL } from "./currency";
import { formatDateBR, formatMonthLabel, formatMonthShort, parseISODate } from "./dates";

// ─── Mensalidades ───────────────────────────────────────────────────────────

export interface MonthSummary {
  monthKey: string;
  totalPlanValue: number;
  recebido: number;
  pendente: number;
  atrasado: number;
  pagoCount: number;
  pendenteCount: number;
  atrasadoCount: number;
  studentCount: number;
}

export function getMonthSummary(allPayments: Payment[], monthKey: string): MonthSummary {
  const monthPayments = allPayments.filter((p) => p.referenceMonth === monthKey);
  let recebido = 0, pendente = 0, atrasado = 0;
  let pagoCount = 0, pendenteCount = 0, atrasadoCount = 0;
  for (const p of monthPayments) {
    if (p.status === "pago") { recebido += p.amount; pagoCount++; }
    else if (p.status === "pendente") { pendente += p.amount; pendenteCount++; }
    else { atrasado += p.amount; atrasadoCount++; }
  }
  return {
    monthKey,
    totalPlanValue: recebido + pendente + atrasado,
    recebido, pendente, atrasado,
    pagoCount, pendenteCount, atrasadoCount,
    studentCount: monthPayments.length,
  };
}

export function getAvailableMonths(allPayments: Payment[]): string[] {
  return Array.from(new Set(allPayments.map((p) => p.referenceMonth))).sort();
}

export function getStudentPayments(allPayments: Payment[], studentId: number): Payment[] {
  return allPayments
    .filter((p) => p.studentId === studentId)
    .sort((a, b) => a.referenceMonth.localeCompare(b.referenceMonth));
}

export function getPaymentForStudentMonth(allPayments: Payment[], studentId: number, monthKey: string): Payment | undefined {
  return allPayments.find((p) => p.studentId === studentId && p.referenceMonth === monthKey);
}

// ─── Despesas ───────────────────────────────────────────────────────────────

export function getExpensesForMonth(allExpenses: Expense[], monthKey: string): Expense[] {
  return allExpenses.filter((e) => e.date.startsWith(monthKey));
}

export function sumExpenses(list: Expense[]): number {
  return list.reduce((sum, e) => sum + e.amount, 0);
}

export interface CategoryTotal {
  category: ExpenseCategory;
  total: number;
  share: number; // 0–1
}

export function getCategoryBreakdown(list: Expense[]): CategoryTotal[] {
  const totals = new Map<ExpenseCategory, number>();
  for (const e of list) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  const grandTotal = sumExpenses(list);
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total, share: grandTotal > 0 ? total / grandTotal : 0 }))
    .sort((a, b) => b.total - a.total);
}

export interface FuelEfficiency {
  avgKmPerLiter: number;
  avgCostPerKm: number;
  totalKm: number;
}

/** Derives real R$/km and km/L from consecutive fill-ups — averaged over all recorded fuel stops. */
export function getFuelEfficiency(allExpenses: Expense[]): FuelEfficiency | null {
  const fuelStops = allExpenses
    .filter((e) => e.category === "combustivel" && e.odometerKm != null)
    .sort((a, b) => (a.odometerKm as number) - (b.odometerKm as number));
  if (fuelStops.length < 2) return null;

  let totalKm = 0, totalLiters = 0, totalCost = 0;
  for (let i = 1; i < fuelStops.length; i++) {
    const kmDelta = (fuelStops[i].odometerKm as number) - (fuelStops[i - 1].odometerKm as number);
    if (kmDelta <= 0) continue;
    totalKm += kmDelta;
    totalLiters += fuelStops[i].liters ?? 0;
    totalCost += fuelStops[i].amount;
  }
  if (totalKm === 0) return null;
  return {
    avgKmPerLiter: totalLiters > 0 ? totalKm / totalLiters : 0,
    avgCostPerKm: totalCost / totalKm,
    totalKm,
  };
}

function countWeekdaysBetween(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  let count = 0;
  const cur = new Date(from);
  while (cur <= to) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

/** Ties the Route Optimization screen's per-trip savings estimate into a monthly figure. */
export function estimateFuelSavingsSoFar(monthStartISO: string, todayISO: string, perTripSavings = 4.72, tripsPerDay = 2): number {
  const weekdays = countWeekdaysBetween(monthStartISO, todayISO);
  return weekdays * tripsPerDay * perTripSavings;
}

// ─── WhatsApp deep links (wa.me — no API key, opens the app/web directly) ──

function buildWaLink(phoneDigitsOnly: string, message: string): string {
  return `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
}

export function buildChargeWhatsAppLink(student: Student, payment: Payment, driver: DriverProfile): string {
  const message =
    `Olá, ${student.guardianName}! Aqui é o ${driver.name}, da van. ` +
    `Passando para lembrar que a mensalidade de ${student.name} referente a ${formatMonthLabel(payment.referenceMonth)} ` +
    `está em aberto (venc. ${formatDateBR(payment.dueDate)}, ${formatBRL(payment.amount)}).\n\n` +
    `Chave Pix para pagamento: ${driver.pixKey}\n\n` +
    `Qualquer dúvida é só chamar por aqui. Obrigado!`;
  return buildWaLink(student.phone, message);
}

export function buildPaidNoticeWhatsAppLink(student: Student, payment: Payment, driver: DriverProfile): string {
  const message =
    `Olá, ${driver.name}! Aqui é responsável por ${student.name}. ` +
    `Acabei de fazer o Pix da mensalidade de ${formatMonthLabel(payment.referenceMonth)} ` +
    `(${formatBRL(payment.amount)}). Segue o comprovante. Obrigado(a)!`;
  return buildWaLink(driver.phone, message);
}

export function buildAbsenceWhatsAppLink(student: Student, dateISO: string, driver: DriverProfile, note?: string): string {
  const message =
    `Olá, ${driver.name}! Aqui é responsável por ${student.name}. ` +
    `Só para avisar que ${student.name} não vai usar a van no dia ${formatDateBR(dateISO)}` +
    `${note ? ` (${note})` : ""}. Assim já pode ajustar a rota. Obrigado!`;
  return buildWaLink(driver.phone, message);
}

export function formatPhoneBR(digits: string): string {
  if (digits.length !== 13) return digits;
  return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
}

// ─── Previsão de recebimento ────────────────────────────────────────────────
// Two numbers, not one fake-precise figure: "conservador" only counts money
// already in hand + not-yet-due charges; "otimista" also assumes every late
// payment eventually comes in. Being explicit about the assumption is more
// honest than a single blended forecast.
export interface Forecast {
  conservative: number;
  optimistic: number;
}

export function getForecast(summary: MonthSummary): Forecast {
  return {
    conservative: summary.recebido + summary.pendente,
    optimistic: summary.totalPlanValue,
  };
}

// ─── Tendência mensal (para gráficos Recharts) ─────────────────────────────
export interface MonthTrendPoint {
  monthKey: string;
  label: string;
  recebido: number;
  despesas: number;
  saldo: number;
}

export function getFinancialTrend(allPayments: Payment[], allExpenses: Expense[]): MonthTrendPoint[] {
  return getAvailableMonths(allPayments).map((monthKey) => {
    const recebido = getMonthSummary(allPayments, monthKey).recebido;
    const despesas = sumExpenses(getExpensesForMonth(allExpenses, monthKey));
    return { monthKey, label: formatMonthShort(monthKey), recebido, despesas, saldo: recebido - despesas };
  });
}

// ─── Ocupação da van ────────────────────────────────────────────────────────
export function getOccupancy(activeStudentCount: number, capacity: number) {
  return {
    occupied: activeStudentCount,
    capacity,
    vacancies: Math.max(0, capacity - activeStudentCount),
    percent: capacity > 0 ? Math.round((activeStudentCount / capacity) * 100) : 0,
  };
}

// ─── Alertas de manutenção (por km ou por tempo) ───────────────────────────
export interface MaintenanceAlert {
  item: import("../types").MaintenanceItem;
  dueInKm: number | null;
  dueInDays: number | null;
  urgent: boolean;
}

export function getMaintenanceAlerts(
  items: import("../types").MaintenanceItem[],
  currentOdometerKm: number,
  today: Date,
): MaintenanceAlert[] {
  return items.map((item) => {
    const dueInKm = item.intervalKm != null ? item.lastDoneKm + item.intervalKm - currentOdometerKm : null;
    let dueInDays: number | null = null;
    if (item.intervalMonths != null) {
      const last = parseISODate(item.lastDoneDate);
      const due = new Date(last.getFullYear(), last.getMonth() + item.intervalMonths, last.getDate());
      dueInDays = Math.round((due.getTime() - today.getTime()) / 86400000);
    }
    const urgent = (dueInKm != null && dueInKm <= 1000) || (dueInDays != null && dueInDays <= 30);
    return { item, dueInKm, dueInDays, urgent };
  });
}

// ─── Rateio sugerido de custos variáveis ────────────────────────────────────
// A "revolutionary" extra: shows the owner what each student's mensalidade
// would need to be to fully cover this month's variable costs (fuel + toll +
// maintenance) plus a target margin — without them having to do the math by
// hand every time diesel goes up.
export interface SplitSuggestion {
  variableCostPerStudent: number;
  suggestedPlanValue: number;
  currentAvgPlanValue: number;
  difference: number;
}

export function getCostSplitSuggestion(
  variableCostsTotal: number,
  studentCount: number,
  currentAvgPlanValue: number,
  targetMarginPerStudent = 60,
): SplitSuggestion | null {
  if (studentCount === 0) return null;
  const variableCostPerStudent = variableCostsTotal / studentCount;
  const suggestedPlanValue = variableCostPerStudent + targetMarginPerStudent;
  return {
    variableCostPerStudent,
    suggestedPlanValue,
    currentAvgPlanValue,
    difference: suggestedPlanValue - currentAvgPlanValue,
  };
}
