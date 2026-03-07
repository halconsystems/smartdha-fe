"use client";

import React, { useCallback, useEffect, useState } from "react";

type FormData = {
  fullName: string;
  password: string;
  emailAddress: string;
  cellNumber: string;
  category: string;
  subCategory: string;
  profilePicture: File | null;
  cnicFront: File | null;
  cnicBack: File | null;
};

const AddHouseHelpWorkerForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [cnicBack, setCnicBack] = useState<File | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    password: "",
    emailAddress: "",
    cellNumber: "",
    category: "House-help Worker",
    subCategory: "",
    profilePicture: null,
    cnicFront: null,
    cnicBack: null,
  });

  useEffect(() => {
    const editData = localStorage.getItem("editHouseHelpWorkerData");
    if (!editData) {
      return;
    }

    try {
      const parsed = JSON.parse(editData) as {
        name?: string;
        email?: string;
        phone?: string;
        subCategory?: string;
      };

      setIsEditing(true);
      setFormData((prev) => ({
        ...prev,
        fullName: parsed.name ?? prev.fullName,
        emailAddress: parsed.email ?? prev.emailAddress,
        cellNumber: parsed.phone ?? prev.cellNumber,
        subCategory: parsed.subCategory ?? prev.subCategory,
      }));
    } catch (error) {
      console.error("Error parsing house help worker edit data:", error);
    }
  }, []);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fieldName = e.target.name;
      
      if (fieldName === 'profilePicture') {
        setProfilePicture(file);
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else if (fieldName === 'cnicFront') {
        setCnicFront(file);
      } else if (fieldName === 'cnicBack') {
        setCnicBack(file);
      }
      
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("House Help Worker Form Data:", formData);
    localStorage.removeItem("editHouseHelpWorkerData");
    // Handle form submission here
  };

  const handleCancel = () => {
    localStorage.removeItem("editHouseHelpWorkerData");
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
            {isEditing ? "Edit house help worker details" : "Please provide house help worker details below!"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Full Name + Email Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Full Name" required />
              <TextInput
                name="fullName"
                value={formData.fullName}
                placeholder="Full Name here"
                required
              />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Email Address" required />
              <TextInput
                name="emailAddress"
                value={formData.emailAddress}
                placeholder="Email Address here"
                type="email"
                required
              />
            </FieldBox>
          </div>

          {/* Row 2: Password + Cell Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Password" required />
              <TextInput
                name="password"
                value={formData.password}
                placeholder="Password here"
                type="password"
                required
              />
            </FieldBox>

            <FieldBox>
              <FieldLabel text="Add Cell Number" required />
              <TextInput
                name="cellNumber"
                value={formData.cellNumber}
                placeholder="0300-1234567"
                type="tel"
                required
              />
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
                        setFormData((p) => ({
                          ...p,
                          category: cat,
                          subCategory: "",
                        }));
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
                onClick={() =>
                  setSubCategoryDropdownOpen(!subCategoryDropdownOpen)
                }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            {/* Profile Picture Upload */}
            <div className="relative mb-6">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-between min-h-[80px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-semibold text-[#30B33D]">
                      Profile Picture
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      *
                    </span>
                    <label
                      htmlFor="profileUpload"
                      className="flex items-center justify-center w-5 h-5 bg-[#30B33D] rounded-full cursor-pointer shrink-0 ml-0.5"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3.5"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <input
                        id="profileUpload"
                        name="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <label
                    htmlFor="profileUpload2"
                    className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-gray-700"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Add Picture
                    <input
                      id="profileUpload2"
                      name="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-[11px] text-gray-400 mt-1">
                    {profilePicture ? profilePicture.name : "No file chosen"}
                  </p>
                </div>

                <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-[3px] border-white shrink-0 bg-gray-300 flex items-center justify-center -mr-2 shadow-md">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle cx="50" cy="35" r="18" fill="#9ca3af" />
                      <ellipse cx="50" cy="80" rx="28" ry="20" fill="#9ca3af" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* CNIC Front Upload */}
            <div className="relative mb-6">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-between min-h-[80px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-semibold text-[#30B33D]">
                      CNIC Front
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      *
                    </span>
                    <label
                      htmlFor="cnicFrontUpload"
                      className="flex items-center justify-center w-5 h-5 bg-[#30B33D] rounded-full cursor-pointer shrink-0 ml-0.5"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3.5"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <input
                        id="cnicFrontUpload"
                        name="cnicFront"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <label
                    htmlFor="cnicFrontUpload2"
                    className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-gray-700"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Add Document
                    <input
                      id="cnicFrontUpload2"
                      name="cnicFront"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-[11px] text-gray-400 mt-1">
                    {cnicFront ? cnicFront.name : "No file chosen"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* CNIC Back Upload */}
            <div className="relative mb-6">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-between min-h-[80px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-semibold text-[#30B33D]">
                      CNIC Back
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      *
                    </span>
                    <label
                      htmlFor="cnicBackUpload"
                      className="flex items-center justify-center w-5 h-5 bg-[#30B33D] rounded-full cursor-pointer shrink-0 ml-0.5"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3.5"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <input
                        id="cnicBackUpload"
                        name="cnicBack"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <label
                    htmlFor="cnicBackUpload2"
                    className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-gray-700"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Add Document
                    <input
                      id="cnicBackUpload2"
                      name="cnicBack"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-[11px] text-gray-400 mt-1">
                    {cnicBack ? cnicBack.name : "No file chosen"}
                  </p>
                </div>
              </div>
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

export default AddHouseHelpWorkerForm;
