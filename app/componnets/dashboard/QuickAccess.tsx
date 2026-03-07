

import { ChevronRight } from "lucide-react";

const icons = [
  "/icons/credit-card-add.png", // Card Request
  "/icons/vehicle-icon-color.svg", // Vehicle Tag
  "/icons/visitor-pass-icon-color.svg", // New Pass
  "/icons/mdi_cast-school.png", // School
];

const items = [
  "Card Request",
  "Vehicle Tag",
  "New Pass",
  "School",
];

export default function QuickAccess() {
  return (
    <div className="bg-white rounded-2xl border border-[#e6f4ec] shadow-sm px-2 py-2" style={{ boxShadow: "0 4px 16px 0 #e9eef7" }}>
      <div className="grid grid-cols-4 gap-0">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-2 py-4 cursor-pointer border-r border-[#e6f4ec] last:border-none hover:bg-green-50 transition group"
          >
            <div className="bg-green-50 rounded-lg flex items-center justify-center w-14 h-14 mb-1">
              <img src={icons[i]} alt={items[i]} width={36} height={36} />
            </div>
            <div className="font-medium text-gray-800 text-base whitespace-nowrap">{item}</div>
            <ChevronRight className="w-5 h-5 text-green-400 opacity-80 group-hover:translate-x-1 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  );
}
