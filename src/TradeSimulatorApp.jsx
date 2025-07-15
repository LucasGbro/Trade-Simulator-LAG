import React, { useState } from "react";
import PriceChart from "./components/PriceChart";

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
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("es");

  const t = (key) => {
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
      },
    };
    return translations[lang][key];
  };

  const handleSimulate = () => {
    const entryPrice = parseFloat(entry);
    const slPrice = parseFloat(sl);
    const cap = parseFloat(capital);
    const lev = parseFloat(leverage);
    const tps = [tp1, tp2, tp3].map((tp) => parseFloat(tp)).filter(Boolean);

    if (!entryPrice || !slPrice || !cap || !lev || tps.length === 0) {
      alert("Completa todos los campos correctamente.");
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
    <div className={`p-4 max-w-xl mx-auto ${darkMode ? "bg-[#111] text-white" : "bg-white text-black"} rounded-xl shadow-lg min-h-screen`}>
      <div className="flex justify-between mb-4">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-700 text-sm rounded hover:opacity-80">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <select
          className="p-2 rounded bg-gray-700 text-sm"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">{t("simulator")}</h1>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input className="p-2 bg-[#222] rounded" placeholder={t("token")} value={coin} onChange={(e) => setCoin(e.target.value)} />
        <select className="p-2 bg-[#222] rounded" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="1">1D</option>
          <option value="7">7D</option>
          <option value="30">30D</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input className="p-2 bg-[#222] rounded" placeholder={t("capital")} value={capital} onChange={(e) => setCapital(e.target.value)} />
        <input className="p-2 bg-[#222] rounded" placeholder={t("leverage")} value={leverage} onChange={(e) => setLeverage(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input className="p-2 bg-[#222] rounded" placeholder={t("entry")} value={entry} onChange={(e) => setEntry(e.target.value)} />
        <input className="p-2 bg-[#222] rounded" placeholder={t("stoploss")} value={sl} onChange={(e) => setSl(e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <input className="p-2 bg-[#222] rounded" placeholder={t("tp1")} value={tp1} onChange={(e) => setTp1(e.target.value)} />
        <input className="p-2 bg-[#222] rounded" placeholder={t("tp2")} value={tp2} onChange={(e) => setTp2(e.target.value)} />
        <input className="p-2 bg-[#222] rounded" placeholder={t("tp3")} value={tp3} onChange={(e) => setTp3(e.target.value)} />
      </div>

      <div className="flex gap-2 mb-4">
        <button className="w-full p-2 bg-green-600 rounded hover:bg-green-700 transition" onClick={handleSimulate}>{t("simulate")}</button>
        <button className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 transition" onClick={() => setShowChart(!showChart)}>
          {showChart ? t("hidechart") : t("chart")}
        </button>
      </div>

      {showChart && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-center">{coin.toUpperCase()} ({timeframe}D)</h2>
          <div className="bg-[#222] p-2 rounded">
            <PriceChart coin={coin} timeframe={timeframe} />
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-[#1e1e1e] rounded text-sm space-y-2 border border-green-700">
          <h3 className="text-base font-semibold text-green-500">{t("result")}</h3>
          <p>{t("sl")}: -{result.loss} USDT ({result.lossPct}%)</p>
          <p>{t("liq")}: ${result.liq}</p>
          {result.gains.map((g, i) => (
            <p key={i}>
              🎯 {t(`tp${i + 1}`)}: ${g.tp} | +{g.gainUSDT.toFixed(2)} USDT ({g.gainPct.toFixed(2)}%)
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeSimulatorApp;
