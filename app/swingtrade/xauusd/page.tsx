"use client";

import { useEffect, useState } from "react";
import { CandlestickData } from "lightweight-charts";
import useSWR from "swr";
import Chart from "@/app/components/markets/Chart/Chart";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CoinPriceChart = () => {
  const { data } = useSWR<CandlestickData[]>(
    "http://localhost:3001/test",
    fetcher
  );
  const [indicatorsData, setIndicatorsData] = useState<any>(null); // State to hold indicators data

  useEffect(() => {
    if (!data) return;

    fetch("http://localhost:3001/indicators/td9", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => setIndicatorsData(res));
  }, [data]);

  return (
    <div className="flex flex-col w-screen h-screen">
      <Chart
        data={data}
        indicatorsData={indicatorsData}
        symbolName={"XAUUSD"}
        timeframe={"12h"}
        broker={"OANDA"}
      />
      <Chart
        data={data}
        indicatorsData={indicatorsData}
        symbolName={"XAUUSD"}
        timeframe={"1D"}
        broker={"OANDA"}
      />
    </div>
  );
};

export default CoinPriceChart;
