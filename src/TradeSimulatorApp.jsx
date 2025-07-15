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
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("lang");
    return saved || "es";
  });

  useEffect(() => {
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
    <div
      className={`min-h-screen flex flex-col items-center transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-tr from-blue-100 via-indigo-100 to-purple-100 text-gray-900"
      }`}
    >
      <header className="w-full max-w-3xl flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="darkmode-toggle" className="flex items-center cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                id="darkmode-toggle"
                checked={darkMode}
                onChange={() => setDarkMode((d) => !d)}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                  darkMode ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
            <span className="ml-3 font-medium">{darkMode ? t("darkMode") : t("lightMode")}</span>
          </label>
        </div>

        <div>
          <select
            className={`rounded-md py-2 px-4 font-semibold focus:outline-none transition ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
            }`}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label={t("language")}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      <main className="w-full max-w-3xl p-6 rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm
        ${darkMode ? "bg-gray-800" : "bg-white"} transition-colors duration-500">
        <h1 className="text-4xl font-extrabold mb-8 text-center">{t("simulator")}</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulate();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("token")}
              value={coin}
              onChange={(e) => setCoin(e.target.value.toLowerCase())}
              required
            />
            <select
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
              }`}
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              required
            >
              <option value="1">1D</option>
              <option value="7">7D</option>
              <option value="30">30D</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="number"
              min="1"
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("capital")}
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("leverage")}
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="number"
              min="0"
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("entry")}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("stoploss")}
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <input
              type="number"
              min="0"
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("tp1")}
              value={tp1}
              onChange={(e) => setTp1(e.target.value)}
            />
            <input
              type="number"
              min="0"
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("tp2")}
              value={tp2}
              onChange={(e) => setTp2(e.target.value)}
            />
            <input
              type="number"
              min="0"
              className={`p-4 rounded-md shadow-inner focus:ring-2 focus:ring-purple-500 transition ${
                darkMode ? "bg-gray-700 text-white placeholder-gray-300" : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              placeholder={t("tp3")}
              value={tp3}
              onChange={(e) => setTp3(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg shadow-lg transition"
            >
              {t("simulate")}
            </button>
            <button
              type="button"
              onClick={() => setShowChart((s) => !s)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg transition"
            >
              {showChart ? t("hidechart") : t("chart")}
            </button>
          </div>
        </form>

        {showChart && (
          <section className="mt-10 bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-center text-2xl font-semibold mb-4">
              {coin.toUpperCase()} ({timeframe}D)
            </h2>
            <PriceChart coin={coin} timeframe={timeframe} />
          </section>
        )}

        {result && (
          <section
            className={`mt-10 p-6 rounded-lg shadow-lg ${
              darkMode ? "bg-gradient-to-r from-green-900 to-green-700 text-green-100" : "bg-green-100 text-green-900"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">{t("result")}</h3>
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
          </section>
        )}
      </main>

      <footer className="w-full max-w-3xl text-center p-6 text-sm text-gray-400 select-none">
        Made with ❤️ by Lucas
      </footer>
    </div>
  );
};

export default TradeSimulatorApp;
