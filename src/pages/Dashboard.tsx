import { useAuth } from "../context/useAuth";
import logo from "../assets/rotamore.png";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Rota Mais Logo"
              className="size-10 rounded-xl object-cover shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/30"
            />
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Rota<span className="text-cyan-400">+</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                  Motorista
                </span>
              </span>
              <p className="text-[11px] text-slate-400">Portal do Motorista</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-white">
                {user?.name} {user?.lastname}
              </span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Motorista Parceiro
              </span>

              <button
                onClick={logout}
                title="Sair da conta"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
              >
                <svg
                  className="size-4"
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
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/50 p-6 sm:p-10 shadow-2xl">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20 mb-4">
              <span className="animate-ping size-1.5 rounded-full bg-cyan-400" />
              Sessão autenticada via Backend & PostgreSQL
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Olá, motorista <span className="text-cyan-400">{user?.name}</span>! 🚗
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-300">
              Bem-vindo ao seu aplicativo de viagens Rota+.
            </p>
          </div>
        </div>

        {/* Em Desenvolvimento Card */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-3xl shadow-lg">
              🏋️‍♂️
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-amber-300">
                  Painel em Desenvolvimento
                </h2>
                <span className="rounded-md bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                  Em Breve
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                Pode ir treinar na academia tranquilo! 💪 Quando você voltar, continuaremos a
                construção das funcionalidades completas deste dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* User Details & Driver Modules */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card: Perfil */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <span>👤</span> Dados do Motorista
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Ativo
              </span>
            </div>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-400">Nome:</dt>
                <dd className="font-medium text-slate-200">{user?.name} {user?.lastname}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">E-mail:</dt>
                <dd className="font-medium text-slate-200">{user?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Celular:</dt>
                <dd className="font-medium text-slate-200">{user?.phone || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Tipo de Perfil:</dt>
                <dd className="font-semibold text-emerald-300 capitalize">Motorista ({user?.type})</dd>
              </div>
            </dl>
          </div>

          {/* Card: Corridas / Rotas */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm opacity-80">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <span>🚗</span> Minhas Corridas
              </h3>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Em Breve
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Módulo de recebimento de chamadas de passageiros em tempo real, aceite de corridas e navegação GPS.
            </p>
          </div>

          {/* Card: Financeiro */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm opacity-80">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <span>💳</span> Meus Ganhos & Repasses
              </h3>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Em Breve
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Relatório de ganhos diários, semanais e mensais, histórico de corridas finalizadas e dados bancários para repasse via PIX.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4 text-center text-xs text-slate-500">
        © 2026 Rota+ • Portal do Motorista Parceiro.
      </footer>
    </div>
  );
}
