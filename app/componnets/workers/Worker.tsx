import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import SvgIcon from "../shared/SvgIcon";
import { workerService } from "../../services/worker-service";
import { useAuth } from "../../hooks/useAuth";
import { JobType, WorkerCardDeliveryType } from "../../types/api";

/* ================= TYPES ================= */

type WorkerType = {
  id: number;
  name: string;
  jobType: string;
  phone: string;
  dob: string;
  cnic: string;
  workerCardNo: string;
  policeVerification: string;
  cardDelivery: string;
};

/* ================= COMPONENT ================= */

const Worker = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workers, setWorkers] = useState<WorkerType[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle edit
  const handleEdit = (item: any) => {
    // Use workerId from API response
    const workerId = item.workerId;
    if (typeof workerId === 'string' && workerId.length > 0) {
      localStorage.setItem('editWorkerData', JSON.stringify({ id: workerId }));
      router.push('/worker/add-worker');
    } else {
      alert('Invalid worker ID. Cannot edit this worker.');
    }
  };

  // Load workers from API
  const loadWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get logged-in user ID from useAuth hook
      const userId = user?.id;
      
      const response = await workerService.getAllWorkers({ id: userId });
      // setApiResponse(response); // Debug output removed
      if (response.success) {
        const fetched = Array.isArray(response.data?.items)
          ? response.data.items
          : Array.isArray(response.data)
          ? response.data
          : [];

        // Map API response to display format
        const mapped = fetched.map((worker: any) => ({
          workerId: worker.workerId || '', // Use workerId from API
          name: worker.name || "",
          jobType: getJobTypeLabel(worker.jobType),
          phone: worker.phoneNo || "",
          dob: formatDate(worker.dob),
          cnic: worker.cnic || "",
          workerCardNo: worker.workerCardNo || "N/A",
          policeVerification: worker.policeVerification ? "Yes" : "No",
          cardDelivery: getCardDeliveryLabel(worker.workerCardDeliveryType),
          isActive: worker.isActive,
        }));

        setWorkers(mapped);
      } else {
        setError(response.message || "Failed to load workers");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for field mapping
  const getJobTypeLabel = (jobType: number): string => {
    const jobTypeMap: { [key: number]: string } = {
      0: "Driver",        // API 0-based
      1: "Cook",          // API 0-based
      2: "Guard",         // API 0-based
      3: "Peon",          // API 0-based
      4: "Gardener",      // API 0-based
    };
    return jobTypeMap[jobType] || "Unknown";
  };

  const getCardDeliveryLabel = (deliveryType: number): string => {
    const deliveryTypeMap: { [key: number]: string } = {
      0: "OwnerOrEmployeerAddress",  // API 0-based
      1: "SelfPickUp",               // API 0-based
    };
    return deliveryTypeMap[deliveryType] || "Unknown";
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    // Keep page in range whenever result count or page size changes.
    setCurrentPage((prev) => Math.min(prev, Math.max(1, Math.ceil(workers.length / rowsPerPage))));
  }, [workers.length, rowsPerPage]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(1, Math.ceil(workers.length / rowsPerPage));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    (safeCurrentPage - 1) * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const paginatedData = workers.slice(
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

      {/* <AddWorkerForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      /> */}




      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            localStorage.removeItem('editWorkerData');
            router.push("/worker/add-worker");
          }}
          className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                     text-white text-sm font-semibold px-4 py-2 rounded-xl
                     hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                     transition w-[150px] h-[35px] text-center"
        >
          Add New
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white border border-gray-200 rounded-bl-xl rounded-br-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">
              Worker Records
            </h2>
            <p className="text-xs text-gray-500">
              {workers.length} total records
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
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '120px' }}>Name</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '140px' }}>Job Type</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '130px' }}>Phone</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '100px' }}>DOB</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '160px' }}>CNIC/nICOP No.</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '180px' }}>Worker Card No.</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '150px' }}>Police Verification</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900" style={{ width: '170px' }}>Worker's Card Delivery</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-900" style={{ width: '100px' }}>Action</th>
                </>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.workerId || index}
                    className={`${rowStyle(index)} hover:bg-gray-50`}
                  >
                    <td className="px-4 py-3 text-sm">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.jobType}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.phone}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.dob}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.cnic}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.workerCardNo}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.policeVerification}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.cardDelivery}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="w-8 h-8 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                        >
                          <SvgIcon name="Edit-Icon" size={14} />
                        </button>
                        <button className="w-8 h-8 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center">
                          <SvgIcon name="delete-icon" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-gray-500" colSpan={9}>
                    No worker records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= GREEN PAGINATION ================= */}

        <div className="px-4 py-3 border-t flex justify-between items-center">
          <div className="text-xs text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, workers.length)} of{" "}
            {workers.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={safeCurrentPage === 1}
              className={`p-2 rounded border transition ${safeCurrentPage === 1
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
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={safeCurrentPage === totalPages}
              className={`p-2 rounded border transition ${safeCurrentPage === totalPages
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

export default Worker;