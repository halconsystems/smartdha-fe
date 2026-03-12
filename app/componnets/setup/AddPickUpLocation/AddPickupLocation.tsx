"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SvgIcon from "../../shared/SvgIcon";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchAllLocations, Location } from "../../../services/location-service";

type PickupLocationRow = Location;

// Removed dummy data and storage key

const AddPickupLocation = () => {
  const router = useRouter();
  const [pickupLocations, setPickupLocations] = useState<PickupLocationRow[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAllLocations()
      .then((locations) => setPickupLocations(locations))
      .catch(() => setPickupLocations([]));
  }, []);

  const totalPages = Math.max(1, Math.ceil(pickupLocations.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return pickupLocations.slice(start, start + rowsPerPage);
  }, [pickupLocations, currentPage, rowsPerPage]);

  const handleAddNew = () => {
    localStorage.removeItem("editPickupLocationData");
    router.push("/setup/add-pickup-location");
  };

  const handleEdit = (item: PickupLocationRow) => {
    localStorage.setItem("editPickupLocationData", JSON.stringify(item));
    router.push("/setup/edit-pickup-location");
  };

  const buildPageButtons = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, 4, totalPages];
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
  };

  const pageButtons = buildPageButtons();

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddNew}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold px-6 py-2 rounded-xl transition"
        >
          Add New Location
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-[2px_2px_20px_0px_#AAAACC80] min-h-[400px]">
       
        <div className="overflow-x-auto rounded-xl">
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                    <tr
                      key={`pickup-${currentPage}-${index}`}
                      className={`${index % 2 !== 0 ? "bg-[#F4FFF1]" : "bg-white"} hover:bg-gray-50`}
                    >
                      <td className="px-4 py-3 text-sm">{item.zone}</td>
                      <td className="px-4 py-3 text-sm">{item.address}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            (!item.status || item.status === "Active")
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status ? item.status : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="w-8 h-8 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 inline-flex items-center justify-center"
                            title="Edit"
                          >
                            <SvgIcon name="Edit-Icon" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                    No pickup locations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
        <div className="flex justify-between items-center mt-8 ">

          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="pagination disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>

            {pageButtons.map((pageNumber, index) => (
              <button
                key={`${pageNumber}-${index}`}
                onClick={() => setCurrentPage(pageNumber)}
                className={`pagination ${
                  currentPage === pageNumber
                    ? "activePage"
                    : ""
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="pagination disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>

          <div className="w-[90px]" />
        </div>
    </>
  );
};

export default AddPickupLocation;
