import React, { useState, useEffect } from "react";

export default function TradeSimulatorApp() {
  const [capital, setCapital] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");
  const [takeProfitPercent, setTakeProfitPercent] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [helpVisible, setHelpVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lag-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveSimulation = (data) => {
    const timestamp = new Date().toLocaleString();
    const newEntry = { ...data, timestamp };
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
    <>
      <div
        style={{
          maxWidth: 420,
          margin: "auto",
          padding: 20,
          backgroundImage: "url('https://media.giphy.com/media/WoD6JZnwap6s8/giphy.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 10,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(255,255,255,0.95)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          color: "#222",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20, color: "#111" }}>
          Trade Simulator L.A.G. 📊
        </h2>

        <Input label="Capital disponible (USDT)" value={capital} setValue={setCapital} placeholder="Ej: 1000" />
        <Input label="% de riesgo por trade" value={riskPercent} setValue={setRiskPercent} placeholder="Ej: 2" />
        <Input label="Precio de entrada" value={entryPrice} setValue={setEntryPrice} placeholder="Ej: 50" />
        <Input label="% Stop Loss" value={stopLossPercent} setValue={setStopLossPercent} placeholder="Ej: 5" />
        <Input label="% Take Profit" value={takeProfitPercent} setValue={setTakeProfitPercent} placeholder="Ej: 10" />

        <button onClick={handleCalculate} style={buttonStyle}>
          Calcular SL / TP
        </button>

        {result && (
          <div style={{ marginTop: 20, color: "#222" }}>
            <h3>📈 Resultados</h3>
            <p>🔻 SL: <strong>${result.stopLossPrice.toFixed(2)}</strong></p>
            <p>📈 TP: <strong>${result.takeProfitPrice.toFixed(2)}</strong></p>
            <p>📦 Acciones: <strong>{result.shares}</strong></p>
            <p>💼 Posición: <strong>${result.positionSize.toFixed(2)}</strong></p>
            <p>📉 Pérdida: <strong>${result.potentialLoss.toFixed(2)}</strong></p>
            <p>📊 Ganancia: <strong>${result.potentialGain.toFixed(2)}</strong></p>
            <p>⚠️ Liquidación: <strong>${result.liquidationPrice.toFixed(2)}</strong></p>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: 30, color: "#222" }}>
            <h3>🕓 Historial</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {history.map((item, i) => (
                <li key={i} style={{ marginBottom: 10, background: "#f5f5f5", padding: 10, borderRadius: 6 }}>
                  <strong>{item.timestamp}</strong><br />
                  TP: ${item.takeProfitPrice.toFixed(2)} / SL: ${item.stopLossPrice.toFixed(2)} / Acc: {item.shares}
                </li>
              ))}
            </ul>
            <button onClick={clearHistory} style={{ ...buttonStyle, backgroundColor: "#f44336" }}>
              Borrar historial
            </button>
          </div>
        )}

        {/* Marca de agua */}
        <div style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          opacity: 0.2,
          fontSize: 18,
          fontWeight: "bold",
          color: "#222",
          userSelect: "none",
        }}>
          L.A.G.
        </div>
      </div>

      {/* Botón de ayuda */}
      <button
        onClick={() => setHelpVisible(true)}
        aria-label="Abrir ayuda"
        style={helpButtonStyle}
      >
        ❓
      </button>

      {/* Panel de ayuda */}
      {helpVisible && (
        <div style={helpPanelStyle}>
          <div style={helpContentStyle}>
            <h3>🆘 Ayuda - Trade Simulator L.A.G.</h3>
            <button onClick={() => setHelpVisible(false)} style={closeButtonStyle} aria-label="Cerrar ayuda">✖</button>
            <p><strong>SL (Stop Loss):</strong> Precio donde limitás la pérdida máxima.</p>
            <p><strong>TP (Take Profit):</strong> Precio objetivo para ganar.</p>
            <p><strong>Riesgo:</strong> Porcentaje del capital que estás dispuesto a perder en cada trade.</p>
            <p><strong>Liquidación:</strong> Precio aproximado donde se cierra tu posición por falta de margen (futuros).</p>
            <p>Completá los campos y presioná <em>"Calcular SL / TP"</em> para ver resultados.</p>
          </div>
        </div>
      )}
    </>
  );
}

const Input = ({ label, value, setValue, placeholder }) => (
  <div>
    <label style={{ display: "block", fontWeight: "600", marginBottom: 4, color: "#333" }}>
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      style={{
        marginBottom: 12,
        padding: 10,
        width: "100%",
        borderRadius: 6,
        border: "1px solid #bbb",
        fontSize: 16,
        boxSizing: "border-box",
        color: "#222",
      }}
    />
  </div>
);

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: 12,
  border: "none",
  borderRadius: 6,
  width: "100%",
  marginTop: 10,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 16,
  transition: "background-color 0.3s",
};

const helpButtonStyle = {
  position: "fixed",
  bottom: 20,
  left: 20,
  width: 50,
  height: 50,
  borderRadius: "50%",
  border: "none",
  backgroundColor: "#1976d2",
  color: "white",
  fontSize: 28,
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
  userSelect: "none",
  zIndex: 1000,
};

const helpPanelStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1100,
};

const helpContentStyle = {
  backgroundColor: "#fff",
  padding: 25,
  borderRadius: 10,
  maxWidth: 400,
  boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
  color: "#222",
  position: "relative",
  fontSize: 15,
  lineHeight: "1.5em",
};

const closeButtonStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  border: "none",
  background: "transparent",
  fontSize: 20,
  fontWeight: "bold",
  cursor: "pointer",
  color: "#444",
  userSelect: "none",
};
