import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import SvgIcon from "../shared/SvgIcon";

/* ================= TYPES ================= */

type PreviousVisitorsType = {
  id: number;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnic: string;
};

type UpcomingVisitorsType = {
  id: number;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnic: string;
};

/* ================= COMPONENT ================= */

const Visitor = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "Upcoming Visitors" | "Previous Visitors"
  >("Upcoming Visitors");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ================= LARGE DUMMY DATA ================= */

  const dummyPreviousVisitors: PreviousVisitorsType[] = Array.from(
    { length: 45 },
    (_, i) => ({
      id: i + 1,
      name: `Previous Visitor ${i + 1}`,
      vehicleInfo: i % 2 === 0 ? "Honda Civic ABC-123" : "Toyota Corolla XYZ-789",
      visitDetail: i % 3 === 0 ? "Meeting with CEO" : i % 3 === 1 ? "Delivery" : "Maintenance",
      validity: `${(i % 28) + 1}-${(i % 12) + 1}-2024`,
      cnic: `35201-12345${i.toString().padStart(2, "0")}-1`,
    })
  );

  const dummyUpcomingVisitors: UpcomingVisitorsType[] = Array.from(
    { length: 32 },
    (_, i) => ({
      id: i + 1,
      name: `Upcoming Visitor ${i + 1}`,
      vehicleInfo: i % 2 === 0 ? "Suzuki Mehran DEF-456" : "Honda CD70 GHI-012",
      visitDetail: i % 3 === 0 ? "Interview" : i % 3 === 1 ? "Site Visit" : "Contract Signing",
      validity: `${(i % 28) + 1}-${(i % 12) + 1}-2024`,
      cnic: `42101-76543${i.toString().padStart(2, "0")}-1`,
    })
  );

  /* ================= PAGINATION ================= */

  const activeData =
    activeTab === "Previous Visitors"
      ? dummyPreviousVisitors
      : dummyUpcomingVisitors;

  const totalPages = Math.ceil(
    activeData.length / rowsPerPage
  );

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const paginatedData = activeData.slice(
    startIndex,
    endIndex
  );

  /* ================= ROW COLOR ================= */

  const rowStyle = (index: number) =>
    index % 2 !== 0
      ? "bg-[#F4FFF1]"
      : "bg-white";

  /* ================= RENDER ================= */

  return (
    <div className="w-full">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push("/visitor/add-visitor-quick")}
          className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                     text-white text-sm font-semibold px-4 py-2 rounded-xl
                     hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                     transition w-[150px] h-[35px] text-center"
        >
          Add New
        </button>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex w-full border-b-2 border-gray-200">
        <button
          onClick={() => {
            setActiveTab("Upcoming Visitors");
            setCurrentPage(1);
          }}
          className={`flex-1 py-2.5 font-semibold rounded-tr-none rounded-tl-xl ${
            activeTab === "Upcoming Visitors"
              ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
              : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
          }`}
        >
          Upcoming Visitors
        </button>

        <button
          onClick={() => {
            setActiveTab("Previous Visitors");
            setCurrentPage(1);
          }}
          className={`flex-1 py-2.5 font-semibold rounded-tr-xl rounded-tl-none ${
            activeTab === "Previous Visitors"
              ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
              : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
          }`}
        >
          Previous Visitors
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-bl-xl rounded-br-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">
              {activeTab === "Previous Visitors"
                ? "Previous Visitors List"
                : "Upcoming Visitors List"}
            </h2>
            <p className="text-xs text-gray-500">
              {activeData.length} total records
            </p>
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
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Vehicle Info</th>
                <th className="px-4 py-3 text-left">Visit Detail</th>
                <th className="px-4 py-3 text-left">Validity</th>
                <th className="px-4 py-3 text-left">CNIC No.</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${rowStyle(index)} hover:bg-gray-50`}
                >
                  <td className="px-4 py-3 text-sm">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.vehicleInfo}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.visitDetail}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.validity}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.cnic}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                        <SvgIcon name="Edit-Icon" size={14} />
                      </button>
                      <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                       <SvgIcon name="delete-icon" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= GREEN PAGINATION ================= */}
        <div className="px-4 py-3 border-t flex justify-between items-center">
          <div className="text-xs text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, activeData.length)} of{" "}
            {activeData.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
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
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
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

export default Visitor;