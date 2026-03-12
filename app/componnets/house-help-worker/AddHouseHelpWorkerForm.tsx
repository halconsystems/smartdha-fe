"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchMemberById } from "../../services/member-service";
import { registerNonMember } from "@/app/lib/api-client";
import SuccessModal from "../shared/SuccessModal";
import { useRouter } from "next/navigation";

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
  cnic: string;
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
    cnic: "",
  });

  // --- CATEGORY/SUBCATEGORY STATE ---
  type Category = { label: string; uuid: string; raw?: any };
  type SubCategory = { label: string; uuid: string };
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    import("@/app/lib/api-client").then(({ apiClient }) => {
      apiClient
        .get("/api/nonmember/get-nonmember-category")
        .then((res: any) => {
          const arr = Array.isArray(res) ? res : (res as any[]);
          if (Array.isArray(arr)) {
            setCategories(arr.map((item: any) => ({
              label: item.displayName || item.name,
              uuid: item.id,
              raw: item,
            })));
          } else {
            setCategories([]);
          }
        })
        .catch(() => setCategories([]));
    });
  }, []);

  // Prefill logic
  useEffect(() => {
    const editData = localStorage.getItem("editHouseHelpWorkerData");
    if (!editData || editData === "null" || editData.trim() === "") return;
    try {
      const parsed = JSON.parse(editData);
      if (parsed && parsed.id) {
        setIsEditing(true);
        fetchMemberById(parsed.id)
          .then((member) => {
            // Find category UUID by name
            const categoryObj = categories.find(cat => cat.label === member.category);
            const categoryId = categoryObj ? categoryObj.uuid : "";
            if (categoryId) {
              import("@/app/lib/api-client").then(({ apiClient }) => {
                apiClient.get(`/api/nonmember/get-nonmember-subcategory-bycategoryid?Id=${categoryId}`)
                  .then((subRes: any) => {
                    const arr = Array.isArray(subRes) ? subRes : (subRes as any[]);
                    setSubCategories(
                      arr.map((item: any) => ({
                        label: item.displayName || item.name,
                        uuid: item.id,
                      }))
                    );
                    const subCatObj = arr.find((sub: any) => (sub.displayName || sub.name) === member.subcategory);
                    setFormData((prev) => ({
                      ...prev,
                      fullName: member.name ?? prev.fullName,
                      emailAddress: member.email ?? prev.emailAddress,
                      cellNumber: member.phone ?? prev.cellNumber,
                      category: categoryId,
                      subCategory: subCatObj ? subCatObj.id : "",
                      cnic: member.cnic ?? prev.cnic,
                    }));
                  });
              });
            }
          })
          .catch((error) => {
            console.error("Failed to fetch member by id:", error);
          });
      }
    } catch (error) {
      console.error("Error parsing house help worker edit data:", error);
    }
  }, [categories]);

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

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string>("House help worker registered successfully.");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const fd = new window.FormData();
      fd.append("Name", formData.fullName);
      fd.append("Password", formData.password);
      fd.append("Email", formData.emailAddress);
      fd.append("MobileNo", formData.cellNumber);
      fd.append("CategoryId", formData.category);
      fd.append("SubCategoryId", formData.subCategory);
      if (formData.profilePicture) fd.append("ProfilePicture", formData.profilePicture);
      if (formData.cnicFront) fd.append("CNICFrontImage", formData.cnicFront);
      if (formData.cnicBack) fd.append("CNICBackImage", formData.cnicBack);
      fd.append("CNIC", formData.cnic);

      // Log all FormData values
      const formDataEntries: Record<string, any> = {};
      fd.forEach((value, key) => {
        formDataEntries[key] = value;
      });
      console.log("FormData values before API call:", formDataEntries);

      let result = null;
      if (isEditing) {
        // Get id from localStorage
        const editData = localStorage.getItem("editHouseHelpWorkerData");
        if (editData) {
          const parsed = JSON.parse(editData);
          if (parsed && parsed.id) {
            fd.append("Id", parsed.id);
          }
        }
        // Add Authorization header
        let headers: Record<string, string> = {};
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("authToken") || localStorage.getItem("accessToken") || "";
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }
        console.log("Calling UPDATE API", {
          url: "https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/update-member-type",
          headers,
          formData: fd
        });
        const response = await fetch("https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/update-member-type", {
          method: "POST",
          headers,
          body: fd,
        });
        console.log("Update API response", response);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Update API error", errorText);
          throw new Error(errorText || "Failed to update member");
        }
        result = await response.json().catch(() => ({}));
        setApiResult(result);
        console.log("Update API result", result);
      } else {
        console.log("Calling ADD API", {
          url: "registerNonMember",
          formData: fd
        });
        result = await registerNonMember(fd);
        setApiResult(result);
        console.log("Add API result", result);
      }
      setSubmitStatus("success");
      if (isEditing) {
        setSuccessMessage("House help worker updated successfully.");
      } else {
        setSuccessMessage("House help worker registered successfully.");
      }
      setShowSuccessModal(true);
      localStorage.removeItem("editHouseHelpWorkerData");
    } catch (err: any) {
      console.error("API call error", err);
      setSubmitStatus("error: " + (err.message || "Unknown error"));
      setApiResult(null);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("editHouseHelpWorkerData");
    window.history.back();
  };

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      import("@/app/lib/api-client").then(({ apiClient }) => {
        apiClient
          .get(`/api/nonmember/get-nonmember-subcategory-bycategoryid?Id=${formData.category}`)
          .then((res: any) => {
            const arr = Array.isArray(res) ? res : (res as any[]);
            if (Array.isArray(arr)) {
              setSubCategories(
                arr.map((item: any) => ({
                  label: item.displayName || item.name,
                  uuid: item.id,
                }))
              );
            } else {
              setSubCategories([]);
            }
          })
          .catch(() => setSubCategories([]));
      });
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

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
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-3">
          <p className="text-lg font-semibold text-black">
            {isEditing ? "Edit house help worker details" : "Please provide house help worker details below!"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Full Name + Email Address + Cell Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
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

          {/* Row 2: Password (only if not editing) + CNIC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
            {!isEditing && (
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
            )}
            <FieldBox>
              <FieldLabel text="CNIC" required />
              <TextInput
                name="cnic"
                value={formData.cnic}
                placeholder="Enter CNIC"
                required
              />
            </FieldBox>
          </div>

          {/* Row 3: Category + Sub-Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
            <FieldBox>
              <FieldLabel text="Category" required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <span
                  className={`text-sm ${formData.category ? "text-gray-700" : "text-gray-400"}`}
                >
                  {categories.length === 0
                    ? "Loading..."
                    : categories.find((cat) => cat.uuid === formData.category)?.label || "Select Category"}
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
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {categories.length === 0 ? (
                    <div className="px-4 py-2.5 text-sm text-gray-400">No categories found</div>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.uuid}
                        className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                        onClick={() => {
                          setFormData((p) => ({ ...p, category: cat.uuid, subCategory: "" }));
                          setCategoryDropdownOpen(false);
                        }}
                      >
                        {cat.label}
                      </div>
                    ))
                  )}
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
                  {subCategories.find((sub) => sub.uuid === formData.subCategory)?.label || "Select Type"}
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
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {subCategories.length === 0 ? (
                    <div className="px-4 py-2.5 text-sm text-gray-400">No subcategories found</div>
                  ) : (
                    subCategories.map((subCat) => (
                      <div
                        key={subCat.uuid}
                        className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                        onClick={() => {
                          setFormData((p) => ({ ...p, subCategory: subCat.uuid }));
                          setSubCategoryDropdownOpen(false);
                        }}
                      >
                        {subCat.label}
                      </div>
                    ))
                  )}
                </div>
              )}
            </FieldBox>
          </div>

          {/* Row 4: Profile Picture, CNIC Front, CNIC Back */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
            {/* Profile Picture Upload */}
            <div className="relative mb-1">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-2 flex items-center justify-between min-h-[60px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
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

                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {profilePicture ? profilePicture.name : "No file chosen"}
                  </p>
                </div>

                <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-[2px] border-white shrink-0 bg-gray-300 flex items-center justify-center -mr-2 shadow-md">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      width="32"
                      height="32"
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
            <div className="relative mb-1">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-2 flex items-center justify-between min-h-[60px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
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

                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {cnicFront ? cnicFront.name : "No file chosen"}
                  </p>
                </div>
              </div>
            </div>

            {/* CNIC Back Upload */}
            <div className="relative mb-1">
              <div className="bg-white border-2 border-dashed rounded-xl px-4 py-2 flex items-center justify-between min-h-[60px]">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
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

                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {cnicBack ? cnicBack.name : "No file chosen"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 rounded-xl bg-white text-[#30B33D] text-[15px] font-semibold cursor-pointer shadow-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 rounded-xl bg-[#30B33D] text-white text-[15px] font-semibold cursor-pointer shadow-md hover:bg-[#28a035] transition"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>

          {/* Submission Status */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              router.push("/residents");
            }}
            title={isEditing ? "Update Successful" : "Registration Successful"}
            message={successMessage}
          />
          {submitStatus && submitStatus.startsWith("error") && (
            <div className="mt-2 text-red-600 font-semibold">{submitStatus}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddHouseHelpWorkerForm;
