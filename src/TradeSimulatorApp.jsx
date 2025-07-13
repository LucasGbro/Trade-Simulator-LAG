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
    const [e, t, s, cap, lev] = [entry, tp, sl, capital, leverage].map(Number);
    if ([e, t, s, cap, lev].some(v => isNaN(v))) {
      alert("Por favor completá todos los campos correctamente.");
      return;
    }
    const size = cap * lev;
    const liq = (e - e / lev).toFixed(2);
    const gain = ((t - e) * size / e).toFixed(2);
    const loss = ((e - s) * size / e).toFixed(2);
    const gainPct = (((t - e) / e) * 100).toFixed(2);
    const lossPct = (((e - s) / e) * 100).toFixed(2);
    setResult({ liq, gain, loss, gainPct, lossPct });
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-[#111] text-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trade Simulator</h1>
        <button className="px-2 py-1 bg-gray-800 rounded" onClick={() => alert("Ayuda: completá todos los campos y simulá tu trade.")}>?</button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <select value={coin} onChange={e => setCoin(e.target.value)} className="p-2 bg-[#222] rounded">
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="ripple">Ripple (XRP)</option>
        </select>
        <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="p-2 bg-[#222] rounded">
          <option value="1">1D</option>
          <option value="7">7D</option>
          <option value="30">30D</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input type="number" value={capital} onChange={e => setCapital(e.target.value)} placeholder="Capital (USDT)" className="p-2 bg-[#222] rounded" />
        <input type="number" value={leverage} onChange={e => setLeverage(e.target.value)} placeholder="Apalancamiento" className="p-2 bg-[#222] rounded" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <input type="number" value={entry} onChange={e => setEntry(e.target.value)} placeholder="Entrada" className="p-2 bg-[#222] rounded" />
        <input type="number" value={sl} onChange={e => setSl(e.target.value)} placeholder="Stop Loss" className="p-2 bg-[#222] rounded" />
        <input type="number" value={tp} onChange={e => setTp(e.target.value)} placeholder="Take Profit" className="p-2 bg-[#222] rounded" />
      </div>

      <div className="flex gap-2">
        <button onClick={handleSimulate} className="flex-grow p-2 bg-green-600 rounded">Simular</button>
        <button onClick={() => setShowChart(!showChart)} className="flex-grow p-2 bg-blue-600 rounded">
          {showChart ? "Ocultar Gráfico" : "Mostrar Gráfico"}
        </button>
      </div>

      {showChart && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-center">{coin.toUpperCase()} ({timeframe}D)</h2>
          <PriceChart coin={coin} timeframe={timeframe} />
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-[#222] rounded border border-green-600 space-y-1">
          <h3 className="text-green-400 font-semibold">Resultado</h3>
          <p>Liquidación: ${result.liq}</p>
          <p>Ganancia: +{result.gain} USDT ({result.gainPct}%)</p>
          <p>Pérdida: -{result.loss} USDT ({result.lossPct}%)</p>
        </div>
      )}
    </div>
  );
};

export default TradeSimulatorApp;
