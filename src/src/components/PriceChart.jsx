import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const PriceChart = ({ coin }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "#111" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#333" },
        horzLines: { color: "#333" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const lineSeries = chart.addLineSeries();

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`
        );
        const data = await res.json();
        const prices = data.prices.map(([timestamp, price]) => ({
          time: Math.floor(timestamp / 1000),
          value: price,
        }));
        lineSeries.setData(prices);
      } catch (e) {
        console.error("Error loading chart:", e);
      }
    };

    fetchData();

    return () => chart.remove();
  }, [coin]);

  return <div ref={chartContainerRef} style={{ width: "100%", marginBottom: 20 }} />;
};

export default PriceChart;
