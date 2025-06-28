import React, { useState } from "react";

export default function TradeSimulatorApp() {
  const [capital, setCapital] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    // Validar que los valores sean números y positivos
    const cap = parseFloat(capital);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const stopLoss = parseFloat(stopLossPrice);

    if (
      isNaN(cap) ||
      isNaN(risk) ||
      isNaN(entry) ||
      isNaN(stopLoss) ||
      cap <= 0 ||
      risk <= 0 ||
      entry <= 0 ||
      stopLoss <= 0
    ) {
      alert("Por favor, ingresa valores válidos y mayores a 0.");
      return;
    }

    if (stopLoss >= entry) {
      alert("El precio de stop loss debe ser menor que el precio de entrada.");
      return;
    }

    const riskAmount = (cap * risk) / 100; // cuánto podés perder
    const riskPerShare = entry - stopLoss; // diferencia de precio por acción
    const shares = Math.floor(riskAmount / riskPerShare); // cantidad de acciones
    const positionSize = shares * entry; // tamaño de la posición
    const potentialLoss = shares * riskPerShare; // pérdida total potencial

    setResult({
      riskAmount,
      shares,
      positionSize,
      potentialLoss,
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Simulador de Riesgo</h2>
      <div>
        <label>Capital disponible:</label>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          placeholder="Ej: 10000"
        />
      </div>
      <div>
        <label>% Riesgo por trade:</label>
        <input
          type="number"
          value={riskPercent}
          onChange={(e) => setRiskPercent(e.target.value)}
          placeholder="Ej: 1"
        />
      </div>
      <div>
        <label>Precio de entrada:</label>
        <input
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          placeholder="Ej: 50"
        />
      </div>
      <div>
        <label>Precio de stop loss:</label>
        <input
          type="number"
          value={stopLossPrice}
          onChange={(e) => setStopLossPrice(e.target.value)}
          placeholder="Ej: 45"
        />
      </div>
      <button onClick={handleCalculate} style={{ marginTop: 10 }}>
        Calcular
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Resultados:</h3>
          <p>Cuánto podés perder: ${result.riskAmount.toFixed(2)}</p>
          <p>Cantidad de acciones: {result.shares}</p>
          <p>Tamaño de posición: ${result.positionSize.toFixed(2)}</p>
          <p>Pérdida total potencial: ${result.potentialLoss.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
