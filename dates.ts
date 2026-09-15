// ─── Date helpers ───────────────────────────────────────────────────────────
// IMPORTANT: `new Date("2026-08-20")` parses as UTC midnight, which renders as
// the previous day in any timezone behind UTC (all of Brazil). Every ISO date
// in this app must go through `parseISODate` instead of the `Date` constructor.

/** The "current" date for this demo/prototype. Keeps every screen's numbers consistent. */
export const DEMO_TODAY = new Date(2026, 7, 20); // August 20, 2026 (months are 0-indexed)

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const WEEKDAYS_PT = [
  "domingo", "segunda-feira", "terça-feira", "quarta-feira",
  "quinta-feira", "sexta-feira", "sábado",
];

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateBR(iso: string): string {
  const d = parseISODate(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function formatDateLong(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
}

export function formatFullWeekday(date: Date): string {
  const weekday = WEEKDAYS_PT[date.getDay()];
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized}, ${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${date.getFullYear()}`;
}

/** 'YYYY-MM' -> 'Agosto de 2026' */
export function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const label = MONTHS_PT[(m ?? 1) - 1];
  return `${label.charAt(0).toUpperCase() + label.slice(1)} de ${y}`;
}

/** 'YYYY-MM' -> 'ago/26' (compact, for chart axes) */
export function formatMonthShort(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  return `${MONTHS_PT[(m ?? 1) - 1].slice(0, 3)}/${String(y).slice(2)}`;
}

/** Whole days from `from` to `to` (positive if `to` is later), ignoring time-of-day. */
export function daysBetween(from: Date, to: Date): number {
  const f = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const t = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((t.getTime() - f.getTime()) / 86400000);
}

export function daysBetweenISO(fromISO: string, toISO: string): number {
  return daysBetween(parseISODate(fromISO), parseISODate(toISO));
}

export function addMonthsToKey(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const total = (y * 12 + (m - 1)) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}
