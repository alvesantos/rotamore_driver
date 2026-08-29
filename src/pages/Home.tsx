import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import type { Ride } from "../types/ride";
import VoucherModal from "../components/voucher/VoucherModal";
import NewRideModal from "../components/rides/NewRideModal";
import RidesHistory from "./RidesHistory";

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

export default function Home() {
  const { user, token } = useAuth();
  const { isDark } = useTheme();

  const [viewMode, setViewMode] = useState<"home" | "history">("home");
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewRideOpen, setIsNewRideOpen] = useState<boolean>(false);
  const [selectedVoucherRide, setSelectedVoucherRide] = useState<Ride | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let ignore = false;
    fetch(`${API_BASE_URL}/api/rides?limit=5`, {
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
        console.warn("Erro ao buscar corridas recentes:", err);
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleDeleteRide = async (id: string) => {
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
        console.warn("Erro ao deletar corrida:", err);
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

  const handleRideCreated = (newRide: Ride) => {
    setRides((prev) => [newRide, ...prev.slice(0, 4)]);
    setIsNewRideOpen(false);
    setSelectedVoucherRide(newRide);
  };

  // If user navigated into full history sub-view
  if (viewMode === "history") {
    return (
      <>
        {isNewRideOpen && (
          <NewRideModal
            onClose={() => setIsNewRideOpen(false)}
            onSuccess={handleRideCreated}
          />
        )}
        <RidesHistory
          onBack={() => setViewMode("home")}
          onOpenNewRide={() => setIsNewRideOpen(true)}
        />
      </>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Voucher Modal */}
      {selectedVoucherRide && (
        <VoucherModal
          ride={selectedVoucherRide}
          onClose={() => setSelectedVoucherRide(null)}
        />
      )}

      {/* New Ride Form Dialog Modal */}
      {isNewRideOpen && (
        <NewRideModal
          onClose={() => setIsNewRideOpen(false)}
          onSuccess={handleRideCreated}
        />
      )}

      {/* Welcome Greeting Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg transition-colors ${
          isDark
            ? "border-slate-800 bg-gradient-to-br from-blue-950/70 via-slate-900 to-cyan-950/40"
            : "border-blue-100 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
        }`}
      >
        <div className="relative z-10">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              isDark ? "text-cyan-400" : "text-cyan-200"
            }`}
          >
            Painel do Motorista
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            Olá, {user?.name}! 🚗
          </h1>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              isDark ? "text-slate-300" : "text-blue-100"
            }`}
          >
            Gerencie suas corridas agendadas e emita vouchers executivos.
          </p>
        </div>
      </div>

      {/* Minhas Corridas Section */}
      <div
        className={`rounded-2xl border p-4 backdrop-blur-sm transition-colors ${
          isDark
            ? "border-slate-800 bg-slate-900/60"
            : "border-slate-200 bg-white shadow-2xs"
        }`}
      >
        {/* Section Header with "Ver mais" */}
        <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-700/40">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span>🗓️</span> Minhas Corridas
            </h2>
            <span className="text-[10px] text-slate-400">Últimos agendamentos</span>
          </div>

          <button
            type="button"
            onClick={() => setViewMode("history")}
            className={`text-xs font-bold transition hover:underline ${
              isDark ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            Ver mais →
          </button>
        </div>

        {/* List of Latest 5 Rides */}
        {isLoading ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Carregando corridas...
          </div>
        ) : rides.length === 0 ? (
          <div className="py-6 text-center space-y-1.5">
            <span className="text-2xl block">🚗</span>
            <p className="text-xs font-semibold text-slate-300">
              Nenhuma corrida cadastrada ainda
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Clique no botão abaixo para agendar a primeira viagem e emitir o voucher.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {rides.map((ride) => {
              const isMenuOpen = openMenuId === ride.id;

              return (
                <div
                  key={ride.id}
                  className={`rounded-xl border p-3 transition-all relative ${
                    isDark
                      ? "border-slate-800/80 bg-slate-850/60 hover:border-slate-700"
                      : "border-slate-100 bg-slate-50 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 text-xs max-w-[78%]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold truncate">{ride.customer_name}</span>
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
                          <span className="text-amber-400/90 truncate max-w-[100px]">
                            • {ride.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & 3-dots Menu */}
                    <div className="flex flex-col items-end gap-1">
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
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                          title="Opções"
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
                              onClick={() => handleDeleteRide(ride.id)}
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

        {/* Bottom Button to Add New Ride */}
        <button
          type="button"
          onClick={() => setIsNewRideOpen(true)}
          className="mt-4 w-full rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <span>+</span> Adicionar Nova Corrida
        </button>
      </div>
    </div>
  );
}
