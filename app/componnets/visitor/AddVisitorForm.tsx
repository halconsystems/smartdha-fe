"use client";

import React, { useCallback, useEffect, useState } from "react";

type FormData = {
  fullName: string;
  password: string;
  emailAddress: string;
  cellNumber: string;
  category: string;
  subCategory: string;
  destination: string;
  vehicleNoNumeric:string;
  vehicleNoAlphabetic: string;
  licensePlate: string;
};

interface AddVisitorFormProps {
  mode?: string;
  visitorId?: string;
}

const AddVisitorForm: React.FC<AddVisitorFormProps> = ({ mode, visitorId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    password: "",
    emailAddress: "",
    cellNumber: "",
    category: "Visitor",
    subCategory: "Temporary Visitor",
    destination: "",
    vehicleNoNumeric: "",
    vehicleNoAlphabetic: "",
    licensePlate: "",
  });

  useEffect(() => {
    const editData = localStorage.getItem("editResidentVisitorData");
    if (!editData) {
      return;
    }

    try {
      const parsed = JSON.parse(editData) as {
        name?: string;
        email?: string;
        phone?: string;
        subCategory?: string;
        Destination?: string;
        vehicleInfo?: string;
      };

      const [platePart = "", numberPart = ""] = (parsed.vehicleInfo ?? "").split("-").map((part) => part.trim());
      const vehicleNoAlphabetic = platePart.split(" ").pop() ?? "";

      setIsEditing(true);
      setFormData((prev) => ({
        ...prev,
        fullName: parsed.name ?? prev.fullName,
        emailAddress: parsed.email ?? prev.emailAddress,
        cellNumber: parsed.phone ?? prev.cellNumber,
        subCategory: parsed.subCategory ?? prev.subCategory,
        destination: parsed.Destination ?? prev.destination,
        vehicleNoAlphabetic: vehicleNoAlphabetic || prev.vehicleNoAlphabetic,
        vehicleNoNumeric: numberPart || prev.vehicleNoNumeric,
        licensePlate: parsed.vehicleInfo ?? prev.licensePlate,
      }));
    } catch (error) {
      console.error("Error parsing resident visitor edit data:", error);
    }
  }, []);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "vehicleNoAlphabetic" || name === "vehicleNoNumeric") {
        const alpha = updated.vehicleNoAlphabetic.trim();
        const numeric = updated.vehicleNoNumeric.trim();
        updated.licensePlate = alpha || numeric
          ? `${alpha}${alpha && numeric ? "-" : ""}${numeric}`
          : "";
      }

      return updated;
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Visitor Form Data:", formData);
    localStorage.removeItem("editResidentVisitorData");
    // Handle form submission here
  };

  const handleCancel = () => {
    localStorage.removeItem("editResidentVisitorData");
    window.history.back();
  };

  const categories: string[] = ["Resident", "Commercial", "House-help Worker", "Education", "Visitor", "Others"];
  const subCategories: { [key: string]: string[] } = {
    "House-help Worker": ["Staff", "Maid", "Driver", "Gardner", "Cook", "Guard"],
    Resident: ["Owner", "Tenant"],
    Commercial: ["Retail", "Office", "Restaurant", "Service"],
    Education: ["Student", "Parent", "Faculty"],
    Visitor: ["Temporary Visitor"],
    Others: ["Please Specify"]
  };

  // Reusable field box
  const FieldBox = useCallback(({ children }: { children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 relative">
      {children}
    </div>
  ), []);

  // Reusable label
  const FieldLabel = useCallback(({
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
  ), []);

  // Reusable input
  const TextInput = useCallback(({
    name,
    value,
    placeholder,
    type = "text",
    required = false,
  }: {
    name: keyof FormData;
    value: string;
    placeholder: string;
    type?: string;
    required?: boolean;
  }) => (
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      required={required}
      className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
    />
  ), [handleInputChange]);

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-black">
            {isEditing ? "Edit visitor details" : "Please provide visitor details below!"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Row 1: Full Name + Email Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Full Name" required />
              <TextInput name="fullName" value={formData.fullName} placeholder="Full Name here" required />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Email Address" required />
              <TextInput name="emailAddress" value={formData.emailAddress} placeholder="Email Address here" type="email" required />
            </FieldBox>
          </div>

          {/* Row 2: Password + Cell Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Password" required />
              <TextInput name="password" value={formData.password} placeholder="Password here" type="password" required />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Add Cell Number" required />
              <TextInput name="cellNumber" value={formData.cellNumber} placeholder="0300-1234567" type="tel" required />
            </FieldBox>
          </div>

          {/* Row 3: Category + Sub-Category */}
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
                  {formData.category || "Select Category"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, category: cat, subCategory: "" }));
                        setCategoryDropdownOpen(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Sub-Category" />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSubCategoryDropdownOpen(!subCategoryDropdownOpen)}
              >
                <span
                  className={`text-sm ${formData.subCategory ? "text-gray-700" : "text-gray-400"}`}
                >
                  {formData.subCategory || "Select Type"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {subCategoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {(subCategories[formData.category] || []).map((subCat) => (
                    <div
                      key={subCat}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, subCategory: subCat }));
                        setSubCategoryDropdownOpen(false);
                      }}
                    >
                      {subCat}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>
          </div>

          {/* Row 4: Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Destination" required />
              <TextInput
                name="destination"
                value={formData.destination}
                placeholder="Enter Destination Visitor's Code (Type & search)"
                required
              />
            </FieldBox>

              
            </div>
               {/* Row 5: Vehicle Number fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Vehicle No." required />
              <TextInput name="vehicleNoAlphabetic" value={formData.vehicleNoAlphabetic} placeholder="ABC Only" required />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Vehicle No." required />
              <TextInput name="vehicleNoNumeric" value={formData.vehicleNoNumeric} placeholder="123 Only" required />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="License Plate" required />
              <TextInput name="licensePlate" value={formData.licensePlate} placeholder="ABC-123" required />
            </FieldBox>
          </div>
          </div>

          {/* Submit Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="py-3 rounded-xl bg-white text-[#30B33D] text-[15px] font-semibold cursor-pointer shadow-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 rounded-xl bg-[#30B33D] text-white text-[15px] font-semibold cursor-pointer shadow-md hover:bg-[#28a035] transition"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisitorForm;
