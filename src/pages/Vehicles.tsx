import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

export interface VehicleItem {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  plate: string;
  color: string;
  year: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const BRANDS = [
  "Chevrolet",
  "Fiat",
  "Hyundai",
  "Volkswagen",
  "Toyota",
  "Renault",
  "Honda",
  "Jeep",
  "Nissan",
  "Ford",
  "Peugeot",
  "Citroën",
  "Outra",
];

const POPULAR_COLORS = ["Branco", "Prata", "Preto", "Cinza", "Vermelho", "Azul"];

const formatPlateMask = (val: string) => {
  const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  if (clean.length > 3 && !isNaN(Number(clean[4]))) {
    // Standard format ABC-1234
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return clean; // Mercosul format ABC1D23
};

export default function Vehicles() {
  const { token } = useAuth();
  const { isDark } = useTheme();

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "Chevrolet",
    plate: "",
    color: "Prata",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (!token) return;

    let ignore = false;
    fetch(`${API_BASE_URL}/api/vehicles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!ignore) {
          setVehicles(data.vehicles || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Erro ao buscar veículos:", err);
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const handlePlateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, plate: formatPlateMask(e.target.value) }));
  };

  const handleAddVehicle = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.plate.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          brand: formData.brand.trim(),
          plate: formData.plate.toUpperCase().trim(),
          color: formData.color.trim(),
          year: Number(formData.year),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.vehicle) {
        setVehicles((prev) => [data.vehicle, ...prev]);
        setIsAdding(false);
        setFormData({
          name: "",
          brand: "Chevrolet",
          plate: "",
          color: "Prata",
          year: new Date().getFullYear(),
        });
        setFeedback({ type: "success", message: "Veículo cadastrado com sucesso!" });
      } else {
        setFeedback({ type: "error", message: data?.error || "Erro ao cadastrar veículo." });
      }
    } catch (err) {
      console.error("Falha ao cadastrar veículo:", err);
      setFeedback({ type: "error", message: "Não foi possível conectar ao servidor." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/vehicles/active`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setVehicles((prev) =>
          prev.map((v) => ({
            ...v,
            is_active: v.id === id,
          }))
        );
      }
    } catch (err) {
      console.warn("Erro ao alterar veículo ativo:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este veículo?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/vehicles?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.warn("Erro ao remover veículo:", err);
    }
  };

  const inputClass = `w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition ${
    isDark
      ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
      : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  }`;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 shadow-lg transition-colors ${
          isDark
            ? "border-slate-800 bg-gradient-to-br from-blue-950/70 via-slate-900 to-cyan-950/40"
            : "border-blue-100 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? "text-cyan-400" : "text-cyan-200"
              }`}
            >
              Frota do Motorista
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Meus Veículos
            </h1>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isDark ? "text-slate-300" : "text-blue-100"
              }`}
            >
              Cadastre e alterne entre os carros que você utiliza para rodar.
            </p>
          </div>
          <span className="text-3xl">🚗</span>
        </div>
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

      {/* Add Vehicle Button / Header Action */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold opacity-80">Carros Cadastrados ({vehicles.length})</h2>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-95 active:scale-95"
          >
            <span>+</span> Adicionar Veículo
          </button>
        )}
      </div>

      {/* Add Vehicle Form Modal/Card */}
      {isAdding && (
        <div
          className={`rounded-2xl border p-5 shadow-xl animate-fadeIn ${
            isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-700/50">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>🚘</span> Novo Veículo
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕ Fechar
            </button>
          </div>

          <form onSubmit={handleAddVehicle} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold mb-1 opacity-80">Modelo / Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Onix Plus / HB20"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-80">Marca</label>
                <select
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  className={inputClass}
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block font-bold mb-1 opacity-80">Placa</label>
                <input
                  type="text"
                  required
                  placeholder="ABC1D23"
                  value={formData.plate}
                  onChange={handlePlateChange}
                  className={`${inputClass} font-mono uppercase`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-80">Cor</label>
                <select
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className={inputClass}
                >
                  {POPULAR_COLORS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-80">Ano</label>
                <input
                  type="number"
                  required
                  min={1990}
                  max={2030}
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, year: Number(e.target.value) }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                disabled={isSubmitting}
                className={`flex-1 rounded-xl border py-2.5 font-bold transition ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-300"
                    : "border-slate-300 bg-slate-100 text-slate-700"
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-2.5 font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Cadastrando..." : "Salvar Carro"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      {isLoading ? (
        <div className="py-10 text-center text-xs text-slate-400">
          Carregando veículos...
        </div>
      ) : vehicles.length === 0 ? (
        <div
          className={`rounded-2xl border p-8 text-center space-y-3 ${
            isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
          }`}
        >
          <span className="text-4xl block">🚗</span>
          <h3 className="font-bold text-sm">Nenhum veículo cadastrado</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Cadastre seu primeiro carro para começar a receber chamadas e realizar corridas.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-md"
          >
            Cadastrar Carro Agora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`rounded-2xl border p-4 transition-all relative overflow-hidden ${
                v.is_active
                  ? isDark
                    ? "border-cyan-500/40 bg-slate-900/90 ring-1 ring-cyan-500/20 shadow-lg"
                    : "border-blue-300 bg-blue-50/40 ring-1 ring-blue-400/20 shadow-md"
                  : isDark
                  ? "border-slate-800 bg-slate-900/50"
                  : "border-slate-200 bg-white shadow-2xs"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl text-2xl ${
                      v.is_active
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    🚗
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm">{v.name}</h4>
                      {v.is_active && (
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Em Uso
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block">
                      {v.brand} • {v.color} • {v.year}
                    </span>
                  </div>
                </div>

                {/* Mercosul / Plate Badge */}
                <div className="flex flex-col items-end gap-2">
                  <span className="font-mono text-xs font-black tracking-wider px-2 py-0.5 rounded border border-slate-700 bg-slate-950 text-slate-200 shadow-2xs">
                    {v.plate}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                {!v.is_active ? (
                  <button
                    type="button"
                    onClick={() => handleSetActive(v.id)}
                    className={`font-semibold transition hover:underline ${
                      isDark ? "text-cyan-400" : "text-blue-600"
                    }`}
                  >
                    Definir como carro ativo
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    ✓ Carro principal selecionado
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  className="text-red-400 hover:text-red-300 text-xs transition"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
