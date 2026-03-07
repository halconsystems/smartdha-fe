"use client";
import LeftSidebar from "../componnets/shared/LeftSidebar";
import Navbar from "../componnets/shared/Navbar";
import RightSidebar from "../componnets/shared/RightSidebar";
import React, { useState } from "react";
import SvgIcon from "../componnets/shared/SvgIcon";

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState("general");
  // Dummy data for pickup locations
  const pickupLocations = [
    { zone: "Zone 01", address: "Khayaban-e-Itehad Phase VIII", status: "Active" },
    { zone: "Zone 02", address: "Khayaban-e-Itehad Phase VIII", status: "Inactive" },
    { zone: "Zone 03", address: "Khayaban-e-Itehad Phase VIII", status: "Active" },
    { zone: "Zone 04", address: "Khayaban-e-Itehad Phase VIII", status: "Inactive" },
    { zone: "Zone 01", address: "Khayaban-e-Itehad Phase VIII", status: "Active" },
    { zone: "Zone 02", address: "Khayaban-e-Itehad Phase VIII", status: "Inactive" },
    { zone: "Zone 03", address: "Khayaban-e-Itehad Phase VIII", status: "Active" },
    { zone: "Zone 04", address: "Khayaban-e-Itehad Phase VIII", status: "Inactive" },
    { zone: "Zone 01", address: "Khayaban-e-Itehad Phase VIII", status: "Active" },
    { zone: "Zone 02", address: "Khayaban-e-Itehad Phase VIII", status: "Inactive" },
    { zone: "Zone 03", address: "Khayaban-e-Itehad Phase VIII", status: "Active" },
    { zone: "Zone 04", address: "Khayaban-e-Itehad Phase VIII", status: "Inactive" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F3F6F9]">
      {/* Sidebar */}
      <div className="w-[270px] min-h-screen border-r border-[#E5E5E5] bg-white">
        <LeftSidebar />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-8">
          {/* Main Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === "general"
                    ? "text-[#30B33D] border-[#30B33D]"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pickup Location
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === "security"
                    ? "text-[#30B33D] border-[#30B33D]"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === "notifications"
                    ? "text-[#30B33D] border-[#30B33D]"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Notifications
              </button>
            </div>
          </div>
          {/* Tab Content */}
          {/* Tab Content */}
          {activeTab === "general" && (
            <div className="bg-white rounded-xl shadow p-8 min-h-[400px]">
              {/* Add New Location Button */}
              <div className="flex justify-end mb-6">
                <button
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold px-6 py-2 rounded-xl transition"
                >
                  Add New Location
                </button>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Zone</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Address</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickupLocations.map((item, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 !== 0 ? "bg-[#F4FFF1]" : "bg-white"} hover:bg-gray-50`}
                      >
                        <td className="px-4 py-3 text-sm">{item.zone}</td>
                        <td className="px-4 py-3 text-sm">{item.address}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            className="w-8 h-8 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                            title="Edit"
                          >
                            <SvgIcon name="Edit-Icon" size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination (static for now) */}
              <div className="flex justify-between items-center mt-4">
                <div></div>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-green-100 text-green-600">{'<'}</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-green-100 text-green-600 font-bold">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-green-100 text-green-600">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-green-100 text-green-600">3</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-green-100 text-green-600">{'>'}</button>
                </div>
                <div></div>
              </div>
            </div>
          )}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl shadow p-8 min-h-[400px] flex items-center justify-center text-gray-400 text-xl">
              Security setup content coming soon.
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl shadow p-8 min-h-[400px] flex items-center justify-center text-gray-400 text-xl">
              Notifications setup content coming soon.
            </div>
          )}
        </div>
      </div>
      {/* Right sidebar */}
      <div className="w-[340px] min-h-screen border-l border-[#E5E5E5] bg-white hidden xl:block">
        <RightSidebar />
      </div>
    </div>
  );
}