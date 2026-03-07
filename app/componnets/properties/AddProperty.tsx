"use client";

import React, { useState } from "react";

type FormData = {
  category: string;
  type: string;
  phase: string;
  zone: string;
  khayaban: string;
  floor: string;
  laneStreetNo: string;
  possessionType: string;
  plotNoNumeric: string;
  plotNoAlpha: string;
  plotNoCombined: string;
  status: string;
  proofOfPossession: File | null;
  utilityBill: File | null;
};

const AddProperty: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    category: "",
    type: "",
    phase: "",
    zone: "",
    khayaban: "",
    floor: "",
    laneStreetNo: "",
    possessionType: "",
    plotNoNumeric: "",
    plotNoAlpha: "",
    plotNoCombined: "",
    status: "Active",
    proofOfPossession: null,
    utilityBill: null,
  });

  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [utilityPreview, setUtilityPreview] = useState<string | null>(null);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);
  const [phaseDropdownOpen, setPhaseDropdownOpen] = useState<boolean>(false);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState<boolean>(false);
  const [possessionDropdownOpen, setPossessionDropdownOpen] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fieldName = e.target.name;
      
      if (fieldName === 'proofOfPossession') {
        setFormData((prev) => ({ ...prev, proofOfPossession: file }));
        const reader = new FileReader();
        reader.onloadend = () => setProofPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else if (fieldName === 'utilityBill') {
        setFormData((prev) => ({ ...prev, utilityBill: file }));
        const reader = new FileReader();
        reader.onloadend = () => setUtilityPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setApiResponse(null);

    try {
      // Always use FormData for this API
      const form = new FormData();
      form.append('Category', formData.category);
      form.append('Type', formData.type);
      form.append('Phase', formData.phase);
      form.append('Zone', formData.zone);
      form.append('Khayaban', formData.khayaban);
      form.append('Floor', formData.floor);
      form.append('StreetNo', formData.laneStreetNo);
      form.append('PossessionType', formData.possessionType);
      form.append('PlotNo', formData.plotNoNumeric);
      form.append('Plot', formData.plotNoAlpha);
      // If you want to send combined plot, add as needed
      // form.append('PlotNoCombined', formData.plotNoCombined);
      form.append('Status', formData.status);
      if (formData.proofOfPossession) {
        form.append('proofOfPossession', formData.proofOfPossession);
      }
      if (formData.utilityBill) {
        form.append('utilityBill', formData.utilityBill);
      }

      const response = await fetch('https://dfpwebp.dhakarachi.org/api/smartdha/residenceproperty/create', {
        method: 'POST',
        headers: {
          // Do NOT set Content-Type, browser will set it for FormData
        },
        body: form,
      });
      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
        setApiResponse(JSON.stringify(result, null, 2));
      } catch (jsonErr) {
        setError(
          'Failed to parse API response as JSON. Raw response: ' + rawText
        );
        setApiResponse(rawText);
        return;
      }
      if (response.ok && (result.success || result.succeeded)) {
        // Show actual API response message if available
        let msg = '';
        if (result.data && result.data.message) {
          msg = result.data.message;
        } else if (result.message) {
          msg = result.message;
        } else {
          msg = JSON.stringify(result);
        }
        setSuccess(msg);
      } else {
        let errorMsg = 'Failed to add property.';
        if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          errorMsg += ' ' + result.errors[0];
        } else if (result.message) {
          errorMsg += ' ' + result.message;
        } else {
          errorMsg += ' ' + JSON.stringify(result);
        }
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
  const TextInput = ({
    name,
    value,
    placeholder,
    type = "text",
    required = false,
    maxLength,
    pattern,
  }: {
    name: keyof FormData;
    value: string;
    placeholder: string;
    type?: string;
    required?: boolean;
    maxLength?: number;
    pattern?: string;
  }) => (
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      pattern={pattern}
      className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
    />
  );

  const categories = ["Residential", "Commercial"];
  const types = ["House", "Apartment", "Office", "Shop"];
  const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"];
  const zones = ["Zone A", "Zone B", "Zone C"];
  const possessionTypes = ["Owner", "Tenant"];

  // Toggle Switch Component
  const ToggleSwitch = ({
    isOn,
    onToggle,
    label,
  }: {
    isOn: boolean;
    onToggle: () => void;
    label: string;
  }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isOn ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isOn ? 'text-green-600' : 'text-red-600'}`}>
        {isOn ? 'Active' : 'Inactive'}
      </span>
    </div>
  );

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-lg font-semibold text-black">
            Please provide property details below!
          </p>
          <ToggleSwitch
            isOn={formData.status === "Active"}
            onToggle={() => setFormData(prev => ({
              ...prev,
              status: prev.status === "Active" ? "Inactive" : "Active"
            }))}
            label="Status"
          />
        </div>

        {/* Form */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {apiResponse && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800">
            <strong>API Response:</strong>
            <pre className="whitespace-pre-wrap break-all">{apiResponse}</pre>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Category + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Category" required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <span
                  className={`text-sm ${formData.category ? "text-gray-700" : "text-gray-400"}`}
                >
                  {formData.category || "Select (Residential / Commercial)"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, category }));
                        setCategoryDropdownOpen(false);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Type" required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              >
                <span
                  className={`text-sm ${formData.type ? "text-gray-700" : "text-gray-400"}`}
                >
                  {formData.type || "Select Type"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {typeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {types.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, type }));
                        setTypeDropdownOpen(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>
          </div>

          {/* Row 2: Phase + Zone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Phase" required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setPhaseDropdownOpen(!phaseDropdownOpen)}
              >
                <span
                  className={`text-sm ${formData.phase ? "text-gray-700" : "text-gray-400"}`}
                >
                  {formData.phase || "Select Phase"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {phaseDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {phases.map((phase) => (
                    <div
                      key={phase}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, phase }));
                        setPhaseDropdownOpen(false);
                      }}
                    >
                      {phase}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Zone" required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
              >
                <span
                  className={`text-sm ${formData.zone ? "text-gray-700" : "text-gray-400"}`}
                >
                  {formData.zone || "Select Zone"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {zoneDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {zones.map((zone) => (
                    <div
                      key={zone}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, zone }));
                        setZoneDropdownOpen(false);
                      }}
                    >
                      {zone}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>
          </div>

          {/* Row 3: Khayaban + Floor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Khayaban" required />
              <TextInput
                name="khayaban"
                value={formData.khayaban}
                placeholder="Enter khayaban name"
                required
              />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Floor" required />
              <TextInput
                name="floor"
                value={formData.floor}
                placeholder="Enter floor number"
                required
                maxLength={2}
                pattern="[0-9]*"
              />
            </FieldBox>
          </div>

          {/* Row 4: Lane/Street No + Possession Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Lane / Street No." required />
              <TextInput
                name="laneStreetNo"
                value={formData.laneStreetNo}
                placeholder="Type here"
                required
              />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Possession Type" required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setPossessionDropdownOpen(!possessionDropdownOpen)
                }
              >
                <span
                  className={`text-sm ${formData.possessionType ? "text-gray-700" : "text-gray-400"}`}
                >
                  {formData.possessionType || "Select (Owner,Tenant)"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {possessionDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {possessionTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, possessionType: type }));
                        setPossessionDropdownOpen(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>
          </div>

          {/* Row 5: Plot No Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FieldBox>
                <FieldLabel text="Plot No." required />
                <TextInput
                  name="plotNoNumeric"
                  value={formData.plotNoNumeric}
                  placeholder="123 Only"
                  required
                />
              </FieldBox>

              <FieldBox>
                <FieldLabel text="Plot No." required />
                <TextInput
                  name="plotNoAlpha"
                  value={formData.plotNoAlpha}
                  placeholder="ABC Only"
                />
              </FieldBox>
            </div>
            <div>
              <FieldBox>
                <FieldLabel text="Plot No." required />
                <TextInput
                  name="plotNoCombined"
                  value={formData.plotNoCombined}
                  placeholder="55-C"
                />
              </FieldBox>
            </div>
          </div>

          {/* Row 6: Proof of Possession + Utility Bill */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative mb-6">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-between min-h-[80px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-semibold text-[#30B33D]">
                      Proof of Possession
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      *
                    </span>
                    <label
                      htmlFor="proofUpload"
                      className="flex items-center justify-center w-5 h-5 bg-[#30B33D] rounded-full cursor-pointer shrink-0 ml-0.5"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                      <input
                        id="proofUpload"
                        name="proofOfPossession"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <label
                    htmlFor="proofUpload2"
                    className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-gray-700"
                  >
                    Add Document
                    <input
                      id="proofUpload2"
                      name="proofOfPossession"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-[11px] text-gray-400 mt-1">
                    {formData.proofOfPossession
                      ? formData.proofOfPossession.name
                      : "No file chosen"}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-between min-h-[80px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-semibold text-[#30B33D]">
                      Attach Utility Bill
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      *
                    </span>
                    <label
                      htmlFor="utilityUpload"
                      className="flex items-center justify-center w-5 h-5 bg-[#30B33D] rounded-full cursor-pointer shrink-0 ml-0.5"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                      <input
                        id="utilityUpload"
                        name="utilityBill"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <label
                    htmlFor="utilityUpload2"
                    className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-gray-700"
                  >
                    Add Document
                    <input
                      id="utilityUpload2"
                      name="utilityBill"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-[11px] text-gray-400 mt-1">
                    {formData.utilityBill
                      ? formData.utilityBill.name
                      : "No file chosen"}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Debug: Show FormData body */}
          <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-700">
            <strong>FormData Body Preview:</strong>
            <ul className="mt-1">
              {Object.entries(formData).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value instanceof File ? value.name : String(value)}
                </li>
              ))}
            </ul>
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
              {loading ? 'Adding Property...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
