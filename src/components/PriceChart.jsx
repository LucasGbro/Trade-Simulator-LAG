import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const PriceChart = ({ coin = "bitcoin", timeframe = "1" }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const seriesRef = useRef(null);
    useEffect(() => {
    chartInstance.current = createChart(chartRef.current, {
      layout: {
        background: { color: "#111" },
        textColor: "#fff",
      },
      width: chartRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { color: "#333" },
        horzLines: { color: "#333" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    seriesRef.current = chartInstance.current.addLineSeries({
      color: "#0f0",
    });

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current.applyOptions({
        width: chartRef.current.clientWidth,
      });
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chartInstance.current.remove();
    };
  }, []);
    useEffect(() => {
    if (!seriesRef.current) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${timeframe}`
        );
        const data = await res.json();
        const prices = data.prices.map(([timestamp, price]) => ({
          time: Math.floor(timestamp / 1000),
          value: price,
        }));
        seriesRef.current.setData(prices);
      } catch (err) {
        console.error("Error al cargar datos del gráfico", err);
      }
    };

    fetchData();
  }, [coin, timeframe]);

    return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "300px",
        margin: "0 auto",
        borderRadius: 8,
        background: "#111",
      }}
    />
  );
};

export default PriceChart;
