// src/SignalForm.jsx
import React, { useState } from "react";

const SignalForm = ({ onSimulate, onSave }) => {
  const [signal, setSignal] = useState({
    coin: "",
    type: "LONG",
    entry: "",
    leverage: 1,
    stopLoss: "",
    tps: ["", "", "", "", ""],
    capital: 1000,
    riskPercent: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignal((prev) => ({ ...prev, [name]: value }));
  };

  const handleTPChange = (index, value) => {
    const newTPs = [...signal.tps];
    newTPs[index] = value;
    setSignal((prev) => ({ ...prev, tps: newTPs }));
  };
    return (
    <div className="p-4 rounded-xl bg-white shadow-md dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-xl font-bold mb-4">📡 Cargar Señal de Trading</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="coin" value={signal.coin} onChange={handleChange} placeholder="Cripto (ej: AAVE)" className="p-2 rounded border" />
        <select name="type" value={signal.type} onChange={handleChange} className="p-2 rounded border">
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <input name="entry" value={signal.entry} onChange={handleChange} placeholder="Precio Entrada" className="p-2 rounded border" />
        <input name="stopLoss" value={signal.stopLoss} onChange={handleChange} placeholder="Stop Loss" className="p-2 rounded border" />
        <input name="leverage" value={signal.leverage} onChange={handleChange} placeholder="Apalancamiento" className="p-2 rounded border" />
        <input name="capital" value={signal.capital} onChange={handleChange} placeholder="Capital USDT" className="p-2 rounded border" />
        <input name="riskPercent" value={signal.riskPercent} onChange={handleChange} placeholder="Riesgo %" className="p-2 rounded border" />

        {signal.tps.map((tp, i) => (
          <input key={i} value={tp} onChange={(e) => handleTPChange(i, e.target.value)} placeholder={`TP${i + 1}`} className="p-2 rounded border" />
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <button onClick={() => onSimulate(signal)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Simular
        </button>
        <button onClick={() => onSave(signal)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Guardar al Historial
        </button>
      </div>
    </div>
  );
};

export default SignalForm;
