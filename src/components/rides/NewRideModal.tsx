import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/useTheme";
import type { Ride, ServiceCategory } from "../../types/ride";
import type { VehicleItem } from "../../pages/Vehicles";

interface NewRideModalProps {
  onClose: () => void;
  onSuccess: (newRide: Ride) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const formatCurrency = (val: number) => {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const parseCurrency = (input: string): number => {
  const clean = input.replace(/\D/g, "");
  const num = Number(clean) / 100;
  return isNaN(num) ? 0 : num;
};

const applyPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function NewRideModal({ onClose, onSuccess }: NewRideModalProps) {
  const { user, token } = useAuth();
  const { isDark } = useTheme();

  const [category, setCategory] = useState<ServiceCategory>("transfer");
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState<string[]>(["Praia do Francês", "Praia do Gunga"]);
  const [notes, setNotes] = useState("");
  const [rideDate, setRideDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [rideTime, setRideTime] = useState(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  });
  const [priceInput, setPriceInput] = useState("");

  // Fetch vehicles to auto-select or populate dropdown
  useEffect(() => {
    if (!token) return;

    let ignore = false;
    fetch(`${API_BASE_URL}/api/vehicles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!ignore && Array.isArray(data.vehicles)) {
          const list: VehicleItem[] = data.vehicles;
          setVehicles(list);
          const active = list.find((v) => v.is_active);
          if (active) {
            setSelectedVehicleId(active.id);
          } else if (list.length > 0) {
            setSelectedVehicleId(list[0].id);
          }
        }
      })
      .catch((err) => console.warn("Erro ao buscar veículos para a corrida:", err));

    return () => {
      ignore = true;
    };
  }, [token]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomerPhone(applyPhoneMask(e.target.value));
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = parseCurrency(e.target.value);
    setPriceInput(formatCurrency(num));
  };

  const handleAddStop = () => {
    setStops((prev) => [...prev, ""]);
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 1) return;
    setStops((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleStopChange = (index: number, val: string) => {
    setStops((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const priceNum = parseCurrency(priceInput);

    const cleanStops = stops.map((s) => s.trim()).filter(Boolean);
    const finalDestination =
      category === "transfer"
        ? destination.trim()
        : cleanStops.join(" ➔ ");

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !pickup.trim() ||
      !finalDestination ||
      priceNum <= 0
    ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      category,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.replace(/\D/g, ""),
      passengers_count: Number(passengersCount),
      pickup: pickup.trim(),
      destination: finalDestination,
      stops: category === "passeio" ? cleanStops : [],
      notes: notes.trim(),
      ride_date: rideDate,
      ride_time: rideTime,
      price: priceNum,
      vehicle_id: selectedVehicleId ? selectedVehicleId : undefined,
      status: "agendada",
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/rides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ride) {
        onSuccess(data.ride);
      } else {
        setErrorMessage(data?.error || "Erro ao salvar agendamento.");
      }
    } catch (err) {
      console.error("Falha ao salvar corrida:", err);
      setErrorMessage("Não foi possível conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const driverName = user ? `${user.name} ${user.lastname}`.trim() : "Motorista Parceiro";

  const inputClass = `w-full rounded-xl border px-3 py-2 text-xs outline-none transition ${
    isDark
      ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
      : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-md my-auto rounded-3xl border p-5 shadow-2xl animate-fadeIn ${
          isDark ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-700/40">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>{category === "transfer" ? "🚗" : "🏖️"}</span>
              Nova Corrida / Voucher
            </h2>
            <p className="text-[11px] opacity-70">
              {category === "transfer" ? "Transfer Ponto a Ponto" : "Passeio com Múltiplos Destinos"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition text-xs"
          >
            ✕
          </button>
        </div>

        {/* Category Switcher: Transfer vs Passeio */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-3.5">
          <button
            type="button"
            onClick={() => setCategory("transfer")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
              category === "transfer"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🚗</span> Transfer (Direto)
          </button>

          <button
            type="button"
            onClick={() => setCategory("passeio")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
              category === "passeio"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🏖️</span> Passeio (Roteiro)
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400 font-semibold">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold mb-1 text-[11px] opacity-80">Nome do Cliente *</label>
              <input
                type="text"
                required
                placeholder="Ex: João da Silva"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[11px] opacity-80">Telefone / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="(00) 00000-0000"
                value={customerPhone}
                onChange={handlePhoneChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Passengers Count */}
          <div>
            <label className="block font-bold mb-1 text-[11px] opacity-80">Quantidade de Passageiros</label>
            <select
              value={passengersCount}
              onChange={(e) => setPassengersCount(Number(e.target.value))}
              className={inputClass}
            >
              <option value={1}>1 Passageiro</option>
              <option value={2}>2 Passageiros</option>
              <option value={3}>3 Passageiros</option>
              <option value={4}>4 Passageiros</option>
              <option value={5}>5 Passageiros</option>
              <option value={6}>6+ Passageiros (Van/SUV)</option>
            </select>
          </div>

          {/* Pickup & Destination (Transfer Mode) */}
          {category === "transfer" ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1 text-[11px] opacity-80">Embarque (Origem) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aeroporto"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[11px] opacity-80">Destino (Desembarque) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hotel Ponta Verde"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ) : (
            /* Passeio Mode: Origin + Dynamic Stops */
            <div className="space-y-2.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div>
                <label className="block font-bold mb-1 text-[11px] text-cyan-400">
                  📍 Ponto de Partida (Embarque) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hotel / Pousada"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-[11px] text-emerald-400">
                    🏖️ Destinos / Paradas do Passeio
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                  >
                    + Adicionar Parada
                  </button>
                </div>

                <div className="space-y-1.5">
                  {stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 w-5">
                        {idx + 1}ª
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Parada ${idx + 1} (Ex: Praia do Gunga)`}
                        value={stop}
                        onChange={(e) => handleStopChange(idx, e.target.value)}
                        className={inputClass}
                      />
                      {stops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(idx)}
                          className="flex size-7 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs shrink-0 transition"
                          title="Remover parada"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes / Flight Info */}
          <div>
            <label className="block font-bold mb-1 text-[11px] opacity-80">Observações / Voo</label>
            <input
              type="text"
              placeholder="Número do voo LA1234, portão 2, paradas para almoço..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold mb-1 text-[11px] opacity-80">Data da Viagem *</label>
              <input
                type="date"
                required
                value={rideDate}
                onChange={(e) => setRideDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[11px] opacity-80">Horário *</label>
              <input
                type="time"
                required
                value={rideTime}
                onChange={(e) => setRideTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Vehicle Selection & Driver Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold mb-1 text-[11px] opacity-80">Motorista</label>
              <input
                type="text"
                disabled
                value={driverName}
                className={`${inputClass} opacity-75 cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[11px] opacity-80">Veículo</label>
              {vehicles.length === 0 ? (
                <div className="text-[11px] text-amber-400 py-2">Nenhum carro cadastrado</div>
              ) : vehicles.length === 1 ? (
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] font-semibold truncate">
                  🚗 {vehicles[0].name} ({vehicles[0].plate})
                </div>
              ) : (
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className={inputClass}
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} - {v.plate}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Price Input */}
          <div>
            <label className="block font-bold mb-1 text-[11px] opacity-80">Valor do Serviço (R$) *</label>
            <input
              type="text"
              required
              placeholder="R$ 0,00"
              value={priceInput}
              onChange={handlePriceChange}
              className={`${inputClass} text-sm font-bold text-emerald-500`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-slate-700/30">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-2.5 font-bold text-white shadow-md hover:opacity-90 active:scale-95 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Salvando..." : "Salvar Voucher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
