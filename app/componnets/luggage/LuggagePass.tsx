import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import SvgIcon from "../shared/SvgIcon";
import WarningModal from "../shared/WarningModal";
import SuccessModal from "../shared/SuccessModal";
import { luggageService } from "../../services/luggage-service";
import type { LuggagePass } from "../../types/api";
import { useAuth } from "../../hooks/useAuth";
/* ================= TYPES ================= */

type PreviousLuggageType = {
  id: number;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnic: string;
};

type UpcomingLuggageType = {
  id: number;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnic: string;
};

/* ================= COMPONENT ================= */

const LuggagePass = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Upcoming Luggage" | "Previous Luggage">("Upcoming Luggage");
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upcomingLuggage, setUpcomingLuggage] = useState<LuggagePass[]>([]);
  const [previousLuggage, setPreviousLuggage] = useState<LuggagePass[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // Load data from API
  const loadLuggagePasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: any = await luggageService.getAllLuggagePasses();
      const succeeded = response?.succeeded ?? response?.success ?? true;
      const payload = response?.data ?? response;

      const upcoming =
        payload?.upcomingLuggage ??
        payload?.upcoming ??
        response?.upcomingLuggage ??
        [];

      const previous =
        payload?.previousLuggage ??
        payload?.previous ??
        response?.previousLuggage ??
        [];

      if (succeeded) {
        setUpcomingLuggage(upcoming || []);
        setPreviousLuggage(previous || []);
      } else {
        setError(response?.message || "Failed to load luggage passes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLuggagePasses();
  }, []);

  // Reload data when tab changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page
    loadLuggagePasses();
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  const handleEdit = (item: any) => {
    // Store the luggage pass ID in localStorage for the add form to pick up
    localStorage.setItem('editLuggageData', JSON.stringify({ id: item.id }));
    router.push('/luggage/add-luggage-pass');
  };

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await luggageService.deleteLuggagePass(itemToDelete.id);
        if ((response as any).succeeded) {
          // Show success modal with message from API
          setSuccessMessage((response as any).data?.message || "Luggage pass deleted successfully!");
          setShowSuccessModal(true);
          // Reload data to refresh the list
          loadLuggagePasses();
        } else {
          setError("Failed to delete luggage pass");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete luggage pass");
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

  /* ================= PAGINATION ================= */

  const handleTabChange = (tab: "Upcoming Luggage" | "Previous Luggage") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const activeData =
    activeTab === "Previous Luggage"
      ? previousLuggage
      : upcomingLuggage;

  const totalPages = Math.max(
    1,
    Math.ceil(activeData.length / rowsPerPage)
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
          onClick={() => {
            localStorage.removeItem('editLuggageData');
            router.push("/luggage/add-luggage-pass");
          }}
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
            setActiveTab("Upcoming Luggage");
            setCurrentPage(1);
          }}
          className={`flex-1 py-2.5 font-semibold rounded-tr-none rounded-tl-xl ${
            activeTab === "Upcoming Luggage"
              ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
              : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
          }`}
        >
          Upcoming Luggage
        </button>

        <button
          onClick={() => {
            setActiveTab("Previous Luggage");
            setCurrentPage(1);
          }}
          className={`flex-1 py-2.5 font-semibold rounded-tr-xl rounded-tl-none ${
            activeTab === "Previous Luggage"
              ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
              : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
          }`}
        >
          Previous Luggage
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-bl-xl rounded-br-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">
              {activeTab === "Previous Luggage"
                ? "Previous Luggage Pass"
                : "Upcoming Luggage Pass"}
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

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        )}

        {/* Table Body */}
        {!loading && (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-full" style={{ minWidth: '900px', width: '100%'}}>
            <thead className="bg-gray-50 text-xs">
              <tr>
                <>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '150px' }}>Name</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '180px' }}>Vehicle Info</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '160px' }}>Visit Detail</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>Validity</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '160px' }}>CNIC No.</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-900" style={{ width: '100px' }}>Action</th>
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
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.vehicleLicensePlate || item.vehicleLicenseNo
                      ? `${item.vehicleLicensePlate || ""} ${item.vehicleLicenseNo || ""}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.validFrom && item.validTo
                      ? `${formatDate(item.validFrom)} to ${formatDate(item.validTo)}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.cnic}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="w-8 h-8 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                      >
                        <SvgIcon name="Edit-Icon" size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item)}
                        className="w-8 h-8 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
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
        )}

        {/* ================= GREEN PAGINATION ================= */}
        {!loading && (
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <WarningModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Luggage Pass"
        message={`Are you sure you want to delete the luggage pass for ${itemToDelete?.name || 'this item'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Delete Successful"
        message={successMessage}
      />
    </div>
  );
};

export default LuggagePass;
