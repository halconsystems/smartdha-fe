"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchMemberById } from "../../services/member-service";
import SuccessModal from "../shared/SuccessModal";
import Snackbar from "../shared/Snackbar";
import { registerNonMember } from "@/app/lib/api-client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiClient } from "@/app/lib/api-client";

type FormData = {
  fullName: string;
  password: string;
  emailAddress: string;
  cellNumber: string;
  category: string;
  subCategory: string;
  employerRegistrationNo: string;
  profilePicture: File | null;
  serviceCardDocument: File | null;
  cnic: string;
};

type SubCategory = { label: string; uuid: string };

type Category = { label: string; uuid: string; raw?: any };

const AddCommercialEmployeeForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [serviceCardDocument, setServiceCardDocument] = useState<File | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState<boolean>(false);
  const [employerDropdownOpen, setEmployerDropdownOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    password: "",
    emailAddress: "",
    cellNumber: "",
    category: "",
    subCategory: "",
    employerRegistrationNo: "",
    profilePicture: null,
    serviceCardDocument: null,
    cnic: "",
  });


  // Move categories and subCategories state declarations above this useEffect
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const editData = localStorage.getItem("editCommercialEmployeeData");
    if (!editData) return;
    try {
      const parsed = JSON.parse(editData);
      if (parsed && parsed.id) {
        setIsEditing(true);
        fetchMemberById(parsed.id)
          .then((member) => {
            // Find category UUID by name
            const categoryObj = categories.find(cat => cat.label === member.category);
            const categoryId = categoryObj ? categoryObj.uuid : "";
            // Always use the value from API, even if 0 or falsy
            const employerRegNo = member.employeeRegistrationNumber !== undefined ? String(member.employeeRegistrationNumber) : "";
            if (categoryId) {
              apiClient.get(`/api/nonmember/get-nonmember-subcategory-bycategoryid?Id=${categoryId}`)
                .then((subRes) => {
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
                    employerRegistrationNo: employerRegNo,
                  }));
                });
            } else {
              setFormData((prev) => ({
                ...prev,
                fullName: member.name ?? prev.fullName,
                emailAddress: member.email ?? prev.emailAddress,
                cellNumber: member.phone ?? prev.cellNumber,
                employerRegistrationNo: employerRegNo,
              }));
            }
          })
          .catch((error) => {
            console.error("Failed to fetch member by id:", error);
          });
      }
    } catch (error) {
      console.error("Error parsing commercial employee edit data:", error);
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
      } else if (fieldName === 'serviceCardDocument') {
        setServiceCardDocument(file);
      }
      
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [curlCommand, setCurlCommand] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });

  const router = useRouter();


  // For debugging: preview the FormData payload before submit
  const [formDataPreview, setFormDataPreview] = useState<any[]>([]);

  const buildFormData = () => {
    const fd = new window.FormData();
    fd.append("Name", formData.fullName);
    fd.append("Password", formData.password);
    fd.append("Email", formData.emailAddress);
    fd.append("MobileNo", formData.cellNumber);
    fd.append("CategoryId", formData.category);
    fd.append("SubCategoryId", formData.subCategory);
    fd.append("employeeRegistrationNumber", String(formData.employerRegistrationNo ?? ""));
    fd.append("CNIC", formData.cnic);
    if (formData.profilePicture) fd.append("ProfilePicture", formData.profilePicture);
    if (formData.serviceCardDocument) fd.append("ServiceCardDocument", formData.serviceCardDocument);
    let isEdit = isEditing;
    let editId = null;
    if (isEdit) {
      const editData = localStorage.getItem("editCommercialEmployeeData");
      if (editData) {
        const parsed = JSON.parse(editData);
        if (parsed && parsed.id) {
          fd.append("Id", parsed.id);
          editId = parsed.id;
        }
      }
    }
    return fd;
  };

  // Update preview whenever formData changes
  useEffect(() => {
    const fd = buildFormData();
    const arr: any[] = [];
    for (const pair of fd.entries()) {
      arr.push({ key: pair[0], value: pair[1] });
    }
    setFormDataPreview(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, profilePicture, serviceCardDocument, isEditing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const fd = buildFormData();

      // ...existing code for cURL and API call...
      let isEdit = isEditing;
      let editId = null;
      if (isEdit) {
        const editData = localStorage.getItem("editCommercialEmployeeData");
        if (editData) {
          const parsed = JSON.parse(editData);
          if (parsed && parsed.id) {
            editId = parsed.id;
          }
        }
      }

      let curl = isEdit
        ? 'curl -X POST https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/update-member-type \\n  -H "Content-Type: multipart/form-data"'
        : 'curl -X POST https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/register-nonmember \\n  -H "Content-Type: multipart/form-data"';
      const fields = [
        ["Name", formData.fullName],
        ["Password", formData.password],
        ["Email", formData.emailAddress],
        ["MobileNo", formData.cellNumber],
        ["CategoryId", formData.category],
        ["SubCategoryId", formData.subCategory],
        ["employeeRegistrationNumber", String(formData.employerRegistrationNo ?? "")],
        ["CNIC", formData.cnic],
      ];
      if (isEdit && editId) fields.push(["Id", editId]);
      fields.forEach(([key, value]) => {
        if (value) curl += ` \\n  -F \"${key}=${value}\"`;
      });
      if (formData.profilePicture) {
        curl += ` \\n  -F \"ProfilePicture=@/path/to/file.jpg\"`;
      }
      if (formData.serviceCardDocument) {
        curl += ` \\n  -F \"ServiceCardDocument=@/path/to/servicecard.pdf\"`;
      }
      setCurlCommand(curl);

      if (isEdit) {
        let headers: Record<string, string> = {};
        if (typeof window !== "undefined") {
          let token = localStorage.getItem("authToken") || localStorage.getItem("accessToken") || "";
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }
        await fetch("https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/update-member-type", {
          method: "POST",
          headers,
          body: fd,
        });
      } else {
        await registerNonMember(fd);
      }
      setShowSuccessModal(true);
      setSubmitStatus("success");
      setSnackbar({ open: true, message: isEdit ? "Update successful!" : "Registration successful!", type: "success" });
      setCurlCommand("");
      localStorage.removeItem("editCommercialEmployeeData");
    } catch (err: any) {
      let message = "Unknown error";
      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.detail) {
            message = parsed.detail;
          } else if (parsed && parsed.title) {
            message = parsed.title;
          } else {
            message = err.message;
          }
        } catch {
          message = err.message;
        }
      }
      setSubmitStatus("error: " + message);
      setSnackbar({ open: true, message, type: "error" });
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("editCommercialEmployeeData");
    window.history.back();
  };

  // Fetch categories from API
  // (Removed duplicate declaration here)

  // Helper to get auth token and cookie (match api-client logic)
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      // Try to match api-client logic: check localStorage, sessionStorage, and cookies
      let token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
      if (!token && document.cookie) {
        // Try to extract token from cookies if present
        const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
        if (match) token = decodeURIComponent(match[1]);
      }
      return token;
    }
    return "";
  };

  // Fetch categories on mount using apiClient (inherits auth/interceptors)
  useEffect(() => {
    apiClient
      .get("/api/nonmember/get-nonmember-category")
      .then((res) => {
        // Log the full response for debugging
        // eslint-disable-next-line no-console
        console.log("Full categories API response:", res);
        const arr = Array.isArray(res) ? res : (res as any[]);
        if (Array.isArray(arr)) {
          const mapped = arr.map((item: any) => ({
            label: item.displayName || item.name,
            uuid: item.id,
            raw: item,
          }));
          setCategories(mapped);
          // Debug: log categories to verify mapping
          // eslint-disable-next-line no-console
          console.log("Mapped categories:", mapped);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        setCategories([]);
        // eslint-disable-next-line no-console
        console.error("Failed to fetch categories", err);
        if (err?.response) {
          // eslint-disable-next-line no-console
          console.error("Error response data:", err.response.data);
        }
      });
  }, []);
  const employerRegistrations: string[] = [
    "REG-001", "REG-002", "REG-003", "REG-004", "REG-005"
  ];

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

  // Fetch subcategories when category changes using apiClient
  useEffect(() => {
    if (formData.category) {
      apiClient
        .get(`/api/nonmember/get-nonmember-subcategory-bycategoryid?Id=${formData.category}`)
        .then((res) => {
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
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-black">
            {isEditing ? "Edit commercial employee details" : "Please provide commercial employee details below!"}
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
          {!isEditing ? (
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
          ) : (
            <div className="mb-4">
              <FieldBox>
                <FieldLabel text="Add Cell Number" required />
                <TextInput name="cellNumber" value={formData.cellNumber} placeholder="0300-1234567" type="tel" required />
              </FieldBox>
            </div>
          )}

          {/* Row 2.5: CNIC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="CNIC" required />
              <TextInput name="cnic" value={formData.cnic} placeholder="Enter CNIC" required />
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
                <span className={`text-sm ${formData.category ? "text-gray-700" : "text-gray-400"}`}>
                  {categories.length === 0
                    ? "Loading..."
                    : categories.find((cat) => cat.uuid === formData.category)?.label || "Select Category"}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
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
                onClick={() => setSubCategoryDropdownOpen(!subCategoryDropdownOpen)}
              >
                <span className={`text-sm ${formData.subCategory ? "text-gray-700" : "text-gray-400"}`}>
                  {subCategories.find((sub) => sub.uuid === formData.subCategory)?.label || "Select Type"}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {subCategoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {subCategories.map((subCat) => (
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
                  ))}
                </div>
              )}
            </FieldBox>
          </div>

          {/* Row 4: Employer Registration No. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Select Employer Registration No." required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setEmployerDropdownOpen(!employerDropdownOpen)}
              >
                <span className={`text-sm ${formData.employerRegistrationNo ? "text-gray-700" : "text-gray-400"}`}>
                  {formData.employerRegistrationNo || "Select here"}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {employerDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {employerRegistrations.map((reg) => (
                    <div
                      key={reg}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, employerRegistrationNo: reg }));
                        setEmployerDropdownOpen(false);
                      }}
                    >
                      {reg}
                    </div>
                  ))}
                </div>
              )}
            </FieldBox>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Profile Picture Upload */}
          <div className="relative mb-6">
            <div className="bg-white border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-between min-h-[80px]">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-semibold text-[#30B33D]">Profile Picture</span>
                  <span className="text-xs font-semibold text-red-500">*</span>
                  <label
                    htmlFor="profileUpload"
                    className="flex items-center justify-center w-5 h-5 bg-[#30B33D] rounded-full cursor-pointer shrink-0 ml-0.5"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
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
                  <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="35" r="18" fill="#9ca3af" />
                    <ellipse cx="50" cy="80" rx="28" ry="20" fill="#9ca3af" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Service Card / Employee Letter Upload */}
          <div className="relative mb-6">
            <div className="bg-white border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-between min-h-[80px]">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-semibold text-[#30B33D]">Service Card / Employee Letter</span>
                  <span className="text-xs font-semibold text-red-500">*</span>
                  <label
                    htmlFor="serviceCardUpload"
                    className="flex items-center justify-center w-5 h-5 bg-[#30B33D] rounded-full cursor-pointer shrink-0 ml-0.5"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <input
                      id="serviceCardUpload"
                      name="serviceCardDocument"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <label
                  htmlFor="serviceCardUpload2"
                  className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-gray-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                  Add Document
                  <input
                    id="serviceCardUpload2"
                    name="serviceCardDocument"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <p className="text-[11px] text-gray-400 mt-1">
                  {serviceCardDocument ? serviceCardDocument.name : "No file chosen"}
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

          {/* Submission Status */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              setCurlCommand("");
              router.push("/residents");
            }}
            title={isEditing ? "Update Successful" : "Registration Successful"}
            message={isEditing ? "Member updated successfully." : "Member registered successfully."}
          />
          <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            type={snackbar.type}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          />
        {/* Debug: Show FormData payload before submit */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="font-semibold mb-2 text-gray-700">FormData Payload Preview:</div>
          <ul className="text-xs text-gray-800">
            {formDataPreview.map((item, idx) => (
              <li key={idx}><b>{item.key}:</b> {item.value instanceof File ? item.value.name : String(item.value)}</li>
            ))}
          </ul>
        </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommercialEmployeeForm;
