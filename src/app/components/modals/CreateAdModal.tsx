"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import Loader from "../shared/LoaderComponent";
import DateRangePicker from "../shared/DateRangePicker";
import axios from "axios";
import UploadIcon from "@/icons/uploadIcon";
import Image from "next/image";
import VideoUploadIcon from "@/icons/videoUploadIcon";
import VideoIcon from "@/icons/videoIcon";
import { Ad } from "@/types/ad";

type CreateAdModalProps = {
  onClose: () => void;
  editMode: boolean;
  adToEdit: Ad | null;
};

const CreateAdModal: React.FC<CreateAdModalProps> = ({
  onClose,
  editMode = false,
  adToEdit = null,
}) => {
  const [activeTab, setActiveTab] = useState<"download" | "video">("download");
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); // Progress state

  useEffect(() => {
    if (editMode && adToEdit) {
      setAdData({
        id: adToEdit.id,
        title: adToEdit.title,
        downloadLink: adToEdit.downloadLink || "",
        adBoardId: adToEdit.adBoardId.toString(),
        adDisplayStartDate: adToEdit.adDisplayStartDate,
        adDisplayEndDate: adToEdit.adDisplayEndDate,
        adDuration: adToEdit.adDuration,
        thumbnailUrl: adToEdit.thumbnailUrl ?? "",
        videoUrl: adToEdit.videoUrl || "",
        remarks: adToEdit.remarks ?? "",
        thumbnailFile: null,
        videoFile: null,
        createdById: adToEdit.createdById, // Ensure createdById is included
      });

      // Set dates if they exist
      if (adToEdit.adDisplayStartDate) {
        setStartDate(new Date(adToEdit.adDisplayStartDate));
      }
      if (adToEdit.adDisplayEndDate) {
        setEndDate(new Date(adToEdit.adDisplayEndDate));
      }
    }
  }, [editMode, adToEdit]);

  const [adData, setAdData] = useState({
    id: "",
    title: "",
    downloadLink: "",
    adBoardId: "",
    adDisplayStartDate: "",
    adDisplayEndDate: "",
    adDuration: "",
    thumbnailFile: null as File | null,
    videoFile: null as File | null,
    remarks: "",
    thumbnailUrl: "",
    videoUrl: "",
    createdById: "", // Ensure createdById is included
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [adBoards, setAdBoards] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState({
    title: false,
    downloadLink: false,
    adBoardId: false,
    adDisplayStartDate: false,
    adDisplayEndDate: false,
    adDuration: false,
    thumbnailFile: false,
    videoFile: false,
    remarks: false,
  });

  useEffect(() => {
    const fetchAdBoards = async () => {
      try {
        const response = await fetch("/api/adBoard");
        const data = await response.json();
        const adBoards = data.map(
          (board: { id: string; boardName: string }) => ({
            // Ensure id is a string
            id: board.id,
            name: board.boardName,
          })
        );
        setAdBoards(adBoards);
      } catch (err) {
        addToast("Something went wrong!", "error");
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "video"
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      if (type === "thumbnail" && file.size > 5 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: true }));
      } else {
        setAdData((prevData) => ({ ...prevData, [`${type}File`]: file }));
        setErrors((prevErrors) => ({ ...prevErrors, [`${type}File`]: false }));
      }
    }
  };

  const handleRemoveFile = (type: "thumbnail" | "video") => {
    setAdData((prevData) => ({ ...prevData, [`${type}File`]: null }));
    setErrors((prevErrors) => ({ ...prevErrors, [`${type}File`]: true }));
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
      [name]: value.trim() === "",
    }));
  };

  const removeUrl = (type: "thumbnailUrl" | "videoUrl") => {
    setAdData((prevData) => ({
      ...prevData,
      [type]: "",
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [type]: false,
    }));
  };

  const uploadVideoToS3 = async (file: File): Promise<string | null> => {
    try {
      // Step 1: Get pre-signed URL
      const presignedResponse = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name }),
      });

      if (!presignedResponse.ok) {
        throw new Error("Failed to get pre-signed URL");
      }

      const { url: presignedUrl } = await presignedResponse.json();

      // Step 2: Upload file to S3 using Axios
      const uploadResponse = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          }
        },
      });

      if (uploadResponse.status !== 200) {
        throw new Error("Failed to upload video to S3");
      }

      // Extract the URL from the pre-signed URL
      return presignedUrl.split("?")[0]; // Removes query parameters to get the raw URL
    } catch (error) {
      console.error("Error uploading video to S3:", error);
      addToast("Error uploading video", "error");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    // Validate fields
    const newErrors = {
      title: adData.title.trim() === "",
      downloadLink:
        activeTab === "download" && !validateURL(adData.downloadLink),
      adBoardId: adData.adBoardId === "",
      adDisplayStartDate: startDate === null,
      adDisplayEndDate: endDate === null,
      adDuration:
        isNaN(Number(adData.adDuration)) || Number(adData.adDuration) <= 0,
      thumbnailFile: !adData.thumbnailFile || errors.thumbnailFile,
      videoFile:
        activeTab === "video" && (!adData.videoFile || errors.videoFile),
      remarks: adData.remarks.trim() === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      addToast("You might have missed some fields", "error");
      setIsLoading(false);
      return;
    }

    let videoUrl = null;
    if (adData.videoFile) {
      setUploadProgress(0);
      videoUrl = await uploadVideoToS3(adData.videoFile);

      if (!videoUrl) {
        setIsLoading(false);
        addToast("Video upload failed", "error");
        return; // Abort submission if the video upload fails
      }
    }

    const formData = new FormData();
    formData.append("title", adData.title);
    if (adData.downloadLink) {
      formData.append("downloadLink", adData.downloadLink);
    }
    formData.append("adBoardId", adData.adBoardId);
    formData.append("adDisplayStartDate", startDate?.toISOString() ?? "");
    formData.append("adDisplayEndDate", endDate?.toISOString() ?? "");
    formData.append("adDuration", adData.adDuration);
    if (adData.thumbnailFile) {
      formData.append("thumbnail", adData.thumbnailFile);
    }
    if (videoUrl) {
      formData.append("videoUrl", videoUrl); // Pass the uploaded video's URL
    }
    formData.append("remarks", adData.remarks);
    formData.append("createdById", adData.createdById); // Ensure createdById is included

    try {
      const response = await fetch("/api/creatives", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        addToast(
          `Creative ${
            editMode ? "updated" : "added"
          } successfully in Dashboard!`,
          "success"
        );
        onClose();

        // Reload Page
        window.location.reload();
      } else {
        addToast("Something went wrong!", "error");
      }
    } catch (error) {
      addToast("Something went wrong!", "error");
      console.error(`Error ${editMode ? "updating" : "creating"} ad:`, error);
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <Loader isVisible={isLoading} />
      <div
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "50%",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 dark:text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600 text-white">
          <h2 className="text-2xl font-bold">
            {editMode ? "Edit Creative" : "Add Creative"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <form onSubmit={handleSubmit} id="createAdForm">
            {/* Title Input */}
            <div className="mb-4">
              <label
                className="block font-medium mb-1 dark:text-white text-black text-sm"
                htmlFor="title"
              >
                Creative Name<span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={adData.title}
                onChange={handleChange}
                className={` w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 dark:border-gray-600 border-gray-300 text-black dark:text-gray-200 ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter creative name"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  Creative name is required
                </p>
              )}
            </div>

            {/* Add tabs */}
            <div className="mb-4">
              <div className="flex font-medium text-sm items-center">
                <button
                  type="button"
                  className={`py-2 px-4 ${
                    activeTab === "download"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("download")}
                >
                  Video Link{" "}
                  {activeTab === "download" && (
                    <span className="text-red-500">*</span>
                  )}
                </button>
                <span className="px-4 text-gray-400">or</span>
                <button
                  type="button"
                  className={`py-2 px-4 ${
                    activeTab === "video"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("video")}
                >
                  Video Upload{" "}
                  {activeTab === "video" && (
                    <span className="text-red-500">*</span>
                  )}
                </button>
              </div>

              {/* Conditional rendering based on active tab */}
              {activeTab === "download" ? (
                <div className="mt-4">
                  <input
                    id="downloadLink"
                    name="downloadLink"
                    type="url"
                    value={adData.downloadLink || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
                      errors.downloadLink ? "border-red-500" : ""
                    }`}
                    placeholder="Link to download video"
                    required={activeTab === "download"}
                  />
                  {errors.downloadLink && (
                    <p className="text-red-500 text-sm mt-1">
                      Invalid video link URL
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  <label
                    className="cursor-pointer block border-2 rounded-lg mr-10 py-2 px-4 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-gray-300 dark:border-gray-700"
                    htmlFor="video"
                    style={{ width: "145px" }}
                  >
                    <div className="flex items-center">
                      <VideoUploadIcon />
                      &nbsp;Add Video{" "}
                    </div>
                  </label>
                  <input
                    id="video"
                    name="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      handleFileChange(e, "video");
                      e.target.value = ""; // Clear the input after files are selected
                    }}
                    className="hidden"
                  />
                  {errors.videoFile && (
                    <p className="text-red-500 text-sm mt-1">
                      Please upload a valid video file
                    </p>
                  )}
                  {adData.videoFile && (
                    <div className="relative mt-2" style={{ width: "200px" }}>
                      <div className="relative w-34 h-30 rounded-lg overflow-hidden border border-blue-300 text-blue-500 bg-blue-50">
                        <VideoIcon />
                      </div>
                      <button
                        onClick={() => {
                          handleRemoveFile("video");
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {adData.videoUrl && (
                    <div className="relative mt-2" style={{ width: "200px" }}>
                      <div className="relative w-34 h-30 rounded-lg overflow-hidden border border-blue-300 text-blue-500 bg-blue-50">
                        <VideoIcon />
                      </div>
                      <button
                        onClick={() => {
                          removeUrl("videoUrl");
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1 text-black dark:text-white text-sm">
                Display Dates<span className="text-red-500">*</span>
              </label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                onTodayClick={() => {
                  const today = new Date();
                  setStartDate(today);
                  setEndDate(today);
                }}
                showSearchIcon={false}
                onSearch={() => {}}
              />
              {errors.adDisplayStartDate ||
                (errors.adDisplayEndDate && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select valid dates
                  </p>
                ))}
            </div>

            <div className="mb-4">
              <label
                className="block font-medium mb-1 text-sm text-black dark:text-white"
                htmlFor="adBoardId"
              >
                Inventory<span className="text-red-500">*</span>
              </label>
              <select
                id="adBoardId"
                name="adBoardId"
                value={adData.adBoardId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded bg-gray-100 border-gray-300 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  errors.adBoardId ? "border-red-500" : ""
                }`}
                required
              >
                <option
                  value=""
                  disabled
                  className="border-b text-xs border-gray-300"
                >
                  Select inventory
                </option>
                {adBoards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
              {errors.adBoardId && (
                <p className="text-red-500 text-sm mt-1">Inventory required</p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block font-medium text-sm mb-1 text-black dark:text-white"
                htmlFor="adDuration"
              >
                Duration (seconds)<span className="text-red-500">*</span>
              </label>
              <input
                id="adDuration"
                name="adDuration"
                type="number"
                value={adData.adDuration}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 border-gray-300 text-black border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  errors.adDuration ? "border-red-500" : ""
                }`}
                placeholder="Enter duration in seconds"
                required
              />
              {errors.adDuration && (
                <p className="text-red-500 text-sm mt-1">
                  Enter a positive number
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="remarks"
              >
                Add more details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={adData.remarks}
                onChange={handleChange}
                rows={5}
                className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
                  errors.remarks ? "border-red-500" : ""
                }`}
                placeholder="Enter more details"
              />
              {errors.remarks && (
                <p className="text-red-500 text-sm mt-1">
                  Add details of the creative
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="font-medium text-black dark:text-white text-sm">
                Thumbnail (max 5MB)
              </label>
              <span className="text-red-500">*</span>
              <label
                className="cursor-pointer block border-2 rounded-lg mr-10 py-2 px-4 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-gray-300 dark:border-gray-700"
                htmlFor="thumbnail"
                style={{ width: "145px" }}
              >
                <div className="flex items-center">
                  <UploadIcon />
                  &nbsp;Add Image{" "}
                </div>
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e, "thumbnail");
                  e.target.value = ""; // Clear the input after files are selected
                }}
                className="hidden"
                placeholder="Add image"
              />
              {errors.thumbnailFile && (
                <p className="text-red-500 text-sm mt-1">
                  Please upload an image less than 5MB
                </p>
              )}
              {adData.thumbnailFile && (
                <div className="relative mt-2" style={{ width: "200px" }}>
                  <div className="relative w-34 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(adData.thumbnailFile)}
                      alt="Thumbnail"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleRemoveFile("thumbnail");
                    }}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                  >
                    ×
                  </button>
                </div>
              )}
              {adData.thumbnailUrl && (
                <div className="relative mt-2" style={{ width: "200px" }}>
                  <div className="relative w-34 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={adData.thumbnailUrl}
                      alt="Thumbnail"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      removeUrl("thumbnailUrl");
                    }}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
          {uploadProgress !== null && (
            <div
              className="w-full bg-gray-400 h-3 -mt-4 mb-4 relative"
              style={{ width: "calc(100% + 50px)", left: "-25px" }}
            >
              <div
                className="bg-blue-600 h-3"
                style={{ width: `${uploadProgress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                uploading video {uploadProgress} %
              </span>
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded hover:bg-gray-400 bg-gray-600 dark:hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="createAdForm"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {editMode ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdModal;
