import { useState } from "react";

export const ProximityNotification = ({ onNav }: { onNav: (s: number) => void }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="relative flex flex-col overflow-hidden" style={{ width: 375, height: 812, background: "linear-gradient(160deg, #0D1F6E 0%, #1A3FD4 50%, #10B981 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1">
        <span className="text-white text-xs font-600">9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-2.5 border border-white/60 rounded-sm relative"><div className="absolute inset-0.5 left-0.5 bg-white/80 rounded-sm w-2/3" /></div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute w-72 h-72 rounded-full border border-white/15" />
        <div className="absolute w-52 h-52 rounded-full border border-white/20" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Van icon big */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🚐</span>
          </div>
          <div className="absolute -inset-3 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute -inset-6 rounded-full border border-white/15" />
        </div>

        {!confirmed ? (
          <>
            <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="text-white/90 text-sm font-500">⚡ Notificação de proximidade</span>
            </div>
            <h1 className="text-4xl font-700 text-white leading-tight mb-4">
              A van está<br />na sua frente!
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-12 max-w-xs">
              José Oliveira parou na sua parada.<br />Confirme o embarque agora.
            </p>

            {/* Swipe or tap button */}
            <div className="w-full max-w-xs">
              <button
                onClick={() => setConfirmed(true)}
                className="w-full py-4 rounded-2xl bg-white text-blue-700 font-700 text-base shadow-xl hover:bg-blue-50 transition-all active:scale-95 cursor-pointer border-0"
              >
                ✓ Confirmar embarque
              </button>
              <button className="mt-3 w-full py-3 rounded-2xl border border-white/30 text-white/80 font-500 text-sm hover:bg-white/10 transition-all cursor-pointer bg-transparent">
                Vou atrasar (avisar motorista)
              </button>
            </div>
          </>
        ) : (
          <div className="slide-up text-center">
            <div className="w-20 h-20 rounded-full bg-green-400 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M6 18l8 8 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-3xl font-700 text-white mb-3">Embarque confirmado!</h2>
            <p className="text-white/70 text-sm mb-8">Presença registrada. Boa aula! 🎓</p>
            <button onClick={() => onNav(2)} className="px-8 py-3 rounded-full bg-white/20 text-white font-600 cursor-pointer border border-white/30 hover:bg-white/30 transition-all">
              Acompanhar rota
            </button>
          </div>
        )}
      </div>

      {/* Bottom safe area */}
      <div className="pb-8 px-8 flex items-center justify-center">
        <div className="w-32 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
};
