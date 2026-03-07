"use client"

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
      <div className="flex flex-col items-center justify-center mb-2">
        <h2 className="font-semibold self-start">Analysis</h2>
        <div className="flex gap-2 mt-1 justify-center">
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Weekly</span>
          <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold">Monthly</span>
          <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold">Yearly</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4} barCategoryGap={16}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="nonMembers" fill="#bbf7d0" radius={[6,6,0,0]} name="Non-Member" />
          <Bar dataKey="members" fill="#22c55e" radius={[6,6,0,0]} name="Members" />
        </BarChart>
      </ResponsiveContainer>
      {/* Custom legend centered at bottom */}
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
