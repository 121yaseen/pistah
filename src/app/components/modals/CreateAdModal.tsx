"use client";

import React, { useState, useEffect } from "react";

type CreateAdModalProps = {
  onClose: () => void;
};

const CreateAdModal: React.FC<CreateAdModalProps> = ({ onClose }) => {
  const [adData, setAdData] = useState({
    id: Date.now(),
    title: "",
    downloadLink: "",
    adBoardId: "",
    adDisplayStartDate: "",
    adDisplayEndDate: "",
    adDuration: "",
    thumbnailFile: null as File | null,
  });

  const [adBoards, setAdBoards] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState({
    title: false,
    downloadLink: false,
    adBoardId: false,
    adDisplayStartDate: false,
    adDisplayEndDate: false,
    adDuration: false,
    thumbnailFile: false,
  });

  useEffect(() => {
    const fetchAdBoards = async () => {
      try {
        const response = await fetch("/api/adBoard");
        const data = await response.json();
        const adBoards = data.map(
          (board: { id: number; boardName: string }) => ({
            id: board.id,
            name: board.boardName,
          })
        );
        setAdBoards(adBoards);
      } catch (err) {
        console.error("Error fetching ad boards:", err);
      }
    };

    fetchAdBoards();
  }, []);

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: true }));
      } else {
        setAdData((prevData) => ({ ...prevData, thumbnailFile: file }));
        setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: false }));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAdData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors = {
      title: adData.title.trim() === "",
      downloadLink: !validateURL(adData.downloadLink),
      adBoardId: adData.adBoardId === "",
      adDisplayStartDate: adData.adDisplayStartDate === "",
      adDisplayEndDate: adData.adDisplayEndDate === "",
      adDuration:
        isNaN(Number(adData.adDuration)) || Number(adData.adDuration) <= 0,
      thumbnailFile: !adData.thumbnailFile || errors.thumbnailFile,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const formData = new FormData();
    formData.append("title", adData.title);
    formData.append("downloadLink", adData.downloadLink);
    formData.append("adBoardId", adData.adBoardId);
    formData.append("adDisplayStartDate", adData.adDisplayStartDate);
    formData.append("adDisplayEndDate", adData.adDisplayEndDate);
    formData.append("adDuration", adData.adDuration);
    if (adData.thumbnailFile) {
      formData.append("thumbnail", adData.thumbnailFile);
    }

    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Ad successfully created");
        onClose();
      } else {
        console.error("Failed to create ad.");
      }
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Ad</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={adData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Enter ad title"
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">Title is required</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="downloadLink"
            >
              Download Link
            </label>
            <input
              id="downloadLink"
              name="downloadLink"
              type="url"
              value={adData.downloadLink}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.downloadLink ? "border-red-500" : ""
              }`}
              placeholder="Enter download link"
              required
            />
            {errors.downloadLink && (
              <p className="text-red-500 text-sm mt-1">
                Invalid download link URL
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="thumbnail"
            >
              Upload Thumbnail (Max 5MB)
            </label>
            <input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {errors.thumbnailFile && (
              <p className="text-red-500 text-sm mt-1">
                Please upload an image less than 5MB
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="adBoardId"
            >
              Ad Board
            </label>
            <select
              id="adBoardId"
              name="adBoardId"
              value={adData.adBoardId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.adBoardId ? "border-red-500" : ""
              }`}
              required
            >
              <option value="" disabled>
                Select an ad board
              </option>
              {adBoards.map((board) => (
                <option key={board.id} value={board.id.toString()}>
                  {board.name}
                </option>
              ))}
            </select>
            {errors.adBoardId && (
              <p className="text-red-500 text-sm mt-1">
                Ad board selection is required
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="adDisplayStartDate"
            >
              Display Start Date
            </label>
            <input
              id="adDisplayStartDate"
              name="adDisplayStartDate"
              type="date"
              value={adData.adDisplayStartDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.adDisplayStartDate ? "border-red-500" : ""
              }`}
              required
            />
            {errors.adDisplayStartDate && (
              <p className="text-red-500 text-sm mt-1">
                Start date is required
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="adDisplayEndDate"
            >
              Display End Date
            </label>
            <input
              id="adDisplayEndDate"
              name="adDisplayEndDate"
              type="date"
              value={adData.adDisplayEndDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.adDisplayEndDate ? "border-red-500" : ""
              }`}
              required
            />
            {errors.adDisplayEndDate && (
              <p className="text-red-500 text-sm mt-1">End date is required</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="adDuration"
            >
              Ad Duration (seconds)
            </label>
            <input
              id="adDuration"
              name="adDuration"
              type="number"
              value={adData.adDuration}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                errors.adDuration ? "border-red-500" : ""
              }`}
              placeholder="Enter ad duration in seconds"
              required
            />
            {errors.adDuration && (
              <p className="text-red-500 text-sm mt-1">
                Enter a positive number
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Create Ad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdModal;
