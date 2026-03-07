
import { Users, User2, Home } from "lucide-react";

const icons = [
  <Users key="workers" className="w-10 h-10 text-green-500" />, // Total Workers
  <User2 key="residents" className="w-10 h-10 text-green-500" />, // Total Residents
  <Home key="properties" className="w-10 h-10 text-green-500" />, // Total Properties
];

export default function StatsCards() {
  const stats = [
    { title: "Total Workers", value: "982" },
    { title: "Total Residents", value: "3214" },
    { title: "Total Properties", value: "1243" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#f0f2f8] shadow-sm px-2 py-2" style={{ boxShadow: "0 4px 16px 0 #e9eef7" }}>
      <div className="grid grid-cols-3 gap-0">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 min-h-[110px] px-6 py-5 bg-white rounded-xl shadow-md ${i !== 2 ? 'border-r border-[#f0f2f8]' : ''}`}
            style={{ boxShadow: "0 4px 24px 0 #e9eef7" }}
          >
            <div className="bg-green-50 rounded-lg flex items-center justify-center w-16 h-16 mr-3">
              {icons[i]}
            </div>
            <div>
              <div className="font-semibold text-black text-base mb-1">{item.title}</div>
              <div className="text-green-600 text-3xl font-bold leading-tight">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
