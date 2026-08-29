import { useState } from "react";
import { useAuth } from "../context/useAuth";
import logo from "../assets/rotamore.png";

type Tab = "profile" | "home" | "settings";
type Theme = "dark" | "light";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("rotamore_theme") as Theme) || "dark";
  });

  const isDark = theme === "dark";

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("rotamore_theme", newTheme);
  };

  // Initials for avatar
  const initials =
    `${user?.name?.[0] || ""}${user?.lastname?.[0] || ""}`.toUpperCase() || "M";

  return (
    <div
      className={`min-h-screen flex flex-col justify-between pb-24 select-none transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"
      }`}
    >
      {/* Top Mobile Header */}
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
            onClick={() => setIsOnline(!isOnline)}
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

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-5 space-y-5">
        {/* ================= TAB 1: HOME (ROTA / INÍCIO) ================= */}
        {activeTab === "home" && (
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
                  Pronto para a próxima rota? Seu aplicativo está conectado ao
                  sistema.
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
                    Pode ir treinar na academia tranquilo! 💪 Quando você
                    voltar, continuaremos a construção das telas de chamadas e
                    mapa em tempo real.
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
        )}

        {/* ================= TAB 2: PROFILE (PERFIL / DADOS DO MOTORISTA) ================= */}
        {activeTab === "profile" && (
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
        )}

        {/* ================= TAB 3: SETTINGS (CONFIGURAÇÕES) ================= */}
        {activeTab === "settings" && (
          <div className="space-y-5 animate-fadeIn">
            <div
              className={`rounded-2xl border p-5 shadow-lg transition-colors ${
                isDark
                  ? "border-slate-800 bg-slate-900/60"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h2
                className={`text-base font-bold flex items-center gap-2 mb-4 border-b pb-3 ${
                  isDark
                    ? "text-white border-slate-800"
                    : "text-slate-800 border-slate-200"
                }`}
              >
                <span>⚙️</span> Configurações do Sistema
              </h2>

              <div className="space-y-4 text-xs">
                {/* Setting Item: Tema da Interface (Modo Escuro / Claro) */}
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
                      onClick={() => handleThemeChange("dark")}
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
                      onClick={() => handleThemeChange("light")}
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
        )}
      </main>

      {/* ================= BOTTOM NAVIGATION BAR (NavBottom) ================= */}
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
            onClick={() => setActiveTab("profile")}
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
            onClick={() => setActiveTab("home")}
            className="flex flex-1 flex-col items-center justify-center relative -top-3.5 group"
          >
            <div
              className={`flex size-14 items-center justify-center rounded-full shadow-lg transition transform group-active:scale-95 ${
                activeTab === "home"
                  ? "bg-linear-to-tr from-blue-600 via-cyan-500 to-cyan-400 text-white shadow-cyan-500/40 ring-4 " +
                    (isDark ? "ring-slate-950" : "ring-slate-100")
                  : (isDark
                      ? "bg-slate-800 text-slate-300 border border-slate-700 shadow-black/40 ring-4 ring-slate-950"
                      : "bg-white text-slate-600 border border-slate-200 shadow-md ring-4 ring-slate-100")
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
            onClick={() => setActiveTab("settings")}
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
    </div>
  );
}
