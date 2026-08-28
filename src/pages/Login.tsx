import { useState, useEffect } from "react";
import type { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../assets/rotamore.png";

type Method = "phone" | "email";
type IconName = "phone" | "mail" | "lock" | "eye" | "arrow";
const inputClass =
  "h-[52px] w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const Icon = ({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) => {
  const paths: Record<IconName, ReactNode> = {
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 20 20 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

const Field = ({
  id,
  label,
  icon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon?: IconName;
}) => (
  <div>
    <label
      className="mb-2 block text-[13px] font-bold text-slate-700"
      htmlFor={id}
    >
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon name={icon} className="size-4.5" />
        </span>
      )}
      <input
        id={id}
        className={`${inputClass} ${icon ? "px-12" : "px-4"}`}
        {...props}
      />
    </div>
  </div>
);

function BrandPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-[radial-gradient(circle_at_8%_92%,rgba(0,198,238,.25),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(19,110,221,.38),transparent_36%),linear-gradient(145deg,#071b45_0%,#06347d_55%,#05183b_100%)] px-[clamp(40px,5vw,78px)] py-9 text-white lg:flex lg:flex-col">
      <div className="absolute -right-64 top-[12%] size-125 rounded-full border border-cyan-300/10 shadow-[0_0_0_80px_rgba(33,141,241,.035),0_0_0_160px_rgba(33,141,241,.025)]" />
      <img
        src={logo}
        alt="Rota Mais"
        className="relative z-10 size-40 rounded-[34px] object-cover shadow-2xl xl:size-40"
      />
      <div className="relative z-10 my-auto max-w-xl pb-24 pt-14">
        <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.16em] text-cyan-200">
          Sua jornada começa aqui
        </span>
        <h1 className="my-6 text-[clamp(38px,4vw,60px)] font-extrabold leading-[1.08] tracking-tighter">
          Seu próximo destino
          <br />
          está a um <em className="not-italic text-amber-400">clique.</em>
        </h1>
        <p className="max-w-md text-[clamp(15px,1.3vw,18px)] leading-7 text-blue-100/80">
          Conectando você aos melhores caminhos, com segurança e praticidade.
        </p>
      </div>
      <div className="absolute bottom-20 left-[-8%] h-40 w-[90%] rotate-[-8deg] rounded-[50%] border-t-[3px] border-cyan-300/30" />
      <p className="relative z-10 mt-auto text-xs text-blue-200/50">
        © 2026 Rota+ • Viaje mais. Viva mais.
      </p>
    </aside>
  );
}

const MobileLogo = () => (
  <img
    src={logo}
    alt="Rota Mais"
    className="mx-auto mb-7 size-36 rounded-[30px] object-cover shadow-xl lg:hidden"
  />
);

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(380px,46%)_1fr]">
    <BrandPanel />
    <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_90%_5%,rgba(24,140,241,.06),transparent_28%)] px-5 py-10 sm:px-10">
      {children}
    </section>
  </main>
);

const Heading = ({ signup = false }: { signup?: boolean }) => (
  <div className="mb-7 text-center">
    <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-[#0a2145]">
      {signup ? "Crie sua conta" : "Bem-vindo de volta!"}
    </h2>
    <p className="text-sm text-slate-500">
      {signup
        ? "Preencha seus dados e comece uma nova jornada com a gente."
        : "Entre na sua conta para continuar sua jornada."}
    </p>
  </div>
);

const PrimaryButton = ({
  children,
  isLoading = false,
}: {
  children: ReactNode;
  isLoading?: boolean;
}) => (
  <button
    type="submit"
    disabled={isLoading}
    className="flex h-13.25 w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#06448f] to-[#0879d5] font-bold text-white shadow-[0_9px_22px_rgba(5,83,165,.22)] transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
  >
    {isLoading ? (
      <span className="inline-flex items-center gap-2">
        <svg className="size-5 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Entrando...
      </span>
    ) : (
      <>
        {children}
        <Icon name="arrow" />
      </>
    )}
  </button>
);

function Login() {
  const [method, setMethod] = useState<Method>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(identifier, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error || "Erro ao efetuar login. Verifique suas credenciais.");
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setMethod("email");
    setIdentifier(email);
    setPassword(pass);
    setError(null);
  };

  const methodIcon: IconName = method === "phone" ? "phone" : "mail";

  return (
    <AuthLayout>
      <div className="w-full max-w-117.5">
        <MobileLogo />
        <Heading />

        {/* Quick Test Seed Account Buttons */}
        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
          <p className="text-xs font-bold text-blue-900 mb-2 flex items-center justify-between">
            <span>⚡ Contas de Teste (Clique para preencher):</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("rogab@admin.com", "r0g4b@2026!")}
              className="flex flex-col items-start rounded-lg border border-blue-200 bg-white p-2 text-left shadow-2xs transition hover:border-blue-400 hover:bg-blue-50/50"
            >
              <span className="text-xs font-bold text-blue-900">👑 Admin</span>
              <span className="text-[11px] text-slate-500 font-mono truncate w-full">rogab@admin.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("ricberns@gmail.com", "1254101254@Abc")}
              className="flex flex-col items-start rounded-lg border border-emerald-200 bg-white p-2 text-left shadow-2xs transition hover:border-emerald-400 hover:bg-emerald-50/50"
            >
              <span className="text-xs font-bold text-emerald-900">🚗 Motorista</span>
              <span className="text-[11px] text-slate-500 font-mono truncate w-full">ricberns@gmail.com</span>
            </button>
          </div>
        </div>

        {/* Method Switcher: Celular ou E-mail */}
        <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1.5">
          {(["email", "phone"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMethod(item);
                setError(null);
              }}
              className={`flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
                method === item
                  ? "bg-white text-blue-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon
                name={item === "phone" ? "phone" : "mail"}
                className="size-4.5"
              />
              {item === "phone" ? "Celular" : "E-mail"}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <svg className="size-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            key={method}
            id="login"
            label={method === "phone" ? "Número de celular" : "Seu e-mail"}
            icon={methodIcon}
            type={method === "phone" ? "tel" : "email"}
            placeholder={
              method === "phone" ? "(00) 00000-0000" : "voce@email.com"
            }
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <div>
            <div className="mb-2 flex justify-between">
              <label
                htmlFor="password"
                className="text-[13px] font-bold text-slate-700"
              >
                Sua senha
              </label>
              <a href="#recuperar" className="text-xs font-bold text-blue-600">
                Esqueci minha senha
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="lock" className="size-4.5" />
              </span>
              <input
                id="password"
                type={show ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClass} px-12`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="eye" className="size-4.5" />
              </button>
            </div>
          </div>

          <PrimaryButton isLoading={isSubmitting}>Entrar</PrimaryButton>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs text-slate-400 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
          ou
        </div>

        <p className="text-center text-[13px] text-slate-500">
          Ainda não tem uma conta?{" "}
          <Link to="/cadastro" className="font-bold text-blue-600 hover:underline">
            Cadastre-se grátis
          </Link>
        </p>

        <p className="mx-auto mt-7 max-w-sm text-center text-[10px] text-slate-400">
          Ao continuar, você concorda com nossos Termos de Uso e Política de
          Privacidade.
        </p>
      </div>
    </AuthLayout>
  );
}

export { AuthLayout, Field, Heading, Icon, MobileLogo, PrimaryButton };
export default Login;
