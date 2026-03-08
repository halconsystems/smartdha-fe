"use client";

import { usePathname, useRouter } from "next/navigation";
import SvgIcon from "./SvgIcon";
// import { Search } from "lucide-react";

// ─── Route label map ─────────────────────────────────────────────────────────

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/setup": "Setup",
  "/residents": "Member Type",
  "/vehicle": "Vehicle",
  "/visitor": "Visitor Pass",
  "/worker": "Worker",
  "/luggage": "Luggage Pass",
  "/properties": "Properties",
  "/residents/add-educational-visitor": "Add Educational Visitor",
  "/residents/add-resident": "Add Resident",
  "/vehicle/add-vehicle": "Add Vehicle",
  "/visitor/add-visitor-quick": "Add Visitor Pass",
  "/visitor/edit-visitor": "Edit Visitor Pass",
  "/worker/add-worker": "Add Worker",
  "/residents/add-house-help-worker": "Add House Help Worker",
  "/residents/add-visitor": "Add Visitor",
  "/residents/add-others": "Add Others",
};

function getPageLabel(pathname: string): string {
  // Exact match first
  if (routeLabels[pathname]) return routeLabels[pathname];

  // Partial match — deepest matching segment wins
  const matched = Object.keys(routeLabels)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  if (matched) return routeLabels[matched];

  // Fallback: capitalize last URL segment
  const last = pathname.split("/").filter(Boolean).pop() ?? "Dashboard";
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar({pageName = null} : {pageName?: any}) {
  const router = useRouter();
  const pathname = usePathname();
  const pageLabel = pageName || getPageLabel(pathname);
  const pathSegments = pathname.split("/").filter(Boolean);
  const parentPath = `/${pathSegments.slice(0, -1).join("/")}`;
  const showBackButton = pathSegments.length > 1;

  return (
    <div className="flex items-center justify-between px-6 h-[64px] bg-transparent w-full">

      {/* ── LEFT: Dynamic page name ── */}
       <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={() => router.push(parentPath)}
            className="w-8 h-8 flex items-center justify-center mt-1"
            aria-label={`Back to ${getPageLabel(parentPath)}`}
            title={`Back to ${getPageLabel(parentPath)}`}
          >
            <img src="/icons/Back.svg" alt="" />
          </button>
        )}
        <h1 className="text-[32px] font-semibold text-gray-800 tracking-tight">
          {pageLabel}
        </h1>
      </div>

      {/* ── RIGHT: Search bar ── */}
      <div className="flex items-center shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-full p-2">
        <div className="relative flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="
              px-2 text-[13px]
              rounded-lg w-[220px] bg-transparent
              text-gray-700 placeholder-[#A7A7A7]
              outline-none
              transition-all duration-150
            "
          />
        </div>
        {/* Search icon */}
        <div className="bg-[#F3F6F9] p-2 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.25)] cursor-pointer">
          <SvgIcon name="search-icon" size={12} className="" />
        </div>
      </div>

    </div>
  );
}