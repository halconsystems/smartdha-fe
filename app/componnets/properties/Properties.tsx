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

type PropertyType = {
  id: number;
  idSpot: string;
  category: string;
  type: string;
  possessionType: string;
  propertyTag: string;
  date: string;
  phase: string;
  zone: string;
  khayaban: string;
  floor: string;
};

/* ================= COMPONENT ================= */

const Properties = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "Active Properties" | "in-Active Properties"
  >("Active Properties");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ================= LARGE DUMMY DATA ================= */

  const dummyActiveProperties: PropertyType[] = Array.from(
    { length: 45 },
    (_, i) => ({
      id: i + 1,
      idSpot: `PROP-${(1000 + i).toString()}`,
      category: i % 3 === 0 ? "Residential" : i % 3 === 1 ? "Commercial" : "Mixed",
      type: i % 4 === 0 ? "House" : i % 4 === 1 ? "Apartment" : i % 4 === 2 ? "Shop" : "Office",
      possessionType: i % 2 === 0 ? "Owned" : "Rented",
      propertyTag: `TAG-${(5000 + i).toString()}`,
      date: `${(i % 28) + 1}-${(i % 12) + 1}-2024`,
      phase: i % 4 === 0 ? "Phase 1" : i % 4 === 1 ? "Phase 2" : i % 4 === 2 ? "Phase 3" : "Phase 4",
      zone: i % 3 === 0 ? "Zone A" : i % 3 === 1 ? "Zone B" : "Zone C",
      khayaban: i % 5 === 0 ? "Khayaban-e-Ittehad" : i % 5 === 1 ? "Khayaban-e-Jinnah" : i % 5 === 2 ? "Khayaban-e-Shahrah" : i % 5 === 3 ? "Khayaban-e-Iqbal" : "Khayaban-e-Rashid",
      floor: i % 10 === 0 ? "Ground Floor" : i % 10 === 1 ? "First Floor" : i % 10 === 2 ? "Second Floor" : `${(i % 8) + 3}rd Floor`,
    })
  );

  const dummyInactiveProperties: PropertyType[] = Array.from(
    { length: 32 },
    (_, i) => ({
      id: i + 1,
      idSpot: `PROP-${(2000 + i).toString()}`,
      category: i % 3 === 0 ? "Residential" : i % 3 === 1 ? "Commercial" : "Mixed",
      type: i % 4 === 0 ? "House" : i % 4 === 1 ? "Apartment" : i % 4 === 2 ? "Shop" : "Office",
      possessionType: i % 2 === 0 ? "Owned" : "Rented",
      propertyTag: `TAG-${(6000 + i).toString()}`,
      date: `${(i % 28) + 1}-${(i % 12) + 1}-2024`,
      phase: i % 4 === 0 ? "Phase 1" : i % 4 === 1 ? "Phase 2" : i % 4 === 2 ? "Phase 3" : "Phase 4",
      zone: i % 3 === 0 ? "Zone A" : i % 3 === 1 ? "Zone B" : "Zone C",
      khayaban: i % 5 === 0 ? "Khayaban-e-Ittehad" : i % 5 === 1 ? "Khayaban-e-Jinnah" : i % 5 === 2 ? "Khayaban-e-Shahrah" : i % 5 === 3 ? "Khayaban-e-Iqbal" : "Khayaban-e-Rashid",
      floor: i % 10 === 0 ? "Ground Floor" : i % 10 === 1 ? "First Floor" : i % 10 === 2 ? "Second Floor" : `${(i % 8) + 3}rd Floor`,
    })
  );

  /* ================= PAGINATION ================= */

  const activeData =
    activeTab === "Active Properties"
      ? dummyActiveProperties
      : dummyInactiveProperties;

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
          onClick={() => router.push("/properties/add-property")}
          className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                     text-white text-sm font-semibold px-4 py-2 rounded-xl
                     hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                     transition w-[150px] h-[35px] text-center"
        >
          Tag New Property
        </button>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex w-full border-b-2 border-gray-200">
        <button
          onClick={() => {
            setActiveTab("Active Properties");
            setCurrentPage(1);
          }}
          className={`flex-1 py-2.5 font-semibold rounded-tr-none rounded-tl-xl ${
            activeTab === "Active Properties"
              ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
              : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
          }`}
        >
          Active Properties
        </button>

        <button
          onClick={() => {
            setActiveTab("in-Active Properties");
            setCurrentPage(1);
          }}
          className={`flex-1 py-2.5 font-semibold rounded-tr-xl rounded-tl-none ${
            activeTab === "in-Active Properties"
              ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
              : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
          }`}
        >
          In-Active Properties
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-bl-xl rounded-br-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">
              {activeTab === "Active Properties"
                ? "Active Properties"
                : "In-Active Properties"}
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
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-full" style={{ minWidth: '1200px' }}>
            <thead className="bg-gray-50 text-xs">
              <tr>
                <>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>ID/Spot</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '140px' }}>Category</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>Type</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '150px' }}>Possession Type</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '140px' }}>Property Tag</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>Date</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>Phase</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>Zone</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '160px' }}>Khayaban</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>Floor</th>
                  {/* <th className="px-4 py-3 text-center font-bold text-gray-900" style={{ width: '100px' }}>Action</th> */}
                </>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${rowStyle(index)} hover:bg-gray-50`}
                >
                  <td className="px-4 py-3 text-sm">
                    {item.idSpot}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.type}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.possessionType}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.propertyTag}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.phase}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.zone}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.khayaban}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.floor}
                  </td>

                  {/* <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="w-8 h-8 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center">
                        <SvgIcon name="Edit-Icon" size={14} />
                      </button>
                      <button className="w-8 h-8 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center">
                       <SvgIcon name="delete-icon" size={14} />
                      </button>
                    </div>
                  </td> */}
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

export default Properties;
