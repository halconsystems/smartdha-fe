"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchMemberById } from "../../services/member-service";
import SuccessModal from "../shared/SuccessModal";
import Snackbar from "../shared/Snackbar";
import { registerNonMember } from "@/app/lib/api-client";

type FormData = {
  fullName: string;
  password: string;
  emailAddress: string;
  cellNumber: string;
  category: string;
  subCategory: string;
  purposeOfVisit: string;
  vehicleNoAlphabetic: string;
  vehicleNoNumeric: string;
  licensePlate: string;
  cnic: string;
  cnicFrontImage: File | null;
  cnicBackImage: File | null;
  profilePicture: File | null;
  proofOfPossession: File | null;
  serviceCardNumber: File | null;
  utilityBill: File | null;
};

const AddOthersForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    password: "",
    emailAddress: "",
    cellNumber: "",
    category: "Others",
    subCategory: "Please Specify",
    purposeOfVisit: "",
    vehicleNoAlphabetic: "",
    vehicleNoNumeric: "",
    licensePlate: "",
    cnic: "",
    cnicFrontImage: null,
    cnicBackImage: null,
    profilePicture: null,
    proofOfPossession: null,
    serviceCardNumber: null,
    utilityBill: null,
  });

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Redirect to residents list after success
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    window.location.href = "/residents";
  };

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
    const editData = localStorage.getItem("editOthersData");
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
                    const [platePart = "", numberPart = ""] = (member.vehicleInfo ?? "").split("-").map((part: string) => part.trim());
                    const vehicleNoAlphabetic = platePart.split(" ").pop() ?? "";
                    setFormData((prev) => ({
                      ...prev,
                      fullName: member.name ?? prev.fullName,
                      emailAddress: member.email ?? prev.emailAddress,
                      cellNumber: member.phone ?? prev.cellNumber,
                      category: categoryId,
                      subCategory: subCatObj ? subCatObj.id : "",
                      purposeOfVisit: member.purposeVisit ?? member.purposeOfVisit ?? prev.purposeOfVisit,
                      vehicleNoAlphabetic: vehicleNoAlphabetic || prev.vehicleNoAlphabetic,
                      vehicleNoNumeric: numberPart || prev.vehicleNoNumeric,
                      licensePlate: member.vehicleInfo ?? prev.licensePlate,
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
      console.error("Error parsing others edit data:", error);
    }
  }, [categories]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData((prev) => {
      if (type === "file") {
        return { ...prev, [name]: files && files.length > 0 ? files[0] : null };
      }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const fd = new window.FormData();
      // Map fields to API keys
      fd.append("Name", formData.fullName);
      fd.append("Password", formData.password);
      fd.append("Email", formData.emailAddress);
      fd.append("MobileNo", formData.cellNumber);
      fd.append("CategoryId", formData.category);
      fd.append("SubCategoryId", formData.subCategory);
      fd.append("PurposeVisit", formData.purposeOfVisit);
      fd.append("VehicleNumber", formData.licensePlate);
      fd.append("CNIC", formData.cnic);
      // File fields
      if (formData.cnicFrontImage) fd.append("CNICFrontImage", formData.cnicFrontImage);
      if (formData.cnicBackImage) fd.append("CNICBackImage", formData.cnicBackImage);
      if (formData.profilePicture) fd.append("ProfilePicture", formData.profilePicture);
      if (formData.proofOfPossession) fd.append("ProofOfPossession", formData.proofOfPossession);
      if (formData.serviceCardNumber) fd.append("ServiceCardNumber", formData.serviceCardNumber);
      if (formData.utilityBill) fd.append("UtilityBill", formData.utilityBill);
      // Add other fields as needed (ZoneId, PlotNo, etc.)
      if (isEditing) {
        // Get id from localStorage
        const editData = localStorage.getItem("editOthersData");
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
        await fetch("https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/update-member-type", {
          method: "POST",
          headers,
          body: fd,
        });
      } else {
        await registerNonMember(fd);
      }
      setSubmitStatus("success");
      setShowSuccessModal(true);
      localStorage.removeItem("editOthersData");
    } catch (err: any) {
      // Show only the 'detail' field if present, otherwise fallback to message or string
      let errorMsg = "Unknown error";
      if (err && typeof err === "object" && "detail" in err && typeof err.detail === "string") {
        errorMsg = err.detail;
      } else if (err?.message) {
        errorMsg = err.message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }
      errorMsg = String(errorMsg).trim();
      setSubmitStatus("error: " + errorMsg);
      setSnackbarMsg(errorMsg);
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("editOthersData");
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
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-black">
            Please provide other details below
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
          <div className={`grid gap-4 mb-4 ${isEditing ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}> 
            {!isEditing && (
              <FieldBox>
                <FieldLabel text="Password" required />
                <TextInput name="password" value={formData.password} placeholder="Password here" type="password" required />
              </FieldBox>
            )}
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
                onClick={() => setSubCategoryDropdownOpen(!subCategoryDropdownOpen)}
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

          {/* Row 4: Purpose of Visit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">

            <FieldBox>
              <FieldLabel text="Purpose of Visit" required />
              <TextInput
                name="purposeOfVisit"
                value={formData.purposeOfVisit}
                placeholder="Type here"
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

          {/* File Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="CNIC" required />
              <TextInput name="cnic" value={formData.cnic} placeholder="CNIC Number" required />
            </FieldBox>
            <FieldBox>
              <FieldLabel text="CNIC Front Image" />
              <input type="file" name="cnicFrontImage" accept="image/*" onChange={handleInputChange} />
            </FieldBox>
            <FieldBox>
              <FieldLabel text="CNIC Back Image" />
              <input type="file" name="cnicBackImage" accept="image/*" onChange={handleInputChange} />
            </FieldBox>
            <FieldBox>
              <FieldLabel text="Profile Picture" />
              <input type="file" name="profilePicture" accept="image/*" onChange={handleInputChange} />
            </FieldBox>
            <FieldBox>
              <FieldLabel text="Proof Of Possession" />
              <input type="file" name="proofOfPossession" accept="image/*,application/pdf" onChange={handleInputChange} />
            </FieldBox>
            <FieldBox>
              <FieldLabel text="Service Card Number (File)" />
              <input type="file" name="serviceCardNumber" accept="image/*,application/pdf" onChange={handleInputChange} />
            </FieldBox>
            <FieldBox>
              <FieldLabel text="Utility Bill" />
              <input type="file" name="utilityBill" accept="image/*,application/pdf" onChange={handleInputChange} />
            </FieldBox>
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

          {/* Submission Status & Success Modal */}
          {showSuccessModal && (
            <SuccessModal
              isOpen={showSuccessModal}
              onClose={handleSuccessClose}
              title="Success"
              message={isEditing ? "Update successful!" : "Registration successful!"}
            />
          )}
          <Snackbar
            open={snackbarOpen}
            message={snackbarMsg}
            onClose={() => setSnackbarOpen(false)}
            type="error"
          />
        </form>
      </div>
    </div>
  );
};

export default AddOthersForm;
