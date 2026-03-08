

import { ChevronRight } from "lucide-react";

const icons = [
  "/icons/credit-card-add.svg", // Card Request
  "/icons/vehicle-icon-color.svg", // Vehicle Tag
  "/icons/visitor-pass-icon-color.svg", // New Pass
  "/icons/mdi_cast-school.svg", // School
];

const items = [
  "Card Request",
  "Vehicle Tag",
  "New Pass",
  "School",
];

export default function QuickAccess() {
  return (<>
    <h2 className="text-xl font-bold">Quick Access</h2>
 
  <div className="bg-white rounded-2xl border border-[#f0f2f8] shadow-sm p-3" style={{ boxShadow: "0 4px 16px 0 #e9eef7" }}>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 min-h-[110px] px-3 py-3 bg-white rounded-xl shadow-md border border-[#D9D9D9] hover:border-[#30B33D] transition cursor-pointer`}
            style={{ boxShadow: "0 4px 24px 0 #e9eef7" }}
          >
            <div className="rounded-lg flex items-center justify-center w-16 h-16 mr-3 border border-[rgba(48,179,61,0.2)]">
               <img src={icons[i]} alt={items[i]} width={36} height={36} />
            </div>
            <div className="font-medium text-gray-800 text-base whitespace-nowrap">{item}</div>
            <ChevronRight className="w-5 h-5 text-green-400 opacity-80 group-hover:translate-x-1 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  </>);
}
