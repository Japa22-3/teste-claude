import { useState } from "react";
import {
  absenceNotices as seedAbsences,
  expenses as seedExpenses,
  notices as seedNotices,
  payments as seedPayments,
  ratings as seedRatings,
  students as seedStudents,
} from "./data/mockData";
import type { AbsenceNotice, Expense, Notice, Payment, Rating, Student } from "./types";
import type { SidebarItem } from "./components/Sidebar";
import type { MobileTab } from "./components/MobileTabBar";
import { LandingPage } from "./screens/LandingPage";
import { DriverDashboard } from "./screens/DriverDashboard";
import { DriverFinance, type FinanceTab } from "./screens/DriverFinance";
import { DriverStudents } from "./screens/DriverStudents";
import { DriverNotices } from "./screens/DriverNotices";
import { RouteOptimization } from "./screens/RouteOptimization";
import { StudentMobile } from "./screens/StudentMobile";
import { StudentPayments } from "./screens/StudentPayments";
import { StudentProfile } from "./screens/StudentProfile";
import { ProximityNotification } from "./screens/ProximityNotification";

// ─── Screen registry ────────────────────────────────────────────────────────
// This is a design prototype, not a routed app: every screen is reachable
// from the toolbar so the whole flow can be reviewed side by side. Swapping
// this for react-router later only touches this file.

type ScreenKey =
  | "landing"
  | "driver-dashboard"
  | "driver-routes"
  | "driver-students"
  | "driver-finance"
  | "driver-expenses"
  | "driver-notices"
  | "student-map"
  | "student-payments"
  | "student-profile"
  | "student-proximity";

const SCREENS: { key: ScreenKey; label: string; group: "Motorista" | "Aluno" | "Público" }[] = [
  { key: "landing", label: "Landing", group: "Público" },
  { key: "driver-dashboard", label: "Painel", group: "Motorista" },
  { key: "driver-routes", label: "Rotas", group: "Motorista" },
  { key: "driver-students", label: "Alunos", group: "Motorista" },
  { key: "driver-finance", label: "Financeiro", group: "Motorista" },
  { key: "driver-expenses", label: "Despesas", group: "Motorista" },
  { key: "driver-notices", label: "Avisos & Van", group: "Motorista" },
  { key: "student-map", label: "Mapa", group: "Aluno" },
  { key: "student-payments", label: "Pagamentos", group: "Aluno" },
  { key: "student-profile", label: "Perfil", group: "Aluno" },
  { key: "student-proximity", label: "Embarque", group: "Aluno" },
];

const MOBILE_SCREENS: ScreenKey[] = ["student-map", "student-payments", "student-profile", "student-proximity"];

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>("driver-finance");
  const [dark, setDark] = useState(false);

  // Shared in-memory "database". Every screen reads and writes the same
  // arrays, so marking a payment paid in Financeiro instantly updates the
  // student's app and the dashboard alert. Resets on refresh — see the
  // Supabase notes in /supabase/schema.sql for making it persistent.
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [payments, setPayments] = useState<Payment[]>(seedPayments);
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);
  const [absences, setAbsences] = useState<AbsenceNotice[]>(seedAbsences);
  const [notices, setNotices] = useState<Notice[]>(seedNotices);
  const [ratings, setRatings] = useState<Rating[]>(seedRatings);

  const handleSidebarNav = (item: SidebarItem) => {
    const map: Record<SidebarItem, ScreenKey> = {
      inicio: "driver-dashboard",
      rotas: "driver-routes",
      alunos: "driver-students",
      financeiro: "driver-finance",
      avisos: "driver-notices",
      config: "driver-dashboard",
    };
    setScreen(map[item]);
  };

  const handleMobileTab = (tab: MobileTab) => {
    const map: Record<MobileTab, ScreenKey> = {
      mapa: "student-map",
      pagamentos: "student-payments",
      perfil: "student-profile",
    };
    setScreen(map[tab]);
  };

  // Legacy numeric nav kept for the screens ported from the original file.
  const handleLegacyNav = (n: number) => {
    const map: Record<number, ScreenKey> = {
      0: "landing",
      1: "driver-dashboard",
      2: "student-map",
      3: "student-proximity",
      4: "driver-routes",
    };
    setScreen(map[n] ?? "landing");
  };

  const isMobile = MOBILE_SCREENS.includes(screen);
  const financeTab: FinanceTab = screen === "driver-expenses" ? "despesas" : "overview";

  const renderScreen = () => {
    switch (screen) {
      case "landing":
        return <LandingPage onNav={handleLegacyNav} />;
      case "driver-dashboard":
        return <DriverDashboard onNav={handleLegacyNav} onSidebarNav={handleSidebarNav} payments={payments} absences={absences} dark={dark} onToggleDark={() => setDark((d) => !d)} />;
      case "driver-routes":
        return <RouteOptimization onSidebarNav={handleSidebarNav} students={students} dark={dark} onToggleDark={() => setDark((d) => !d)} />;
      case "driver-students":
        return <DriverStudents onSidebarNav={handleSidebarNav} students={students} setStudents={setStudents} dark={dark} onToggleDark={() => setDark((d) => !d)} />;
      case "driver-finance":
      case "driver-expenses":
        return (
          <DriverFinance
            key={financeTab}
            onSidebarNav={handleSidebarNav}
            initialTab={financeTab}
            students={students} setStudents={setStudents}
            payments={payments} setPayments={setPayments}
            expenses={expenses} setExpenses={setExpenses}
            dark={dark} onToggleDark={() => setDark((d) => !d)}
          />
        );
      case "driver-notices":
        return <DriverNotices onSidebarNav={handleSidebarNav} notices={notices} setNotices={setNotices} dark={dark} onToggleDark={() => setDark((d) => !d)} />;
      case "student-map":
        return <StudentMobile onNav={handleLegacyNav} onTab={handleMobileTab} payments={payments} notices={notices} />;
      case "student-payments":
        return <StudentPayments onTab={handleMobileTab} payments={payments} absences={absences} setAbsences={setAbsences} ratings={ratings} setRatings={setRatings} />;
      case "student-profile":
        return <StudentProfile onTab={handleMobileTab} notices={notices} />;
      case "student-proximity":
        return <ProximityNotification onNav={handleLegacyNav} />;
      default:
        return null;
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
        {/* Prototype toolbar — not part of the product UI */}
        <div className="sticky top-0 z-[100] bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-700 text-white tracking-tight mr-1">VanFácil</span>
          {(["Público", "Motorista", "Aluno"] as const).map((group) => (
            <div key={group} className="flex items-center gap-1.5">
              <span className="text-[10px] font-600 text-slate-500 uppercase tracking-wider">{group}</span>
              {SCREENS.filter((s) => s.group === group).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setScreen(s.key)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-600 cursor-pointer border-0 transition-colors ${
                    screen === s.key ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ))}
          <button
            onClick={() => setDark((d) => !d)}
            className="ml-auto px-3 py-1 rounded-full text-[11px] font-600 cursor-pointer border-0 bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            {dark ? "☀ Claro" : "☾ Escuro"}
          </button>
        </div>

        <div className={`flex justify-center ${isMobile ? "py-8" : ""}`}>
          <div className={isMobile ? "rounded-[36px] overflow-hidden shadow-2xl border-[10px] border-slate-900" : "w-full flex justify-center overflow-x-auto"}>
            {renderScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}

