import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import AddResidentForm from "./AddResidentForm";
import SvgIcon from "../shared/SvgIcon";
import { useRouter } from "next/navigation";
import EducationalVisitor from "../educational-visitor/EducationalVisitor";
import CommercialEmployee from "../commercial-employee/CommercialEmployee";
import HouseHelpWorker from "../house-help-worker/HouseHelpWorker";
import VisitorComponent from "../visitor/VisitorComponent";
import Others from "../others/Others";

/* ================= TYPES ================= */

type ResidentType = {
  id: number;
  name: string;
  relation: string;
  phone: string;
  dob: string;
  cnic: string;
  residentCard: string;
};

type CommercialType = {
  id: number;
  companyName: string;
  ownerName: string;
  phone: string;
  cnic: string;
  officeNo: string;
};

type MainTabType = "residential-commercial" | "educational-visitor" | "commercial-employee" | "house-help-worker" | "visitor" | "others";
type Tab = "commercial" | "resident";

/* ================= COMPONENT ================= */

const Resident = () => {

  const router = useRouter();

  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("residential-commercial");
  const [activeTab, setActiveTab] = useState<Tab>("commercial");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  /* ================= LARGE DUMMY DATA ================= */

  const dummyResidents: ResidentType[] = Array.from(
    { length: 45 },
    (_, i) => ({
      id: i + 1,
      name: `Resident ${i + 1}`,
      relation:
        i % 3 === 0 ? "Son" : i % 3 === 1 ? "Daughter" : "Spouse",
      phone: `0301-2346${(10 + i)
        .toString()
        .padStart(2, "0")}`,
      dob: `0${(i % 9) + 1}-0${(i % 11) + 1}-199${i % 10}`,
      cnic: `35201-12345${i
        .toString()
        .padStart(2, "0")}-1`,
      residentCard: `UID-92786453${1000 + i}`,
    })
  );

  const dummyCommercial: CommercialType[] = Array.from(
    { length: 32 },
    (_, i) => ({
      id: i + 1,
      companyName: `Company ${i + 1}`,
      ownerName: `Owner ${i + 1}`,
      phone: `0300-5678${(10 + i)
        .toString()
        .padStart(2, "0")}`,
      cnic: `42101-76543${i
        .toString()
        .padStart(2, "0")}-1`,
      officeNo: `Office ${100 + i}`,
    })
  );

  /* ================= PAGINATION ================= */

  const activeData =
    activeTab === "resident"
      ? dummyResidents
      : dummyCommercial;

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
      {/* ================= MAIN LEVEL 1 TABS ================= */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveMainTab("residential-commercial")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === "residential-commercial"
                ? "text-[#30B33D] border-[#30B33D]"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Residential/Commercial
          </button>
          
          <button
            onClick={() => setActiveMainTab("educational-visitor")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === "educational-visitor"
                ? "text-[#30B33D] border-[#30B33D]"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Educational Visitor
          </button>
          
          <button
            onClick={() => setActiveMainTab("commercial-employee")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === "commercial-employee"
                ? "text-[#30B33D] border-[#30B33D]"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Commercial Employee
          </button>
          
          <button
            onClick={() => setActiveMainTab("house-help-worker")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === "house-help-worker"
                ? "text-[#30B33D] border-[#30B33D]"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            House-Help Worker
          </button>
          
          <button
            onClick={() => setActiveMainTab("visitor")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === "visitor"
                ? "text-[#30B33D] border-[#30B33D]"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Visitor
          </button>
          
          <button
            onClick={() => setActiveMainTab("others")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === "others"
                ? "text-[#30B33D] border-[#30B33D]"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Others
          </button>
        </div>
      </div>

      {/* ================= CONTENT BASED ON MAIN TAB ================= */}
      {activeMainTab === "residential-commercial" ? (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => router.push("/residents/add-residents")}
              className="bg-gradient-to-t from-[rgba(48,179,61,0.7)] to-[rgba(48,179,61,1)] 
                       text-white text-sm font-semibold px-4 py-2 rounded-xl
                       hover:from-[rgba(48,179,61,0.7)] hover:to-[rgba(48,179,61,1)] 
                       transition w-[150px] h-[35px] text-center"
            >
              Add New
            </button>
          </div>

          {/* ================= SUB-TABS (Commercial/Residents) ================= */}
          <div className="flex w-full border-b-2 border-gray-200">
            <button
              onClick={() => {
                setActiveTab("commercial");
                setCurrentPage(1);
              }}
              className={`flex-1 py-2.5 font-semibold rounded-tr-none rounded-tl-xl ${
                activeTab === "commercial"
                  ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
                  : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
              }`}
            >
              Commercial
            </button>

            <button
              onClick={() => {
                setActiveTab("resident");
                setCurrentPage(1);
              }}
              className={`flex-1 py-2.5 font-semibold rounded-tr-xl rounded-tl-none ${
                activeTab === "resident"
                  ? "bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
                  : "bg-gray-100 text-gray-500 shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20"
              }`}
            >
              Residents
            </button>
          </div>

          {/* ================= TABLE ================= */}
          <div className="bg-white border border-gray-200 rounded-bl-xl rounded-br-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-semibold">
                  {activeTab === "resident"
                    ? "Resident List"
                    : "Commercial List"}
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
                    {activeTab === "resident" ? (
                      <>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Relation</th>
                        <th className="px-4 py-3 text-left">Phone</th>
                        <th className="px-4 py-3 text-left">DOB</th>
                        <th className="px-4 py-3 text-left">CNIC</th>
                        <th className="px-4 py-3 text-left">Resident Card</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left">Company Name</th>
                        <th className="px-4 py-3 text-left">Owner Name</th>
                        <th className="px-4 py-3 text-left">Phone</th>
                        <th className="px-4 py-3 text-left">CNIC</th>
                        <th className="px-4 py-3 text-left">Office No.</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${rowStyle(index)} hover:bg-gray-50`}
                    >
                      {activeTab === "resident" ? (
                        <>
                          <td className="px-4 py-3 text-sm">
                            {(item as ResidentType).name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {(item as ResidentType).relation}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.phone}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {(item as ResidentType).dob}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.cnic}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {(item as ResidentType).residentCard}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm">
                            {(item as CommercialType).companyName}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {(item as CommercialType).ownerName}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.phone}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.cnic}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {(item as CommercialType).officeNo}
                          </td>
                        </>
                      )}

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
      ) : activeMainTab === "educational-visitor" ? (
        <EducationalVisitor />
      ) : activeMainTab === "commercial-employee" ? (
        <CommercialEmployee />
      ) : activeMainTab === "house-help-worker" ? (
        <HouseHelpWorker />
      ) : activeMainTab === "visitor" ? (
        <VisitorComponent />
      ) : (
        <Others />
      )}
    </div>
  );
};

export default Resident;
