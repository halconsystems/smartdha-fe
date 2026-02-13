"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import SvgIcon from "./SvgIcon";
import { AppNotification, MemberStats, MOCK_NOTIFICATIONS, MOCK_STATS } from "@/app/utils/RightSidebarData";
// import { Phone, Mail, Bell, Users } from "lucide-react";



// ─── Pie Chart Component ─────────────────────────────────────────────────────
function PieChart({ members, nonMembers }: { members: number; nonMembers: number }) {
  const total = members + nonMembers;
  const memberPct = Math.round((members / total) * 100);
  console.log("Member Per",memberPct);
  
  const nonMemberPct = 100 - memberPct;
  console.log("Non Mem Per",nonMemberPct);
  

  const cx = 100;
  const cy = 100;
  const r = 85;

  // Convert percentage to SVG arc path
  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function slicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  }

  // Members = dark green, starts at 0°
  const membersStart = 0;
  const membersEnd = (members / total) * 360;

  // Non-members = light green, continues after members
  const nonMembersStart = membersEnd;
  const nonMembersEnd = 360;

  // Tooltip position — midpoint of non-member arc
  const tooltipAngle = nonMembersStart + (nonMembersEnd - nonMembersStart) / 2;
  const tooltipPos = polarToCartesian(cx, cy, r * 0.62, tooltipAngle);

  return (
    <div className="flex items-center gap-1">

      {/* ── Legend left ── */}
      <div className="flex flex-col gap-3 flex-shrink-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="w-[9px] h-[9px] rounded-[3px] bg-[#22c55e] flex-shrink-0 shadow-sm" />
          <span className="text-[8px] text-black/50 whitespace-nowrap">
            {memberPct}% Members
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[9px] h-[9px] rounded-[3px] bg-[#bbf7d0] flex-shrink-0 shadow-sm" />
          <span className="text-[8px] text-black/50 whitespace-nowrap">
            {nonMemberPct}% Non-Members
          </span>
        </div>
      </div>

      {/* ── Pie chart SVG ── */}
      <div className="flex-shrink-0 ml-auto">
        <svg
          width="123"
          height="123"
          viewBox="0 0 200 200"
          className="drop-shadow-sm"
        >
          {/* Non-members slice — light green (drawn first / behind) */}
          <path
            d={slicePath(cx, cy, r, nonMembersStart, nonMembersEnd)}
            fill="#bbf7d0"
          />

          {/* Members slice — dark green */}
          <path
            d={slicePath(cx, cy, r, membersStart, membersEnd)}
            fill="#22c55e"
          />

          {/* Tooltip bubble on non-members slice */}
          <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`}>
            {/* Bubble background */}
            <rect
              x="-18"
              y="-13"
              width="36"
              height="22"
              rx="6"
              ry="6"
              fill="white"
              filter="url(#shadow)"
            />
            {/* Bubble tail */}
            <polygon
              points="-4,9 4,9 0,16"
              fill="white"
            />
            {/* Percentage text */}
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#16a34a"
            >
              {nonMemberPct}%
            </text>

            {/* Drop shadow filter */}
            <defs>
              <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00000018" />
              </filter>
            </defs>
          </g>
        </svg>
      </div>

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RightSidebar() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [stats, setStats] = useState<MemberStats>(MOCK_STATS);
  const notifRef = useRef<HTMLDivElement>(null);

  // Simulate API fetch
  useEffect(() => {
    // Replace these with real API calls:
    // const res = await fetch("/api/notifications"); ...
    // const res = await fetch("/api/member-stats"); ...
    setNotifications(MOCK_NOTIFICATIONS);
    setStats(MOCK_STATS);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex flex-col w-full h-full bg-white overflow-hidden">

      {/* ════════════════════════════════════════
          SECTION 1 — Organisation Card
      ════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4 py-5">
        <div className="rounded-xl p-4 bg-[#F9FAFB] flex flex-col items-center shadow-[0_0_15px_rgba(0,0,0,0.25)]">

          {/* Logo */}
          <div className="shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-full px-2.5 py-1.5">
            <Image
              src="/logos/dha-logo.png"
              alt="DHA Logo"
              width={80}
              height={80}
              className='mb-2 flex-shrink-0'
            />
          </div>

          <div className="text-center leading-tight py-2">
            <p className="text-[18px] font-semibold text-[#30B33D]">DHA Smart City</p>
          </div>

          {/* Contact mini-card */}
          <div className="w-full rounded-lg space-y-1.5 shadow-[0_0_15px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3  px-3 py-2.5">
              {/* phone icon */}
              <div className="bg-white p-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.25)]">
                <SvgIcon name="phone-icon" size={12} className="" />
              </div>
              <span className="text-[12px] text-black font-medium">+92 300 1234567</span>
            </div>
            <div className="w-full h-px bg-[#ECECEC]" />
            <div className="flex items-center gap-3  px-3 py-2.5">
              {/* email icon */}
              <div className="bg-white px-2 py-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.25)]">
                <SvgIcon name="email-icon" size={12} className="" />
              </div>
              <span className="text-[12px] text-black font-medium">info@dhasmartcity.com</span>
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="flex-shrink-0 h-px bg-[#D9D9D9]" />

      {/* ════════════════════════════════════════
          SECTION 2 — Notifications
      ════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 min-h-0 px-4 py-5 overflow-hidden">

        {/* Heading row */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* <Bell size={15} className="text-gray-500" /> */}
            <h2 className="text-[14px] font-semibold text-black">Notifications</h2>
          </div>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Scrollable notification list — 5 visible then scroll */}
        <div
          ref={notifRef}
          className="flex-1 overflow-y-auto min-h-0 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.25)] divide-y divide-[#ECECEC]"
          style={{ maxHeight: "calc(5 * 72px)" }}
        >
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-2.5 px-3 py-3 transition-colors hover:bg-white}`}
            >
              {/* notification icon */}
              <div className="bg-white px-2 py-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.25)]">
                <SvgIcon name="notification-icon" size={14} className="" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-black truncate">
                  {notif.title}
                </p>
                <p className="text-[8px] text-black/50 mt-0.5 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
                {/* <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p> */}
              </div>

              {/* Unread dot */}
              {/* <div className="flex-shrink-0 mt-1">
                {notif.unread ? (
                  <span className="w-2 h-2 rounded-full bg-green-500 block mt-0.5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-200 block mt-0.5" />
                )}
              </div> */}
            </div>
          ))}
        </div>

      </div>

      {/* Divider */}
      <div className="flex-shrink-0 h-px bg-[#D9D9D9]" />

      {/* ════════════════════════════════════════
          SECTION 3 — Total DHA Members + Pie
      ════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4 py-5">
      <div
        className="rounded-2xl px-5 pt-4 bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)]"
      >
        {/* Heading */}
        <p className="text-[12px] font-medium text-black mb-1">
          Total DHA Members
        </p>

        {/* Large count */}
        <p
          className="text-[32px] font-semibold text-[#30B33D] leading-none mb-4"
        >
          {stats.totalMembers}
        </p>

        {/* Pie chart + legend */}
        <PieChart members={stats.members} nonMembers={stats.nonMembers} />
      </div>
    </div>

    </div>
  );
}