import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { PaymentStatus } from "../types";

// ─── Brand ──────────────────────────────────────────────────────────────────

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="6" width="13" height="8" rx="2" fill="white" />
        <rect x="14" y="8" width="3" height="4" rx="1" fill="white" opacity="0.7" />
        <circle cx="4" cy="14" r="1.5" fill="#10B981" />
        <circle cx="10" cy="14" r="1.5" fill="#10B981" />
      </svg>
    </div>
    <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xl font-700 text-slate-900 tracking-tight">
      Van<span className="text-blue-600">Fácil</span>
    </span>
  </div>
);

// ─── Buttons ────────────────────────────────────────────────────────────────

export const Btn = ({
  children, variant = "primary", size = "md", onClick, className = "", type = "button", disabled = false, title,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "green" | "amber";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  title?: string;
}) => {
  const base = "inline-flex items-center justify-center font-500 rounded-full transition-all duration-150 cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";
  const sizes = { sm: "px-4 py-1.5 text-sm", md: "px-6 py-2.5 text-sm", lg: "px-8 py-3.5 text-base" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-sm",
    secondary: "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 focus-visible:ring-blue-400",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400",
    green: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-sm",
    amber: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400 shadow-sm",
  };
  return (
    <button type={type} title={title} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export const IconButton = ({ children, onClick, active = false, title, className = "" }: { children: ReactNode; onClick?: () => void; active?: boolean; title?: string; className?: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm cursor-pointer border-0 transition-colors ${active ? "bg-blue-600 text-white" : "bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"} ${className}`}
  >
    {children}
  </button>
);

// ─── Surfaces ───────────────────────────────────────────────────────────────

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

// ─── Badges ─────────────────────────────────────────────────────────────────

export const StatusBadge = ({ label, active = true }: { label: string; active?: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-500 ${active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-slate-400"}`} />
    {label}
  </span>
);

const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; dot: string; bg: string; text: string }> = {
  pago: { label: "Pago", dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700" },
  pendente: { label: "Pendente", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  atrasado: { label: "Atrasado", dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
};

export const PaymentStatusPill = ({ status, detail }: { status: PaymentStatus; detail?: string }) => {
  const meta = PAYMENT_STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-600 ${meta.bg} ${meta.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}{detail ? ` · ${detail}` : ""}
    </span>
  );
};

export const Avatar = ({ initials, tone = "blue", size = "md" }: { initials: string; tone?: "blue" | "green" | "slate" | "solid"; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" };
  const tones = { blue: "bg-blue-50 text-blue-600", green: "bg-green-100 text-green-700", slate: "bg-slate-100 text-slate-600", solid: "bg-blue-600 text-white" };
  return (
    <div className={`rounded-full flex items-center justify-center font-700 flex-shrink-0 ${sizes[size]} ${tones[tone]}`}>
      {initials}
    </div>
  );
};

// ─── Form controls ──────────────────────────────────────────────────────────

export const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="block">
    <span className="block text-xs font-600 text-slate-600 mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
  </label>
);

const inputBase = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${inputBase} ${props.className ?? ""}`} />
);

export const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`${inputBase} cursor-pointer ${props.className ?? ""}`} />
);

export const Switch = ({ on, onToggle, label }: { on: boolean; onToggle: () => void; label?: string }) => (
  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
    <input type="checkbox" checked={on} onChange={onToggle} className="hidden" />
    <div className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${on ? "bg-blue-600" : "bg-slate-300"}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </div>
    {label}
  </label>
);

export const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <label className="flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-green-500 border-green-500" : "border-slate-300 bg-white"}`}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  </label>
);

// ─── Empty / misc ───────────────────────────────────────────────────────────

export const EmptyState = ({ icon, title, desc }: { icon: ReactNode; title: string; desc?: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-6">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-2xl">{icon}</div>
    <h3 className="text-sm font-600 text-slate-700">{title}</h3>
    {desc && <p className="text-xs text-slate-400 mt-1 max-w-xs">{desc}</p>}
  </div>
);

// ─── Simulated file upload ──────────────────────────────────────────────────
// There is no backend/storage in this prototype, so "uploading" only keeps
// the file in memory for the current tab (via an object URL) — nothing is
// sent anywhere or persisted after a refresh. Good enough to demo the flow.

export const FileDropSim = ({
  label, fileName, onSelect, accept = "image/*,.pdf",
}: {
  label: string;
  fileName?: string | null;
  onSelect: (file: File) => void;
  accept?: string;
}) => {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label htmlFor={inputId} className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors">
      <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm flex-shrink-0">📎</span>
      <span className="flex-1 min-w-0">
        <span className="block text-xs font-600 text-slate-600">{label}</span>
        <span className="block text-xs text-slate-400 truncate">{fileName ?? "Nenhum arquivo selecionado — toque para anexar"}</span>
      </span>
      <input id={inputId} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f); }} />
    </label>
  );
};

export const StarRating = ({ value, onChange, size = 22 }: { value: number; onChange?: (v: number) => void; size?: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        className={`bg-transparent border-0 p-0 leading-none ${onChange ? "cursor-pointer" : "cursor-default"}`}
        style={{ fontSize: size, color: n <= value ? "#F59E0B" : "#E2E8F0" }}
      >
        ★
      </button>
    ))}
  </div>
);

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`${inputBase} resize-none ${props.className ?? ""}`} />
);

export const ProgressBar = ({ value, max, color = "bg-green-500", track = "bg-slate-100" }: { value: number; max: number; color?: string; track?: string }) => (
  <div className={`h-2 rounded-full overflow-hidden ${track}`}>
    <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%` }} />
  </div>
);
