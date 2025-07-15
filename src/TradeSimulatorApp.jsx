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
        alert_fill: "Completa todos los campos correctamente.",
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
        alert_fill: "Please fill all fields correctly.",
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
      alert(t("alert_fill"));
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
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <header className="w-full max-w-3xl p-4 flex justify-between items-center">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <select
          className="px-3 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </header>

      <main
        className={`w-full max-w-3xl p-6 rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        } transition-colors duration-500`}
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center">{t("simulator")}</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("token")}
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
          />
          <select
            className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="1">1D</option>
            <option value="7">7D</option>
            <option value="30">30D</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("capital")}
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            min={0}
          />
          <input
            type="number"
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("leverage")}
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            min={1}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("entry")}
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            min={0}
          />
          <input
            type="number"
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("stoploss")}
            value={sl}
            onChange={(e) => setSl(e.target.value)}
            min={0}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <input
            type="number"
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("tp1")}
            value={tp1}
            onChange={(e) => setTp1(e.target.value)}
            min={0}
          />
          <input
            type="number"
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("tp2")}
            value={tp2}
            onChange={(e) => setTp2(e.target.value)}
            min={0}
          />
          <input
            type="number"
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("tp3")}
            value={tp3}
            onChange={(e) => setTp3(e.target.value)}
            min={0}
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleSimulate}
            className="flex-1 p-3 bg-green-600 rounded text-white font-semibold hover:bg-green-700 transition"
          >
            {t("simulate")}
          </button>
          <button
            onClick={() => setShowChart(!showChart)}
            className="flex-1 p-3 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700 transition"
          >
            {showChart ? t("hidechart") : t("chart")}
          </button>
        </div>

        {showChart && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {coin.toUpperCase()} ({timeframe}D)
            </h2>
            <div className="bg-gray-700 rounded p-2">
              <PriceChart coin={coin} timeframe={timeframe} darkMode={darkMode} />
            </div>
          </section>
        )}

        {result && (
          <section className="p-4 bg-green-900 bg-opacity-30 rounded text-white space-y-2 border border-green-500">
            <h3 className="text-lg font-semibold">{t("result")}</h3>
            <p>
              {t("sl")}: -{result.loss} USDT ({result.lossPct}%)
            </p>
            <p>
              {t("liq")}: ${result.liq}
            </p>
            {result.gains.map((g, i) => (
              <p key={i}>
                🎯 {t(`tp${i + 1}`)}: ${g.tp} | +{g.gainUSDT.toFixed(2)} USDT ({g.gainPct.toFixed(2)}%)
              </p>
            ))}
          </section>
        )}
      </main>
      <footer className="mt-6 text-center text-xs text-gray-500">
        Made with ❤️ by Lucas
      </footer>
    </div>
  );
};

export default TradeSimulatorApp;
