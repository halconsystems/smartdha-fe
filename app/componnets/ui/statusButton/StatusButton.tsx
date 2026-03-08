"use client";

import React from "react";

type StatusButtonProps = {
  text?: String,
  isActive: boolean;
  onToggle: () => void;
  activeText?: string;
  inactiveText?: string;
};

const StatusButton: React.FC<StatusButtonProps> = ({
  text = "Status",
  isActive,
  onToggle,
  activeText = "Active",
  inactiveText = "Inactive",
}) => {
  return (
    <div className="flex">
    <p className="block text-sm font-semibold mr-2">
        {text}
    </p>
        <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex items-center h-[24px] w-[68px] rounded-full px-2 transition-colors duration-300 focus:outline-none ${
            isActive ? "bg-[#30B33D]" : "bg-gray-300"
        }`}
        aria-pressed={isActive}
        >
        <span
            className={`text-[10px] font-semibold transition-colors duration-300 w-full  ${
            isActive ? "text-white text-left" : "text-gray-700 text-right"
            }`}
        >
            {isActive ? activeText : inactiveText}
        </span>

        <span
            className={`absolute top-[50%] left-1 inline-block h-[16px] w-[16px] transform translate-y-[-50%] rounded-full bg-white shadow-md transition-transform duration-300 ${
            isActive ? "translate-x-[45px]" : "translate-x-0"
            }`}
        />
        </button>
    </div>
  );
};

export default StatusButton;
