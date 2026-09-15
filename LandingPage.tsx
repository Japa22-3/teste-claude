import { Btn, Card, Logo, StatusBadge } from "../components/ui";
import { MapBg, MapPin, VanIcon } from "../components/map";

const BENEFITS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#1A3FD4" strokeWidth="2" />
        <path d="M14 8v6l4 2" stroke="#1A3FD4" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill="#10B981" />
      </svg>
    ),
    title: "Rota em tempo real",
    desc: "Alunos acompanham a van em tempo real no mapa. Notificações automáticas quando a van estiver a 5 minutos da parada.",
    stat: "< 30s latência",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 14 L14 4 L24 14" stroke="#1A3FD4" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 18 Q14 10 20 18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="22" r="2" fill="#1A3FD4" />
      </svg>
    ),
    title: "Menos km rodado",
    desc: "Algoritmo de otimização de rotas reduz em média 34% a distância percorrida. Menos gasto com combustível, mais lucro.",
    stat: "−34% em média",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="#1A3FD4" strokeWidth="2" />
        <path d="M9 13l3 3 7-7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Contrato e presença digital",
    desc: "Check-in digital de embarque, histórico de presença e contrato de transporte — tudo documentado automaticamente.",
    stat: "100% digital",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="13" cy="14" r="10" stroke="#1A3FD4" strokeWidth="2" />
        <path d="M13 8.5v11M16 11c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.2c0 2.8 6 1.6 6 4.4 0 1.2-1.3 2.4-3 2.4s-3-1.2-3-2.4" stroke="#1A3FD4" strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <circle cx="21" cy="21" r="4.5" fill="#10B981" />
        <path d="M19 21l1.3 1.3L23 19.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Mensalidades sem esforço",
    desc: "Cobrança por Pix, painel de quem já pagou e quem está em atraso, com lembrete automático — sem precisar checar o WhatsApp o mês inteiro.",
    stat: "Direto no Pix, sem taxas",
  },
];

export const LandingPage = ({ onNav }: { onNav: (s: number) => void }) => {
  return (
    <div className="min-h-screen bg-white" style={{ width: 1440, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-16 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <Logo />
        <nav className="flex items-center gap-8">
          {["Como funciona", "Para motoristas", "Para alunos"].map((item) => (
            <a key={item} className="text-sm font-500 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">{item}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Btn variant="ghost" size="sm">Login</Btn>
          <Btn variant="primary" size="sm" onClick={() => onNav(1)}>Cadastrar</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1F6E 0%, #1A3FD4 60%, #2B5CE6 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative flex items-center justify-between px-16 py-28">
          <div className="max-w-xl">
            <StatusBadge label="Rastreamento em tempo real" />
            <h1 className="mt-6 text-6xl font-700 text-white leading-tight tracking-tight">
              Sua van,<br />no seu tempo.
            </h1>
            <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-md">
              Conectamos motoristas de van escolar com alunos através de rotas otimizadas, controle financeiro completo e rastreamento em tempo real.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Btn size="lg" onClick={() => onNav(1)} className="bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 py-3.5 text-base font-600">
                Comece agora
              </Btn>
              <Btn variant="ghost" size="lg" className="text-white border border-white/30 hover:bg-white/10 rounded-full">
                Ver demonstração →
              </Btn>
            </div>
            <div className="mt-12 flex items-center gap-8">
              {[["2.400+", "Alunos ativos"], ["380+", "Motoristas"], ["98%", "Pontualidade"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-700 text-white">{n}</div>
                  <div className="text-sm text-blue-200">{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero visual */}
          <div className="relative w-96 h-80 rounded-3xl overflow-hidden border border-white/20 shadow-2xl" style={{ background: "#1330B0" }}>
            <MapBg />
            <VanIcon style={{ top: "42%", left: "38%" }} />
            <MapPin n={1} style={{ top: "20%", left: "55%" }} color="#10B981" />
            <MapPin n={2} style={{ top: "55%", left: "20%" }} color="#10B981" />
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full z-5" viewBox="0 0 384 320" preserveAspectRatio="none">
              <path d="M 80 200 Q 160 160 215 130 Q 260 100 290 80" stroke="#10B981" strokeWidth="3" fill="none" strokeDasharray="6 4" opacity="0.8" />
            </svg>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-xl p-3 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Próxima parada</div>
                  <div className="text-sm font-600 text-slate-900">Campus Central</div>
                </div>
                <StatusBadge label="Em rota" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-16 py-24 bg-slate-50">
        <div className="text-center mb-16">
          <p className="text-sm font-600 text-blue-600 uppercase tracking-widest mb-3">Por que VanFácil</p>
          <h2 className="text-4xl font-700 text-slate-900 tracking-tight">Tudo que você precisa,<br />em um só lugar</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {BENEFITS.map(({ icon, title, desc, stat }) => (
            <Card key={title} className="p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">{icon}</div>
              <h3 className="text-lg font-600 text-slate-900 mb-3">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{desc}</p>
              <span className="inline-block text-xs font-600 text-green-700 bg-green-50 px-3 py-1 rounded-full">{stat}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-16 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-600 text-blue-600 uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-4xl font-700 text-slate-900 tracking-tight">Em 3 passos simples</h2>
          </div>
          <div className="grid grid-cols-3 gap-12">
            {[
              { n: "01", title: "Cadastre-se", desc: "Motorista ou aluno — crie sua conta em menos de 2 minutos." },
              { n: "02", title: "Configure sua rota e mensalidades", desc: "Motorista define paradas e valores; o sistema otimiza a rota e organiza as cobranças." },
              { n: "03", title: "Viajem juntos", desc: "Alunos acompanham a van em tempo real, pagam pelo Pix e fazem check-in digital." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-700 text-sm">{n}</div>
                <div>
                  <h3 className="font-600 text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-16 mb-24 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A3FD4, #0D1F6E)" }}>
        <div className="px-16 py-16 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-700 text-white mb-3">Pronto para começar?</h2>
            <p className="text-blue-200">Junte-se a mais de 2.400 alunos e 380 motoristas.</p>
          </div>
          <div className="flex gap-4">
            <Btn size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 py-3.5 font-600" onClick={() => onNav(1)}>Sou motorista</Btn>
            <Btn size="lg" className="bg-green-500 text-white hover:bg-green-600 rounded-full px-8 py-3.5 font-600" onClick={() => onNav(2)}>Sou aluno</Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-16 py-10 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex gap-8 text-sm text-slate-500">
            {["Privacidade", "Termos", "Suporte", "Blog"].map((l) => (
              <a key={l} className="hover:text-slate-800 cursor-pointer">{l}</a>
            ))}
          </div>
          <p className="text-xs text-slate-400">© 2026 VanFácil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
