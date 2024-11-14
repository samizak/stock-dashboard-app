"use client";

const TitleLegend = ({ candlePriceAtCursor, barChangeData }: any) => {
  const candleData = { ...candlePriceAtCursor, ...barChangeData };

  return (
    <div className="absolute top-2 left-2 z-20 text-white flex flex-row gap-3">
      <div className="font-bold">XAUUSD · 1D · OANDA</div>

      <div className="flex flex-row gap-2 text-sm my-auto">
        <div className="flex flex-row gap-1">
          <div className="font-bold">O</div>
          <div
            className={
              candleData?.change > 0 ? "text-emerald-600" : "text-red-500"
            }
          >
            {candleData?.open}
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="font-bold">H</div>
          <div
            className={
              candleData?.change > 0 ? "text-emerald-600" : "text-red-500"
            }
          >
            {candleData?.high}
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="font-bold">L</div>
          <div
            className={
              candleData?.change > 0 ? "text-emerald-600" : "text-red-500"
            }
          >
            {candleData?.low}
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="font-bold">C</div>
          <div
            className={
              candleData?.change > 0 ? "text-emerald-600" : "text-red-500"
            }
          >
            {candleData?.close}
          </div>
        </div>

        <div className="flex flex-row gap-1">
          <div
            className={
              candleData?.change > 0 ? "text-emerald-600" : "text-red-500"
            }
          >
            {(candleData?.change > 0 ? "+" : "") + candleData?.change}
          </div>
          <div
            className={
              candleData?.change > 0 ? "text-emerald-600" : "text-red-500"
            }
          >
            {"(" +
              (candleData?.change_percentage > 0 ? "+" : "") +
              candleData?.change_percentage +
              "%)"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleLegend;
