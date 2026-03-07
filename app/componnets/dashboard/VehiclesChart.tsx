"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Vehicles", value: 200 },
  { name: "E-Tags", value: 80 },
];

const COLORS = ["#22c55e", "#bbf7d0"];


import React from "react";

const LABEL_COLORS = ["#22c55e", "#22c55e"];
const LEGEND_COLORS = ["#22c55e", "#bbf7d0"];

import type { PieLabelRenderProps } from 'recharts';

function renderCustomLabel(props: PieLabelRenderProps) {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    index = 0,
    value = 0,
  } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <g>
      <foreignObject x={x - 22} y={y - 16} width={44} height={32}>
        <div style={{ background: LABEL_COLORS[index], color: '#fff', borderRadius: 16, fontWeight: 700, fontSize: 16, width: 44, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0001' }}>{value}</div>
      </foreignObject>
    </g>
  );
}

export default function VehiclesChart() {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="bg-white rounded-2xl px-6 py-5 flex flex-col h-full justify-between" style={{ minHeight: 260 }}>
      <div>
        <h2 className="font-semibold mb-1 text-left">Total Vehicles <span className="font-normal">/</span> <span className="font-normal">E-Tags</span></h2>
        <div className="text-green-600 text-3xl font-bold mb-2 text-left">{total}</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={80}
              innerRadius={55}
              startAngle={90}
              endAngle={-270}
              label={renderCustomLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Legend below chart */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-[#22c55e] inline-block"></span>
            <span className="text-gray-700">200 Vehicles</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-[#bbf7d0] inline-block"></span>
            <span className="text-gray-700">80 E-Tags</span>
          </div>
        </div>
      </div>
    </div>
  );
}
