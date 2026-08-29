import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

const formatPhone = (phone?: string) => {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

const formatDocument = (doc?: string) => {
  if (!doc) return "-";
  const digits = doc.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }
  return doc;
};

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
              {formatPhone(user?.phone)}
            </dd>
          </div>
          <div className="flex justify-between items-center py-1">
            <dt className={isDark ? "text-slate-400" : "text-slate-500"}>
              Documento:
            </dt>
            <dd
              className={`font-mono font-medium ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {formatDocument(user?.document)}
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
