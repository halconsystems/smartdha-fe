"use client";

import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import SvgIcon from "../shared/SvgIcon";
import { useRouter } from "next/navigation";

interface CommercialEmployeeType {
  id: number;
  name: string;
  email: string;
  phone: string;
  subCategory: string;
  employeerRegistrationNumber: string;
}

const CommercialEmployee: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data
  const employees: CommercialEmployeeType[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "0300-1234567",
    subCategory: "Sales",
    employeerRegistrationNumber: "EMP-1001",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@businessinc.com",
    phone: "0301-2345678",
    subCategory: "Marketing",
    employeerRegistrationNumber: "EMP-1002",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@globalltd.com",
    phone: "0302-3456789",
    subCategory: "Operations",
    employeerRegistrationNumber: "EMP-1003",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@innovateco.com",
    phone: "0303-4567890",
    subCategory: "HR",
    employeerRegistrationNumber: "EMP-1004",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.wilson@smartsolutions.com",
    phone: "0304-5678901",
    subCategory: "Finance",
    employeerRegistrationNumber: "EMP-1005",
  },
];

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = employees.slice(startIndex, endIndex);

  const rowStyle = (index: number) =>
    index % 2 !== 0 ? "bg-[#F4FFF1]" : "bg-white";

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push("/residents/add-commercial-employee")}
          className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                   text-white text-sm font-semibold px-4 py-2 rounded-xl
                   hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                   transition w-[150px] h-[35px] text-center"
        >
          Add New
        </button>
      </div>

      {/* Commercial Employee Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">Commercial Employee List</h2>
            <p className="text-xs text-gray-500">{employees.length} total records</p>
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
                <th className="px-4 py-3 text-left">Employeer Registraion No.</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`${rowStyle(index)} hover:bg-gray-50`}
                >
                  <td className="px-4 py-3 text-sm">{employee.id}</td>
                  <td className="px-4 py-3 text-sm">{employee.name}</td>
                  <td className="px-4 py-3 text-sm">{employee.email}</td>
                  <td className="px-4 py-3 text-sm">{employee.phone}</td>
                  <td className="px-4 py-3 text-sm">{employee.subCategory}</td>
                  <td className="px-4 py-3 text-sm">{employee.employeerRegistrationNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
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
            Showing {startIndex + 1} to {Math.min(endIndex, employees.length)} of {employees.length}
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

export default CommercialEmployee;
