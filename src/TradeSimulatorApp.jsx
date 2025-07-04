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
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("es");

  const t = (es, en) => (lang === "es" ? es : en);
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

  const filteredCoins = coinsList.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const entry = parseFloat(entryPrice);
    const slPercent = parseFloat(stopLossPercent);
    const tpPercent = parseFloat(takeProfitPercent);

    if (
      isNaN(cap) ||
      isNaN(entry) ||
      isNaN(slPercent) ||
      isNaN(tpPercent) ||
      cap <= 0 ||
      entry <= 0
    ) {
      alert(t("Por favor, completa todos los campos correctamente.", "Please fill all fields correctly."));
      return;
    }

    let riskAmount = 0;
    if (riskMode === "%") {
      const rPercent = parseFloat(riskPercent);
      if (isNaN(rPercent) || rPercent <= 0 || rPercent > 100) {
        alert(t("Ingresa un porcentaje de riesgo válido (0-100).", "Enter a valid risk percentage (0-100)."));
        return;
      }
      riskAmount = (cap * rPercent) / 100;
    } else {
      const rUSDT = parseFloat(riskUSDT);
      if (isNaN(rUSDT) || rUSDT <= 0 || rUSDT > cap) {
        alert(t("Ingresa un monto de riesgo válido (mayor que 0 y menor o igual al capital).", "Enter a valid risk amount (greater than 0 and less or equal to capital)."));
        return;
      }
      riskAmount = rUSDT;
    }

    const stopLossPrice = entry * (1 - slPercent / 100);
    const takeProfitPrice = entry * (1 + tpPercent / 100);
    const riskPerUnit = entry - stopLossPrice;
    if (riskPerUnit <= 0) {
      alert(t("Stop Loss debe estar por debajo del precio de entrada.", "Stop Loss must be below entry price."));
      return;
    }

    const shares = Math.floor(riskAmount / riskPerUnit);
    const positionSize = shares * entry;
    const potentialLoss = shares * riskPerUnit;
    const potentialGain = shares * (takeProfitPrice - entry);

    // Estimación simple de liquidación (puede ajustarse según apalancamiento)
    const liquidationPrice = stopLossPrice * 0.9;

    const res = {
      stopLossPrice,
      takeProfitPrice,
      shares,
      positionSize,
      potentialLoss,
      potentialGain,
      liquidationPrice,
    };

    setResult(res);
    saveSimulation(res);
  };
    return (
    <div
      style={{
        padding: 16,
        fontFamily: "Arial",
        color: darkMode ? "#f1f1f1" : "#111",
        backgroundColor: darkMode ? "#111" : "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 10 }}>
        Trade Simulator L.A.G.
      </h1>

      <div style={{ fontSize: 12, color: darkMode ? "#ccc" : "#555" }}>
        {t("Precios en vivo desde CoinGecko", "Live prices from CoinGecko")} – USDT
      </div>

      <div style={{ fontSize: 10, marginBottom: 20 }}>
        {t("Visitas", "Visits")}: {visitCount} • <b>{selectedCoin}</b> – ${prices[selectedCoin] || "..."}
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>{t("Buscar cripto", "Search coin")}: </label>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("Escribí para buscar...", "Type to search...")}
          style={{ padding: "4px", width: "100%", maxWidth: 300 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>{t("Seleccionar criptomoneda", "Select coin")}: </label>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          style={{ padding: "4px", width: "100%", maxWidth: 320 }}
        >
          {filteredCoins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
        {selectedCoin && (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
    <img
      src={coinsList.find((c) => c.id === selectedCoin)?.image}
      alt="logo"
      width={32}
      height={32}
      style={{ borderRadius: "50%" }}
    />
    <div>
      <div><strong>{coinsList.find((c) => c.id === selectedCoin)?.symbol?.toUpperCase()}</strong></div>
      <div>${prices[selectedCoin]?.toFixed(4) || "..."}</div>
    </div>
  </div>
)}
      </div>
            <div style={{ marginBottom: 8 }}>
        <label>{t("Capital disponible (USDT)", "Capital (USDT)")}: </label>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          placeholder="1000"
          style={{ padding: "4px", width: "100%", maxWidth: 320 }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>{t("Modo riesgo", "Risk mode")}: </label>
        <select
          value={riskMode}
          onChange={(e) => setRiskMode(e.target.value)}
          style={{ padding: "4px" }}
        >
          <option value="%">%</option>
          <option value="$">USDT</option>
        </select>
      </div>

      {riskMode === "%" ? (
        <div style={{ marginBottom: 8 }}>
          <label>{t("Riesgo (%)", "Risk (%)")}: </label>
          <input
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            placeholder="1.5"
            style={{ padding: "4px", width: "100%", maxWidth: 320 }}
          />
        </div>
      ) : (
        <div style={{ marginBottom: 8 }}>
          <label>{t("Riesgo (USDT)", "Risk (USDT)")}: </label>
          <input
            type="number"
            value={riskUSDT}
            onChange={(e) => setRiskUSDT(e.target.value)}
            placeholder="15"
            style={{ padding: "4px", width: "100%", maxWidth: 320 }}
          />
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <label>{t("Precio de entrada", "Entry price")}: </label>
        <input
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          placeholder="30000"
          style={{ padding: "4px", width: "100%", maxWidth: 320 }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>{t("Stop Loss (%)", "Stop Loss (%)")}: </label>
        <input
          type="number"
          value={stopLossPercent}
          onChange={(e) => setStopLossPercent(e.target.value)}
          placeholder="2"
          style={{ padding: "4px", width: "100%", maxWidth: 320 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>{t("Take Profit (%)", "Take Profit (%)")}: </label>
        <input
          type="number"
          value={takeProfitPercent}
          onChange={(e) => setTakeProfitPercent(e.target.value)}
          placeholder="5"
          style={{ padding: "4px", width: "100%", maxWidth: 320 }}
        />
      </div>
            <div style={{ marginBottom: 20 }}>
        <button onClick={handleCalculate} style={{ padding: "8px 16px" }}>
          {t("Calcular", "Calculate")}
        </button>

        <button
          onClick={() => setHelpVisible(!helpVisible)}
          style={{ marginLeft: 12, padding: "8px 16px" }}
        >
          {helpVisible ? t("Ocultar ayuda", "Hide Help") : t("Ayuda", "Help")}
        </button>

        <button
          onClick={clearHistory}
          style={{ marginLeft: 12, padding: "8px 16px" }}
        >
          {t("Borrar historial", "Clear History")}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ marginLeft: 12, padding: "8px 16px" }}
        >
          {darkMode ? t("Modo claro", "Light Mode") : t("Modo oscuro", "Dark Mode")}
        </button>

        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          style={{ marginLeft: 12, padding: "8px 16px" }}
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {helpVisible && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            backgroundColor: darkMode ? "#222" : "#eee",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {t(
            "Ingrese capital, riesgo, precio de entrada y SL/TP. El simulador calcula tamaño de posición, pérdidas y ganancias.",
            "Enter capital, risk, entry price and SL/TP. The simulator calculates position size, loss, and profit."
          )}
        </div>
      )}

      {result && (
        <div
          style={{
            marginBottom: 20,
            padding: 16,
            backgroundColor: darkMode ? "#222" : "#eee",
            borderRadius: 8,
            fontSize: 15,
          }}
        >
          <h3>{t("📊 Resultados", "📊 Results")}:</h3>
          <p>{t("SL en", "SL at")}: ${result.stopLossPrice.toFixed(2)}</p>
          <p>{t("TP en", "TP at")}: ${result.takeProfitPrice.toFixed(2)}</p>
          <p>{t("Unidades a comprar", "Units to buy")}: {result.shares}</p>
          <p>{t("Tamaño posición", "Position size")}: ${result.positionSize.toFixed(2)}</p>
          <p>{t("Pérdida potencial", "Potential loss")}: ${result.potentialLoss.toFixed(2)}</p>
          <p>{t("Ganancia potencial", "Potential gain")}: ${result.potentialGain.toFixed(2)}</p>
          <p>{t("Precio de liquidación estimado", "Estimated liquidation price")}: ${result.liquidationPrice.toFixed(2)}</p>
        </div>
      )}

      {history.length > 0 && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            backgroundColor: darkMode ? "#222" : "#eee",
            borderRadius: 8,
            fontSize: 13,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <h3>📁 {t("Historial", "History")}:</h3>
          <ul>
            {history.map((h, i) => (
              <li key={i}>
                {h.timestamp} – {h.coin} – SL: ${h.stopLossPrice.toFixed(2)} – TP: ${h.takeProfitPrice.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          fontSize: 10,
          opacity: 0.5,
          marginTop: 30,
          textAlign: "center",
          userSelect: "none",
        }}
      >
        L.A.G. Trade Simulator • {t("Precios por", "Prices via")}: CoinGecko • {t("Uso educativo", "Educational use only")}
      </div>
    </div>
  );
}
