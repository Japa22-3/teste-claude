import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { MobileTabBar, type MobileTab } from "../components/MobileTabBar";
import { Avatar, Card } from "../components/ui";
import { currentStudentId, driverProfile, students } from "../data/mockData";
import { SHIFT_LABEL, type Notice } from "../types";
import { formatPhoneBR } from "../lib/finance";
import { formatBRL } from "../lib/currency";
import { formatDateBR } from "../lib/dates";

/**
 * Boarding QR: encodes a check-in payload the driver's app would scan to
 * register presence. Static here (no backend to validate it) — in production
 * this should be a short-lived signed token, not a plain student id.
 */
const StudentQr = ({ studentId, name }: { studentId: number; name: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(JSON.stringify({ t: "vanfacil.checkin", s: studentId, d: "2026-08-20" }), { margin: 1, width: 360, color: { dark: "#0F172A", light: "#FFFFFF" } })
      .then((u) => { if (!cancelled) setUrl(u); })
      .catch(() => { if (!cancelled) setUrl(null); });
    return () => { cancelled = true; };
  }, [studentId]);

  return (
    <Card className="p-5 flex flex-col items-center">
      <h3 className="text-sm font-700 text-slate-700 mb-1">QR de embarque</h3>
      <p className="text-xs text-slate-400 mb-4 text-center">Mostre para o motorista confirmar sua presença</p>
      {url ? <img src={url} alt={`QR de embarque de ${name}`} width={150} height={150} className="rounded-lg" /> : <div className="w-[150px] h-[150px] rounded-lg bg-slate-100 animate-pulse" />}
    </Card>
  );
};

export const StudentProfile = ({ onTab, notices }: { onTab: (t: MobileTab) => void; notices: Notice[] }) => {
  const me = students.find((s) => s.id === currentStudentId)!;
  const myNotices = notices.filter((n) => n.audience === "todos" || n.audience === me.shift);

  return (
    <div className="relative bg-slate-50 overflow-hidden" style={{ width: 375, height: 812, fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-[88px]">
        <div className="bg-white px-6 pt-3 pb-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-900 text-xs font-600">9:41</span>
            <div className="w-4 h-2.5 border border-slate-400 rounded-sm relative"><div className="absolute inset-0.5 left-0.5 bg-slate-700 rounded-sm w-2/3" /></div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar initials={me.avatar} tone="blue" size="lg" />
            <div className="min-w-0">
              <h1 className="text-lg font-700 text-slate-900 truncate">{me.name}</h1>
              <p className="text-xs text-slate-400">{me.school} · {SHIFT_LABEL[me.shift]}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Mural de recados */}
          <div>
            <h3 className="text-sm font-700 text-slate-700 mb-2">Recados do motorista</h3>
            <div className="space-y-2">
              {myNotices.length === 0 ? (
                <Card className="p-4"><p className="text-xs text-slate-400">Nenhum recado no momento.</p></Card>
              ) : myNotices.map((n) => (
                <Card key={n.id} className={`p-4 ${n.pinned ? "border-blue-200 bg-blue-50/40" : ""}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {n.pinned && <span className="text-xs">📌</span>}
                    <h4 className="text-sm font-600 text-slate-900">{n.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-slate-400 mt-2">{formatDateBR(n.createdAt)}</p>
                </Card>
              ))}
            </div>
          </div>

          <StudentQr studentId={me.id} name={me.name} />

          {/* Dados do trajeto */}
          <Card className="p-5">
            <h3 className="text-sm font-700 text-slate-700 mb-3">Meu trajeto</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Embarque · {me.pickupTime}</div>
                <div className="text-slate-700">{me.pickupAddress}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Desembarque · {me.dropoffTime}</div>
                <div className="text-slate-700">{me.dropoffAddress}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Mensalidade</div>
                <div className="text-slate-700">{formatBRL(me.planValue)} · vence todo dia {me.dueDay}</div>
              </div>
            </div>
          </Card>

          {/* Motorista */}
          <Card className="p-5">
            <h3 className="text-sm font-700 text-slate-700 mb-3">Motorista</h3>
            <div className="flex items-center gap-3">
              <Avatar initials="JO" tone="solid" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-600 text-slate-900">{driverProfile.name}</div>
                <div className="text-xs text-slate-400">{driverProfile.vehicleModel} · {driverProfile.plate}</div>
              </div>
              <a href={`https://wa.me/${driverProfile.phone}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center no-underline flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3a1 1 0 011-1h2l1 3-1.5 1.5a9 9 0 004 4L11 9l3 1v2a1 1 0 01-1 1A12 12 0 013 3z" fill="white" />
                </svg>
              </a>
            </div>
          </Card>

          {/* Documentos */}
          <Card className="p-5">
            <h3 className="text-sm font-700 text-slate-700 mb-1">Meus documentos</h3>
            <p className="text-xs text-slate-400 mb-3">Contrato e comprovantes enviados</p>
            <div className="space-y-2">
              {me.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-2 py-1.5">
                  <span className="text-xs text-slate-600 truncate">📎 {d.name}</span>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">{formatDateBR(d.uploadedAt)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Contato */}
          <Card className="p-5">
            <h3 className="text-sm font-700 text-slate-700 mb-3">Meus dados</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400 text-xs">Responsável</span><span className="text-slate-700 text-xs">{me.guardianName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-xs">Telefone</span><span className="text-slate-700 text-xs">{formatPhoneBR(me.phone)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-xs">Aluno desde</span><span className="text-slate-700 text-xs">{formatDateBR(me.joinedAt)}</span></div>
            </div>
          </Card>
        </div>
      </div>

      <MobileTabBar active="perfil" onNavigate={onTab} />
    </div>
  );
};
