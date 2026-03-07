"use client";

import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import SvgIcon from "../shared/SvgIcon";
import { useRouter } from "next/navigation";

interface HouseHelpWorkerType {
  id: number;
  name: string;
  email: string;
  phone: string;
  subCategory: string;
}

const HouseHelpWorker: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleEdit = (worker: HouseHelpWorkerType) => {
    localStorage.setItem("editHouseHelpWorkerData", JSON.stringify(worker));
    router.push("/residents/add-house-help-worker");
  };

  // Mock data
  const workers: HouseHelpWorkerType[] = [
    {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "0300-1234567",
    subCategory: "Vendor",
  },
  {
    id: 2,
    name: "Mariam Yousuf",
    email: "mariam.yousuf@example.com",
    phone: "0301-2345678",
    subCategory: "Service Provider",
  },
  {
    id: 3,
    name: "Zain Abbas",
    email: "zain.abbas@example.com",
    phone: "0302-3456789",
    subCategory: "Contractor",
  },
  {
    id: 4,
    name: "Sana Khan",
    email: "sana.khan@example.com",
    phone: "0303-4567890",
    subCategory: "Consultant",
  },
  {
    id: 5,
    name: "Bilal Raza",
    email: "bilal.raza@example.com",
    phone: "0304-5678901",
    subCategory: "Maintenance",
  },];

  const totalPages = Math.ceil(workers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = workers.slice(startIndex, endIndex);

  const rowStyle = (index: number) =>
    index % 2 !== 0 ? "bg-[#F4FFF1]" : "bg-white";

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            localStorage.removeItem("editHouseHelpWorkerData");
            router.push("/residents/add-house-help-worker");
          }}
          className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                   text-white text-sm font-semibold px-4 py-2 rounded-xl
                   hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                   transition w-[150px] h-[35px] text-center"
        >
          Add New
        </button>
      </div>

      {/* House Help Worker Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">House-Help Worker List</h2>
            <p className="text-xs text-gray-500">{workers.length} total records</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs">Show:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            >
              {[5, 10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Sub Category</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((worker, index) => (
                <tr
                  key={worker.id}
                  className={`${rowStyle(index)} hover:bg-gray-50`}
                >
                  <td className="px-4 py-3 text-sm">{worker.id}</td>
                  <td className="px-4 py-3 text-sm">{worker.name}</td>
                  <td className="px-4 py-3 text-sm">{worker.email}</td>
                  <td className="px-4 py-3 text-sm">{worker.phone}</td>
                  <td className="px-4 py-3 text-sm">{worker.subCategory}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(worker)}
                        className="w-8 h-8 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                      >
                        <SvgIcon name="Edit-Icon" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t flex justify-between items-center">
          <div className="text-xs text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, workers.length)} of {workers.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded border transition ${
                currentPage === 1
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#30B33D] text-[#30B33D] hover:bg-[#30B33D] hover:text-white"
              }`}
            >
              <FiChevronLeft />
            </button>

            <span className="px-4 py-1.5 rounded bg-[#30B33D] text-white text-sm font-semibold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded border transition ${
                currentPage === totalPages
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#30B33D] text-[#30B33D] hover:bg-[#30B33D] hover:text-white"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseHelpWorker;
