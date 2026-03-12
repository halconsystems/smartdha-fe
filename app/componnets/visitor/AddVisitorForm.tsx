"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchMemberById } from "../../services/member-service";
import SuccessModal from "../shared/SuccessModal";
import { useRouter } from "next/navigation";
import { registerNonMember } from "@/app/lib/api-client";

type FormData = {
  fullName: string;
  password: string;
  emailAddress: string;
  cellNumber: string;
  category: string;
  subCategory: string;
  destination: string;
  vehicleNoNumeric: string;
  vehicleNoAlphabetic: string;
  licensePlate: string;
  cnic: string;
};

interface AddVisitorFormProps {
  mode?: string;
  visitorId?: string;
}


type Category = { label: string; uuid: string; raw?: any };
type SubCategory = { label: string; uuid: string };
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
    cnic: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);



  useEffect(() => {
    const editData = localStorage.getItem("editResidentVisitorData");
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
                      destination: member.destination ?? member.Destination ?? prev.destination,
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
      console.error("Error parsing resident visitor edit data:", error);
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

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
      fd.append("Destination", formData.destination);
      fd.append("VehicleNumber", formData.licensePlate);
      fd.append("CNIC", formData.cnic);
      if (isEditing) {
        // Get id from localStorage
        const editData = localStorage.getItem("editResidentVisitorData");
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
      setShowSuccessModal(true);
      setSubmitStatus("success");
      localStorage.removeItem("editResidentVisitorData");
    } catch (err: any) {
      setSubmitStatus("error: " + (err.message || "Unknown error"));
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("editResidentVisitorData");
    window.history.back();
  };


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

          {/* Row 2.5: CNIC */}
            <div className={`grid gap-4 mb-4 ${isEditing ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
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

          {/* Submission Status */}
          {submitStatus && submitStatus.startsWith("error") && (
            <div className="mt-4 text-red-600 font-semibold">{submitStatus}</div>
          )}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              router.push("/residents");
            }}
            title={isEditing ? "Update Successful" : "Registration Successful"}
            message={isEditing ? "Visitor updated successfully." : "Visitor registered successfully."}
          />
        </form>
      </div>
    </div>
  );
};

export default AddVisitorForm;
