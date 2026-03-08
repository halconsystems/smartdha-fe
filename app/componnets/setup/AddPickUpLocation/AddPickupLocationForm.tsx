"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusButton from "../../ui/statusButton/StatusButton";

type PickupLocationStatus = "Active" | "Inactive";

type PickupLocationFormData = {
  zone: string;
  address: string;
  status: PickupLocationStatus;
};

type PickupLocationRecord = PickupLocationFormData & {
  id: string;
  createdAt: string;
};

const STORAGE_KEY = "pickupLocationsData";

const defaultFormData: PickupLocationFormData = {
  zone: "",
  address: "",
  status: "Active",
};

const AddPickupLocationForm: React.FC<{ mode?: "add" | "edit" }> = ({ mode = "add" }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [formData, setFormData] = useState<PickupLocationFormData>(defaultFormData);

  useEffect(() => {
    if (mode !== "edit") return;

    const editData = localStorage.getItem("editPickupLocationData");
    if (!editData) return;

    try {
      const parsed = JSON.parse(editData) as Partial<PickupLocationRecord>;
      setIsEditing(true);
      setFormData((prev) => ({
        ...prev,
        zone: parsed.zone ?? prev.zone,
        address: parsed.address ?? prev.address,
        status: parsed.status === "Inactive" ? "Inactive" : "Active",
      }));
    } catch (error) {
      console.error("Error parsing pickup location edit data:", error);
    }
  }, [mode]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isActive = formData.status === "Active";

  const toggleStatus = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
  }, []);

  const handleCancel = () => {
    localStorage.removeItem("editPickupLocationData");
    router.push("/setup");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const savedData = localStorage.getItem(STORAGE_KEY);
    const existingList: PickupLocationRecord[] = savedData ? JSON.parse(savedData) : [];

    if (isEditing) {
      const editData = localStorage.getItem("editPickupLocationData");
      const editId = editData ? (JSON.parse(editData) as PickupLocationRecord).id : null;

      const updatedList = existingList.map((item) =>
        item.id === editId
          ? {
              ...item,
              zone: formData.zone.trim(),
              address: formData.address.trim(),
              status: formData.status,
            }
          : item
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } else {
      const newRecord: PickupLocationRecord = {
        id: Date.now().toString(),
        zone: formData.zone.trim(),
        address: formData.address.trim(),
        status: formData.status,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify([newRecord, ...existingList]));
    }

    localStorage.removeItem("editPickupLocationData");
    router.push("/setup");
  };

  const FieldBox = useCallback(({ children }: { children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 relative">
      {children}
    </div>
  ), []);

  const FieldLabel = useCallback(
    ({ text, required = false }: { text: string; required?: boolean }) => (
      <label className="block text-xs font-semibold mb-1.5 text-[#30B33D]">
        {text} {required && <span className="text-red-500">*</span>}
      </label>
    ),
    []
  );

  return (
    <div className="w-full bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <div className="w-full mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-lg font-semibold text-black">
            {isEditing ? "Edit pickup location details" : "Please provide pickup location details below!"}
          </p>
       <StatusButton isActive={isActive} onToggle={toggleStatus} />
        </div>
    

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <FieldBox>
              <FieldLabel text="Zone" required />
              <input
                type="text"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                placeholder="Enter Zone (e.g. Zone 01)"
                required
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </FieldBox>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <FieldBox>
              <FieldLabel text="Address" required />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter complete pickup address"
                required
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </FieldBox>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="max-w-sm w-full py-3 rounded-xl bg-white text-[#30B33D] text-[15px] font-semibold cursor-pointer shadow-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="max-w-sm w-full py-3 rounded-xl bg-[#30B33D] text-white text-[15px] font-semibold cursor-pointer shadow-md hover:bg-[#28a035] transition"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default AddPickupLocationForm;
