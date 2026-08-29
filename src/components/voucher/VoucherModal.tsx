import { useState } from "react";
import type { Ride } from "../../types/ride";
import { useAuth } from "../../context/useAuth";
import logoImg from "../../assets/rotamore.png";

interface VoucherModalProps {
  ride: Ride;
  onClose: () => void;
}

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

export default function VoucherModal({ ride, onClose }: VoucherModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const voucherCode = `#VOUCH-${ride.id.slice(0, 8).toUpperCase()}`;
  const driverName = user ? `${user.name} ${user.lastname}`.trim() : "Motorista Parceiro";
  const driverPhone = user?.phone || "";

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppMessage = () => {
    const formattedDate = formatDateBR(ride.ride_date);
    const vehicleText = ride.vehicle_name
      ? `${ride.vehicle_brand || ""} ${ride.vehicle_name} (${ride.vehicle_plate || ""})`.trim()
      : "A definir";

    return (
      `🎟️ *VOUCHER DE VIAGEM CONFIRMADO - ROTA+*\n` +
      `Código: ${voucherCode}\n\n` +
      `👤 *Passageiro:* ${ride.customer_name}\n` +
      `👥 *Pessoas:* ${ride.passengers_count} passageiro(s)\n` +
      `📅 *Data:* ${formattedDate} às ${ride.ride_time}\n\n` +
      `📍 *Embarque:* ${ride.pickup}\n` +
      `🏁 *Destino:* ${ride.destination}\n` +
      (ride.notes ? `📝 *Observações/Voo:* ${ride.notes}\n` : "") +
      `\n🚗 *Veículo:* ${vehicleText}\n` +
      `🧑‍✈️ *Motorista:* ${driverName} (${formatPhone(driverPhone)})\n\n` +
      `💰 *Valor Total:* ${formatCurrency(ride.price)}\n\n` +
      `_Obrigado por viajar com a Rota+ Transporte Executivo._`
    );
  };

  const handleShareWhatsApp = () => {
    const msg = generateWhatsAppMessage();
    const phoneDigits = ride.customer_phone.replace(/\D/g, "");
    let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    if (phoneDigits.length >= 10) {
      const waNumber = phoneDigits.startsWith("55") ? phoneDigits : `55${phoneDigits}`;
      url = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`;
    }
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Print Dedicated CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-voucher, #printable-voucher * {
            visibility: visible;
          }
          #printable-voucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
            border: 2px solid #000 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-sm my-auto animate-fadeIn">
        {/* Close Button on Modal (no-print) */}
        <div className="no-print flex justify-end mb-2">
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Printable Ticket Container */}
        <div
          id="printable-voucher"
          className="rounded-3xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden print:border-black print:text-black print:bg-white"
        >
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 p-5 text-white border-b border-slate-700/60 print:bg-white print:text-black print:border-b-2 print:border-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={logoImg}
                  alt="Rota+"
                  className="h-7 w-auto object-contain bg-white/10 rounded-md p-0.5 print:invert"
                />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">VOUCHER DE VIAGEM</h3>
                  <span className="text-[10px] text-blue-200 uppercase font-mono tracking-wider print:text-gray-600">
                    {voucherCode}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase print:border-black print:text-black">
                {ride.status || "Confirmada"}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-5 space-y-4 text-xs">
            {/* Passenger & Date/Time Bar */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
              <div>
                <span className="text-[10px] text-slate-400 block print:text-gray-600">Passageiro(a)</span>
                <span className="font-bold text-sm block truncate">{ride.customer_name}</span>
                <span className="text-[11px] text-slate-300 font-mono print:text-gray-800">
                  {formatPhone(ride.customer_phone)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block print:text-gray-600">Data e Horário</span>
                <span className="font-bold text-sm text-cyan-400 print:text-black block">
                  {formatDateBR(ride.ride_date)}
                </span>
                <span className="text-[11px] font-bold text-slate-200 print:text-gray-800">
                  ⏰ {ride.ride_time} ({ride.passengers_count} {ride.passengers_count === 1 ? "pessoa" : "pessoas"})
                </span>
              </div>
            </div>

            {/* Route Details */}
            <div className="space-y-2.5 border-l-2 border-cyan-500/40 pl-3 py-1 print:border-black">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold block print:text-black">
                  📍 EMBARQUE (ORIGEM)
                </span>
                <span className="font-semibold text-xs leading-tight block text-slate-200 print:text-black">
                  {ride.pickup}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-cyan-400 font-bold block print:text-black">
                  🏁 DESTINO (DESEMBARQUE)
                </span>
                <span className="font-semibold text-xs leading-tight block text-slate-200 print:text-black">
                  {ride.destination}
                </span>
              </div>
            </div>

            {/* Flight / Notes if present */}
            {ride.notes && (
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 p-2.5 text-[11px] print:bg-gray-100 print:border-gray-300">
                <span className="font-bold text-slate-400 block text-[10px] print:text-gray-700">
                  📝 Observações / Voo:
                </span>
                <span className="text-slate-200 font-medium print:text-black">{ride.notes}</span>
              </div>
            )}

            {/* Driver & Vehicle Details */}
            <div className="pt-3 border-t border-dashed border-slate-700/80 flex items-center justify-between text-[11px] print:border-gray-400">
              <div>
                <span className="text-[10px] text-slate-400 block print:text-gray-600">Motorista Responsável</span>
                <span className="font-bold text-slate-200 print:text-black">{driverName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block print:text-gray-600">Veículo / Placa</span>
                <span className="font-bold text-slate-200 print:text-black">
                  {ride.vehicle_name ? `${ride.vehicle_name}` : "Carro do Motorista"}
                </span>
                {ride.vehicle_plate && (
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {ride.vehicle_plate} • {ride.vehicle_color || ""}
                  </span>
                )}
              </div>
            </div>

            {/* Total Price */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950/60 border border-slate-800 flex items-center justify-between print:bg-gray-200 print:border-black">
              <div>
                <span className="text-[10px] text-slate-400 block print:text-gray-700 uppercase font-semibold">
                  Valor Total do Serviço
                </span>
                <span className="text-[10px] text-emerald-400 print:text-black font-medium">
                  Transporte Privativo
                </span>
              </div>
              <span className="text-xl font-black text-emerald-400 print:text-black">
                {formatCurrency(ride.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (no-print) */}
        <div className="no-print mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition"
            >
              <span>🖨️</span> Imprimir / PDF
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition active:scale-95 ${
              copied
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span>{copied ? "✓ Copiado" : "📋"}</span>
            {copied ? "Dados do Voucher Copiados!" : "Copiar Dados do Voucher"}
          </button>
        </div>
      </div>
    </div>
  );
}

