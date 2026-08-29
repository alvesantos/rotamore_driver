import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

export default function Home() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Welcome Greeting Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 shadow-xl transition-colors ${
          isDark
            ? "border-slate-800 bg-gradient-to-br from-blue-950/70 via-slate-900 to-cyan-950/40"
            : "border-blue-100 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
        }`}
      >
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider ${
              isDark ? "text-cyan-400" : "text-cyan-200"
            }`}
          >
            Bem-vindo de volta
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Olá, {user?.name}! 🚗
          </h1>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              isDark ? "text-slate-300" : "text-blue-100"
            }`}
          >
            Pronto para a próxima rota? Seu aplicativo está conectado ao sistema.
          </p>
        </div>
      </div>

      {/* Em Desenvolvimento Card */}
      <div
        className={`rounded-2xl border p-5 shadow-lg transition-colors ${
          isDark
            ? "border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent"
            : "border-amber-200 bg-amber-50/80"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-500 text-2xl shadow-md">
            🏋️‍♂️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2
                className={`text-base font-bold ${
                  isDark ? "text-amber-300" : "text-amber-800"
                }`}
              >
                Painel em Desenvolvimento
              </h2>
              <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                Em Breve
              </span>
            </div>
            <p
              className={`mt-1 text-xs leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Pode ir treinar na academia tranquilo! 💪 Quando você voltar,
              continuaremos a construção das telas de chamadas e mapa em tempo
              real.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions / Modules */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card: Corridas */}
        <div
          className={`rounded-xl border p-4 backdrop-blur-sm transition-colors ${
            isDark
              ? "border-slate-800/80 bg-slate-900/60"
              : "border-slate-200 bg-white shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🗺️</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isDark
                  ? "text-amber-400 bg-amber-950/60 border-amber-800/40"
                  : "text-amber-700 bg-amber-100 border-amber-200"
              }`}
            >
              Em breve
            </span>
          </div>
          <h3
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            Minhas Corridas
          </h3>
          <p
            className={`text-[11px] mt-1 leading-snug ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Histórico de trajetos e chamadas.
          </p>
        </div>

        {/* Card: Ganhos */}
        <div
          className={`rounded-xl border p-4 backdrop-blur-sm transition-colors ${
            isDark
              ? "border-slate-800/80 bg-slate-900/60"
              : "border-slate-200 bg-white shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">💰</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isDark
                  ? "text-amber-400 bg-amber-950/60 border-amber-800/40"
                  : "text-amber-700 bg-amber-100 border-amber-200"
              }`}
            >
              Em breve
            </span>
          </div>
          <h3
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            Meus Ganhos
          </h3>
          <p
            className={`text-[11px] mt-1 leading-snug ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Repasses e extrato PIX diário.
          </p>
        </div>
      </div>
    </div>
  );
}
