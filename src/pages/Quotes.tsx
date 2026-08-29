import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

interface QuoteItem {
  id?: string;
  pickup: string;
  destination: string;
  price: number;
  created_at?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const MACEIO_POPULAR_PLACES = [
  "Ponta Verde",
  "Pajuçara",
  "Jatiúca",
  "Aeroporto Zumbi dos Palmares",
  "Praia do Francês",
  "Cruz das Almas",
  "Centro",
  "Barra de São Miguel",
  "Benedito Bentes",
  "Tabuleiro",
];

const formatCurrency = (val: number) => {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const parseCurrency = (input: string): number => {
  const clean = input.replace(/\D/g, "");
  const num = Number(clean) / 100;
  return isNaN(num) ? 0 : num;
};

export default function Quotes() {
  const { user, token } = useAuth();
  const { isDark } = useTheme();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [currentQuote, setCurrentQuote] = useState<QuoteItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<QuoteItem[]>([]);

  useEffect(() => {
    if (!token) return;

    let ignore = false;
    fetch(`${API_BASE_URL}/api/quotes?limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!ignore && Array.isArray(data.quotes)) {
          setHistory(data.quotes);
        }
      })
      .catch((err) => console.warn("Erro ao buscar histórico de orçamentos:", err));

    return () => {
      ignore = true;
    };
  }, [token]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseCurrency(e.target.value);
    setPriceInput(formatCurrency(num));
  };

  const handleGenerateQuote = async (e: FormEvent) => {
    e.preventDefault();
    const priceNum = parseCurrency(priceInput);
    if (!pickup.trim() || !destination.trim() || priceNum <= 0) return;

    const tempQuote: QuoteItem = {
      pickup: pickup.trim(),
      destination: destination.trim(),
      price: priceNum,
      created_at: new Date().toISOString(),
    };

    // Save to backend and get persistent ID
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/quotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pickup: tempQuote.pickup,
            destination: tempQuote.destination,
            price: tempQuote.price,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.quote) {
            setCurrentQuote(data.quote);
            setHistory((prev) => [data.quote, ...prev.filter((q) => q.id !== data.quote.id)]);
            return;
          }
        }
      } catch (err) {
        console.warn("Erro ao salvar orçamento no servidor:", err);
      }
    }

    setCurrentQuote(tempQuote);
    setHistory((prev) => [tempQuote, ...prev]);
  };

  const handleDeleteQuote = async (id?: string) => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este orçamento?")) return;

    if (currentQuote?.id === id) {
      setCurrentQuote(null);
    }

    setHistory((prev) => prev.filter((item) => item.id !== id));

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/quotes?id=${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("Erro ao excluir orçamento na API:", err);
      }
    }
  };

  const generateWhatsAppMessage = (quote: QuoteItem) => {
    const driverName = user ? `${user.name} ${user.lastname}`.trim() : "Motorista Parceiro";
    const driverPhone = user?.phone || "";

    return (
      `🚗 *ORÇAMENTO DE CORRIDA - ROTA+*\n\n` +
      `📍 *Embarque:* ${quote.pickup}\n` +
      `🏁 *Destino:* ${quote.destination}\n` +
      `💰 *Valor da Viagem:* ${formatCurrency(quote.price)}\n\n` +
      `👤 *Motorista:* ${driverName}\n` +
      (driverPhone ? `📱 *Contato:* ${driverPhone}\n\n` : `\n`) +
      `_Orçamento calculado via aplicativo Rota+ Maceió._`
    );
  };

  const handleShareWhatsApp = (quote: QuoteItem) => {
    const msg = generateWhatsAppMessage(quote);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleCopyText = (quote: QuoteItem) => {
    const msg = generateWhatsAppMessage(quote);
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inputClass = `w-full rounded-xl border px-3.5 py-3 text-xs outline-none transition ${
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
              Maceió e Região Metropolitana 🌴
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Criar Orçamento de Viagem
            </h1>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isDark ? "text-slate-300" : "text-blue-100"
              }`}
            >
              Defina o trajeto, calcule o valor e compartilhe com o passageiro.
            </p>
          </div>
          <span className="text-3xl">💰</span>
        </div>
      </div>

      {/* Quote Form */}
      <div
        className={`rounded-2xl border p-5 backdrop-blur-sm transition-colors ${
          isDark
            ? "border-slate-800 bg-slate-900/60"
            : "border-slate-200 bg-white shadow-xs"
        }`}
      >
        <form onSubmit={handleGenerateQuote} className="space-y-4 text-xs">
          {/* Embarque */}
          <div>
            <label className="block font-bold mb-1 opacity-80 flex items-center gap-1.5">
              <span>📍</span> Local de Embarque (Origem)
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Ponta Verde / Hotel Maceió"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className={inputClass}
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {MACEIO_POPULAR_PLACES.slice(0, 4).map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => setPickup(place)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                    isDark
                      ? "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-cyan-400/50"
                      : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  + {place}
                </button>
              ))}
            </div>
          </div>

          {/* Destino */}
          <div>
            <label className="block font-bold mb-1 opacity-80 flex items-center gap-1.5">
              <span>🏁</span> Local de Destino
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Aeroporto Zumbi dos Palmares / Francês"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={inputClass}
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {MACEIO_POPULAR_PLACES.slice(3, 7).map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => setDestination(place)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                    isDark
                      ? "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-cyan-400/50"
                      : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  + {place}
                </button>
              ))}
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block font-bold mb-1 opacity-80 flex items-center gap-1.5">
              <span>💵</span> Valor da Corrida (R$)
            </label>
            <input
              type="text"
              required
              placeholder="R$ 0,00"
              value={priceInput}
              onChange={handlePriceChange}
              className={`${inputClass} text-sm font-bold text-emerald-500`}
            />
          </div>

          {/* Clean text without icon */}
          <button
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-3 font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99] flex items-center justify-center"
          >
            Gerar Orçamento
          </button>
        </form>
      </div>

      {/* Generated Quote Preview Card */}
      {currentQuote && (
        <div
          className={`rounded-2xl border p-5 shadow-xl animate-fadeIn ${
            isDark
              ? "border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900"
              : "border-blue-200 bg-gradient-to-b from-blue-50 to-white"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-700/50">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <span>📋</span> Orçamento Pronto
            </span>
            {currentQuote.id && (
              <button
                type="button"
                onClick={() => handleDeleteQuote(currentQuote.id)}
                className="text-[11px] text-red-400 hover:text-red-300 font-medium"
              >
                Excluir
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400">📍</span>
              <div>
                <span className="text-[10px] text-slate-400 block">Embarque</span>
                <span className="font-semibold">{currentQuote.pickup}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">🏁</span>
              <div>
                <span className="text-[10px] text-slate-400 block">Destino</span>
                <span className="font-semibold">{currentQuote.destination}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/40 flex justify-between items-center">
              <span className="text-slate-400">Valor Proposto:</span>
              <span className="text-lg font-black text-emerald-400">
                {formatCurrency(currentQuote.price)}
              </span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Copy */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => handleShareWhatsApp(currentQuote)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => handleCopyText(currentQuote)}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition active:scale-[0.98] ${
                copied
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                  : isDark
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{copied ? "✓" : "📄"}</span>
              {copied ? "Copiado!" : "Copiar Texto"}
            </button>
          </div>
        </div>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <div
          className={`rounded-2xl border p-5 backdrop-blur-sm transition-colors ${
            isDark
              ? "border-slate-800 bg-slate-900/40"
              : "border-slate-200 bg-white shadow-2xs"
          }`}
        >
          <h3 className="text-xs font-bold mb-3 flex items-center justify-between opacity-80">
            <span>🕒 Orçamentos Salvos ({history.length})</span>
          </h3>

          <div className="space-y-2.5">
            {history.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`flex items-center justify-between p-3 rounded-xl border transition ${
                  isDark
                    ? "border-slate-800/80 bg-slate-800/40 hover:border-slate-700"
                    : "border-slate-100 bg-slate-50 hover:bg-slate-100/80"
                }`}
              >
                <div className="space-y-0.5 text-xs max-w-[55%]">
                  <div className="font-semibold truncate">
                    📍 {item.pickup} → {item.destination}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-500">
                    {formatCurrency(item.price)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(item)}
                    title="Enviar no WhatsApp"
                    className="rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 text-xs hover:bg-emerald-600 hover:text-white transition font-medium"
                  >
                    📲 WhatsApp
                  </button>
                  {item.id && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuote(item.id)}
                      title="Excluir Orçamento"
                      className="rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1.5 text-xs hover:bg-red-500 hover:text-white transition"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
