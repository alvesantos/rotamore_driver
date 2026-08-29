import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import type { Ride } from "../types/ride";
import VoucherModal from "../components/voucher/VoucherModal";

interface RidesHistoryProps {
  onBack: () => void;
  onOpenNewRide: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const formatDateBR = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const formatCurrency = (val: number) => {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function RidesHistory({ onBack, onOpenNewRide }: RidesHistoryProps) {
  const { user, token } = useAuth();
  const { isDark } = useTheme();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [rides, setRides] = useState<Ride[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedVoucherRide, setSelectedVoucherRide] = useState<Ride | null>(null);

  useEffect(() => {
    if (!token) return;

    let ignore = false;
    fetch(`${API_BASE_URL}/api/rides?year=${selectedYear}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!ignore && Array.isArray(data.rides)) {
          setRides(data.rides);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Erro ao buscar histórico de corridas:", err);
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token, selectedYear]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta corrida?")) return;
    setOpenMenuId(null);

    setRides((prev) => prev.filter((r) => r.id !== id));

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/rides?id=${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("Erro ao remover corrida:", err);
      }
    }
  };

  const handleShareWhatsApp = (ride: Ride) => {
    setOpenMenuId(null);
    const driverName = user ? `${user.name} ${user.lastname}`.trim() : "Motorista";
    const msg =
      `🚗 *CORRIDA AGENDADA - ROTA+*\n\n` +
      `👤 *Cliente:* ${ride.customer_name}\n` +
      `📅 *Data:* ${formatDateBR(ride.ride_date)} às ${ride.ride_time}\n` +
      `📍 *Embarque:* ${ride.pickup}\n` +
      `🏁 *Destino:* ${ride.destination}\n` +
      (ride.notes ? `📝 *Observações:* ${ride.notes}\n` : "") +
      `💰 *Valor:* ${formatCurrency(ride.price)}\n` +
      `🧑‍✈️ *Motorista:* ${driverName}\n`;

    const digits = ride.customer_phone.replace(/\D/g, "");
    let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    if (digits.length >= 10) {
      const waNumber = digits.startsWith("55") ? digits : `55${digits}`;
      url = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`;
    }
    window.open(url, "_blank");
  };

  const filteredRides = rides.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.customer_name.toLowerCase().includes(term) ||
      r.pickup.toLowerCase().includes(term) ||
      r.destination.toLowerCase().includes(term) ||
      (r.notes && r.notes.toLowerCase().includes(term))
    );
  });

  const totalYearAmount = filteredRides.reduce((acc, r) => acc + r.price, 0);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Voucher Modal */}
      {selectedVoucherRide && (
        <VoucherModal
          ride={selectedVoucherRide}
          onClose={() => setSelectedVoucherRide(null)}
        />
      )}

      {/* Top Navigation / Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition shadow-xs ${
            isDark
              ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>←</span> Voltar
        </button>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={`rounded-xl border px-2.5 py-1 text-xs font-bold outline-none transition ${
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-slate-300 bg-white text-slate-800"
            }`}
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear - 1}>{currentYear - 1}</option>
          </select>

          <button
            type="button"
            onClick={onOpenNewRide}
            className="flex items-center gap-1 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-90 active:scale-95 transition"
          >
            <span>+</span> Nova Corrida
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className={`rounded-2xl border p-4 shadow-sm ${
          isDark
            ? "border-slate-800 bg-slate-900/90"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">Histórico de Corridas {selectedYear}</h1>
            <p className="text-[11px] opacity-70">
              {filteredRides.length} viagens registradas neste ano
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Total Acumulado</span>
            <span className="text-sm font-black text-emerald-400">
              {formatCurrency(totalYearAmount)}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Buscar por cliente, destino ou voo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition ${
              isDark
                ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
                : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
            }`}
          />
        </div>
      </div>

      {/* Rides List */}
      {isLoading ? (
        <div className="py-10 text-center text-xs text-slate-400">
          Carregando corridas do ano...
        </div>
      ) : filteredRides.length === 0 ? (
        <div
          className={`rounded-2xl border p-8 text-center space-y-2 ${
            isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
          }`}
        >
          <span className="text-3xl block">🗓️</span>
          <h3 className="font-bold text-sm">Nenhuma corrida encontrada</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {search
              ? "Nenhum resultado para os termos pesquisados."
              : `Você ainda não possui corridas cadastradas em ${selectedYear}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredRides.map((ride) => {
            const isMenuOpen = openMenuId === ride.id;

            return (
              <div
                key={ride.id}
                className={`rounded-2xl border p-3.5 transition-all relative ${
                  isDark
                    ? "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                    : "border-slate-200 bg-white hover:bg-slate-50 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 text-xs max-w-[78%]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm truncate">{ride.customer_name}</span>
                      <span className="rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.2 text-[9px] font-bold">
                        {ride.category === "passeio" ? "🏖️ Passeio" : "🚗 Transfer"}
                      </span>
                      <span className="rounded-full bg-slate-700/50 text-slate-300 px-1.5 py-0.2 text-[9px] font-medium">
                        {ride.passengers_count}pax
                      </span>
                    </div>

                    <div className="text-[11px] opacity-80 truncate">
                      {ride.category === "passeio" && ride.stops && ride.stops.length > 0
                        ? `🏖️ ${ride.pickup} ➔ ${ride.stops.join(" ➔ ")}`
                        : `📍 ${ride.pickup} → ${ride.destination}`}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>📅 {formatDateBR(ride.ride_date)}</span>
                      <span>⏰ {ride.ride_time}</span>
                      {ride.notes && (
                        <span className="text-amber-400/90 truncate max-w-[120px]">
                          • {ride.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & 3-dots Menu */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-black text-emerald-400">
                      {formatCurrency(ride.price)}
                    </span>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : ride.id);
                        }}
                        className={`flex size-7 items-center justify-center rounded-lg border text-sm transition ${
                          isDark
                            ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                            : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        ⋮
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute right-0 top-8 z-50 w-44 rounded-xl border p-1.5 shadow-xl animate-fadeIn text-xs ${
                            isDark
                              ? "border-slate-700 bg-slate-900 text-slate-200 shadow-black/80"
                              : "border-slate-200 bg-white text-slate-800 shadow-slate-300"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setSelectedVoucherRide(ride);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-blue-500/15 hover:text-cyan-400 transition"
                          >
                            <span>🎟️</span> Ver Voucher / Imprimir
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(ride)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-emerald-500/15 hover:text-emerald-400 transition"
                          >
                            <span>📲</span> Enviar no WhatsApp
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(ride.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-red-400 hover:bg-red-500/15 transition border-t border-slate-700/40 mt-1 pt-1.5"
                          >
                            <span>🗑️</span> Excluir Corrida
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
