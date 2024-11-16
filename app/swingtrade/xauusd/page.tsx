"use client";

import { useEffect, useState } from "react";
import { CandlestickData } from "lightweight-charts";
import useSWR from "swr";
import Chart from "@/app/components/markets/Chart/Chart";

const BASE_URL = "http://localhost:3001";
const SYMBOL = "XAU_USD";
const BROKER = "oanda";
const TIMEFRAMES = ["h12", "D"];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const fetchIndicators = async (data: CandlestickData[]) => {
  const response = await fetch(`${BASE_URL}/indicators/td9`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const useFetchData = (timeframe: string) => {
  const { data, error } = useSWR<CandlestickData[]>(
    `${BASE_URL}/fetchprice?symbol=${SYMBOL}&timeframe=${timeframe}&broker=${BROKER}`,
    fetcher
  );
  return { data, error };
};

const CoinPriceChart = () => {
  const { data: data12h, error: error12h } = useFetchData(TIMEFRAMES[0]);
  const { data: data1D, error: error1D } = useFetchData(TIMEFRAMES[1]);

  const [indicatorsData, setIndicatorsData] = useState<{
    h12: any;
    D: any;
  }>({ h12: null, D: null });

  useEffect(() => {
    if (data12h) {
      fetchIndicators(data12h).then((res) =>
        setIndicatorsData((prev) => ({ ...prev, h12: res }))
      );
    }
  }, [data12h]);

  useEffect(() => {
    if (data1D) {
      fetchIndicators(data1D).then((res) =>
        setIndicatorsData((prev) => ({ ...prev, D: res }))
      );
    }
  }, [data1D]);

  if (error12h || error1D) return <div>Failed to load</div>;
  if (!data12h || !data1D) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-screen h-screen">
      <Chart
        data={data12h}
        indicatorsData={indicatorsData.h12}
        symbolName="XAUUSD"
        timeframe="12h"
        broker="OANDA"
      />
      <Chart
        data={data1D}
        indicatorsData={indicatorsData.D}
        symbolName="XAUUSD"
        timeframe="1D"
        broker="OANDA"
      />
    </div>
  );
};

export default CoinPriceChart;
