import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";

const PriceChart = ({ coin = "bitcoin", timeframe = "1" }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // CoinGecko API: market_chart
        // timeframe: 1,7,30 días
        const days = timeframe;
        const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Error al obtener datos");

        const data = await res.json();

        // data.prices es un array: [ [timestamp, price], ... ]
        const labels = data.prices.map((p) => {
          const date = new Date(p[0]);
          return days <= 1
            ? date.toLocaleTimeString()
            : date.toLocaleDateString();
        });
        const prices = data.prices.map((p) => p[1]);

        if (chartInstance) {
          chartInstance.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: `${coin} Precio (USD)`,
                data: prices,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
                tension: 0.3,
                pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  maxTicksLimit: 10,
                  maxRotation: 0,
                  minRotation: 0,
                },
              },
              y: {
                beginAtZero: false,
              },
            },
            plugins: {
              legend: { display: true },
              tooltip: { mode: "index", intersect: false },
            },
          },
        });

        setChartInstance(newChart);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup al desmontar o cambiar coin/timeframe
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [coin, timeframe]);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      {loading && <p>Cargando gráfico...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PriceChart;
