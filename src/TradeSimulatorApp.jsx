import React, { useState, useEffect } from "react";
import PriceChart from "./components/PriceChart";

const translations = {
  es: {
    simulator: "📈 Simulador de Trade",
    token: "Token (ej: bitcoin)",
    timeframe: "Temporalidad",
    capital: "Capital (USDT)",
    leverage: "Apalancamiento (ej: 3)",
    entry: "Entrada",
    stoploss: "Stop Loss",
    takeprofit: "Take Profit",
    simulate: "Simular Trade",
    chart: "Ver gráfico",
    hidechart: "Ocultar gráfico",
    result: "📊 Resultado de la simulación",
    sl: "🔻 Riesgo (SL)",
    liq: "⚠️ Liquidación",
    gain: "🟢 Ganancia",
    loss: "🔴 Pérdida",
    tp1: "TP1",
    tp2: "TP2",
    tp3: "TP3",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    language: "Idioma",
  },
  en: {
    simulator: "📈 Trade Simulator",
    token: "Token (e.g. bitcoin)",
    timeframe: "Timeframe",
    capital: "Capital (USDT)",
    leverage: "Leverage (e.g. 3)",
    entry: "Entry Price",
    stoploss: "Stop Loss",
    takeprofit: "Take Profit",
    simulate: "Simulate Trade",
    chart: "Show Chart",
    hidechart: "Hide Chart",
    result: "📊 Simulation Result",
    sl: "🔻 Risk (SL)",
    liq: "⚠️ Liquidation",
    gain: "🟢 Gain",
    loss: "🔴 Loss",
    tp1: "TP1",
    tp2: "TP2",
    tp3: "TP3",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
  },
};

const TradeSimulatorApp = () => {
  const [coin, setCoin] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("1");
  const [capital, setCapital] = useState(100);
  const [leverage, setLeverage] = useState(3);
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const [tp1, setTp1] = useState("");
  const [tp2, setTp2] = useState("");
  const [tp3, setTp3] = useState("");
  const [showChart, setShowChart] = useState(true);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Lee modo oscuro guardado en localStorage si existe
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("lang");
    return saved || "es";
  });

  useEffect(() => {
    // Guarda el modo oscuro y el idioma en localStorage para persistencia
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key) => translations[lang][key] || key;

  const handleSimulate = () => {
    const entryPrice = parseFloat(entry);
    const slPrice = parseFloat(sl);
    const cap = parseFloat(capital);
    const lev = parseFloat(leverage);
    const tps = [tp1, tp2, tp3].map((tp) => parseFloat(tp)).filter(Boolean);

    if (!entryPrice || !slPrice || !cap || !lev || tps.length === 0) {
      alert(lang === "es" ? "Completa todos los campos correctamente." : "Please fill all fields correctly.");
      return;
    }

    const liquidation = entryPrice - entryPrice / lev;
    const lossPct = ((entryPrice - slPrice) / entryPrice) * 100;
    const lossUSDT = ((entryPrice - slPrice) * cap * lev) / entryPrice;

    const gains = tps.map((tp) => {
      const gainPct = ((tp - entryPrice) / entryPrice) * 100;
      const gainUSDT = ((tp - entryPrice) * cap * lev) / entryPrice;
      return { tp, gainPct, gainUSDT };
    });

    setResult({
      sl: slPrice.toFixed(2),
      liq: liquidation.toFixed(2),
      loss: lossUSDT.toFixed(2),
      lossPct: lossPct.toFixed(2),
      gains,
    });
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col items-center p-4`}>
      <div className="w-full max-w-xl flex justify-between items-center mb-6">
        <button
          onClick={() => setDarkMode((d) => !d)}
          className={`py-2 px-4 rounded transition ${
            darkMode ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? t("lightMode") : t("darkMode")}
        </button>

        <select
          className="p-2 rounded bg-gray-700 text-white focus:outline-none"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label={t("language")}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <h1 className="text-3xl font-extrabold mb-6 text-center">{t("simulator")}</h1>

      <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-6">
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("token")}
          value={coin}
          onChange={(e) => setCoin(e.target.value.toLowerCase())}
        />
        <select
          className="p-3 rounded bg-gray-700 text-white focus:outline-none"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          aria-label={t("timeframe")}
        >
          <option value="1">1D</option>
          <option value="7">7D</option>
          <option value="30">30D</option>
        </select>
      </div>

      <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-6">
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("capital")}
          type="number"
          min="1"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
        />
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("leverage")}
          type="number"
          min="1"
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
        />
      </div>

      <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-6">
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("entry")}
          type="number"
          min="0"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("stoploss")}
          type="number"
          min="0"
          value={sl}
          onChange={(e) => setSl(e.target.value)}
        />
      </div>

      <div className="w-full max-w-xl grid grid-cols-3 gap-4 mb-8">
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("tp1")}
          type="number"
          min="0"
          value={tp1}
          onChange={(e) => setTp1(e.target.value)}
        />
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("tp2")}
          type="number"
          min="0"
          value={tp2}
          onChange={(e) => setTp2(e.target.value)}
        />
        <input
          className="p-3 rounded bg-gray-700 placeholder-gray-300 text-white focus:outline-none"
          placeholder={t("tp3")}
          type="number"
          min="0"
          value={tp3}
          onChange={(e) => setTp3(e.target.value)}
        />
      </div>

      <div className="w-full max-w-xl flex gap-4 mb-8">
        <button
          onClick={handleSimulate}
          className="flex-1 bg-green-600 hover:bg-green-700 rounded text-white font-semibold py-3 transition"
          aria-label={t("simulate")}
        >
          {t("simulate")}
        </button>
        <button
          onClick={() => setShowChart((s) => !s)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold py-3 transition"
          aria-label={showChart ? t("hidechart") : t("chart")}
        >
          {showChart ? t("hidechart") : t("chart")}
        </button>
      </div>

      {showChart && (
        <div className="w-full max-w-xl bg-gray-800 rounded p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {coin.toUpperCase()} ({timeframe}D)
          </h2>
          <PriceChart coin={coin} timeframe={timeframe} />
        </div>
      )}

      {result && (
        <div className="w-full max-w-xl bg-green-900 bg-opacity-40 rounded p-4 text-white space-y-2">
          <h3 className="text-lg font-semibold">{t("result")}</h3>
          <p>
            {t("sl")}: -{result.loss} USDT ({result.lossPct}%)
          </p>
          <p>
            {t("liq")}: ${result.liq}
          </p>
          {result.gains.map((g, i) => (
            <p key={i}>
              🎯 {t(`tp${i + 1}`)}: ${g.tp} | +{g.gainUSDT.toFixed(2)} USDT (
              {g.gainPct.toFixed(2)}%)
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeSimulatorApp;
