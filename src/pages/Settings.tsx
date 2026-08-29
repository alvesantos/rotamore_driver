import { useTheme } from "../context/useTheme";

export default function Settings() {
  const { isDark, setTheme } = useTheme();

  return (
    <div className="space-y-5 animate-fadeIn">
      <div
        className={`rounded-2xl border p-5 shadow-lg transition-colors ${
          isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white"
        }`}
      >
        <h2
          className={`text-base font-bold flex items-center gap-2 mb-4 border-b pb-3 ${
            isDark ? "text-white border-slate-800" : "text-slate-800 border-slate-200"
          }`}
        >
          <span>⚙️</span> Configurações do Sistema
        </h2>

        <div className="space-y-4 text-xs">
          {/* Setting Item: Tema da Interface */}
          <div
            className={`flex items-center justify-between py-2 border-b ${
              isDark ? "border-slate-800/50" : "border-slate-100"
            }`}
          >
            <div>
              <span
                className={`font-bold block ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                Tema da Interface
              </span>
              <span
                className={`text-[11px] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Escolha o tema de visualização
              </span>
            </div>

            {/* Theme Switcher Toggle */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isDark
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isDark
                    ? "bg-cyan-500 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span>🌙</span> Escuro
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  !isDark
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>☀️</span> Claro
              </button>
            </div>
          </div>

          {/* Setting Item: Versão do Sistema */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span
                className={`font-bold block ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                Versão do Sistema
              </span>
              <span
                className={`text-[11px] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Rota+ Driver Core
              </span>
            </div>
            <span
              className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg border ${
                isDark
                  ? "text-cyan-400 bg-cyan-950/50 border-cyan-800/40"
                  : "text-blue-700 bg-blue-50 border-blue-200"
              }`}
            >
              V0.1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

