import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

export default function Profile() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const initials =
    `${user?.name?.[0] || ""}${user?.lastname?.[0] || ""}`.toUpperCase() || "M";

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Driver Avatar & Identity */}
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-lg transition-colors ${
          isDark
            ? "border-slate-800 bg-slate-900/70"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="relative">
          <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-tr from-cyan-600 to-blue-600 text-2xl font-black text-white shadow-lg ring-4 ring-blue-500/20">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs ring-2 ring-white shadow">
            ✓
          </span>
        </div>

        <h2
          className={`mt-3 text-lg font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {user?.name} {user?.lastname}
        </h2>
        <span
          className={`text-xs ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {user?.email}
        </span>
        <span
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border ${
            isDark
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Motorista Credenciado
        </span>
      </div>

      {/* Dados Cadastrais */}
      <div
        className={`rounded-2xl border p-5 backdrop-blur-sm transition-colors ${
          isDark
            ? "border-slate-800 bg-slate-900/60"
            : "border-slate-200 bg-white"
        }`}
      >
        <h3
          className={`text-sm font-bold flex items-center gap-2 border-b pb-3 mb-3 ${
            isDark
              ? "text-white border-slate-800"
              : "text-slate-800 border-slate-200"
          }`}
        >
          <span>📋</span> Dados do Motorista
        </h3>

        <dl className="space-y-3 text-xs">
          <div
            className={`flex justify-between items-center py-1 border-b ${
              isDark ? "border-slate-800/50" : "border-slate-100"
            }`}
          >
            <dt className={isDark ? "text-slate-400" : "text-slate-500"}>
              Nome:
            </dt>
            <dd
              className={`font-semibold ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {user?.name} {user?.lastname}
            </dd>
          </div>
          <div
            className={`flex justify-between items-center py-1 border-b ${
              isDark ? "border-slate-800/50" : "border-slate-100"
            }`}
          >
            <dt className={isDark ? "text-slate-400" : "text-slate-500"}>
              E-mail:
            </dt>
            <dd
              className={`font-semibold ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {user?.email}
            </dd>
          </div>
          <div
            className={`flex justify-between items-center py-1 border-b ${
              isDark ? "border-slate-800/50" : "border-slate-100"
            }`}
          >
            <dt className={isDark ? "text-slate-400" : "text-slate-500"}>
              Celular:
            </dt>
            <dd
              className={`font-semibold ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {user?.phone || "-"}
            </dd>
          </div>
          <div
            className={`flex justify-between items-center py-1 border-b ${
              isDark ? "border-slate-800/50" : "border-slate-100"
            }`}
          >
            <dt className={isDark ? "text-slate-400" : "text-slate-500"}>
              Documento / CPF:
            </dt>
            <dd
              className={`font-mono ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {user?.document || "-"}
            </dd>
          </div>
          <div className="flex justify-between items-center py-1">
            <dt className={isDark ? "text-slate-400" : "text-slate-500"}>
              Tipo de Acesso:
            </dt>
            <dd className="font-semibold text-cyan-500 uppercase tracking-wider text-[11px]">
              Motorista ({user?.type})
            </dd>
          </div>
        </dl>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 py-3.5 text-sm font-bold text-red-500 transition hover:bg-red-500/20 active:scale-[0.98]"
      >
        <svg
          className="size-4.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sair da Conta
      </button>
    </div>
  );
}

