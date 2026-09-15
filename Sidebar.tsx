import { driverProfile } from "../data/mockData";
import { Avatar, Logo } from "./ui";

export type SidebarItem = "inicio" | "rotas" | "alunos" | "financeiro" | "avisos" | "config";

const ITEMS: { key: SidebarItem; label: string; icon: string; comingSoon?: boolean }[] = [
  { key: "inicio", label: "Início", icon: "⊞" },
  { key: "rotas", label: "Minhas Rotas", icon: "↗" },
  { key: "alunos", label: "Alunos", icon: "◎" },
  { key: "financeiro", label: "Financeiro", icon: "$" },
  { key: "avisos", label: "Avisos & Van", icon: "✉" },
  { key: "config", label: "Configurações", icon: "⚙", comingSoon: true },
];

export const Sidebar = ({
  active,
  onNavigate,
  dark,
  onToggleDark,
}: {
  active: SidebarItem;
  onNavigate: (item: SidebarItem) => void;
  dark?: boolean;
  onToggleDark?: () => void;
}) => (
  <aside className="w-64 bg-slate-900 flex flex-col flex-shrink-0">
    <div className="p-6 border-b border-slate-700">
      <Logo className="[&_span]:text-white" />
    </div>
    <nav className="flex-1 p-4 space-y-1">
      {ITEMS.map(({ key, label, icon, comingSoon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => !comingSoon && onNavigate(key)}
            disabled={comingSoon}
            title={comingSoon ? "Em breve" : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-500 transition-colors cursor-pointer border-0 text-left ${
              isActive
                ? "bg-blue-600 text-white"
                : comingSoon
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-base w-4 text-center flex-shrink-0">{icon}</span>
            <span className="flex-1">{label}</span>
            {comingSoon && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-500 font-600 flex-shrink-0">
                EM BREVE
              </span>
            )}
          </button>
        );
      })}
    </nav>
    <div className="p-4 space-y-2">
      {onToggleDark && (
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-500 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer border-0 bg-transparent text-left transition-colors"
        >
          <span className="text-base w-4 text-center flex-shrink-0">{dark ? "☀" : "☾"}</span>
          <span>{dark ? "Modo claro" : "Modo escuro"}</span>
        </button>
      )}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800">
        <Avatar initials="JO" tone="solid" />
        <div className="min-w-0">
          <div className="text-sm font-500 text-white truncate">{driverProfile.name}</div>
          <div className="text-xs text-slate-400">Motorista · {driverProfile.plate}</div>
        </div>
      </div>
    </div>
  </aside>
);
