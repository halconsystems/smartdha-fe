"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", members: 400, nonMembers: 320 },
  { day: "Tue", members: 250, nonMembers: 140 },
  { day: "Wed", members: 460, nonMembers: 300 },
  { day: "Thu", members: 420, nonMembers: 210 },
  { day: "Fri", members: 480, nonMembers: 270 },
  { day: "Sat", members: 320, nonMembers: 210 },
  { day: "Sun", members: 120, nonMembers: 80 },
];

export default function AnalysisChart() {
  return (
    <div>
      <div className="flex items-center justify-center mb-2 relative">
        <h2 className="self-start text-xl font-bold absolute left-0">Analysis</h2>
        <div className="flex gap-2 mt-1 justify-center">
          <span className="bg-[#30B33D] text-white px-3 py-2 rounded-full text-xs font-semibold">Weekly</span>
          <span className="bg-[#30B33D33] text-[#30B33D] px-3 py-2 rounded-full text-xs font-semibold">Monthly</span>
          <span className="bg-[#30B33D33] text-[#30B33D] px-3 py-2 rounded-full text-xs font-semibold">Yearly</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={0} barCategoryGap={16} style={{ outline: 'none' }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontWeight: 500, fontSize: 14, fill: '#333' }}/>
          <YAxis tickLine={false} axisLine={false} tick={{ fontWeight: 500, fontSize: 14, fill: '#333' }}/>
          <Tooltip />
          <Bar dataKey="nonMembers" fill="#bbf7d0" radius={[10,10,0,0]} name="Non-Member" barSize={15} />
          <Bar dataKey="members" fill="#22c55e" radius={[10,10,0,0]} name="Members" barSize={15} />
          <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" strokeDasharray="5 3" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-6 mt-2 justify-center">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full" style={{ background: '#bbf7d0' }}></span>
          <span className="text-gray-700">Non-Member</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }}></span>
          <span className="text-gray-700">Members</span>
        </div>
      </div>
    </div>
  );
}
