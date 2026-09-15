import type { CSSProperties } from "react";

// ─── Map placeholder ────────────────────────────────────────────────────────
// Hand-drawn grid + roads standing in for a real map tile provider.

export const MapBg = () => (
  <div className="absolute inset-0 map-grid overflow-hidden">
    {/* Main horizontal roads */}
    <div className="map-road-main-h" style={{ top: "30%", left: 0, right: 0 }} />
    <div className="map-road-main-h" style={{ top: "60%", left: 0, right: 0 }} />
    <div className="map-road-h" style={{ top: "45%", left: 0, right: 0 }} />
    <div className="map-road-h" style={{ top: "75%", left: 0, right: 0 }} />
    <div className="map-road-h" style={{ top: "15%", left: 0, right: 0 }} />
    {/* Main vertical roads */}
    <div className="map-road-main-v" style={{ left: "25%", top: 0, bottom: 0 }} />
    <div className="map-road-main-v" style={{ left: "65%", top: 0, bottom: 0 }} />
    <div className="map-road-v" style={{ left: "45%", top: 0, bottom: 0 }} />
    <div className="map-road-v" style={{ left: "15%", top: 0, bottom: 0 }} />
    <div className="map-road-v" style={{ left: "80%", top: 0, bottom: 0 }} />
    {/* Blocks */}
    <div className="absolute rounded-lg bg-slate-300 opacity-30" style={{ top: "17%", left: "16%", width: "8%", height: "11%" }} />
    <div className="absolute rounded-lg bg-slate-300 opacity-30" style={{ top: "32%", left: "26%", width: "18%", height: "12%" }} />
    <div className="absolute rounded-lg bg-slate-300 opacity-30" style={{ top: "47%", left: "46%", width: "18%", height: "11%" }} />
    <div className="absolute rounded-lg bg-slate-300 opacity-30" style={{ top: "17%", left: "47%", width: "17%", height: "10%" }} />
    <div className="absolute rounded-lg bg-slate-300 opacity-30" style={{ top: "62%", left: "16%", width: "28%", height: "11%" }} />
    <div className="absolute rounded-lg bg-slate-300 opacity-30" style={{ top: "62%", left: "66%", width: "13%", height: "11%" }} />
  </div>
);

export const VanIcon = ({ style }: { style?: CSSProperties }) => (
  <div className="absolute van-bounce z-20" style={style}>
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg pulse-ring">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="1" y="6" width="14" height="9" rx="2" fill="white" />
          <rect x="15" y="8" width="4" height="5" rx="1" fill="white" opacity="0.8" />
          <circle cx="4" cy="15" r="1.5" fill="#059669" />
          <circle cx="11" cy="15" r="1.5" fill="#059669" />
        </svg>
      </div>
    </div>
  </div>
);

export const MapPin = ({ n, style, color = "#1A3FD4" }: { n?: number | string; style: CSSProperties; color?: string }) => (
  <div className="absolute z-10" style={style}>
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-700 shadow-md" style={{ background: color, fontFamily: "'DM Sans', sans-serif" }}>
        {n ?? "●"}
      </div>
      <div className="w-0.5 h-3" style={{ background: color }} />
      <div className="w-2 h-1 rounded-full opacity-30" style={{ background: color }} />
    </div>
  </div>
);
