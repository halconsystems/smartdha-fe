"use client";

import React, { useState } from "react";

type FormData = {
  fullName: string;
  cnicNo: string;
  vehicleNoAlpha: string;
  vehicleNoNumeric: string;
  licensePlate: string;
  description: string;
  validityDate: string;
};

const AddLuggagePass: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cnicNo: "",
    vehicleNoAlpha: "",
    vehicleNoNumeric: "",
    licensePlate: "",
    description: "",
    validityDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        <div className="mb-6 flex justify-between items-center">
          <p className="text-lg font-semibold text-black">Please provide details below!</p>
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
              className="py-3 rounded-xl bg-[#30B33D] text-white text-[15px] font-semibold cursor-pointer shadow-md hover:bg-[#28a035] transition"
            >
              Add Luggage Pass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLuggagePass;
