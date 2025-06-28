import React, { useState, useEffect } from "react";

export default function TradeSimulatorApp() {
  const [capital, setCapital] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [riskUSDT, setRiskUSDT] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");
  const [takeProfitPercent, setTakeProfitPercent] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [helpVisible, setHelpVisible] = useState(false);
  const [prices, setPrices] = useState({});
  const [visitCount, setVisitCount] = useState(0);
  const [coinsList, setCoinsList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [riskMode, setRiskMode] = useState("%");

  useEffect(() => {
    const savedHistory = localStorage.getItem("lag-history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const visits = localStorage.getItem("lag-visit-count");
    const newCount = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem("lag-visit-count", newCount);
    setVisitCount(newCount);
  }, []);

  useEffect(() => {
    const fetchCoinsList = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoinsList(data);
      } catch (e) {
        console.error("Error fetching coins list:", e);
      }
    };
    fetchCoinsList();
  }, []);

  useEffect(() => {
    if (!selectedCoin) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin}&vs_currencies=usd`
        );
        const data = await res.json();
        setPrices((p) => ({ ...p, [selectedCoin]: data[selectedCoin]?.usd || null }));
      } catch (e) {
        console.error("Error fetching price:", e);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [selectedCoin]);

  const saveSimulation = (data) => {
    const timestamp = new Date().toLocaleString();
    const newEntry = { ...data, timestamp, coin: selectedCoin };
    const updatedHistory = [newEntry, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    localStorage.setItem("lag-history", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("lag-history");
  };

  const handleCalculate = () => {
    const cap = parseFloat(capital);
    const riskP = parseFloat(riskPercent);
    const riskU = parseFloat(riskUSDT);
    const entry = parseFloat(entryPrice);
    const slPerc = parseFloat(stopLossPercent);
    const tpPerc = parseFloat(takeProfitPercent);

    if (
      isNaN(cap) || isNaN(entry) ||
      isNaN(slPerc) || isNaN(tpPerc) ||
      cap <= 0 || entry <= 0 || slPerc <= 0 || tpPerc <= 0
    ) {
      alert("Por favor, completá todos los campos obligatorios.");
      return;
    }

    let riskAmount;
    if (riskMode === "%") {
      if (isNaN(riskP) || riskP <= 0) {
        alert("Ingresá un % de riesgo válido.");
        return;
      }
      riskAmount = (cap * riskP) / 100;
    } else {
      if (isNaN(riskU) || riskU <= 0) {
        alert("Ingresá un monto de riesgo válido.");
        return;
      }
      riskAmount = riskU;
    }

    const stopLossPrice = entry - (entry * slPerc / 100);
    const takeProfitPrice = entry + (entry * tpPerc / 100);
    const riskPerTrade = entry - stopLossPrice;

    if (riskPerTrade <= 0) {
      alert("El SL debe ser menor al precio de entrada.");
      return;
    }

    const shares = Math.floor(riskAmount / riskPerTrade);
    const positionSize = shares * entry;
    const potentialLoss = shares * riskPerTrade;
    const potentialGain = shares * (takeProfitPrice - entry);
    const liquidationPrice = entry - (entry * 0.8);

    const calc = {
      stopLossPrice,
      takeProfitPrice,
      shares,
      positionSize,
      potentialLoss,
      potentialGain,
      liquidationPrice,
    };

    setResult(calc);
    saveSimulation(calc);
  };
  return (
    <div style={{ padding: 16, fontFamily: "Arial", color: "#f1f1f1", backgroundColor: "#111", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, marginBottom: 10 }}>Trade Simulator L.A.G.</h1>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>
        Precios en vivo desde CoinGecko – simulaciones en USDT
      </div>
      <div style={{ fontSize: 10, color: "#555", marginBottom: 20 }}>
        Visitas: {visitCount} • Seleccionado: <b>{selectedCoin}</b> • Precio: <b>${prices[selectedCoin] || "..."}</b>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Seleccionar criptomoneda: </label>
        <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
          {coinsList.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Capital disponible (USDT): </label>
        <input value={capital} onChange={(e) => setCapital(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Modo riesgo: </label>
        <select value={riskMode} onChange={(e) => setRiskMode(e.target.value)}>
          <option value="%">% del capital</option>
          <option value="$">Monto en USDT</option>
        </select>
      </div>

      {riskMode === "%" ? (
        <div style={{ marginBottom: 8 }}>
          <label>Riesgo (%): </label>
          <input value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} />
        </div>
      ) : (
        <div style={{ marginBottom: 8 }}>
          <label>Riesgo (USDT): </label>
          <input value={riskUSDT} onChange={(e) => setRiskUSDT(e.target.value)} />
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <label>Precio de entrada (USDT): </label>
        <input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Stop Loss (%): </label>
        <input value={stopLossPercent} onChange={(e) => setStopLossPercent(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Take Profit (%): </label>
        <input value={takeProfitPercent} onChange={(e) => setTakeProfitPercent(e.target.value)} />
      </div>

      <button onClick={handleCalculate} style={{ marginTop: 12, padding: "6px 16px" }}>
        Calcular
      </button>
      <button onClick={() => setHelpVisible(!helpVisible)} style={{ marginLeft: 10 }}>
        {helpVisible ? "Ocultar ayuda" : "Ayuda"}
      </button>
      <button onClick={clearHistory} style={{ marginLeft: 10 }}>
        Borrar historial
      </button>

      {helpVisible && (
        <div style={{ marginTop: 10, fontSize: 13, background: "#222", padding: 10, borderRadius: 8 }}>
          Ingresá tu capital, el riesgo deseado, precio de entrada y los porcentajes para SL y TP. El simulador calcula
          cuánto podés perder o ganar por trade, cuántas unidades comprar y tu riesgo real. Los precios se obtienen en
          tiempo real desde <a href="https://coingecko.com" target="_blank" rel="noreferrer">CoinGecko</a>.
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, fontSize: 14 }}>
          <h3>📊 Resultados:</h3>
          <p>SL en: ${result.stopLossPrice.toFixed(2)}</p>
          <p>TP en: ${result.takeProfitPrice.toFixed(2)}</p>
          <p>Unidades a comprar: {result.shares}</p>
          <p>Tamaño posición: ${result.positionSize.toFixed(2)}</p>
          <p>Pérdida potencial: ${result.potentialLoss.toFixed(2)}</p>
          <p>Ganancia potencial: ${result.potentialGain.toFixed(2)}</p>
          <p>Precio de liquidación (estimado): ${result.liquidationPrice.toFixed(2)}</p>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 30, fontSize: 13 }}>
          <h3>📁 Historial:</h3>
          <ul>
            {history.map((h, i) => (
              <li key={i}>
                {h.timestamp} – {h.coin} – Unidades: {h.shares} – SL: ${h.stopLossPrice.toFixed(2)} – TP: $
                {h.takeProfitPrice.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ fontSize: 10, marginTop: 40, opacity: 0.5 }}>
        L.A.G. Simulador de Riesgo • Precios provistos por CoinGecko – uso informativo y educativo.
      </div>
    </div>
  );
}
