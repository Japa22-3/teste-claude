import { useState, type Dispatch, type SetStateAction } from "react";
import { MobileTabBar, type MobileTab } from "../components/MobileTabBar";
import { Btn, Card, FileDropSim, PaymentStatusPill, StarRating, Textarea } from "../components/ui";
import { PixPayment } from "../components/PixPayment";
import { driverProfile, students } from "../data/mockData";
import type { AbsenceNotice, Payment, Rating } from "../types";
import { buildAbsenceWhatsAppLink, buildPaidNoticeWhatsAppLink, getStudentPayments } from "../lib/finance";
import { formatBRL } from "../lib/currency";
import { DEMO_TODAY, daysBetweenISO, formatDateBR, formatMonthLabel, formatMonthShort, toISODate } from "../lib/dates";

const CURRENT_MONTH = "2026-08";
const CURRENT_STUDENT_ID = 1;
const todayISO = toISODate(DEMO_TODAY);

export const StudentPayments = ({
  onTab, payments, absences, setAbsences, ratings, setRatings,
}: {
  onTab: (t: MobileTab) => void;
  payments: Payment[];
  absences: AbsenceNotice[];
  setAbsences: Dispatch<SetStateAction<AbsenceNotice[]>>;
  ratings: Rating[];
  setRatings: Dispatch<SetStateAction<Rating[]>>;
}) => {
  const me = students.find((s) => s.id === CURRENT_STUDENT_ID)!;
  const current = payments.find((p) => p.studentId === CURRENT_STUDENT_ID && p.referenceMonth === CURRENT_MONTH);
  const history = getStudentPayments(payments, CURRENT_STUDENT_ID).filter((p) => p.referenceMonth !== CURRENT_MONTH).reverse();
  const [showPay, setShowPay] = useState(false);
  const [proofFileName, setProofFileName] = useState<string | undefined>();
  const [notifiedPaid, setNotifiedPaid] = useState(false);
  const myAbsences = absences.filter((a) => a.studentId === CURRENT_STUDENT_ID && a.date >= todayISO);
  const myRating = ratings.find((r) => r.studentId === CURRENT_STUDENT_ID);
  const [ratingScore, setRatingScore] = useState(myRating?.score ?? 0);
  const [ratingComment, setRatingComment] = useState(myRating?.comment ?? "");
  const [ratingSaved, setRatingSaved] = useState(false);

  const daysToDue = current ? daysBetweenISO(todayISO, current.dueDate) : 0;
  const alertTone = !current || current.status === "pago" ? "green" : current.status === "atrasado" ? "red" : daysToDue <= 3 ? "amber" : "slate";
  const toneStyles = {
    green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
    red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
    slate: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" },
  }[alertTone];

  const handleMarkAbsent = (date: string) => {
    setAbsences((prev) => [...prev, { id: Date.now(), studentId: CURRENT_STUDENT_ID, date }]);
  };

  const handleSaveRating = () => {
    if (ratingScore === 0) return;
    setRatings((prev) => {
      const withoutMine = prev.filter((r) => r.studentId !== CURRENT_STUDENT_ID);
      return [...withoutMine, { id: Date.now(), studentId: CURRENT_STUDENT_ID, score: ratingScore as 1 | 2 | 3 | 4 | 5, comment: ratingComment || undefined, createdAt: todayISO }];
    });
    setRatingSaved(true);
    setTimeout(() => setRatingSaved(false), 2000);
  };

  return (
    <div className="relative bg-slate-50 overflow-hidden" style={{ width: 375, height: 812, fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-[88px]">
        {/* Status bar + header */}
        <div className="bg-white px-6 pt-3 pb-4 sticky top-0 z-30 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-900 text-xs font-600">9:41</span>
            <div className="w-4 h-2.5 border border-slate-400 rounded-sm relative"><div className="absolute inset-0.5 left-0.5 bg-slate-700 rounded-sm w-2/3" /></div>
          </div>
          <h1 className="text-xl font-700 text-slate-900">Pagamentos</h1>
          <p className="text-xs text-slate-400">{me.name} · plano {formatBRL(me.planValue)}/mês</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Current month status */}
          {current && (
            <Card className={`p-5 border ${toneStyles.border} ${toneStyles.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-600 text-slate-500">{formatMonthLabel(current.referenceMonth)}</span>
                <PaymentStatusPill status={current.status} />
              </div>
              <div className={`text-3xl font-700 mb-1 ${toneStyles.text}`}>{formatBRL(current.amount)}</div>
              <div className="text-xs text-slate-500 mb-4">
                {current.status === "pago"
                  ? `Pago em ${formatDateBR(current.paidDate!)}`
                  : current.status === "atrasado"
                    ? `Venceu em ${formatDateBR(current.dueDate)} — ${Math.abs(daysToDue)} dia(s) em atraso`
                    : `Vence em ${formatDateBR(current.dueDate)} (${daysToDue === 0 ? "hoje" : `em ${daysToDue} dias`})`}
              </div>

              {current.status !== "pago" && !showPay && (
                <Btn variant="green" size="md" className="w-full justify-center" onClick={() => setShowPay(true)}>Pagar agora com Pix</Btn>
              )}

              {current.status !== "pago" && showPay && (
                <div className="space-y-3">
                  <PixPayment pixKey={driverProfile.pixKey} merchantName={driverProfile.name} merchantCity={driverProfile.city} amount={current.amount} txid={`MENS${me.id}${current.referenceMonth.replace("-", "")}`} description={`Mensalidade ${me.name}`} />
                  <FileDropSim label="Anexar comprovante (opcional)" fileName={proofFileName} onSelect={(f) => setProofFileName(f.name)} />
                  <a
                    href={buildPaidNoticeWhatsAppLink(me, current, driverProfile)}
                    target="_blank" rel="noreferrer"
                    onClick={() => setNotifiedPaid(true)}
                    className="block text-center text-sm font-600 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full py-2.5 no-underline"
                  >
                    Já paguei — avisar motorista
                  </a>
                  {notifiedPaid && <p className="text-xs text-slate-400 text-center">Motorista avisado! O status muda para "Pago" assim que ele confirmar o recebimento.</p>}
                </div>
              )}
            </Card>
          )}

          {/* Absence notice */}
          <Card className="p-4">
            <h3 className="text-sm font-700 text-slate-700 mb-1">Não vai usar a van?</h3>
            <p className="text-xs text-slate-400 mb-3">Avise o motorista e ele já ajusta a rota — economiza tempo e combustível.</p>
            <div className="flex gap-2">
              {[["Hoje", todayISO], ["Amanhã", toISODate(new Date(DEMO_TODAY.getFullYear(), DEMO_TODAY.getMonth(), DEMO_TODAY.getDate() + 1))]].map(([label, date]) => {
                const already = myAbsences.some((a) => a.date === date);
                return (
                  <a
                    key={date}
                    href={buildAbsenceWhatsAppLink(me, date, driverProfile)}
                    target="_blank" rel="noreferrer"
                    onClick={() => !already && handleMarkAbsent(date)}
                    className={`flex-1 text-center text-xs font-600 rounded-full py-2.5 no-underline cursor-pointer ${already ? "bg-slate-100 text-slate-400" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}
                  >
                    {already ? `${label} ✓ avisado` : `Avisar ${label.toLowerCase()}`}
                  </a>
                );
              })}
            </div>
          </Card>

          {/* History */}
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-700 text-slate-700">Histórico</h3>
            </div>
            {history.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-sm font-500 text-slate-800">{formatMonthLabel(p.referenceMonth)}</div>
                  <div className="text-xs text-slate-400">{p.paidDate ? `Pago em ${formatDateBR(p.paidDate)}` : `Venceu ${formatDateBR(p.dueDate)}`}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-600 text-slate-700 tabular-nums">{formatBRL(p.amount)}</div>
                  <PaymentStatusPill status={p.status} />
                </div>
              </div>
            ))}
          </Card>

          {/* Rating */}
          <Card className="p-4">
            <h3 className="text-sm font-700 text-slate-700 mb-1">Como está o serviço?</h3>
            <p className="text-xs text-slate-400 mb-3">Só o motorista vê sua avaliação.</p>
            <StarRating value={ratingScore} onChange={setRatingScore} />
            <Textarea rows={2} placeholder="Comentário (opcional)" value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} className="mt-3" />
            <Btn variant={ratingSaved ? "green" : "primary"} size="sm" className="mt-3 w-full justify-center" onClick={handleSaveRating}>
              {ratingSaved ? "Avaliação enviada ✓" : "Enviar avaliação"}
            </Btn>
          </Card>
        </div>
      </div>

      <MobileTabBar active="pagamentos" onNavigate={onTab} />
    </div>
  );
};
