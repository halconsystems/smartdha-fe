"use client";

import React, { useState } from "react";

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

const AddVisitorQuickForm: React.FC = () => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Handle form submission here
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

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-black">
            Please provide visitor details below!
          </p>
        </div>

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
              />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="CNIC No." />
              <TextInput
                name="cnicNo"
                value={formData.cnicNo}
                placeholder="12345-1234567-1"
              />
            </FieldBox>
          </div>

          {/* Row 2: Vehicle No (ABC only) + Vehicle No (Number only) +  License Plate*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldBox>
              <FieldLabel text="Vehicle No." required />
              <TextInput name="vehicleNoAlpha" value={formData.vehicleNoAlpha} placeholder="ABC Only" required />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Vehicle No." required />
              <TextInput name="vehicleNoNumeric" value={formData.vehicleNoNumeric} placeholder="123 Only" required />
            </FieldBox>

            </div>
            <div >
              <FieldBox>
                <FieldLabel text="License Plate" />
                <TextInput
                  name="licensePlate"
                  value={formData.licensePlate}
                  placeholder="ABC-123"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldBox>
                <FieldLabel text="From Date" required />
                <TextInput
                  name="fromDate"
                  value={formData.fromDate}
                  type="date"
                  placeholder="Select start date"
                  required
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
                />
              </FieldBox>
            </div>
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
              className="py-3 rounded-xl bg-[#30B33D] text-white text-[15px] font-semibold cursor-pointer shadow-md hover:bg-[#28a035] transition"
            >
              Add Visitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisitorQuickForm;
