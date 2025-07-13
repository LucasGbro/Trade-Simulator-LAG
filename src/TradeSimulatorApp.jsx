import React, { useState } from "react";
import PriceChart from "./components/PriceChart";

const TradeSimulatorApp = () => {
  const [showChart, setShowChart] = useState(false);
  const [timeframe, setTimeframe] = useState("1");
  const [coin, setCoin] = useState("bitcoin");
  const [capital, setCapital] = useState(100);
  const [leverage, setLeverage] = useState(3);
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
    const [result, setResult] = useState(null);

  const handleSimulate = () => {
    const risk = ((entry - sl) / entry) * 100;
    const reward = ((tp - entry) / entry) * 100;
    const liquidationPrice = entry - (entry / leverage);
    const profit = ((tp - entry) * (capital * leverage)) / entry;
    const loss = ((entry - sl) * (capital * leverage)) / entry;

    setResult({
      risk: risk.toFixed(2),
      reward: reward.toFixed(2),
      liquidation: liquidationPrice.toFixed(4),
      profit: profit.toFixed(2),
      loss: loss.toFixed(2),
    });
  };  return (
    <div className="p-4 max-w-xl mx-auto bg-[#111] text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Simulador de Trade</h1>

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
            <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Precio de entrada"
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

      <button
        className="w-full p-2 bg-green-600 rounded hover:bg-green-700 transition"
        onClick={handleSimulate}
      >
        Simular Trade
      </button>

      {coin && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-center">Gráfico de {coin}</h2>
          <PriceChart coin={coin} timeframe={timeframe} />
        </div>
      )}
            {result && (
        <div className="mt-6 p-4 bg-[#1e1e1e] rounded text-sm space-y-2 border border-green-700">
          <h3 className="text-base font-semibold text-green-500">📊 Resultado de la simulación</h3>
          <p>SL: ${result.sl} ({result.slPct}%)</p>
          <p>TP: ${result.tp} ({result.tpPct}%)</p>
          <p>Liquidación: ${result.liq}</p>
          <p>Pérdida: -{result.loss.toFixed(2)} USDT ({result.lossPct.toFixed(2)}%)</p>
          <p>Ganancia: +{result.gain.toFixed(2)} USDT ({result.gainPct.toFixed(2)}%)</p>
        </div>
      )}
  
