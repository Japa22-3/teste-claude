// ─── Domain types ──────────────────────────────────────────────────────────
// Each interface here is written to map 1:1 onto a future Supabase (Postgres)
// table — see /supabase/schema.sql for the matching `create table` statements
// and RLS policy sketches. Field names use camelCase here (frontend
// convention) and snake_case in SQL; the mapping is 1:1 either way.

export type PaymentStatus = "pago" | "pendente" | "atrasado";
export type PaymentMethod = "pix" | "dinheiro" | "cartao" | "transferencia";
export type RouteShift = "matutino" | "vespertino" | "integral";
export type StudentStatus = "ativo" | "inativo" | "lista_espera";

export type ExpenseCategory =
  | "combustivel"
  | "pedagio"
  | "manutencao"
  | "seguro"
  | "limpeza"
  | "ipva"
  | "outros";

export interface Student {
  id: number;
  name: string;
  avatar: string;
  guardianName: string;
  /** Digits only, with country code — e.g. "5511987650001". Used for wa.me links. */
  phone: string;
  email?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string; // "HH:mm"
  dropoffTime: string; // "HH:mm"
  school: string;
  shift: RouteShift;
  /** Monthly plan value in BRL. */
  planValue: number;
  /** Day of month the mensalidade is due. */
  dueDay: number;
  preferredMethod: PaymentMethod;
  status: StudentStatus;
  joinedAt: string; // ISO date
  documents: StudentDocument[];
}

export interface StudentDocument {
  id: number;
  name: string;
  /** Simulated — an object URL or a static label, never uploaded to a server in this prototype. */
  fileName: string;
  uploadedAt: string; // ISO date
}

export interface Payment {
  id: number;
  studentId: number;
  /** 'YYYY-MM' */
  referenceMonth: string;
  amount: number;
  dueDate: string; // ISO date
  paidDate?: string; // ISO date
  status: PaymentStatus;
  method?: PaymentMethod;
  /** Simulated proof-of-payment upload — file name only, kept in memory for the session. */
  proofFileName?: string;
  proofUrl?: string;
}

export interface Expense {
  id: number;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // ISO date
  odometerKm?: number;
  liters?: number;
  /** Simulated receipt attachment — file name only, kept in memory for the session. */
  receiptFileName?: string;
  receiptUrl?: string;
}

export interface VehicleDocument {
  id: number;
  name: string;
  dueDate: string; // ISO date
  renewalCost?: number;
}

export interface MaintenanceItem {
  id: number;
  name: string;
  intervalKm?: number;
  intervalMonths?: number;
  lastDoneDate: string; // ISO date
  lastDoneKm: number;
}

export interface DriverProfile {
  name: string;
  phone: string;
  vehicleModel: string;
  plate: string;
  capacity: number;
  odometerKm: number;
  city: string;
  pixKey: string;
}

export interface AbsenceNotice {
  id: number;
  studentId: number;
  date: string; // ISO date
  note?: string;
}

export interface Notice {
  id: number;
  title: string;
  message: string;
  audience: "todos" | RouteShift;
  createdAt: string; // ISO date
  pinned?: boolean;
}

export interface Rating {
  id: number;
  studentId: number;
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string; // ISO date
}

export interface WaitlistEntry {
  id: number;
  name: string;
  guardianName: string;
  phone: string;
  desiredShift: RouteShift;
  requestedAt: string; // ISO date
}

export const EXPENSE_CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; icon: string; color: string }
> = {
  combustivel: { label: "Combustível", icon: "⛽", color: "#1A3FD4" },
  pedagio: { label: "Pedágio", icon: "🛣️", color: "#7C3AED" },
  manutencao: { label: "Manutenção", icon: "🔧", color: "#EA580C" },
  seguro: { label: "Seguro", icon: "🛡️", color: "#0891B2" },
  limpeza: { label: "Limpeza", icon: "🧽", color: "#059669" },
  ipva: { label: "IPVA", icon: "📄", color: "#64748B" },
  outros: { label: "Outros", icon: "•", color: "#94A3B8" },
};

export const SHIFT_LABEL: Record<RouteShift, string> = {
  matutino: "Matutino",
  vespertino: "Vespertino",
  integral: "Integral",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  transferencia: "Transferência",
};
