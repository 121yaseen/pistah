"use client";

import React, { useEffect, useState } from "react";
import AdBoardForm from "./publisherForm";
import { AdBoard } from "@/types/ad";
import { AdBoardType } from "../../enums/AdBoardType";
import {
  createAdBoard,
  deleteAdBoard,
  fetchAdBoards,
  updateAdBoard,
} from "@/app/services/adBoardService";
import PencilIcon from "@/icons/pencilIcon";
import DeleteIcon from "@/icons/deleteIcon";
import AddIcon from "@/icons/addIcon";
import Loader from "../shared/LoaderComponent";
import { useToast } from "@/app/context/ToastContext";
import ImageCarousel from "../shared/ImageCarousel";

const PublisherInventoryPage: React.FC = () => {
  const [adBoards, setAdBoards] = useState<AdBoard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdBoard, setCurrentAdBoard] = useState<AdBoard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const loadAdBoards = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdBoards();
      setAdBoards(data);
    } catch (error) {
      console.error("Error loading ad boards:", error);
      addToast("Something went wrong!", "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadAdBoards();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentAdBoard({
      id: "",
      imageUrl: [],
      boardType: AdBoardType.STATIC,
      boardName: "",
      location: "",
      dailyRate: 1500,
      ownerContact: "",
      operationalHours: "",
      lastMaintenanceDate: new Date().toISOString(),
      createdById: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dimensions: "1920 x 1080",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setIsEditing(true);
    setEditingIndex(index);
    setCurrentAdBoard(adBoards[index]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentAdBoard(null);
    setEditingIndex(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleAdBoardChange = (
    field: keyof AdBoard,
    value: string | number | boolean | File[] | null | string[]
  ) => {
    if (currentAdBoard) {
      setCurrentAdBoard({ ...currentAdBoard, [field]: value });
    }
  };

  const handleAddAdBoard = async () => {
    if (!validateForm()) {
      addToast("Invalid input fields.", "error");
      return;
    }
    try {
      setIsLoading(true);
      const response = await createAdBoard(currentAdBoard);

      if (response) {
        addToast("Inventory added successfully!", "success");
        await loadAdBoards();
        closeModal();
      } else {
        addToast("Failed to add Inventory!", "error");
      }
    } catch (error) {
      addToast("Something went wrong!", "error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAdBoard = async () => {
    if (currentAdBoard !== null && editingIndex !== null) {
      if (!validateForm()) {
        addToast("Invalid input fields.", "error");
        return;
      }

      setIsLoading(true);
      try {
        await updateAdBoard(currentAdBoard);
        addToast("Inventory edited successfully!", "success");
      } catch (error) {
        addToast("Failed to edit Inventory!", "error");
        console.log(error);
      } finally {
        await loadAdBoards();
        setIsLoading(false);
      }
      closeModal();
    }
  };

  const openDeleteConfirmModal = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async (confirmed: boolean) => {
    if (confirmed && deleteIndex !== null) {
      setIsLoading(true);
      const adBoardId = adBoards[deleteIndex]?.id;
      if (adBoardId) {
        deleteAdBoard(adBoardId)
          .then(
            () => {
              addToast("Inventory deleted successfully!", "success");
            },
            () => {
              addToast("Failed to delete Inventory!", "error");
            }
          )
          .finally(async () => {
            await loadAdBoards();
            setIsLoading(false);
          });
      } else {
        addToast("Inventory Id is undefined!", "error");
      }
    }
    setIsDeleteConfirmationOpen(false);
    setDeleteIndex(null);
  };

  // Validate the form when any field is updated
  const validateForm = () => {
    if (
      currentAdBoard &&
      currentAdBoard.images &&
      currentAdBoard.imageUrl &&
      currentAdBoard.imageUrl.length + currentAdBoard.images.length > 7
    ) {
      addToast("Maximum 7 images allowed!", "error");
      return false;
    }
    return currentAdBoard
      ? currentAdBoard.boardName !== "" &&
          currentAdBoard.location !== "" &&
          currentAdBoard.dailyRate > 0 &&
          currentAdBoard.ownerContact &&
          /^\d{10}$/.test(currentAdBoard.ownerContact) &&
          ((currentAdBoard.images &&
            currentAdBoard.images.every(
              (image) => image.size < 5 * 1024 * 1024
            )) ||
            (currentAdBoard.imageUrl && currentAdBoard.imageUrl?.length > 0))
      : false;
  };

  useEffect(() => {
    if (isModalOpen || isDeleteConfirmationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup when the component is unmounted
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isDeleteConfirmationOpen]);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Loader isVisible={isLoading} />
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="flex justify-end items-center mb-6 space-x-2">
              <span className="text-gray-900 dark:text-gray-100 text-2xl font-bold">
                Add Inventory
              </span>
              <button
                type="button"
                onClick={openAddModal}
                className="border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
              >
                <AddIcon />
              </button>
            </div>
            {adBoards && adBoards.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {adBoards.map((adBoard, index) => (
                  <div
                    key={index}
                    className="p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col"
                  >
                    {/* Image at the top */}
                    <div
                      className="relative w-full"
                      style={{ height: "250px" }}
                    >
                      <ImageCarousel images={adBoard.imageUrl || []} />
                    </div>

                    {/* Content pushed to bottom with flex-grow */}
                    <div className="flex-grow"></div>

                    {/* Ad Board Details at bottom */}
                    <div className="mt-4">
                      <p>
                        <strong>Name:</strong> {adBoard.boardName}
                      </p>
                      <p>
                        <strong>Type:</strong> {adBoard.boardType}
                      </p>
                      <p>
                        <strong>Location:</strong> {adBoard.location}
                      </p>
                      <p>
                        <strong>Daily Rate:</strong> {adBoard.dailyRate}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4 justify-end">
                      <button
                        type="button"
                        onClick={() => openEditModal(index)}
                        className="p-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition flex items-center justify-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteConfirmModal(index)}
                        className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-700 dark:text-gray-300">
                No available inventory. Add one now!
              </p>
            )}
          </div>
        </div>

        {isModalOpen && currentAdBoard && (
          <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative"
              style={{ width: "60%", maxWidth: "calc(2xl * 1.1)" }} // Increased width by 10%
            >
              {/* Header */}
              <div className="absolute top-0 left-0 w-full p-4 bg-[#001464] dark:bg-gray-800 rounded-t-lg border-b border-gray-300 dark:border-gray-600">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? "Edit Inventory" : "Add Inventory"}
                </h2>
              </div>

              {/* Form Content */}
              <div
                className="mt-[5%] mb-12 overflow-y-auto scrollable-content"
                style={{
                  maxHeight: "70vh",
                  marginRight: "-1.5rem",
                  paddingRight: "1rem",
                  paddingLeft: "1rem",
                  paddingBottom: "2rem",
                  paddingTop: "1rem",
                }} // Adjust margin and padding
              >
                <AdBoardForm
                  adBoard={currentAdBoard}
                  onChange={handleAdBoardChange}
                />
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 w-full p-4 rounded-b-lg flex justify-end space-x-2 border-t border-gray-300 dark:border-gray-600">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditing ? handleEditAdBoard : handleAddAdBoard}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteConfirmationOpen && (
          <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
              <p>Are you sure you want to delete this ad board?</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleDeleteConfirmation(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteConfirmation(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherInventoryPage;
