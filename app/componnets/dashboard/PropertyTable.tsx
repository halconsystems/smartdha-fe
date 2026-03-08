"use client";

import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type PropertyRow = {
  id: string;
  idSpot: string;
  category: string;
  type: string;
  possessionType: string;
  propertyTagDate: string;
  phase: string;
  zone: string;
  khayaban: string;
  floor: string;
};

const sampleProperties: PropertyRow[] = [
  {
    id: "1",
    idSpot: "14 R-001",
    category: "Commercial",
    type: "Shop",
    possessionType: "Tenant",
    propertyTagDate: "25-01-2026",
    phase: "Phase VIII",
    zone: "N/A",
    khayaban: "Khayaban-e-Ittehad",
    floor: "02",
  },
  {
    id: "2",
    idSpot: "14 R-002",
    category: "Commercial",
    type: "Shop",
    possessionType: "Owner",
    propertyTagDate: "25-01-2026",
    phase: "Phase VIII",
    zone: "N/A",
    khayaban: "Khayaban-e-Faisal",
    floor: "04",
  },
  {
    id: "3",
    idSpot: "21 B-007",
    category: "Residential",
    type: "Apartment",
    possessionType: "Owner",
    propertyTagDate: "18-02-2026",
    phase: "Phase VI",
    zone: "Zone B",
    khayaban: "Khayaban-e-Sehar",
    floor: "07",
  },
  {
    id: "4",
    idSpot: "09 C-112",
    category: "Residential",
    type: "House",
    possessionType: "Tenant",
    propertyTagDate: "02-03-2026",
    phase: "Phase V",
    zone: "Zone C",
    khayaban: "Khayaban-e-Muslim",
    floor: "Ground",
  },
  {
    id: "5",
    idSpot: "55 M-004",
    category: "Commercial",
    type: "Office",
    possessionType: "Owner",
    propertyTagDate: "21-01-2026",
    phase: "Phase VIII",
    zone: "N/A",
    khayaban: "Khayaban-e-Shamsheer",
    floor: "04",
  },
  {
    id: "6",
    idSpot: "17 L-021",
    category: "Residential",
    type: "Apartment",
    possessionType: "Tenant",
    propertyTagDate: "28-02-2026",
    phase: "Phase VII",
    zone: "Zone A",
    khayaban: "Khayaban-e-Itehad",
    floor: "02",
  },
];

export default function PropertyTable() {
  // Replace sampleProperties with API data later (same shape as PropertyRow).
  const [properties] = useState<PropertyRow[]>(sampleProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalPages = Math.max(1, Math.ceil(properties.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedData = useMemo(
    () => properties.slice(startIndex, endIndex),
    [properties, startIndex, endIndex]
  );

  const rowStyle = (index: number) =>
    index % 2 !== 0 ? "bg-[#F4FFF1]" : "bg-white";

  return (
    <div className="w-full mt-6">
      <div className="bg-transparent rounded-bl-xl rounded-br-xl overflow-hidden">
        <div className=" py-3 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-4">Property List</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">Rows :</span>
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

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID/Spot</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Possession Type</th>
                <th className="px-4 py-3 text-left">Property Tag Date</th>
                <th className="px-4 py-3 text-left">Phase</th>
                <th className="px-4 py-3 text-left">Zone</th>
                <th className="px-4 py-3 text-left">Khayaban</th>
                <th className="px-4 py-3 text-left">Floor</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className={`${rowStyle(index)} hover:bg-gray-50`}>
                    <td className="px-4 py-3 text-sm">{item.idSpot}</td>
                    <td className="px-4 py-3 text-sm">{item.category}</td>
                    <td className="px-4 py-3 text-sm">{item.type}</td>
                    <td className="px-4 py-3 text-sm">{item.possessionType}</td>
                    <td className="px-4 py-3 text-sm">{item.propertyTagDate}</td>
                    <td className="px-4 py-3 text-sm">{item.phase}</td>
                    <td className="px-4 py-3 text-sm">{item.zone}</td>
                    <td className="px-4 py-3 text-sm">{item.khayaban}</td>
                    <td className="px-4 py-3 text-sm">{item.floor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="py-3 border-t flex justify-between items-center">
           <p className="text-xs text-gray-500">{properties.length} total records</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className={`p-2 rounded border transition ${
                safeCurrentPage === 1
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#30B33D] text-[#30B33D] hover:bg-[#30B33D] hover:text-white"
              }`}
            >
              <FiChevronLeft />
            </button>

            <span className="px-4 py-1.5 rounded bg-[#30B33D] text-white text-sm font-semibold">
              {safeCurrentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className={`p-2 rounded border transition ${
                safeCurrentPage === totalPages
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
}
