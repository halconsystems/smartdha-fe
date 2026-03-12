"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchMemberById } from "../../services/member-service";
import { registerNonMember } from "@/app/lib/api-client";
import SuccessModal from "../shared/SuccessModal";
import Snackbar from "../shared/Snackbar";
import { useRouter } from "next/navigation";

type FormData = {
  fullName: string;
  password: string;
  emailAddress: string;
  cellNumber: string;
  category: string;
  subCategory: string;
  selectInstitute: string;
  vehicleNoAlphabetic: string;
  vehicleNoNumeric: string;
  licensePlate: string;
  profilePicture: File | null;
  cnic: string;
};

const AddEducationalVisitorForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState<boolean>(false);
  const [instituteDropdownOpen, setInstituteDropdownOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    password: "",
    emailAddress: "",
    cellNumber: "",
    category: "",
    subCategory: "",
    selectInstitute: "",
    vehicleNoAlphabetic: "",
    vehicleNoNumeric: "",
    licensePlate: "",
    profilePicture: null,
    cnic: "",
  });

  // --- CATEGORY/SUBCATEGORY STATE ---
  // (Removed duplicate Category and SubCategory type declarations)
  // (Keep only the useState declarations below, remove this block)

  // (Removed duplicate fetch categories useEffect)

  // --- CATEGORY/SUBCATEGORY STATE ---
  type Category = { label: string; uuid: string; raw?: any };
  type SubCategory = { label: string; uuid: string };
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Prefill logic
  useEffect(() => {
    const editData = localStorage.getItem("editEducationalVisitorData");
    if (!editData) return;
    try {
      const parsed = JSON.parse(editData);
      if (parsed && parsed.id) {
        setIsEditing(true);
        fetchMemberById(parsed.id)
          .then(async (member) => {
            // Find category UUID by name
            const categoryObj = categories.find(cat => cat.label === member.category);
            const categoryId = categoryObj ? categoryObj.uuid : "";
            if (categoryId) {
              const { apiClient } = await import("@/app/lib/api-client");
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
                  // Parse vehicle info if present
                  const [platePart = "", numberPart = ""] = (member.vehicleInfo ?? "").split("-").map((part: string) => part.trim());
                  const vehicleNoAlphabetic = platePart.split(" ").pop() ?? "";
                  setFormData((prev) => ({
                    ...prev,
                    fullName: member.name ?? prev.fullName,
                    emailAddress: member.email ?? prev.emailAddress,
                    cellNumber: member.phone ?? prev.cellNumber,
                    category: categoryId,
                    subCategory: subCatObj ? subCatObj.id : "",
                    selectInstitute: member.instituteName ?? member.institute ?? prev.selectInstitute,
                    vehicleNoAlphabetic: vehicleNoAlphabetic || prev.vehicleNoAlphabetic,
                    vehicleNoNumeric: numberPart || prev.vehicleNoNumeric,
                    licensePlate: member.vehicleInfo ?? prev.licensePlate,
                    cnic: member.cnic ?? prev.cnic,
                  }));
                });
            }
          })
          .catch((error) => {
            console.error("Failed to fetch member by id:", error);
          });
      }
    } catch (error) {
      console.error("Error parsing educational visitor edit data:", error);
    }
  }, [categories]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fieldName = e.target.name;
      
      if (fieldName === 'profilePicture') {
        setProfilePicture(file);
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
      
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [curlCommand, setCurlCommand] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type?: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });
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
      fd.append("InstituteName", formData.selectInstitute);
      fd.append("VehicleNumber", formData.licensePlate);
      fd.append("CNIC", formData.cnic);
      if (formData.profilePicture) fd.append("ProfilePicture", formData.profilePicture);

      let isEdit = isEditing;
      let editId = null;
      if (isEdit) {
        const editData = localStorage.getItem("editEducationalVisitorData");
        if (editData) {
          const parsed = JSON.parse(editData);
          if (parsed && parsed.id) {
            editId = parsed.id;
            fd.append("Id", editId);
          }
        }
      }

      // Generate cURL command
      let curl = isEdit
        ? 'curl -X POST https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/update-member-type \\\n  -H "Content-Type: multipart/form-data"'
        : 'curl -X POST https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/register-nonmember \\\n  -H "Content-Type: multipart/form-data"';
      const fields = [
        ["Name", formData.fullName],
        ["Password", formData.password],
        ["Email", formData.emailAddress],
        ["MobileNo", formData.cellNumber],
        ["CategoryId", formData.category],
        ["SubCategoryId", formData.subCategory],
        ["InstituteName", formData.selectInstitute],
        ["VehicleNumber", formData.licensePlate],
        ["CNIC", formData.cnic],
      ];
      if (isEdit && editId) fields.push(["Id", editId]);
      fields.forEach(([key, value]) => {
        if (value) curl += ` \\\n  -F \"${key}=${value}\"`;
      });
      if (formData.profilePicture) {
        curl += ` \\\n  -F \"ProfilePicture=@/path/to/file.jpg\"`;
      }
      setCurlCommand(curl);

      let headers: Record<string, string> = {};
      if (typeof window !== "undefined") {
        let token = localStorage.getItem("authToken") || localStorage.getItem("accessToken") || "";
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      let response;
      if (isEdit && editId) {
        response = await fetch("https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/update-member-type", {
          method: "POST",
          headers,
          body: fd,
        });
      } else {
        response = await fetch("https://dfpwebp.dhakarachi.org/api/smartdha/nonmemberregistration/register-nonmember", {
          method: "POST",
          body: fd,
        });
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || (isEdit ? "Failed to update educational visitor" : "Failed to register educational visitor"));
      }
      const data = await response.json();
      let message = isEdit ? "Update successful!" : "Registration successful.";
      if (isEdit) {
        message = "Educational visitor updated successfully.";
      } else {
        message = "Educational visitor registered successfully.";
      }
      if (data && typeof data === "object") {
        if (data.message) message = data.message;
        else if (data.data && typeof data.data === "object" && data.data.message) message = data.data.message;
      }
      setShowSuccessModal(true);
      setSubmitStatus("success");
      setSnackbar({ open: true, message, type: "success" });
      setCurlCommand("");
      localStorage.removeItem("editEducationalVisitorData");
    } catch (err: any) {
      let message = "An error occurred.";
      if (err?.message) message = err.message;
      setSubmitStatus("error");
      setSnackbar({ open: true, message, type: "error" });
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("editEducationalVisitorData");
    window.history.back();
  };

  // ...existing code...

  // Fetch categories on mount
  useEffect(() => {
    import("@/app/lib/api-client").then(({ apiClient }) => {
      apiClient
        .get("/api/nonmember/get-nonmember-category")
        .then((res) => {
          const arr = Array.isArray(res) ? res : (res as any[]);
          if (Array.isArray(arr)) {
            setCategories(
              arr.map((item: any) => ({
                label: item.displayName || item.name,
                uuid: item.id,
                raw: item,
              }))
            );
          } else {
            setCategories([]);
          }
        })
        .catch(() => setCategories([]));
    });
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      import("@/app/lib/api-client").then(({ apiClient }) => {
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
      });
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);
  const institutes: string[] = ["Institute 1", "Institute 2", "Institute 3", "Institute 4"];

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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-black">
            {isEditing ? "Edit educational visitor details" : "Please provide educational visitor details below!"}
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

          {/* Row 2: Cell Number + CNIC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Cell Number" required />
              <TextInput name="cellNumber" value={formData.cellNumber} placeholder="0300-1234567" type="tel" required />
            </FieldBox>
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

          {/* Row 4: Select Institute */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Select Institute" required />
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setInstituteDropdownOpen(!instituteDropdownOpen)}
              >
                <span className={`text-sm ${formData.selectInstitute ? "text-gray-700" : "text-gray-400"}`}>
                  {formData.selectInstitute || "Select here"}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {instituteDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1 shadow-lg">
                  {institutes.map((institute) => (
                    <div
                      key={institute}
                      className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setFormData((p) => ({ ...p, selectInstitute: institute }));
                        setInstituteDropdownOpen(false);
                      }}
                    >
                      {institute}
                    </div>
                  ))}
                </div>
              )}
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

         
                  {/* Profile Picture Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          {/* Snackbar for API responses */}
          <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            type={snackbar.type}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          />
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              setCurlCommand("");
              router.push("/residents");
            }}
            title={isEditing ? "Update Successful" : "Registration Successful"}
            message={isEditing ? "Educational visitor updated successfully." : "Educational visitor registered successfully."}
          />
        </form>
      </div>
    </div>
  );
};

export default AddEducationalVisitorForm;
