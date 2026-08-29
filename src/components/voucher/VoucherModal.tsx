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

  const isPasseio = ride.category === "passeio";
  const voucherCode = `#VOUCH-${ride.id.slice(0, 8).toUpperCase()}`;
  const driverName = user ? `${user.name} ${user.lastname}`.trim() : "Motorista Parceiro";
  const driverPhone = user?.phone || "";

  const handlePrint = () => {
    const formattedDate = formatDateBR(ride.ride_date);
    const vehicleText = ride.vehicle_name
      ? `${ride.vehicle_brand || ""} ${ride.vehicle_name} (${ride.vehicle_plate || ""})`.trim()
      : "Veículo Executivo";

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    let routeHTML = `
      <div class="route-item">
        <div class="route-title">📍 EMBARQUE (ORIGEM)</div>
        <div class="route-desc">${ride.pickup}</div>
      </div>
      <div class="route-item">
        <div class="route-title">🏁 DESTINO (DESEMBARQUE)</div>
        <div class="route-desc">${ride.destination}</div>
      </div>
    `;

    if (isPasseio && ride.stops && ride.stops.length > 0) {
      routeHTML = `
        <div class="route-item">
          <div class="route-title">📍 PONTO DE PARTIDA</div>
          <div class="route-desc">${ride.pickup}</div>
        </div>
        <div style="margin-top: 10px;">
          <div class="route-title">🏖️ ROTEIRO / PARADAS DO PASSEIO</div>
          <div style="margin-top: 4px;">
            ${ride.stops
              .map(
                (s, idx) =>
                  `<div style="font-size: 12px; font-weight: 600; color: #1e293b; margin-bottom: 2px;">• ${idx + 1}ª Parada: ${s}</div>`
              )
              .join("")}
          </div>
        </div>
      `;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Voucher - ${voucherCode}</title>
          <style>
            @page {
              margin: 15mm;
              size: auto;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 20px;
              display: flex;
              justify-content: center;
            }
            .ticket {
              width: 100%;
              max-width: 520px;
              border: 2px solid ${isPasseio ? "#0ea5e9" : "#2563eb"};
              border-radius: 16px;
              overflow: hidden;
              background: #ffffff;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            }
            .header {
              background: ${isPasseio ? "linear-gradient(135deg, #0284c7, #0f766e)" : "linear-gradient(135deg, #1e40af, #0284c7)"};
              color: #ffffff;
              padding: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo-title {
              font-size: 18px;
              font-weight: 900;
              letter-spacing: -0.5px;
            }
            .code {
              font-family: monospace;
              font-size: 11px;
              opacity: 0.9;
            }
            .badge {
              background: #10b981;
              color: white;
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .category-tag {
              display: inline-block;
              background: rgba(255,255,255,0.2);
              padding: 2px 8px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: bold;
              margin-top: 4px;
              text-transform: uppercase;
            }
            .body {
              padding: 24px;
            }
            .box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 14px;
              margin-bottom: 18px;
              display: flex;
              justify-content: space-between;
            }
            .label {
              font-size: 10px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 700;
              margin-bottom: 2px;
            }
            .val {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
            }
            .subval {
              font-size: 12px;
              color: #475569;
            }
            .route-section {
              border-left: 3px solid ${isPasseio ? "#0ea5e9" : "#2563eb"};
              padding-left: 14px;
              margin-bottom: 18px;
            }
            .route-item {
              margin-bottom: 12px;
            }
            .route-item:last-child {
              margin-bottom: 0;
            }
            .route-title {
              font-size: 10px;
              font-weight: 800;
              color: ${isPasseio ? "#0ea5e9" : "#2563eb"};
            }
            .route-desc {
              font-size: 13px;
              font-weight: 600;
              color: #1e293b;
            }
            .notes-box {
              background: #fffbeb;
              border: 1px solid #fef3c7;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 18px;
              font-size: 11px;
              color: #92400e;
            }
            .footer-info {
              border-top: 1px dashed #cbd5e1;
              padding-top: 14px;
              margin-bottom: 18px;
              display: flex;
              justify-content: space-between;
              font-size: 11px;
            }
            .price-card {
              background: #0f172a;
              color: white;
              border-radius: 12px;
              padding: 16px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .price-val {
              font-size: 22px;
              font-weight: 900;
              color: #34d399;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div>
                <div class="logo-title">ROTA+ EXECUTIVO</div>
                <div class="category-tag">${isPasseio ? "🏖️ PASSEIO TURÍSTICO" : "🚗 TRANSFER EXECUTIVO"}</div>
                <div class="code" style="margin-top: 4px;">VOUCHER: ${voucherCode}</div>
              </div>
              <div class="badge">${ride.status || "CONFIRMADO"}</div>
            </div>

            <div class="body">
              <div class="box">
                <div>
                  <div class="label">Passageiro(a)</div>
                  <div class="val">${ride.customer_name}</div>
                  <div class="subval">${formatPhone(ride.customer_phone)}</div>
                </div>
                <div style="text-align: right;">
                  <div class="label">Data & Horário</div>
                  <div class="val">${formattedDate}</div>
                  <div class="subval">⏰ ${ride.ride_time} • ${ride.passengers_count} pessoa(s)</div>
                </div>
              </div>

              <div class="route-section">
                ${routeHTML}
              </div>

              ${
                ride.notes
                  ? `<div class="notes-box"><strong>📝 Observações:</strong> ${ride.notes}</div>`
                  : ""
              }

              <div class="footer-info">
                <div>
                  <div class="label">Motorista</div>
                  <div style="font-weight: bold;">${driverName}</div>
                  <div style="color: #64748b;">${formatPhone(driverPhone)}</div>
                </div>
                <div style="text-align: right;">
                  <div class="label">Veículo</div>
                  <div style="font-weight: bold;">${vehicleText}</div>
                  ${
                    ride.vehicle_color
                      ? `<div style="color: #64748b;">Cor: ${ride.vehicle_color}</div>`
                      : ""
                  }
                </div>
              </div>

              <div class="price-card">
                <div>
                  <div style="font-size: 10px; text-transform: uppercase; color: #94a3b8;">Valor Total do Serviço</div>
                  <div style="font-size: 11px; color: #38bdf8;">${isPasseio ? "Passeio Privativo" : "Transfer Privativo"}</div>
                </div>
                <div class="price-val">${formatCurrency(ride.price)}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 3000);
    }, 350);
  };

  const generateWhatsAppMessage = () => {
    const formattedDate = formatDateBR(ride.ride_date);
    const vehicleText = ride.vehicle_name
      ? `${ride.vehicle_brand || ""} ${ride.vehicle_name} (${ride.vehicle_plate || ""})`.trim()
      : "A definir";

    let routeSection = `📍 *Embarque:* ${ride.pickup}\n🏁 *Destino:* ${ride.destination}\n`;
    if (isPasseio && ride.stops && ride.stops.length > 0) {
      routeSection = `📍 *Ponto de Partida:* ${ride.pickup}\n🏖️ *Roteiro de Paradas:*\n` +
        ride.stops.map((s, idx) => `   ${idx + 1}. ${s}`).join("\n") + "\n";
    }

    return (
      `🎟️ *VOUCHER DE ${isPasseio ? "PASSEIO TURÍSTICO" : "TRANSFER"} - ROTA+*\n` +
      `Código: ${voucherCode}\n\n` +
      `👤 *Passageiro:* ${ride.customer_name}\n` +
      `👥 *Pessoas:* ${ride.passengers_count} passageiro(s)\n` +
      `📅 *Data:* ${formattedDate} às ${ride.ride_time}\n\n` +
      routeSection +
      (ride.notes ? `📝 *Observações:* ${ride.notes}\n` : "") +
      `\n🚗 *Veículo:* ${vehicleText}\n` +
      `🧑‍✈️ *Motorista:* ${driverName} (${formatPhone(driverPhone)})\n\n` +
      `💰 *Valor Total:* ${formatCurrency(ride.price)}\n\n` +
      `_Obrigado por viajar com a Rota+ Transporte Executivo & Turismo._`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-sm my-auto animate-fadeIn">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Ticket Card Container */}
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden">
          {/* Ticket Header */}
          <div
            className={`p-5 text-white border-b border-slate-700/60 ${
              isPasseio
                ? "bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900"
                : "bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={logoImg}
                  alt="Rota+"
                  className="h-7 w-auto object-contain bg-white/10 rounded-md p-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm tracking-wide">VOUCHER</h3>
                    <span className="rounded bg-white/20 px-1.5 py-0.2 text-[9px] font-bold uppercase">
                      {isPasseio ? "🏖️ Passeio" : "🚗 Transfer"}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-200 uppercase font-mono tracking-wider block mt-0.5">
                    {voucherCode}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                {ride.status || "Confirmada"}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-5 space-y-4 text-xs">
            {/* Passenger & Date/Time Bar */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div>
                <span className="text-[10px] text-slate-400 block">Passageiro(a)</span>
                <span className="font-bold text-sm block truncate">{ride.customer_name}</span>
                <span className="text-[11px] text-slate-300 font-mono">
                  {formatPhone(ride.customer_phone)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Data e Horário</span>
                <span className="font-bold text-sm text-cyan-400 block">
                  {formatDateBR(ride.ride_date)}
                </span>
                <span className="text-[11px] font-bold text-slate-200">
                  ⏰ {ride.ride_time} ({ride.passengers_count} {ride.passengers_count === 1 ? "pessoa" : "pessoas"})
                </span>
              </div>
            </div>

            {/* Route Details (Transfer vs Passeio) */}
            <div className="space-y-2.5 border-l-2 border-cyan-500/40 pl-3 py-1">
              {isPasseio && ride.stops && ride.stops.length > 0 ? (
                <>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      📍 PONTO DE PARTIDA (EMBARQUE)
                    </span>
                    <span className="font-semibold text-xs leading-tight block text-slate-200">
                      {ride.pickup}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-cyan-400 font-bold block mb-1">
                      🏖️ ROTEIRO DE PARADAS ({ride.stops.length})
                    </span>
                    <div className="space-y-1">
                      {ride.stops.map((stop, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                          <span className="text-cyan-400 font-bold">• {idx + 1}ª:</span>
                          <span className="font-medium">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      📍 EMBARQUE (ORIGEM)
                    </span>
                    <span className="font-semibold text-xs leading-tight block text-slate-200">
                      {ride.pickup}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold block">
                      🏁 DESTINO (DESEMBARQUE)
                    </span>
                    <span className="font-semibold text-xs leading-tight block text-slate-200">
                      {ride.destination}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Flight / Notes if present */}
            {ride.notes && (
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 p-2.5 text-[11px]">
                <span className="font-bold text-slate-400 block text-[10px]">
                  📝 Observações:
                </span>
                <span className="text-slate-200 font-medium">{ride.notes}</span>
              </div>
            )}

            {/* Driver & Vehicle Details */}
            <div className="pt-3 border-t border-dashed border-slate-700/80 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block">Motorista Responsável</span>
                <span className="font-bold text-slate-200">{driverName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Veículo / Placa</span>
                <span className="font-bold text-slate-200">
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
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Valor Total do Serviço
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {isPasseio ? "Passeio Privativo" : "Transfer Privativo"}
                </span>
              </div>
              <span className="text-xl font-black text-emerald-400">
                {formatCurrency(ride.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-3 space-y-2">
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
