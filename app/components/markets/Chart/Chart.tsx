"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickData,
  ChartOptions,
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import TitleLegend from "./Legend/TitleLegend";
import { CandlePrice } from "@/types/candlePrice";
import { BarChangeData } from "@/types/BarChangeData";

interface ChartProps {
  data: CandlestickData[] | undefined;
  indicatorsData: any[];
  symbolName: string;
  timeframe: string;
  broker: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  indicatorsData,
  symbolName,
  timeframe,
  broker,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [candlePriceAtCursor, setCandlePriceAtCursor] = useState<CandlePrice>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });

  const [barChangeData, setBarChangeData] = useState<BarChangeData>({
    change: "",
    change_percentage: "",
  });

  const chartOptions = useMemo<DeepPartial<ChartOptions>>(
    () => ({
      layout: {
        background: { color: "#222" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
    }),
    []
  );

  const updateBarChangeData = (close: number, prevClose: number) => {
    const change = (close - prevClose).toFixed(3);
    const changePercentage = ((100 * (close - prevClose)) / prevClose).toFixed(
      2
    );
    setBarChangeData({ change, change_percentage: changePercentage });
  };

  useEffect(() => {
    if (!chartContainerRef.current || !data || !indicatorsData) return;

    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });
    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries();
    seriesRef.current = candleSeries;
    candleSeries.setData(data);

    const recentBar = data[data.length - 1];
    const prevBar = data[data.length - 2];

    setCandlePriceAtCursor({
      open: recentBar.open,
      high: recentBar.high,
      low: recentBar.low,
      close: recentBar.close,
    });

    updateBarChangeData(recentBar.close, prevBar.close);

    chart.timeScale().setVisibleLogicalRange({
      from: Math.max(0, data.length - 100),
      to: data.length - 1,
    });
    chart.timeScale().scrollToPosition(5, false);

    const markers = indicatorsData.map((indicator) => ({
      time: indicator.time,
      position: indicator.direction === 1 ? "aboveBar" : "belowBar",
      color: indicator.direction === 1 ? "#e91e63" : "#2196F3",
      shape: indicator.direction === 1 ? "arrowDown" : "arrowUp",
      text: indicator.signal,
    }));
    candleSeries.setMarkers(markers as any);

    const handleResize = () => {
      chart.resize(
        chartContainerRef.current!.clientWidth,
        chartContainerRef.current!.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const dataPoint = param.seriesData.get(candleSeries) as CandlestickData;
        setCandlePriceAtCursor({
          open: dataPoint.open,
          high: dataPoint.high,
          low: dataPoint.low,
          close: dataPoint.close,
        });

        const prevClose = data[(param.logical as number) - 1].close;
        updateBarChangeData(dataPoint.close, prevClose);
      }
    });

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [data, indicatorsData, chartOptions]);

  return (
    <div className="relative h-1/2" ref={chartContainerRef}>
      <TitleLegend
        candlePriceAtCursor={candlePriceAtCursor}
        barChangeData={barChangeData}
        symbolName={symbolName}
        timeframe={timeframe}
        broker={broker}
      />
    </div>
  );
};

export default Chart;
