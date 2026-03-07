"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { vehicleService } from "../../services/vehicle-service";
import { CreateVehicleCommand, UpdateVehicleCommand, Vehicle } from "../../types/api";
import SvgIcon from "../shared/SvgIcon";
import SuccessModal from "../shared/SuccessModal";

// ─── Types ───────────────────────────────────────────────────────────────────
interface VehicleFormData {
  vehicleNoABC: string;
  vehicleNoNum: string;
  licensePlate: string;
  make: string;
  model: string;
  year: string;
  color: string;
  attachment: File | null;
}

// ─── Year options ─────────────────────────────────────────────────────────────
const YEARS = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

// ─── Reusable Field components ────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[12px] font-medium text-[#30B33D]">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({
  placeholder,
  value,
  readOnly,
  onChange,
}: {
  placeholder: string;
  value: string;
  readOnly?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      className="
        w-full text-[13px] text-gray-700 placeholder-gray-300
        bg-transparent border-0 outline-none
        focus:ring-0 p-0
      "
    />
  );
}

function FieldBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-xl px-4 py-3
        focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-50
        transition-all duration-150 ${className}
      `}
    >
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddVehicleForm({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<VehicleFormData>({
    vehicleNoABC: "",
    vehicleNoNum: "",
    licensePlate: "",
    make: "",
    model: "",
    year: "2001",
    color: "",
    attachment: null,
  });

  const [yearOpen, setYearOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Check if we're in edit mode
  useEffect(() => {
    const editData = localStorage.getItem('editVehicleData');
    if (editData) {
      try {
        const { id } = JSON.parse(editData);
        setEditingId(id);
        setIsEditing(true);
        loadVehicleData(id);
      } catch (error) {
        console.error('Error parsing edit data:', error);
      }
    }
  }, []);

  // Load vehicle data for editing
  const loadVehicleData = async (id: string) => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicleById(id);
      if ((response as any).success) {
        const vehicle = (response as any).data;
        console.log("Loaded vehicle for editing:", vehicle);
        setForm({
          vehicleNoABC: vehicle.license || '',
          vehicleNoNum: vehicle.licenseNo?.toString() || '',
          licensePlate: `${vehicle.license || ''}-${vehicle.licenseNo || ''}`, // For display only
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || '2001',
          color: vehicle.color || '',
          attachment: null,
        });
      }
    } catch (error) {
      setError('Failed to load vehicle data');
    } finally {
      setLoading(false);
    }
  };

  const set = useCallback((field: keyof VehicleFormData, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "vehicleNoABC" || field === "vehicleNoNum") {
        const alpha = updated.vehicleNoABC.trim();
        const numeric = updated.vehicleNoNum.trim();
        updated.licensePlate = alpha || numeric
          ? `${alpha}${alpha && numeric ? "-" : ""}${numeric}`
          : "";
      }

      return updated;
    });
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setForm((prev) => ({ ...prev, attachment: file }));
    setPreview(URL.createObjectURL(file));
  };

  const removeAttachment = () => {
    setForm((prev) => ({ ...prev, attachment: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleModalClose = (): void => {
    setShowSuccessModal(false);
    localStorage.removeItem('editVehicleData');
    router.push('/vehicle');
  };

  const handleAdd = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (isEditing && editingId) {
        // Update existing vehicle
        const formData = new FormData();
        formData.append('Id', editingId);
        formData.append('Color', form.color);
        formData.append('Make', form.make);
        formData.append('Model', form.model);

        if (form.attachment) {
          formData.append('Attachment', form.attachment);
        }

        console.log('[DEBUG] Calling updateVehicle API with:', {
          editingId,
          color: form.color,
          make: form.make,
          model: form.model,
          hasAttachment: !!form.attachment
        });

        const response = await vehicleService.updateVehicle(formData);

        if ((response as any).success) {
          setSuccessMessage((response as any).message || "Vehicle updated successfully!");
          setShowSuccessModal(true);
        } else {
          setError((response as any).message || "Failed to update vehicle");
        }
      } else {
        // Create new vehicle
        const formData = new FormData();
        
        if (form.attachment) {
          formData.append('Attachment', form.attachment);
        }

        const params = new URLSearchParams({
          LicenseNo: form.vehicleNoNum || '',
          License: form.vehicleNoABC || '',
          Year: form.year || '',
          Color: form.color || '',
          Make: form.make || '',
          Model: form.model || '',
          ETagId: form.licensePlate || '',
          ValidTo: new Date().toISOString(),
        });

        const response = await vehicleService.createVehicle(formData, params.toString());
        console.log('Vehicle create response:', response);

        // Consider success if succeeded is true OR if response.data contains an id or expected property
        const createdId = response?.data?.id || response?.data?.vehicleId;
        if (response.succeeded || createdId) {
          let msg = "Vehicle created successfully!";
          if (typeof response.data === "string") {
            msg = response.data;
          } else if (response.data && typeof response.data === "object") {
            msg = response.data.message || msg;
          }
          setSuccessMessage(msg);
          setShowSuccessModal(true);
        } else {
          setError(typeof response.data === "string" ? response.data : "Failed to create vehicle");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-4">
      <div className="w-full">

        {/* Heading */}
        <p className="text-[12px] font-semibold text-black mb-5">
          Please provide details below!
        </p>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* ── Form grid ── */}
        <div className="flex flex-col gap-3">

          {/* Row 1: Vehicle No (ABC) | Vehicle No (Num) | License Plate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Vehicle No — ABC Only */}
              <FieldBox>
                <FieldLabel label="Vehicle No" required />
                <TextInput
                  placeholder="ABC Only"
                  value={form.vehicleNoABC}
                  onChange={(v) => set("vehicleNoABC", v)}
                />
              </FieldBox>

              {/* Vehicle No — Number Only */}
              <FieldBox>
                <FieldLabel label="Vehicle No" required />
                <TextInput
                  placeholder="Number Only"
                  value={form.vehicleNoNum}
                  onChange={(v) => set("vehicleNoNum", v)}
                />
              </FieldBox>
            </div>

            {/* License Plate Display */}
            <FieldBox>
              <FieldLabel label="License Plate" />
              <TextInput
                placeholder="ABC-123"
                value={form.licensePlate}
                readOnly={true}
                onChange={(v) => set("licensePlate", v)}
              />
            </FieldBox>
          </div>

          {/* Row 2: Make | Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldBox>
              <FieldLabel label="Make" required />
              <TextInput
                placeholder="Manufacturer"
                value={form.make}
                onChange={(v) => set("make", v)}
              />
            </FieldBox>

            <FieldBox>
              <FieldLabel label="Model" required />
              <TextInput
                placeholder="Model Name"
                value={form.model}
                onChange={(v) => set("model", v)}
              />
            </FieldBox>
          </div>

          {/* Row 3: Year (dropdown) | Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Year dropdown */}
            <div className="relative">
              <FieldBox className="cursor-pointer" >
                <FieldLabel label="Year" required />
                <div
                  className="flex items-center justify-between"
                  onClick={() => setYearOpen((o) => !o)}
                >
                  <span className="text-[13px] text-gray-700">
                    {form.year || "Select Year"}
                  </span>
                  {/* <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform duration-150 ${
                        yearOpen ? "rotate-180" : ""
                      }`}
                    /> */}
                </div>
              </FieldBox>

              {yearOpen && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="max-h-[180px] overflow-y-auto">
                    {YEARS.map((yr) => (
                      <div
                        key={yr}
                        onClick={() => {
                          set("year", yr);
                          setYearOpen(false);
                        }}
                        className={`
                            px-4 py-2 text-[13px] cursor-pointer transition-colors
                            ${form.year === yr
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                          }
                          `}
                      >
                        {yr}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color */}
            <FieldBox>
              <FieldLabel label="Color" required />
              <TextInput
                placeholder="White"
                value={form.color}
                onChange={(v) => set("color", v)}
              />
            </FieldBox>
          </div>

          {/* Row 4: Attachment (half width) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className="
                  bg-white border border-gray-200 rounded-xl px-4 py-3
                  transition-all duration-150
                "
            >
              {/* Attachment header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[#30B33D]">
                  Attachment
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                      w-6 h-6 rounded-md border border-gray-300
                      flex items-center justify-center
                      hover:border-green-400 hover:bg-green-50
                      transition-colors duration-150
                    "
                >
                   <SvgIcon name="add-icon" size={12} />
                  {/* <Plus size={13} className="text-gray-500" /> */}
                </button>
              </div>

              {/* Preview or placeholder */}
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="attachment"
                    className="w-full h-[72px] object-cover rounded-lg border border-gray-100"
                  />
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow"
                  >
                    {/* <X size={10} className="text-white" /> */}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-start gap-0.5 text-left w-full"
                >
                  <div className="flex items-center gap-1.5 text-gray-400">
                    {/* <ImagePlus size={14} /> */}
                    <span className="text-[12px]">Add Picture</span>
                  </div>
                  <span className="text-[11px] text-gray-300">Add file here</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          </div>

        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="
                flex-1 py-2.5 rounded-xl border border-gray-200
                text-[13px] font-medium text-[#30B33D]
                hover:bg-gray-50 hover:text-gray-700
                transition-all duration-150
              "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAdd}
            disabled={loading}
            className="
                flex-1 py-2.5 rounded-xl
                text-[13px] font-semibold text-white
                bg-[#30B33D] hover:bg-green-600 active:bg-green-700
                transition-all duration-150 shadow-sm
                disabled:opacity-50 disabled:cursor-not-allowed
              "
          >
            {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update" : "Add")}
          </button>
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleModalClose}
          title="Vehicle Registration Successful"
          message={successMessage}
        />
      </div>
    </div>
  );
}