"use client";

import { useEffect, useRef, useState } from "react";
import { CandlestickData } from "lightweight-charts";
import useSWR from "swr";
import Chart from "@/app/components/markets/Chart/Chart";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CoinPriceChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
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

  return <Chart data={data} title={"Test"} indicatorsData={indicatorsData} />;
};

export default CoinPriceChart;
