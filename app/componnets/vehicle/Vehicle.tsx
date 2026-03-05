import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import SvgIcon from "../shared/SvgIcon";
import WarningModal from "../shared/WarningModal";
import SuccessModal from "../shared/SuccessModal";
import { vehicleService } from "../../services/vehicle-service";
import type { Vehicle } from "../../types/api";
import { useAuth } from "../../hooks/useAuth";

/* ================= TYPES ================= */

type ResidentType = {
  id: number;
  licensePlate: string;
  eTagId: string;
  ownership: string;
  make: string;
  model: string;
  year: string;
  color: string;
  status: string;
};

/* ================= COMPONENT ================= */

const Vehicle = () => {
    const [apiResponse, setApiResponse] = useState<any>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Vehicle | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load vehicles from API
  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all vehicles without filtering by userId for debugging
      const response = await vehicleService.getAllVehicles({});
      // setApiResponse(response); // Remove API response debug output
      if (response.success) {
        // Ensure fetched is always an array (fix for paged API response)
        const fetched = Array.isArray(response.data?.items) ? response.data.items : [];
        const mapped: Vehicle[] = fetched.map((d: any) => ({
          id: d.id ?? d.vehicleId ?? "",
          licenseNo: Number(d.licenseNo ?? d.license_no ?? 0),
          license: d.license ?? "",
          eTagId: d.eTagId ?? d.eTag ?? d.etagId ?? null,
          ownership: d.owner ?? "Unknown",
          make: d.make ?? "",
          model: d.model ?? "",
          year: d.year ?? "",
          color: d.color ?? "",
          validFrom: d.validFrom ?? null,
          validTo: d.validTo ?? null,
          modifiedDate: d.modifiedDate ?? "",
          isActive:
            typeof d.status === "boolean"
              ? d.status
              : typeof d.status === "string"
              ? d.status.toLowerCase() === "true"
              : false,
        }));
        setVehicles(mapped);
      } else {
        setError(response.message || "Failed to load vehicles");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Pagination
  const totalPages = Math.ceil(vehicles.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = vehicles.slice(startIndex, endIndex);

  // Handle edit
  const handleEdit = (item: Vehicle) => {
    localStorage.setItem('editVehicleData', JSON.stringify({ id: item.id }));
    router.push('/vehicle/add-vehicle');
  };

  // Handle delete
  const handleDelete = (item: Vehicle) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await vehicleService.deleteVehicle({ id: itemToDelete.id });
        if ((response as any).success) {
          setSuccessMessage((response as any).data?.message || "Vehicle deleted successfully!");
          setShowSuccessModal(true);
          loadVehicles();
        } else {
          setError("Failed to delete vehicle");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete vehicle");
      } finally {
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  /* ================= ROW COLOR ================= */

  const rowStyle = (index: number) =>
    index % 2 !== 0
      ? "bg-[#F4FFF1]"
      : "bg-white";

  /* ================= RENDER ================= */

  return (
    <div className="w-full">
      {/* <AddResidentForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialTab={activeTab}
      /> */}

      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push("/vehicle/add-vehicle")}
          className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                     text-white text-sm font-semibold px-4 py-2 rounded-xl
                     hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                     transition w-[150px] h-[35px] text-center"
        >
          Add New
        </button>
      </div>


      {/* ================= API RESPONSE DEBUG ================= */}
      {/* API Response debug output removed */}

      {/* ================= TABLE ================= */}

      <div className="bg-white border border-gray-200 rounded-bl-xl rounded-br-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">Vehicle Records</h2>
            <p className="text-xs text-gray-500">
              {vehicles.length} total records
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
            <thead className="bg-gray-50 text-xs">
              <tr>
                <>
                  <th className="px-4 py-3 text-left">
                    State/Provided License Plate
                  </th>
                  <th className="px-4 py-3 text-left">Vehicle E-Tag ID</th>
                  <th className="px-4 py-3 text-left">Ownership</th>
                  <th className="px-4 py-3 text-left">Make</th>
                  <th className="px-4 py-3 text-left">Model</th>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-center">Color</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={`${item.licenseNo}-${item.license || 'no-license'}-${index}`}
                  className={`${rowStyle(index)} hover:bg-gray-50`}
                >
                  <td className="px-4 py-3 text-sm">
                    {item.license ? item.license + " " + item.licenseNo : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.eTagId ? item.eTagId : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.ownership ? item.ownership : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.make}</td>
                  <td className="px-4 py-3 text-sm">{item.model}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.year ? item.year : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.color ? item.color : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <SvgIcon name="Edit-Icon" size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
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
            Showing {startIndex + 1} to {Math.min(endIndex, vehicles.length)} of{" "}
            {vehicles.length}
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

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <WarningModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete this vehicle? This action cannot be undone.`}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Vehicle Deleted Successfully"
        message={successMessage}
      />
    </div>
  );
};

export default Vehicle;