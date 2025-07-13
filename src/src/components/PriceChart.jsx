import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const PriceChart = ({ coin = "bitcoin", timeframe = "1" }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "#111" },
        textColor: "#ffffff",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const lineSeries = chart.addLineSeries({
      color: "#00FFAA",
    });

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${timeframe}`
        );
        const data = await res.json();

        const chartData = data.prices.map(([timestamp, price]) => ({
          time: Math.floor(timestamp / 1000),
          value: price,
        }));

        lineSeries.setData(chartData);
      } catch (error) {
        console.error("Error al cargar datos del gráfico:", error);
      }
    };

    fetchData();

    return () => {
      chart.remove();
    };
  }, [coin, timeframe]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "300px", marginTop: "1rem" }}
    />
  );
};

export default PriceChart;

uso lightweight-charts para mostrar gráfico
