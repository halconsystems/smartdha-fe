"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { luggageService } from "../../services/luggage-service";
import { CreateLuggagePassCommand, UpdateLuggagePassCommand } from "../../types/api";
import SuccessModal from "../shared/SuccessModal";

type FormData = {
  fullName: string;
  cnicNo: string;
  vehicleNoAlpha: string;
  vehicleNoNumeric: string;
  licensePlate: string;
  description: string;
  validityDate: string;
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

// Reusable input
const TextInput = React.memo(({
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  pattern,
  onChange,
}: {
  name: keyof FormData;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
    className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
  />
));

TextInput.displayName = 'TextInput';

const AddLuggagePass = () => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Check for edit data on component mount
  useEffect(() => {
    const editData = localStorage.getItem('editLuggageData');
    if (editData) {
      try {
        const parsedData = JSON.parse(editData);
        setIsEditMode(true);
        setEditId(parsedData.id);

        // If we have an ID, fetch the latest data from API
        if (parsedData.id) {
          loadLuggagePassData(parsedData.id);
        } else {
          // Fallback to localStorage data
          populateFormFromData(parsedData);
        }

        // Clear edit data after loading
        localStorage.removeItem('editLuggageData');
      } catch (error) {
        console.error('Error parsing edit data:', error);
      }
    }
  }, []);

  // Load luggage pass data by ID
  const loadLuggagePassData = async (id: string) => {
    try {
      const response = await luggageService.getLuggagePassById(id);
      if (response) {
        populateFormFromData(response);
      } else {
        setError("Failed to load luggage pass data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load luggage pass data");
    }
  };

  // Populate form with data
  const populateFormFromData = (data: any) => {
    setFormData({
      fullName: data.name || '',
      cnicNo: data.cnic || '',
      vehicleNoAlpha: data.vehicleLicensePlate?.split('-')[0] || '',
      vehicleNoNumeric: data.vehicleLicensePlate?.split('-')[1] || '',
      licensePlate: data.vehicleLicensePlate || '',
      description: data.description || '',
      validityDate: data.validTo ? new Date(data.validTo).toISOString().split('T')[0] : '',
    });
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cnicNo: "",
    vehicleNoAlpha: "",
    vehicleNoNumeric: "",
    licensePlate: "",
    description: "",
    validityDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };

        if (name === "vehicleNoAlpha" || name === "vehicleNoNumeric") {
          const alpha = updated.vehicleNoAlpha.trim();
          const numeric = updated.vehicleNoNumeric.trim();
          updated.licensePlate = alpha || numeric
            ? `${alpha}${alpha && numeric ? "-" : ""}${numeric}`
            : "";
        }

        return updated;
      });
    },
    []
  );

  const handleModalClose = (): void => {
    setShowSuccessModal(false);
    router.push('/luggage');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Combine vehicle parts for license plate
      const vehicleLicensePlate = formData.vehicleNoAlpha && formData.vehicleNoNumeric 
        ? `${formData.vehicleNoAlpha}-${formData.vehicleNoNumeric}`
        : formData.licensePlate;

      // Convert to API format
      const luggagePassData = isEditMode && editId ? {
        id: editId,
        name: formData.fullName,
        cnic: formData.cnicNo,
        vehicleLicensePlate: vehicleLicensePlate || undefined,
        vehicleLicenseNo: formData.vehicleNoNumeric ? parseInt(formData.vehicleNoNumeric) : undefined,
        description: formData.description || undefined,
        validFrom: formData.validityDate ? new Date(formData.validityDate).toISOString() : undefined,
        validTo: formData.validityDate ? new Date(formData.validityDate).toISOString() : undefined,
      } : {
        name: formData.fullName,
        cnic: formData.cnicNo,
        vehicleLicensePlate: vehicleLicensePlate || undefined,
        vehicleLicenseNo: formData.vehicleNoNumeric ? parseInt(formData.vehicleNoNumeric) : undefined,
        description: formData.description || undefined,
        validFrom: formData.validityDate ? new Date(formData.validityDate).toISOString() : undefined,
        validTo: formData.validityDate ? new Date(formData.validityDate).toISOString() : undefined,
      };

      let response;
      if (isEditMode && editId) {
        // Update existing luggage pass
        const updateData = {
          name: formData.fullName,
          cnic: formData.cnicNo,
          vehicleLicensePlate: vehicleLicensePlate || undefined,
          vehicleLicenseNo: formData.vehicleNoNumeric ? parseInt(formData.vehicleNoNumeric) : undefined,
          description: formData.description || undefined,
          validFrom: formData.validityDate ? new Date(formData.validityDate).toISOString() : undefined,
          validTo: formData.validityDate ? new Date(formData.validityDate).toISOString() : undefined,
        };
        
        response = await luggageService.updateLuggagePass({
          id: editId,
          ...updateData
        });
        setSuccessMessage("Luggage pass updated successfully!");
      } else {
        // Create new luggage pass
        response = await luggageService.createLuggagePass(luggagePassData);
        setSuccessMessage("Luggage pass created successfully!");
      }
      
      if ((response as any).succeeded) {
        // Show success modal
        setShowSuccessModal(true);
      } else {
        setError("Failed to save luggage pass");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-lg font-semibold text-black">Please provide details below!</p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
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

          {/* Row 2: Vehicle No (ABC only) + Vehicle No (Number only) + License Plate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldBox>
                <FieldLabel text="Vehicle No (ABC only)" required />
                <TextInput 
                  name="vehicleNoAlpha" 
                  value={formData.vehicleNoAlpha} 
                  placeholder="ABC" 
                  required 
                  maxLength={3}
                  onChange={handleInputChange}
                />
              </FieldBox>

              <FieldBox>
                <FieldLabel text="Vehicle No (Number only)" required />
                <TextInput 
                  name="vehicleNoNumeric" 
                  value={formData.vehicleNoNumeric} 
                  placeholder="123" 
                  required 
                  type="text"
                  pattern="[0-9]*"
                  onChange={handleInputChange}
                />
              </FieldBox>
            </div>
            <div>
              <FieldBox>
                <FieldLabel text="License Plate" />
                <TextInput
                  name="licensePlate"
                  value={formData.licensePlate}
                  placeholder="ABC-123"
                  onChange={handleInputChange}
                />
              </FieldBox>
              <div></div> {/* Empty div for alignment */}
            </div>
          </div>

          {/* Row 3: Description */}
          <div className="mb-4">
            <FieldBox>
              <FieldLabel text="Description" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="write here"
                rows={4}
                className="w-full text-sm text-[#30B33D] placeholder-gray-400 outline-none bg-transparent resize-none"
              />
            </FieldBox>
          </div>

          {/* Row 4: Date (Validity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="px-2 mb-2">
              <span className="text-sm font-semibold text-black"> Date </span>
              <span className="text-sm font-semibold text-red-500"> (Validity) </span>
              </div>
            
              <FieldBox>
                <div className="relative">
                  <TextInput 
                name="validityDate" 
                value={formData.validityDate} 
                placeholder="validity date" 
                onChange={handleInputChange}
              />
                </div>
              </FieldBox>
            </div>
            <div></div> {/* Empty div for alignment */}
          </div>

          {/* Submit Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="py-3 rounded-xl bg-white text-[#30B33D] text-[15px] font-semibold cursor-pointer shadow-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-xl bg-[#30B33D] text-white text-[15px] font-semibold cursor-pointer shadow-md hover:bg-[#28a035] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Luggage Pass" : "Add Luggage Pass")}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Luggage Registration Successful"
        message={successMessage}
      />
    </div>
  );
};

export default AddLuggagePass;
