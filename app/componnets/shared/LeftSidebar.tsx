"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SvgIcon from "./SvgIcon";
import Image from "next/image";
import { BiChevronDown } from "react-icons/bi";

// ─── Types ──────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DropdownItem extends NavItem { }

// ─── Data ───────────────────────────────────────────────────────────────────

const topNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <SvgIcon name="dashboard-icon" size={12} />,
  },
  {
    label: "Setup",
    href: "/setup",
    icon: <SvgIcon name="setup-icon" size={16} />,
  },
];

const membershipItems: DropdownItem[] = [
  {
    label: "Residents",
    href: "/residents",
    icon: <SvgIcon name="residents-icon" size={20} />,
  },
  {
    label: "Vehicle",
    href: "/vehicle",
    icon: <SvgIcon name="vehicle-icon" size={16} />,
  },
  {
    label: "Visitor Pass",
    href: "/visitor-pass",
    icon: <SvgIcon name="visitor-pass-icon" size={16} />,
  },
  {
    label: "Worker",
    href: "/membership/worker",
    icon: <SvgIcon name="worker-icon" size={16} />,
  },
  {
    label: "Luggage Pass",
    href: "/membership/luggage-pass",
    icon: <SvgIcon name="luggage-pass-icon" size={16} />,
  },
  {
    label: "Properties",
    href: "/membership/properties",
    icon: <SvgIcon name="properties-icon" size={16} />,
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={`
        group flex items-center justify-between w-full px-4 py-2.5 rounded-lg
        text-sm  transition-all duration-150
        ${isActive
          ? " text-[#30B33D] font-medium shadow-[0_0_15px_rgba(0,0,0,0.25)]"
          : "text-[#A5A5A5] hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >

      {item.label}
      <span
        className={`transition-colors duration-150 ${isActive ? "text-[#30B33D]" : "text-gray-400 group-hover:text-gray-600"
          }`}
      >
        {item.icon}
      </span>

    </Link>
  );
}

function DropdownNavLink({
  item,
  pathname,
}: {
  item: DropdownItem;
  pathname: string;
}) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={`
        group flex items-center justify-between w-full px-4 py-2 rounded-lg
        text-sm transition-all duration-150
        ${isActive
          ? "text-[#30B33D] font-medium shadow-[0_0_15px_rgba(0,0,0,0.25)]"
          : "text-[#A5A5A5] hover:bg-gray-100 hover:text-gray-800 font-normal"
        }
      `}
    >
      {item.label}
      <span
        className={`transition-colors duration-150 ${isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
          }`}
      >
        {item.icon}
      </span>
    </Link>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LeftSidebar() {
  const pathname = usePathname();
  const [membershipOpen, setMembershipOpen] = useState(true);

  return (
    <div className="flex flex-col w-full h-full bg-white">

      {/* ── LOGO ── */}
      <div className="flex items-center justify-center px-6 py-5 border-b border-[#D9D9D9]">
        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className=" rounded-lg flex items-center justify-center flex-shrink-0">
            {/* Logo */}
            <Image
              src="/logos/dha-logo.png"
              alt="DHA Logo"
              width={80}
              height={80}
              className='mb-2 flex-shrink-0'
            />
          </div>
        </div>
      </div>

      {/* ── NAVIGATION ── scrollable middle area */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1">

        {/* Top nav items: Dashboard, Setup */}
        {topNavItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* ── Membership Services Dropdown ── */}
        <div className="pt-1">
          {/* Dropdown trigger */}
          <button
            onClick={() => setMembershipOpen((prev) => !prev)}
            className={`
              group flex items-center justify-between w-full py-2.5 rounded-lg
              text-sm font-medium transition-all duration-150
              ${membershipOpen
                ? "text-[#30B33D]"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >

            Membership Services
            <span
              className={`transition-colors duration-150 ${membershipOpen
                ? "text-[#30B33D]"
                : "text-gray-600 group-hover:text-gray-600"
                }`}
            >
              <BiChevronDown
                className={`w-[28px] h-[28px] transition-transform ${membershipOpen ? "rotate-180" : ""}`}
              />
            </span>
          </button>

          {/* Dropdown items */}
          {membershipOpen && (
            <div className="mt-1 pl-3 space-y-0.5">
              {membershipItems.map((item) => (
                <DropdownNavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ── BOTTOM BORDER + LOGOUT ── */}
      <div className="border-t border-[#D9D9D9] px-3 py-6">
        <button
          className="
            group flex items-center justify-between text-[#FF0000] font-medium shadow-[0_0_15px_rgba(0,0,0,0.25)] w-full px-4 py-2.5 rounded-lg
            text-sm
            hover:bg-red-50 hover:text-red-600
            transition-all duration-150
          "
          onClick={() => {
            /* handle logout */
          }}
        >
            Logout
            <span className="group-hover:text-red-500 transition-colors duration-150">
              <SvgIcon name="logout-icon" size={16} className="text-red-500" />
            </span>
        </button>
      </div>

    </div>
  );
}