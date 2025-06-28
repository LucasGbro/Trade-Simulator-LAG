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
    const t = (es, en) => (lang === "es" ? es : en);

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
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>{t("Seleccionar criptomoneda", "Select coin")}: </label>
        <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
          {filteredCoins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>{t("Capital disponible (USDT)", "Capital (USDT)")}: </label>
        <input value={capital} onChange={(e) => setCapital(e.target.value)} />
      </div>

      <div>
        <label>{t("Modo riesgo", "Risk mode")}: </label>
        <select value={riskMode} onChange={(e) => setRiskMode(e.target.value)}>
          <option value="%">%</option>
          <option value="$">USDT</option>
        </select>
      </div>

      {riskMode === "%" ? (
        <div>
          <label>{t("Riesgo (%)", "Risk (%)")}: </label>
          <input value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} />
        </div>
      ) : (
        <div>
          <label>{t("Riesgo (USDT)", "Risk (USDT)")}: </label>
          <input value={riskUSDT} onChange={(e) => setRiskUSDT(e.target.value)} />
        </div>
      )}

      <div>
        <label>{t("Precio de entrada", "Entry price")}: </label>
        <input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} />
      </div>

      <div>
        <label>{t("Stop Loss (%)", "Stop Loss (%)")}: </label>
        <input value={stopLossPercent} onChange={(e) => setStopLossPercent(e.target.value)} />
      </div>

      <div>
        <label>{t("Take Profit (%)", "Take Profit (%)")}: </label>
        <input value={takeProfitPercent} onChange={(e) => setTakeProfitPercent(e.target.value)} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleCalculate}>{t("Calcular", "Calculate")}</button>
        <button onClick={() => setHelpVisible(!helpVisible)} style={{ marginLeft: 8 }}>
          {helpVisible ? t("Ocultar ayuda", "Hide Help") : t("Ayuda", "Help")}
        </button>
        <button onClick={clearHistory} style={{ marginLeft: 8 }}>
          {t("Borrar historial", "Clear history")}
        </button>
        <button onClick={() => setDarkMode(!darkMode)} style={{ marginLeft: 8 }}>
          {darkMode ? t("Modo claro", "Light mode") : t("Modo oscuro", "Dark mode")}
        </button>
        <button onClick={() => setLang(lang === "es" ? "en" : "es")} style={{ marginLeft: 8 }}>
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {helpVisible && (
        <div style={{ marginTop: 12, fontSize: 13, background: darkMode ? "#222" : "#eee", padding: 10, borderRadius: 8 }}>
          {t(
            "Ingresá tu capital, el riesgo, precio de entrada y SL/TP. El simulador calcula posiciones, pérdidas y ganancias.",
            "Enter your capital, risk, entry price and SL/TP. The simulator calculates position size, loss and profit."
          )}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, fontSize: 14 }}>
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
        <div style={{ marginTop: 30, fontSize: 13 }}>
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

      <div style={{ fontSize: 10, marginTop: 40, opacity: 0.5 }}>
        L.A.G. Trade Simulator • {t("Precios por", "Prices via")}: CoinGecko • {t("Uso educativo", "Educational use only")}
      </div>
    </div>
  );
}
