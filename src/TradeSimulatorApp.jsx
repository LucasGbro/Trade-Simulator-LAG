import React, { useState, useEffect } from "react";

export default function TradeSimulatorApp() {
  const [capital, setCapital] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");
  const [takeProfitPercent, setTakeProfitPercent] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const cap = parseFloat(capital);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const slPerc = parseFloat(stopLossPercent);
    const tpPerc = parseFloat(takeProfitPercent);

    if (
      isNaN(cap) || isNaN(risk) || isNaN(entry) ||
      isNaN(slPerc) || isNaN(tpPerc) ||
      cap <= 0 || risk <= 0 || entry <= 0 || slPerc <= 0 || tpPerc <= 0
    ) {
      alert("Por favor, completá todos los campos con valores válidos.");
      return;
    }

    const riskAmount = (cap * risk) / 100;
    const stopLossPrice = entry - (entry * slPerc / 100);
    const takeProfitPrice = entry + (entry * tpPerc / 100);
    const riskPerTrade = entry - stopLossPrice;
    const shares = Math.floor(riskAmount / riskPerTrade);
    const positionSize = shares * entry;
    const potentialLoss = shares * riskPerTrade;
    const potentialGain = shares * (takeProfitPrice - entry);

    const liquidationPrice = entry - (entry * 0.8); // estimado: pierde 80% de entrada

    setResult({
      stopLossPrice,
      takeProfitPrice,
      shares,
      positionSize,
      potentialLoss,
      potentialGain,
      liquidationPrice,
    });
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "auto",
        padding: 20,
        backgroundImage: "url('https://media.giphy.com/media/3o7TKP9PNbE0jX4LZm/giphy.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 10,
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(255,255,255,0.85)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Trade Simulator L.A.G. 📊🚀
      </h2>

      <div>
        <label>Capital disponible (USDT):</label>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          placeholder="Ej: 1000"
          style={inputStyle}
        />
      </div>
      <div>
        <label>% de riesgo por trade:</label>
        <input
          type="number"
          value={riskPercent}
          onChange={(e) => setRiskPercent(e.target.value)}
          placeholder="Ej: 2"
          style={inputStyle}
        />
      </div>
      <div>
        <label>Precio de entrada:</label>
        <input
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          placeholder="Ej: 50"
          style={inputStyle}
        />
      </div>
      <div>
        <label>% Stop Loss:</label>
        <input
          type="number"
          value={stopLossPercent}
          onChange={(e) => setStopLossPercent(e.target.value)}
          placeholder="Ej: 5"
          style={inputStyle}
        />
      </div>
      <div>
        <label>% Take Profit:</label>
        <input
          type="number"
          value={takeProfitPercent}
          onChange={(e) => setTakeProfitPercent(e.target.value)}
          placeholder="Ej: 10"
          style={inputStyle}
        />
      </div>

      <button onClick={handleCalculate} style={buttonStyle}>
        Calcular SL / TP
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>📈 Resultados</h3>
          <p>🔻 Stop Loss en: <strong>${result.stopLossPrice.toFixed(2)}</strong></p>
          <p>📈 Take Profit en: <strong>${result.takeProfitPrice.toFixed(2)}</strong></p>
          <p>💼 Tamaño de posición: <strong>${result.positionSize.toFixed(2)}</strong></p>
          <p>📦 Acciones que podés comprar: <strong>{result.shares}</strong></p>
          <p>📉 Pérdida total posible: <strong>${result.potentialLoss.toFixed(2)}</strong></p>
          <p>📊 Ganancia potencial: <strong>${result.potentialGain.toFixed(2)}</strong></p>
          <p>⚠️ Precio de liquidación estimado: <strong>${result.liquidationPrice.toFixed(2)}</strong></p>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          opacity: 0.25,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        L.A.G.
      </div>
    </div>
  );
}

// Estilos reutilizables
const inputStyle = {
  marginBottom: 10,
  padding: 8,
  width: "100%",
  borderRadius: 6,
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: 10,
  border: "none",
  borderRadius: 6,
  width: "100%",
  marginTop: 10,
  cursor: "pointer",
  fontWeight: "bold",
};


