"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
  import type { PieLabelRenderProps } from 'recharts';

const data = [
  { name: "Vehicles", value: 200 },
  { name: "E-Tags", value: 80 },
];

const COLORS = ["#22c55e", "#bbf7d0"];

function renderCustomLabel(props: PieLabelRenderProps) {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    value = 0,
  } = props;

  const RADIAN = Math.PI / 180;

  // radius where label should sit (70% between inner and outer radius)
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  // calculate center of label
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const width = 38;
  const height = 24;

  return (
    <g>
      <foreignObject
        x={x - width / 2}   // shift left by half width
        y={y - height / 2}  // shift up by half height
        width={width}
        height={height}
      >
        <div
          style={{
            background: "white",
            color: '#22c55e',
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 12,
            width: width,
            height: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0001',
          }}
        >
          {value}
        </div>
      </foreignObject>
    </g>
  );
}

export default function VehiclesChart() {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="bg-white rounded-2xl px-1 flex flex-col h-full justify-between" style={{ minHeight: 260 }}>
      <div>
        <h2 className="font-bold mb-1 text-xl text-left">Total Vehicles /E-Tags</h2>
        <div className="text-green-600 text-3xl font-bold mb-2 text-left">{total}</div>
      </div>
      <div className="flex items-end justify-center gap-2">
        {/* Legend below chart */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-[#22c55e] inline-block"></span>
            <span className="text-gray-700">200 Vehicles</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-[#bbf7d0] inline-block"></span>
            <span className="text-gray-700">80 E-Tags</span>
          </div>
        </div>
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={80}
              startAngle={270}
              endAngle={-90}
              label={renderCustomLabel}
              labelLine={false}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
