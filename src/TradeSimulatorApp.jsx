import React, { useState } from "react";
import PriceChart from "./components/PriceChart";

const TradeSimulatorApp = () => {
  const [capital, setCapital] = useState(100);
  const [leverage, setLeverage] = useState(3);
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const [showChart, setShowChart] = useState(true);
  const [result, setResult] = useState(null);

  const handleSimulate = () => {
    const entryNum = parseFloat(entry);
    const tpNum = parseFloat(tp);
    const slNum = parseFloat(sl);
    const capitalNum = parseFloat(capital);
    const leverageNum = parseFloat(leverage);

    if (!entryNum || !tpNum || !slNum || !capitalNum || !leverageNum) {
      alert("Completá todos los campos correctamente.");
      return;
    }

    const positionSize = capitalNum * leverageNum;
    const liquidation = (entryNum - entryNum / leverageNum).toFixed(2);
    const gain = ((tpNum - entryNum) * positionSize) / entryNum;
    const loss = ((entryNum - slNum) * positionSize) / entryNum;

    setResult({
      liq: liquidation,
      gain: gain.toFixed(2),
      loss: loss.toFixed(2),
      gainPct: (((tpNum - entryNum) / entryNum) * 100).toFixed(2),
      lossPct: (((entryNum - slNum) / entryNum) * 100).toFixed(2),
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-[#111] text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Simulador de Trade</h1>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Capital (USDT)"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
        />
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Apalancamiento"
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
        />
        <input
          className="p-2 bg-[#222] rounded"
          placeholder="Precio Entrada"
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
        className="w-full p-2 bg-green-600 rounded hover:bg-green-700"
        onClick={handleSimulate}
      >
        Simular
      </button>

      <button
        className="w-full mt-4 p-2 bg-blue-600 rounded hover:bg-blue-700"
        onClick={() => setShowChart(!showChart)}
      >
        {showChart ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </button>

      {showChart && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-center">Bitcoin (1D)</h2>
          <PriceChart />
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-[#1e1e1e] rounded border border-green-600 text-sm space-y-1">
          <h3 className="text-green-400 font-semibold">📊 Resultado</h3>
          <p>Liquidación: ${result.liq}</p>
          <p>Ganancia: +{result.gain} USDT ({result.gainPct}%)</p>
          <p>Pérdida: -{result.loss} USDT ({result.lossPct}%)</p>
        </div>
      )}
    </div>
  );
};

export default TradeSimulatorApp;
