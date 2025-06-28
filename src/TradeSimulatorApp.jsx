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
  const [riskMode, setRiskMode] = useState("%"); // '%' o 'USDT'

  // Cargar historial y contador visitas
  useEffect(() => {
    const savedHistory = localStorage.getItem("lag-history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const visits = localStorage.getItem("lag-visit-count");
    const newCount = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem("lag-visit-count", newCount);
    setVisitCount(newCount);
  }, []);

  // Traer lista monedas (top 100)
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

  // Traer precio seleccionado cada 30 seg
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
    const coinPrice = prices[selectedCoin];

    if (
      isNaN(cap) || isNaN(entry) ||
      isNaN(slPerc) || isNaN(tpPerc) ||
      cap <= 0 || entry <= 0 || slPerc <= 0 || tpPerc <= 0
    ) {
      alert("Por favor, completá los campos obligatorios con valores válidos.");
      return;
    }

    // Definir riesgo en USDT según modo
    let riskAmount;
    if (riskMode === "%") {
      if (isNaN(riskP) || riskP <= 0) {
        alert("Por favor, ingresá un porcentaje de riesgo válido.");
        return;
      }
      riskAmount = (cap * riskP) / 100;
    } else {
      if (isNaN(riskU) || riskU <= 0) {
        alert("Por favor, ingresá un monto de riesgo válido en USDT.");
        return;
      }
      riskAmount = riskU;
    }

    // Cálculos de posición
    const stopLossPrice = entry - (entry * slPerc / 100);
    const takeProfitPrice = entry + (entry * tpPerc / 100);
    const riskPerTrade = entry - stopLossPrice;

    if (riskPerTrade <= 0) {
      alert("Stop Loss debe ser menor que el precio de entrada.");
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
    <>
      <div
        style={{
          maxWidth: 480,
          margin: "auto",
          padding: 20,
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          color: "#222",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          userSelect: "none",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20, color: "#111" }}>
          Trade Simulator L.A.G. 📊
        </h2>

        {/* Selector de moneda */}
        <label style={{ fontWeight: "600", color: "#333" }}>Seleccioná la criptomoneda:</label>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            marginBottom: 20,
            borderRadius: 6,
            border: "1px solid #bbb",
            color: "#222",
          }}
        >
          {coinsList.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        {/* Precio actual */}
        <div style={{ marginBottom: 20 }}>
          <strong>Precio actual (USD): </strong>
          {prices[selectedCoin] !== null ? `$${prices[selectedCoin].toLocaleString()}` : "Cargando..."}
        </div>

        <Input label="Capital disponible (USDT)" value={capital} setValue={setCapital} placeholder="Ej: 1000" />

        {/* Selector riesgo % o USDT */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: "600", color: "#333" }}>Modo de riesgo:</label>
          <select
            value={riskMode}
            onChange={(e) => {
              setRiskMode(e.target.value);
              setRiskPercent("");
              setRiskUSDT("");
            }}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #bbb",
              color: "#222",
              marginTop: 6,
            }}
          >
            <option value="%">Porcentaje (%)</option>
            <option value="USDT">Monto fijo (USDT)</option>
          </select>
        </div>

        {riskMode === "%" ? (
          <Input label="% de riesgo por trade" value={riskPercent} setValue={setRiskPercent} placeholder="Ej: 2" />
        ) : (
          <Input label="Riesgo en USDT" value={riskUSDT} setValue={setRiskUSDT} placeholder="Ej: 20" />
        )}

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
                <li
                  key={i}
                  style={{
                    marginBottom: 10,
                    background: "#f5f5f5",
                    padding: 10,
                    borderRadius: 6,
                    fontSize: 14,
                    lineHeight: 1.3,
                  }}
                >
                  <strong>{item.timestamp}</strong> — {coinsList.find(c => c.id === item.coin)?.name || item.coin} <br />
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
        <div
          style={{
            position: "fixed",
            bottom: 10,
            right: 10,
            opacity: 0.2,
            fontSize: 18,
            fontWeight: "bold",
            color: "#222",
            userSelect: "none",
          }}
        >
          L.A.G.
        </div>

        {/* Contador de visitas */}
        <div
          style={{
            position: "fixed",
            bottom: 10,
            left: 10,
            fontSize: 14,
            color: "#555",
            userSelect: "none",
            fontWeight: "600",
          }}
        >
          Visitas: {visitCount}
        </div>

        {/* Referencia legal */}
        <div
          style={{
            marginTop: 40,
            fontSize: 12,
            color: "#666",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          Los precios se obtienen en tiempo real de{" "}
          <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>
            CoinGecko
          </a>{" "}
          (API pública, sin fines comerciales).
        </div>
      </div>

      {/* Botón de ayuda */}
      <HelpButton onClick={() => setHelpVisible(true)} />

      {/* Panel de ayuda */}
      {helpVisible && <HelpPanel onClose={() => setHelpVisible(false)} />}
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

const HelpButton = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Abrir ayuda"
    style={{
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
    }}
  >
    ❓
  </button>
);

const HelpPanel = ({ onClose }) => (
  <div
    style={{
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
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 10,
        maxWidth: 400,
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        color: "#222",
        position: "relative",
        fontSize: 15,
        lineHeight: "1.5em",
      }}
    >
      <h3>🆘 Ayuda - Trade Simulator L.A.G.</h3>
      <button
        onClick={onClose}
        style={{
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
        }}
        aria-label="Cerrar ayuda"
      >
        ✖
      </button>
      <p><strong>SL (Stop Loss):</strong> Precio donde limitás la pérdida máxima.</p>
      <p><strong>TP (Take Profit):</strong> Precio objetivo para ganar.</p>
      <p><strong>Riesgo:</strong> Porcentaje o monto del capital que estás dispuesto a perder en cada trade.</p>
      <p><strong>Liquidación:</strong> Precio aproximado donde se cierra tu posición por falta de margen (futuros).</p>
      <p>Completá los campos y presioná <em>"Calcular SL / TP"</em> para ver resultados.</p>
    </div>
  </div>
);
