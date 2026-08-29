import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
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

const applyPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const applyDocumentMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { isDark } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: formatPhone(user?.phone),
    document: formatDocument(user?.document),
  });

  const initials =
    `${user?.name?.[0] || ""}${user?.lastname?.[0] || ""}`.toUpperCase() || "M";

  const handleStartEdit = () => {
    setFormData({
      name: user?.name || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      phone: formatPhone(user?.phone),
      document: formatDocument(user?.document),
    });
    setFeedback(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFeedback(null);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: applyPhoneMask(e.target.value) }));
  };

  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, document: applyDocumentMask(e.target.value) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const cleanPhone = formData.phone.replace(/\D/g, "");
    const cleanDoc = formData.document.replace(/\D/g, "");

    const res = await updateProfile({
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      phone: cleanPhone,
      document: cleanDoc,
    });

    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: "success", message: "Dados atualizados com sucesso!" });
      setIsEditing(false);
    } else {
      setFeedback({ type: "error", message: res.error || "Erro ao salvar alterações." });
    }
  };

  const inputClass = `w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition ${
    isDark
      ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
      : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  }`;

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

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-semibold animate-fadeIn ${
            feedback.type === "success"
              ? isDark
                ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
              : isDark
              ? "bg-red-950/60 border-red-800/60 text-red-300"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <span>{feedback.type === "success" ? "✓" : "⚠️"}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Dados do Motorista (View or Edit Form) */}
      <div
        className={`rounded-2xl border p-5 backdrop-blur-sm transition-colors ${
          isDark
            ? "border-slate-800 bg-slate-900/60"
            : "border-slate-200 bg-white shadow-xs"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-3 mb-4 ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <h3
            className={`text-sm font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            <span>📋</span> Dados do Motorista
          </h3>

          {!isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                isDark
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25"
                  : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Alterar Dados
            </button>
          )}
        </div>

        {/* View Mode */}
        {!isEditing ? (
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
        ) : (
          /* Edit Form Mode */
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold mb-1 opacity-80">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Nome"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 opacity-80">Sobrenome</label>
                <input
                  type="text"
                  required
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lastname: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Sobrenome"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-80">E-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={inputClass}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-80">Celular</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={handlePhoneChange}
                className={inputClass}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-80">Documento / CPF</label>
              <input
                type="text"
                required
                value={formData.document}
                onChange={handleDocumentChange}
                className={inputClass}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className={`flex-1 rounded-xl border py-2.5 font-bold transition ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-2.5 font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        )}
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
