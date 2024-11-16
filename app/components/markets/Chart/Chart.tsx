"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickData,
  ChartOptions,
  createChart,
  DeepPartial,
} from "lightweight-charts";
import TitleLegend from "./Legend/TitleLegend";

const Chart = ({
  data,
  title,
  indicatorsData,
}: {
  data: CandlestickData[] | undefined;
  indicatorsData: any;
  title: string;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [candlePriceAtCursor, setCandlePriceAtCursor] = useState<any>();
  const [barChangeData, setBarChangeData] = useState<any>();

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

  useEffect(() => {
    if (!chartContainerRef.current || !data || !indicatorsData) return;

    const recent_bar = data.at(-1);
    const prev_bar = data.at(-2);
    setCandlePriceAtCursor(recent_bar);

    const _close = (recent_bar as any).close;
    const _prev_close = (prev_bar as any).close;

    const change = (_close - _prev_close).toFixed(3);
    const changePercentage = (
      (100 * (_close - _prev_close)) /
      _prev_close
    ).toFixed(2);

    setBarChangeData({
      change: change,
      change_percentage: changePercentage,
    });

    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chart.timeScale().setVisibleLogicalRange({
      from: Math.max(0, data.length - 100),
      to: data.length - 1,
    });

    chart.timeScale().scrollToPosition(5, false);

    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(data);

    const markers: any = [];

    for (let i = 0; i < indicatorsData.length; i++) {
      if (indicatorsData[i].direction == 1) {
        markers.push({
          time: indicatorsData[i].time,
          position: "aboveBar",
          color: "#e91e63",
          shape: "arrowDown",
          text: indicatorsData[i].signal,
        });
      } else {
        markers.push({
          time: indicatorsData[i].time,
          position: "belowBar",
          color: "#2196F3",
          shape: "arrowUp",
          text: indicatorsData[i].signal,
        });
      }
    }
    candleSeries.setMarkers(markers);

    const handleResize = () => {
      chart.resize(
        chartContainerRef.current!.clientWidth,
        chartContainerRef.current!.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Subscribe to crosshair move events
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const dataPoint = param.seriesData.get(candleSeries);
        setCandlePriceAtCursor(dataPoint);

        const _close = (dataPoint as any).close;
        const _prev_close = data[(param.logical as number) - 1].close;

        const change = (_close - _prev_close).toFixed(3);
        const changePercentage = (
          (100 * (_close - _prev_close)) /
          _prev_close
        ).toFixed(2);

        setBarChangeData({
          change: change,
          change_percentage: changePercentage,
        });
      }
    });

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [data, indicatorsData]);

  return (
    <div className="fixed inset-0 w-screen h-screen" ref={chartContainerRef}>
      <TitleLegend
        candlePriceAtCursor={candlePriceAtCursor}
        barChangeData={barChangeData}
      />
    </div>
  );
};

export default Chart;
