import logo from "../../assets/rotamore.png";
import { useTheme } from "../../context/useTheme";

interface MobileHeaderProps {
  isOnline: boolean;
  onToggleOnline: () => void;
}

export default function MobileHeader({ isOnline, onToggleOnline }: MobileHeaderProps) {
  const { isDark } = useTheme();

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 py-3 sm:px-6 transition-colors ${
        isDark
          ? "border-slate-800/80 bg-slate-950/90"
          : "border-slate-200 bg-white/90 shadow-2xs"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="Rota Mais Logo"
            className="size-8 rounded-xl object-cover shadow-sm ring-1 ring-cyan-400/30"
          />
          <span
            className={`text-base font-black tracking-tight flex items-center gap-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Rota<span className="text-cyan-500">+</span>
          </span>
        </div>

        {/* Online / Offline Driver Switch */}
        <button
          onClick={onToggleOnline}
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold transition ${
            isOnline
              ? isDark
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs"
              : isDark
              ? "bg-slate-800 text-slate-400 border border-slate-700"
              : "bg-slate-200 text-slate-600 border border-slate-300"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
            }`}
          />
          {isOnline ? "Online para Corridas" : "Offline"}
        </button>
      </div>
    </header>
  );
}

