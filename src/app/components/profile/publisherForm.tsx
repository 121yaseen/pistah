import { AdBoard } from "@/types/ad";
import React, { useState } from "react";
import Image from "next/image";
import UploadIcon from "@/icons/uploadIcon";

interface AdBoardFormProps {
  adBoard: AdBoard;
  onChange: (
    field: keyof AdBoard,
    value: string | number | boolean | File[] | null | string[]
  ) => void;
}

const AdBoardForm: React.FC<AdBoardFormProps> = ({ adBoard, onChange }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (
    field: keyof AdBoard,
    value: string | number | boolean
  ) => {
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
      newErrors.dailyRate = "Enter a positive number.";
    } else {
      delete newErrors.dailyRate;
    }

    // Owner Contact validation
    if (field === "ownerContact" && !/^\d{10}$/.test(value.toString())) {
      newErrors.ownerContact = "Enter a valid phone number.";
    } else {
      delete newErrors.ownerContact;
    }

    // Image validation
    if (field === "images" && !value) {
      newErrors.image = "Upload an image less than 5MB.";
    } else {
      delete newErrors.image;
    }

    setErrors(newErrors);
  };

  const handleChange = (
    field: keyof AdBoard,
    value: string | number | boolean
  ) => {
    onChange(field, value);
    validateField(field, value); // Validate field when it changes
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length < files.length) {
      setErrors((prev) => ({
        ...prev,
        image: "Some files were skipped because they exceed 5MB",
      }));
    } else {
      delete errors.image;
    }

    // Combine existing files with new ones
    const newFiles = [...(adBoard.images || []), ...validFiles];
    onChange("images", newFiles);
  };

  const removeImage = (index: number) => {
    const newImages = [...(adBoard.images || [])];
    newImages.splice(index, 1);
    onChange("images", newImages);
  };

  return (
    <div className="space-y-4">
      {/* Board Name */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Inventory Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Inventory name"
          value={adBoard.boardName}
          onChange={(e) => handleChange("boardName", e.target.value)}
          className={`w-full p-3 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
            errors.boardName ? "border-red-500" : ""
          }`}
        />
        {errors.boardName && (
          <p className="text-red-500 text-sm">{errors.boardName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Inventory Images (max 5MB each)<span className="text-red-500">*</span>
        </label>
        <label
          className={`cursor-pointer block p-3 border-2 rounded-lg mr-10 py-2 px-4 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-gray-300 dark:border-gray-700 ${
            errors.image ? "border-red-500" : ""
          }`}
          htmlFor="invImage"
          style={{ width: "145px" }}
        >
          <div className="flex items-center">
            <UploadIcon /> &nbsp;Add Images{" "}
          </div>
        </label>
        <input
          id="invImage"
          name="invImage"
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleFileChange(e);
            e.target.value = "";
          }}
          multiple
          className="hidden"
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

        <div className="mt-2 grid grid-cols-4 gap-4">
          {/* Show existing images from imageUrls */}
          {adBoard.imageUrl?.map((url, index) => (
            <div key={`existing-${index}`} className="relative w-34">
              <div className="relative w-34 h-32 rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Inventory image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <button
                onClick={() => {
                  const newUrls = [...(adBoard.imageUrl || [])];
                  newUrls.splice(index, 1);
                  onChange("imageUrl", newUrls);
                }}
                className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
              >
                ×
              </button>
            </div>
          ))}

          {/* Show newly added images */}
          {adBoard.images?.map((file, index) => (
            <div key={`new-${index}`} className="relative w-34">
              <div className="relative w-34 h-32 rounded-lg overflow-hidden">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`New inventory image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <i className="text-gray-500 block text-sm">
          Add more images to let your inventory standout (maximum of 7)
        </i>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Location<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="location"
          value={adBoard.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className={`w-full p-3 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
            errors.location ? "border-red-500" : ""
          }`}
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}
      </div>

      {/* Board Type */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Board Type<span className="text-red-500">*</span>
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
        {errors.boardType && (
          <p className="text-red-500 text-sm">{errors.boardType}</p>
        )}
      </div>

      {/* Daily Rate */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Daily Rate<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-black dark:text-white">₹</span>
          <input
            type="number"
            value={adBoard.dailyRate}
            onChange={(e) =>
              handleChange("dailyRate", parseFloat(e.target.value ?? 0))
            }
            className={`w-full p-3 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
              errors.dailyRate ? "border-red-500" : ""
            }`}
            placeholder="enter daily rate"
          />
        </div>
        {errors.dailyRate && (
          <p className="text-red-500 text-sm">{errors.dailyRate}</p>
        )}
      </div>

      {/* Owner Contact */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Contact<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-black dark:text-white">+91</span>
          <input
            type="text"
            value={adBoard.ownerContact}
            placeholder="mobile number"
            onChange={(e) => handleChange("ownerContact", e.target.value)}
            className={`w-full p-3 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
              errors.ownerContact ? "border-red-500" : ""
            }`}
          />
        </div>
        {errors.ownerContact && (
          <p className="text-red-500 text-sm">{errors.ownerContact}</p>
        )}
      </div>
    </div>
  );
};

export default AdBoardForm;
