import { MapBg, MapPin, VanIcon } from "../components/map";
import { Avatar, Btn, StatusBadge } from "../components/ui";
import { MobileTabBar, type MobileTab } from "../components/MobileTabBar";
import { currentStudentId } from "../data/mockData";
import type { Notice, Payment } from "../types";
import { getPaymentForStudentMonth } from "../lib/finance";
import { formatDateLong } from "../lib/dates";

const CURRENT_MONTH = "2026-08";

const PAYMENT_CHIP_STYLE = {
  pago: { bg: "bg-green-50", text: "text-green-700", label: "Pago ✓" },
  pendente: { bg: "bg-amber-50", text: "text-amber-700", label: "Pendente" },
  atrasado: { bg: "bg-red-50", text: "text-red-700", label: "Em atraso" },
};

export const StudentMobile = ({
  onNav, onTab, payments, notices,
}: {
  onNav: (s: number) => void;
  onTab: (t: MobileTab) => void;
  payments: Payment[];
  notices: Notice[];
}) => {
  const payment = getPaymentForStudentMonth(payments, currentStudentId, CURRENT_MONTH);
  const chip = payment ? PAYMENT_CHIP_STYLE[payment.status] : null;

  return (
    <div className="relative bg-slate-800 overflow-hidden" style={{ width: 375, height: 812, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-3 pb-1">
        <span className="text-white text-xs font-600">9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-2.5 border border-white/60 rounded-sm relative"><div className="absolute inset-0.5 left-0.5 bg-white/80 rounded-sm w-2/3" /></div>
          <svg width="12" height="10" viewBox="0 0 12 10" fill="white" opacity="0.8"><path d="M6 1 L11 5 L9 5 L9 9 L3 9 L3 5 L1 5 Z" /></svg>
        </div>
      </div>

      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapBg />
        <VanIcon style={{ top: "38%", left: "45%" }} />
        <MapPin n={undefined} style={{ top: "60%", left: "55%" }} color="#1A3FD4" />
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full z-5" viewBox="0 0 375 812" preserveAspectRatio="none">
          <path d="M 170 310 Q 200 350 215 490" stroke="#1A3FD4" strokeWidth="4" fill="none" strokeDasharray="8 5" opacity="0.7" />
          <path d="M 170 310 Q 200 350 215 490" stroke="#1A3FD4" strokeWidth="12" fill="none" opacity="0.1" />
        </svg>

        {/* Destination pin */}
        <div className="absolute z-20" style={{ top: "59%", left: "48%" }}>
          <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
              <circle cx="8" cy="6" r="1.5" fill="#1A3FD4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top notification */}
      <div className="absolute top-12 left-4 right-4 z-40 slide-up">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="2,1 12,7 2,13" fill="white" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-white text-xs font-600">VanFácil · agora</div>
            <div className="text-white/80 text-xs mt-0.5">A van iniciou o trajeto</div>
          </div>
          <button className="text-white/40 text-lg leading-none cursor-pointer bg-transparent border-0">×</button>
        </div>
      </div>

      {/* Bottom card — shifted up to make room for the tab bar */}
      <div className="absolute bottom-[72px] left-0 right-0 z-40">
        <div className="bg-white rounded-t-3xl shadow-2xl px-6 pt-5 pb-6">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge label="Em rota" />
              </div>
              <h2 className="text-2xl font-700 text-slate-900 mt-2">Van chegando<br />em <span className="text-green-600">5 min</span></h2>
            </div>
            <div className="text-right">
              <div className="text-3xl font-700 text-slate-900">1,2</div>
              <div className="text-sm text-slate-500">km de distância</div>
            </div>
          </div>

          {/* Payment status — tap through to Pagamentos */}
          {payment && chip && (
            <button onClick={() => onTab("pagamentos")} className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 mb-3 cursor-pointer border-0 text-left ${chip.bg}`}>
              <span className={`text-xs font-600 ${chip.text}`}>
                Mensalidade de agosto: {chip.label}
                {payment.status !== "pago" && ` · vence ${formatDateLong(payment.dueDate)}`}
              </span>
              <span className={`text-xs font-600 ${chip.text}`}>Ver →</span>
            </button>
          )}

          {/* Driver info */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 mb-5">
            <Avatar initials="JO" tone="solid" />
            <div className="flex-1">
              <div className="text-sm font-600 text-slate-900">José Oliveira</div>
              <div className="text-xs text-slate-500">Toyota HiAce • AYG-4512</div>
            </div>
            <button className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center cursor-pointer border-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3a1 1 0 011-1h2l1 3-1.5 1.5a9 9 0 004 4L11 9l3 1v2a1 1 0 01-1 1A12 12 0 013 3z" fill="white" />
              </svg>
            </button>
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" size="md" className="flex-1 justify-center">Ver rota completa</Btn>
            <Btn variant="green" size="md" className="flex-1 justify-center" onClick={() => onNav(3)}>
              Confirmar local →
            </Btn>
          </div>
        </div>
      </div>

      <MobileTabBar active="mapa" onNavigate={onTab} />
    </div>
  );
};
