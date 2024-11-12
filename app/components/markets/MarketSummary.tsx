"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  
  const stockData = {
    "AAPL": { logoURL: "", symbol: "AAPL", price: 223.75, change: -0.46, changePercent: -0.21 },
    "AMD": { logoURL: "", symbol: "AMD", price: 142.24, change: -5.10, changePercent: -3.46 },
    "AMZN": { logoURL: "", symbol: "AMZN", price: 207.71, change: 0.89, changePercent: 0.43 },
    "META": { logoURL: "", symbol: "META", price: 583.17, change: -0.09, changePercent: -0.02 },
    "TSLA": { logoURL: "", symbol: "TSLA", price: 328.13, change: -22.08, changePercent: -6.31 },
    "UBER": { logoURL: "", symbol: "UBER", price: 71.56, change: -0.13, changePercent: -0.18 }
  };


  export default function MarketSummary(){

    for (const [symbol, value] of Object.entries(stockData)) {
        const url = `https://img.logo.dev/ticker/${symbol}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_API_KEY}`;
        
        stockData[symbol as keyof typeof stockData].logoURL = url;
      }
  
    console.log(stockData);

    function GetPercentageElement (changePercent: number){
        if (changePercent > 0){
          return <div className="bg-green-900 text-green-400 text-sm px-2 py-1 rounded-md">{changePercent}%</div>
        }
        return <div className="bg-red-900 text-red-400 text-sm px-2 py-1 rounded-md">{changePercent}%</div>
      }
    
      function GetSymbolAndLogo (symbol: string, logoURL: string) {
    
        return (
          <TableCell className="h-6 px-4 text-center align-middle font-medium">
            <div className="flex flex-row align-middle justify-between gap-4">
                <Image src={logoURL} width={32} height={32} alt="logo" className="rounded-full max-w-full h-auto"/>
                <div className="text-left my-auto w-full">{symbol}</div>
            </div>
          </TableCell>
        )
      }


    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full">
            <nav className="navbar">NAVBAR HERE</nav>
    
            <div className="flex flex-col max-w-screen-xl w-full">
              <div className="text-gray-300 ml-2 mb-3 mt-4 text-left">Market Summary</div>
    
              <div className="grid grid-cols-3 gap-4 rounded-md border">
                <Table className="">
                  <TableHeader className="">
                    <TableRow className="">
                      <TableHead className="h-6 px-4 text-center align-middle font-medium">Symbol</TableHead>
                      <TableHead className="h-6 px-4 text-center align-middle font-medium">Price</TableHead>
                      <TableHead className="h-6 px-4 text-center align-middle font-medium">Change</TableHead>
                      <TableHead className="h-6 px-4 text-right align-middle font-medium">% Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(stockData).map((data) => (
                      <TableRow key={data.symbol}>
                        {/* <TableCell className="h-6 px-4 text-left align-middle font-medium">{data.symbol}</TableCell> */}
                        {GetSymbolAndLogo(data.symbol, data.logoURL)}
                        <TableCell className="h-6 px-4 text-center align-middle font-medium">{data.price}</TableCell>
                        <TableCell className="h-6 px-4 text-center align-middle font-medium">{data.change}</TableCell>
                        <TableCell className="h-6 px-4 text-center align-middle font-medium">
                          
                          {GetPercentageElement(data.changePercent)}
    
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
    
                <div className="w-full text-left">
                  <div className="flex flex-row p-4 gap-4">
                    <div className="text-3xl">AAPL</div>
                    <div className="text-3xl text-gray-400">223.75</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      );
}