import { AdBoard } from "@/types/ad";
import React, { useState } from "react";

interface AdBoardFormProps {
  adBoard: AdBoard;
  onChange: (
    field: keyof AdBoard,
    value: string | number | boolean | File | null
  ) => void;
}

const AdBoardForm: React.FC<AdBoardFormProps> = ({ adBoard, onChange }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: keyof AdBoard, value: string | number | boolean) => {
    const newErrors = { ...errors };

    // Board Name validation
    if (field === "boardName" && !value) {
      newErrors.boardName = "Inventory name is required.";
    } else {
      delete newErrors.boardName;
    }

    // Location validation
    if (field === "location" && !value) {
      newErrors.location = "Location is required.";
    } else {
      delete newErrors.location;
    }

    // Daily Rate validation
    if (field === "dailyRate" && (Number(value) <= 0 || isNaN(Number(value)))) {
      newErrors.dailyRate = "Daily rate must be a positive number.";
    } else {
      delete newErrors.dailyRate;
    }

    // Owner Contact validation
    if (field === "ownerContact" && !/^\d{10}$/.test(value.toString())) {
      newErrors.ownerContact = "Contact must be a valid phone number.";
    } else {
      delete newErrors.ownerContact;
    }

    // Image validation
    if (field === "image" && !value) {
      newErrors.image = "Please upload an image less than 5MB.";
    } else {
      delete newErrors.image;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: keyof AdBoard, value: string | number | boolean) => {
    onChange(field, value);
    validateField(field, value); // Validate field when it changes
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        validateField("image", false);
      } else {
        validateField("image", true);
      }
    } else {
      validateField("image", false);
    }
    onChange("image", file);
  };

  return (
    <div className="space-y-4">
      {/* Board Name */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Inventory Name
        </label>
        <input
          type="text"
          placeholder="inventory name"
          value={adBoard.boardName}
          onChange={(e) => handleChange("boardName", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
        />
        {errors.boardName && <p className="text-red-500 text-sm">{errors.boardName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white" >
          Inventory Image (Max 5MB)
        </label>
        <input
          id="invImage"
          name="invImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border rounded-lg dark:bg-gray-700 bg-gray-100 border-gray-300 dark:border-gray-700 dark:text-gray-100"
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Location
        </label>
        <input
          type="text"
          placeholder="location"
          value={adBoard.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>

      {/* Board Type */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Board Type
        </label>
        <select
          value={adBoard.boardType}
          onChange={(e) => handleChange("boardType", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
        >
          <option value="Static">Static</option>
          <option value="Digital">Digital</option>
          <option value="Moving Digital">Moving Digital</option>
        </select>
        {errors.boardType && <p className="text-red-500 text-sm">{errors.boardType}</p>}
      </div>

      {/* Daily Rate */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Daily Rate (₹)
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-black dark:text-white">₹</span>
          <input
            type="number"
            value={adBoard.dailyRate}
            onChange={(e) => handleChange("dailyRate", parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
            placeholder="1500"
          />
        </div>
        {errors.dailyRate && <p className="text-red-500 text-sm">{errors.dailyRate}</p>}
      </div>

      {/* Owner Contact */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Contact
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-black dark:text-white">+91</span>
          <input
            type="text"
            value={adBoard.ownerContact}
            placeholder="mobile number"
            onChange={(e) => handleChange("ownerContact", e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
          />
        </div>
        {errors.ownerContact && <p className="text-red-500 text-sm">{errors.ownerContact}</p>}
      </div>
    </div>
  );
};

export default AdBoardForm;
