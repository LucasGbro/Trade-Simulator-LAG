import React, { useState } from "react";
import PriceChart from "./components/PriceChart";

const TradeSimulatorApp = () => {
  const [coin, setCoin] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("1");
  const [capital, setCapital] = useState(100);
  const [leverage, setLeverage] = useState(3);
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const [showChart, setShowChart] = useState(true);
  const [result, setResult] = useState(null);

  const handleSimulate = () => {
    const entryPrice = parseFloat(entry);
    const slPrice = parseFloat(sl);
    const tpPrice = parseFloat(tp);
    const cap = parseFloat(capital);
    const lev = parseFloat(leverage);

    if (!entryPrice || !slPrice || !tpPrice || !cap || !lev) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    const lossPct = ((entryPrice - slPrice) / entryPrice) * 100;
    const gainPct = ((tpPrice - entryPrice) / entryPrice) * 100;
    const liquidation = entryPrice - entryPrice / lev;
    const lossUSDT = ((entryPrice - slPrice) * cap * lev) / entryPrice;
    const gainUSDT = ((tpPrice - entryPrice) * cap * lev) / entryPrice;

    setResult({
      sl: slPrice.toFixed(2),
      tp: tpPrice.toFixed(2),
      liq: liquidation.toFixed(2),
      loss: lossUSDT,
      gain: gainUSDT,
      lossPct,
      gainPct,
    });
  };
    return (
    <div className="p-4 max-w-xl mx-auto bg-[#111] text-white rounded-xl shadow-lg min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">📈 Simulador de Trade</h1>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Token (ej: bitcoin)"
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
        />
        <select
          className="p-2 bg-[#222] rounded"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="1">1D</option>
          <option value="7">7D</option>
          <option value="30">30D</option>
          <option value="90">90D</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Capital (USDT)"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
        />
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Apalancamiento (ej: 3)"
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Entrada"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Stop Loss"
          value={sl}
          onChange={(e) => setSl(e.target.value)}
        />
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Take Profit"
          value={tp}
          onChange={(e) => setTp(e.target.value)}
        />
      </div>

      <div className="flex justify-between gap-2 mb-4">
        <button
          className="w-full p-2 bg-green-600 rounded hover:bg-green-700 transition"
          onClick={handleSimulate}
        >
          Simular Trade
        </button>
        <button
          className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? "Ocultar gráfico" : "Ver gráfico"}
        </button>
      </div>
            {showChart && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Gráfico de {coin.toUpperCase()} ({timeframe}D)
          </h2>
          <div className="bg-[#222] p-2 rounded">
            <PriceChart coin={coin} timeframe={timeframe} />
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-[#1e1e1e] rounded text-sm space-y-2 border border-green-700">
          <h3 className="text-base font-semibold text-green-500">
            📊 Resultado de la simulación
          </h3>
          <p>🔻 Riesgo (SL): -{result.r
