"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { visitorService } from "../../services/visitor-service";
import { VisitorPassType } from "../../types/api";

type FormData = {
  fullName: string;
  cnicNo: string;
  vehicleNoAlpha: string;
  vehicleNoNumeric: string;
  licensePlate: string;
  quickPick: "dayPass" | "longStay";
  fromDate: string;
  toDate: string;
};

// Reusable field box
const FieldBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 relative">
    {children}
  </div>
);

// Reusable label
const FieldLabel = ({
  text,
  required = false,
  green = true,
}: {
  text: string;
  required?: boolean;
  green?: boolean;
}) => (
  <label className={`block text-xs font-semibold mb-1.5 ${green ? "text-[#30B33D]" : "text-gray-700"}`}>
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

// Reusable input - moved outside component to prevent re-rendering
const TextInput = ({
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  pattern,
  readOnly = false,
  onChange,
}: {
  name: keyof FormData;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    maxLength={maxLength}
    pattern={pattern}
    readOnly={readOnly}
    className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
    style={readOnly ? { backgroundColor: '#f9fafb', cursor: 'not-allowed' } : {}}
  />
);

type AddVisitorQuickFormProps = {
  mode?: "add" | "edit";
};

const AddVisitorQuickForm: React.FC<AddVisitorQuickFormProps> = ({ mode = "add" }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cnicNo: "",
    vehicleNoAlpha: "",
    vehicleNoNumeric: "",
    licensePlate: "",
    quickPick: "dayPass",
    fromDate: "",
    toDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (mode !== "edit") return;

    const editData = localStorage.getItem("editVisitorData");
    if (!editData) {
      setError("No visitor selected for editing.");
      return;
    }

    const loadVisitor = async () => {
      try {
        setLoading(true);
        const parsed = JSON.parse(editData);
        if (!parsed?.id) {
          setError("Invalid visitor selection.");
          return;
        }

        setEditingId(parsed.id);
        const response = await visitorService.getVisitorById(parsed.id);
        // Support both wrapped and direct visitor object
        let visitor = response?.data;
        if (!visitor && response && typeof response === 'object' && response.id && response.name) {
          visitor = response;
        }

        if (!visitor) {
          setError(
            `Failed to load visitor data.\nAPI response: ${JSON.stringify(response, null, 2)}`
          );
          return;
        }

        const plate = visitor.vehicleLicensePlate || "";
        const [alphaPart = "", numericPart = ""] = plate.includes("-")
          ? plate.split("-")
          : [plate, String(visitor.vehicleLicenseNo || "")];

        const normalizedType = Number(visitor.visitorPassType) === VisitorPassType.LONG_STAY
          ? "longStay"
          : "dayPass";

        setFormData({
          fullName: visitor.name || "",
          cnicNo: visitor.cnic || "",
          vehicleNoAlpha: alphaPart,
          vehicleNoNumeric: numericPart || String(visitor.vehicleLicenseNo || ""),
          licensePlate: plate,
          quickPick: normalizedType,
          fromDate: visitor.validFrom ? String(visitor.validFrom).slice(0, 10) : "",
          toDate: visitor.validTo ? String(visitor.validTo).slice(0, 10) : "",
        });
      } catch (err) {
        let errorMsg = "Failed to load visitor data.";
        if (err instanceof Error) {
          errorMsg += `\nError: ${err.message}`;
        } else if (typeof err === "object") {
          errorMsg += `\nError: ${JSON.stringify(err, null, 2)}`;
        }
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadVisitor();
  }, [mode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-update license plate when vehicle number fields change
      if (name === 'vehicleNoAlpha' || name === 'vehicleNoNumeric') {
        const alpha = updated.vehicleNoAlpha.trim();
        const numeric = updated.vehicleNoNumeric.trim();
        updated.licensePlate = alpha || numeric
          ? `${alpha}${alpha && numeric ? "-" : ""}${numeric}`
          : "";
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for API matching curl example format
      const visitorData = {
        name: formData.fullName,
        cnic: formData.cnicNo,
        vehicleLicensePlate: formData.licensePlate,
        vehicleLicenseNo: formData.vehicleNoNumeric,
        visitorPassType: formData.quickPick === "dayPass" ? VisitorPassType.DAY_PASS : VisitorPassType.LONG_STAY,
        validFrom: formData.quickPick === "longStay" ? formData.fromDate : new Date().toISOString(),
        validTo: formData.toDate,
      };

      let response;

      if (isEditing && editingId) {
        const updatePayload = {
          id: editingId,
          name: visitorData.name || "",
          cnic: visitorData.cnic || "",
          vehicleLicensePlate: visitorData.vehicleLicensePlate || "",
          vehicleLicenseNo: visitorData.vehicleLicenseNo || "",
          visitorPassType: visitorData.visitorPassType,
          validFrom: visitorData.validFrom || "",
          validTo: visitorData.validTo || ""
        };
        response = await visitorService.updateVisitor(updatePayload);
      } else {
        response = await visitorService.quickAddVisitor(visitorData);
      }

      if (response.succeeded || response.success) {
        setSuccess(isEditing ? "Visitor Pass Updated Successfully" : "Visitor Pass Created Successfully");
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          fullName: "",
          cnicNo: "",
          vehicleNoAlpha: "",
          vehicleNoNumeric: "",
          licensePlate: "",
          quickPick: "dayPass",
          fromDate: "",
          toDate: "",
        });
        localStorage.removeItem("editVisitorData");
      } else {
        setError(
          (response.message || (isEditing ? "Failed to update visitor pass" : "Failed to add visitor pass")) +
          `\nAPI response: ${JSON.stringify(response, null, 2)}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/visitor');
  };

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-black">
            Please provide visitor details below!
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Full Name + CNIC No. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Full Name" required />
              <TextInput
                name="fullName"
                value={formData.fullName}
                placeholder="Enter full name"
                required
                onChange={handleInputChange}
              />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="CNIC No." />
              <TextInput
                name="cnicNo"
                value={formData.cnicNo}
                placeholder="12345-1234567-1"
                onChange={handleInputChange}
              />
            </FieldBox>
          </div>

          {/* Row 2: Vehicle No (ABC only) + Vehicle No (Number only) +  License Plate*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldBox>
              <FieldLabel text="Vehicle No." required />
              <TextInput name="vehicleNoAlpha" value={formData.vehicleNoAlpha} placeholder="ABC Only" required onChange={handleInputChange} />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Vehicle No." required />
              <TextInput name="vehicleNoNumeric" value={formData.vehicleNoNumeric} placeholder="123 Only" required onChange={handleInputChange} />
            </FieldBox>

            </div>
            <div >
              <FieldBox>
                <FieldLabel text="License Plate (Auto-generated)" />
                <TextInput
                  name="licensePlate"
                  value={formData.licensePlate}
                  placeholder="ABC-123"
                  onChange={handleInputChange}
                  readOnly
                />
              </FieldBox>
              <div></div> {/* Empty div for alignment */}
            </div>
          </div>

          {/* Row 4: Quick Pick */}
          <div className="mb-6">
            <FieldLabel text="Quick Pick" required green={false} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Day Pass Div */}
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="quickPick"
                    value="dayPass"
                    checked={formData.quickPick === "dayPass"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#30B33D] focus:ring-[#30B33D]"
                  />
                  <span className="text-xs font-medium text-[#30B33D]">
                    Day Pass
                  </span>
                </label>
              </div>

              {/* Long Stay Div */}
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="quickPick"
                    value="longStay"
                    checked={formData.quickPick === "longStay"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#30B33D] focus:ring-[#30B33D]"
                  />
                  <span className="text-xs font-medium text-[#30B33D]">
                    Long Stay
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
          {/* Row 5: Date Selection */}
          <div className="mb-6">
            {formData.quickPick === "dayPass" ? (
              // Day Pass - Only show To Date
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FieldBox>
                  <FieldLabel text="To Date" required />
                  <TextInput
                    name="toDate"
                    value={formData.toDate}
                    type="date"
                    placeholder="Select end date"
                    required
                    onChange={handleInputChange}
                  />
                </FieldBox>
              </div>
              <div></div>
              </div>
             
            ) : (
              // Long Stay - Show both From Date and To Date
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldBox>
                  <FieldLabel text="From Date" required />
                  <TextInput
                    name="fromDate"
                    value={formData.fromDate}
                    type="date"
                    placeholder="Select start date"
                    required
                    onChange={handleInputChange}
                  />
                </FieldBox>

                <FieldBox>
                  <FieldLabel text="To Date" required />
                  <TextInput
                    name="toDate"
                    value={formData.toDate}
                    type="date"
                    placeholder="Select end date"
                    required
                    onChange={handleInputChange}
                  />
                </FieldBox>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("editVisitorData");
                router.push('/visitor');
              }}
              className="py-3 rounded-xl bg-white text-[#30B33D] text-[15px] font-semibold cursor-pointer shadow-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-xl bg-[#30B33D] text-white text-[15px] font-semibold cursor-pointer shadow-md hover:bg-[#28a035] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Visitor" : "Add Visitor")}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Success!
              </h3>
              
              <p className="text-gray-600 mb-6">
                {success}
              </p>
              
              <button
                onClick={handleSuccessModalClose}
                className="w-full bg-[#30B33D] text-white py-2 px-4 rounded-lg hover:bg-[#28a035] transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVisitorQuickForm;
