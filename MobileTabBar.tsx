export type MobileTab = "mapa" | "pagamentos" | "perfil";

const TABS: { key: MobileTab; label: string; icon: string }[] = [
  { key: "mapa", label: "Mapa", icon: "◈" },
  { key: "pagamentos", label: "Pagamentos", icon: "$" },
  { key: "perfil", label: "Perfil", icon: "☺" },
];

export const MobileTabBar = ({ active, onNavigate }: { active: MobileTab; onNavigate: (tab: MobileTab) => void }) => (
  <div className="absolute bottom-0 left-0 right-0 z-40 h-[72px] bg-white border-t border-slate-100 flex items-stretch px-2 pb-4">
    {TABS.map(({ key, label, icon }) => {
      const isActive = active === key;
      return (
        <button
          key={key}
          onClick={() => onNavigate(key)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer border-0 bg-transparent transition-colors ${
            isActive ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <span className={`text-base leading-none ${isActive ? "font-700" : ""}`}>{icon}</span>
          <span className={`text-[10px] ${isActive ? "font-600" : "font-500"}`}>{label}</span>
        </button>
      );
    })}
  </div>
);
