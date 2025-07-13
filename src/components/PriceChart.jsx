
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const PriceChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: 360,
      height: 300,
      layout: {
        background: { color: "#111" },
        textColor: "#fff",
      },
      grid: {
        vertLines: { color: "#333" },
        horzLines: { color: "#333" },
      },
    });

    const lineSeries = chart.addLineSeries({ color: "#0f0" });

    fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1")
      .then((res) => res.json())
      .then((data) => {
        const prices = data.prices.map(([timestamp, price]) => ({
          time: Math.floor(timestamp / 1000),
          value: price,
        }));
        lineSeries.setData(prices);
      });

    return () => chart.remove();
  }, []);

  return <div ref={chartRef} style={{ width: "100%", maxWidth: "400px", height: "300px", margin: "0 auto" }} />;
};

export default PriceChart;

