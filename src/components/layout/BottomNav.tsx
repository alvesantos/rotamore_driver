import { useTheme } from "../../context/useTheme";

export type TabType = "profile" | "vehicles" | "home" | "quotes" | "settings";

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
      <div className="mx-auto flex max-w-md items-center justify-around px-1 py-1.5">
        {/* TAB 1: PERFIL */}
        <button
          type="button"
          onClick={() => onSelectTab("profile")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-center transition ${
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
            className={`flex size-9 items-center justify-center rounded-xl transition ${
              activeTab === "profile"
                ? isDark
                  ? "bg-cyan-500/15"
                  : "bg-blue-50"
                : ""
            }`}
          >
            {/* User Icon */}
            <svg
              className="size-5"
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
          <span className="text-[10px] tracking-tight">Perfil</span>
        </button>

        {/* TAB 2: VEÍCULOS */}
        <button
          type="button"
          onClick={() => onSelectTab("vehicles")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-center transition ${
            activeTab === "vehicles"
              ? isDark
                ? "text-cyan-400 font-bold"
                : "text-blue-600 font-bold"
              : isDark
              ? "text-slate-400 hover:text-slate-200 font-medium"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <div
            className={`flex size-9 items-center justify-center rounded-xl transition ${
              activeTab === "vehicles"
                ? isDark
                  ? "bg-cyan-500/15"
                  : "bg-blue-50"
                : ""
            }`}
          >
            {/* Car Icon */}
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === "vehicles" ? "2.2" : "1.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <span className="text-[10px] tracking-tight">Veículos</span>
        </button>

        {/* TAB 3: ESTRADA / ROTA (Centro - Home) */}
        <button
          type="button"
          onClick={() => onSelectTab("home")}
          className="flex flex-1 flex-col items-center justify-center relative -top-3.5 group"
        >
          <div
            className={`flex size-13 items-center justify-center rounded-full shadow-lg transition transform group-active:scale-95 ${
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
              className="size-6.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19L9 4h6l5 15H4z" />
              <line x1="12" y1="7" x2="12" y2="9" strokeWidth="2.5" />
              <line x1="12" y1="12" x2="12" y2="14" strokeWidth="2.5" />
              <line x1="12" y1="17" x2="12" y2="19" strokeWidth="2.5" />
            </svg>
          </div>
          <span
            className={`text-[10px] mt-0.5 transition ${
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

        {/* TAB 4: ORÇAMENTO */}
        <button
          type="button"
          onClick={() => onSelectTab("quotes")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-center transition ${
            activeTab === "quotes"
              ? isDark
                ? "text-cyan-400 font-bold"
                : "text-blue-600 font-bold"
              : isDark
              ? "text-slate-400 hover:text-slate-200 font-medium"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <div
            className={`flex size-9 items-center justify-center rounded-xl transition ${
              activeTab === "quotes"
                ? isDark
                  ? "bg-cyan-500/15"
                  : "bg-blue-50"
                : ""
            }`}
          >
            {/* Quote / Money Calculator Icon */}
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === "quotes" ? "2.2" : "1.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <line x1="8" x2="16" y1="8" y2="8" />
              <line x1="8" x2="16" y1="12" y2="12" />
              <line x1="8" x2="12" y1="16" y2="16" />
            </svg>
          </div>
          <span className="text-[10px] tracking-tight">Orçamento</span>
        </button>

        {/* TAB 5: AJUSTES */}
        <button
          type="button"
          onClick={() => onSelectTab("settings")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-center transition ${
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
            className={`flex size-9 items-center justify-center rounded-xl transition ${
              activeTab === "settings"
                ? isDark
                  ? "bg-cyan-500/15"
                  : "bg-blue-50"
                : ""
            }`}
          >
            {/* Settings Cog Icon */}
            <svg
              className="size-5"
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
          <span className="text-[10px] tracking-tight">Ajustes</span>
        </button>
      </div>
    </nav>
  );
}
