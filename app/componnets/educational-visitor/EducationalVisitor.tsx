"use client";

import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import SvgIcon from "../shared/SvgIcon";
import { useRouter } from "next/navigation";

interface EducationalVisitorType {
  id: number;
  name: string;
  email: string;
  phone: string;
  subCategory: string;
  institute: string;
  vehicleInfo: string;
}

const EducationalVisitor: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleEdit = (visitor: EducationalVisitorType) => {
    localStorage.setItem("editEducationalVisitorData", JSON.stringify(visitor));
    router.push("/residents/add-educational-visitor");
  };

  // Mock data
  const visitors: EducationalVisitorType[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@harvard.edu",
    phone: "0300-1234567",
    subCategory: "Research Visitor",
    institute: "Harvard University",
    vehicleInfo: "Toyota Corolla - LEA 1234",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    email: "michael.chen@mit.edu",
    phone: "0301-2345678",
    subCategory: "Guest Lecturer",
    institute: "MIT",
    vehicleInfo: "Honda Civic - LEB 5678",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    email: "emily.davis@stanford.edu",
    phone: "0302-3456789",
    subCategory: "Academic Visitor",
    institute: "Stanford University",
    vehicleInfo: "Suzuki Cultus - LEC 9012",
  },
  {
    id: 4,
    name: "Prof. James Wilson",
    email: "james.wilson@oxford.ac.uk",
    phone: "0303-4567890",
    subCategory: "Conference Speaker",
    institute: "Oxford University",
    vehicleInfo: "Kia Sportage - LED 3456",
  },
  {
    id: 5,
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@yale.edu",
    phone: "0304-5678901",
    subCategory: "Research Collaboration",
    institute: "Yale University",
    vehicleInfo: "Toyota Hilux - LEE 7890",
  },
];

  const totalPages = Math.ceil(visitors.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = visitors.slice(startIndex, endIndex);

  const rowStyle = (index: number) =>
    index % 2 !== 0 ? "bg-[#F4FFF1]" : "bg-white";

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            localStorage.removeItem("editEducationalVisitorData");
            router.push("/residents/add-educational-visitor");
          }}
          className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                   text-white text-sm font-semibold px-4 py-2 rounded-xl
                   hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                   transition w-[150px] h-[35px] text-center"
        >
          Add New
        </button>
      </div>

      {/* Educational Visitor Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">Educational Visitor List</h2>
            <p className="text-xs text-gray-500">{visitors.length} total records</p>
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
                <th className="px-4 py-3 text-left">Institute</th>
                <th className="px-4 py-3 text-left">Vehicle Info</th>
                <th className="px-4 py-3 text-center">Action</th>
              
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((visitor, index) => (
                <tr
                  key={visitor.id}
                  className={`${rowStyle(index)} hover:bg-gray-50`}
                >
                  <td className="px-4 py-3 text-sm">{visitor.id}</td>
                  <td className="px-4 py-3 text-sm">{visitor.name}</td>
                  <td className="px-4 py-3 text-sm">{visitor.email}</td>
                  <td className="px-4 py-3 text-sm">{visitor.phone}</td>
                  <td className="px-4 py-3 text-sm">{visitor.subCategory}</td>
                  <td className="px-4 py-3 text-sm">{visitor.institute}</td>
                  <td className="px-4 py-3 text-sm">{visitor.vehicleInfo}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(visitor)}
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
            Showing {startIndex + 1} to {Math.min(endIndex, visitors.length)} of {visitors.length}
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

export default EducationalVisitor;
