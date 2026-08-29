import { useTheme } from "../../context/useTheme";

export type TabType = "profile" | "home" | "settings";

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const { isDark } = useTheme();

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)] transition-colors ${
        isDark
          ? "border-slate-800/90 bg-slate-950/95 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
          : "border-slate-200 bg-white/95 shadow-[0_-8px_25px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {/* TAB 1: PERFIL (Bonequinho) */}
        <button
          type="button"
          onClick={() => onSelectTab("profile")}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition ${
            activeTab === "profile"
              ? isDark
                ? "text-cyan-400 font-bold"
                : "text-blue-600 font-bold"
              : isDark
              ? "text-slate-400 hover:text-slate-200 font-medium"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <div
            className={`flex size-10 items-center justify-center rounded-xl transition ${
              activeTab === "profile"
                ? isDark
                  ? "bg-cyan-500/15"
                  : "bg-blue-50"
                : ""
            }`}
          >
            {/* User Icon */}
            <svg
              className="size-5.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === "profile" ? "2.2" : "1.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-[11px] tracking-tight">Perfil</span>
        </button>

        {/* TAB 2: ESTRADA / ROTA (Centro - Home) */}
        <button
          type="button"
          onClick={() => onSelectTab("home")}
          className="flex flex-1 flex-col items-center justify-center relative -top-3.5 group"
        >
          <div
            className={`flex size-14 items-center justify-center rounded-full shadow-lg transition transform group-active:scale-95 ${
              activeTab === "home"
                ? "bg-linear-to-tr from-blue-600 via-cyan-500 to-cyan-400 text-white shadow-cyan-500/40 ring-4 " +
                  (isDark ? "ring-slate-950" : "ring-slate-100")
                : isDark
                ? "bg-slate-800 text-slate-300 border border-slate-700 shadow-black/40 ring-4 ring-slate-950"
                : "bg-white text-slate-600 border border-slate-200 shadow-md ring-4 ring-slate-100"
            }`}
          >
            {/* Road / Highway Icon */}
            <svg
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Road edges */}
              <path d="M4 19L9 4h6l5 15H4z" />
              {/* Center highway lane dividers */}
              <line x1="12" y1="7" x2="12" y2="9" strokeWidth="2.5" />
              <line x1="12" y1="12" x2="12" y2="14" strokeWidth="2.5" />
              <line x1="12" y1="17" x2="12" y2="19" strokeWidth="2.5" />
            </svg>
          </div>
          <span
            className={`text-[11px] mt-0.5 transition ${
              activeTab === "home"
                ? isDark
                  ? "text-cyan-400 font-bold"
                  : "text-blue-600 font-bold"
                : isDark
                ? "text-slate-400 font-medium"
                : "text-slate-500 font-medium"
            }`}
          >
            Início
          </span>
        </button>

        {/* TAB 3: CONFIGURAÇÕES (Engrenagem) */}
        <button
          type="button"
          onClick={() => onSelectTab("settings")}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition ${
            activeTab === "settings"
              ? isDark
                ? "text-cyan-400 font-bold"
                : "text-blue-600 font-bold"
              : isDark
              ? "text-slate-400 hover:text-slate-200 font-medium"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <div
            className={`flex size-10 items-center justify-center rounded-xl transition ${
              activeTab === "settings"
                ? isDark
                  ? "bg-cyan-500/15"
                  : "bg-blue-50"
                : ""
            }`}
          >
            {/* Settings Cog Icon */}
            <svg
              className="size-5.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === "settings" ? "2.2" : "1.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="text-[11px] tracking-tight">Ajustes</span>
        </button>
      </div>
    </nav>
  );
}

