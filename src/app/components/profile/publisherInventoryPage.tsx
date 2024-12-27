"use client";

import React, { useEffect, useState } from "react";
import AdBoardForm from "./publisherForm";
import { AdBoard } from "@/types/ad";
import { AdBoardType } from "../../enums/AdBoardType";
import { createAdBoard, fetchAdBoards } from "@/app/services/adBoardService";
import PencilIcon from "@/icons/pencilIcon";
import DeleteIcon from "@/icons/deleteIcon";
import AddIcon from "@/icons/addIcon";
import Loader from "../shared/LoaderComponent";
import { useToast } from "@/app/context/ToastContext";
import Image from 'next/image';

const PublisherInventoryPage: React.FC = () => {
  const [adBoards, setAdBoards] = useState<AdBoard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdBoard, setCurrentAdBoard] = useState<AdBoard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
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

    loadAdBoards();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentAdBoard({
      id: undefined,
      pic: null,
      boardType: AdBoardType.STATIC,
      boardName: "",
      location: "",
      dailyRate: 1500,
      ownerContact: "",
      count: 1,
      size: "",
      more: "",
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
    value: string | number | boolean | null | File
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
      await createAdBoard(currentAdBoard);
      if (currentAdBoard) {
        setAdBoards([...adBoards, currentAdBoard]);
        addToast("Inventory added successfully!", "success");
        closeModal();
      }
    } catch (error) {
      addToast("Something went wrong!", "error");
      console.log(error);
    }
  };

  const handleEditAdBoard = () => {
    if (currentAdBoard !== null && editingIndex !== null) {
      if (!validateForm()) {
        addToast("Invalid input fields.", "error");
        return;
      }
      const updatedAdBoards = [...adBoards];
      updatedAdBoards[editingIndex] = currentAdBoard;
      setAdBoards(updatedAdBoards);
      addToast("Inventory edited successfully!", "success");
      closeModal();
    }
  };

  const openDeleteConfirmModal = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = (confirmed: boolean) => {
    if (confirmed && deleteIndex !== null) {
      setAdBoards(adBoards.filter((_, i) => i !== deleteIndex));
      addToast("Ad Board deleted successfully!", "success");
    }
    setIsDeleteConfirmationOpen(false);
    setDeleteIndex(null);
  };

  // Validate the form when any field is updated
  const validateForm = () => {
    return currentAdBoard
      ? currentAdBoard.boardName !== "" &&
      currentAdBoard.location !== "" &&
      currentAdBoard.dailyRate > 0 &&
      currentAdBoard.ownerContact &&
      /^\d{10}$/.test(currentAdBoard.ownerContact)
      : false;
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Loader isVisible={isLoading} />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-10">My Inventory</h1>
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
            <ul className="space-y-4">
              {adBoards.map((adBoard, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center space-x-4" // Added space-x-4 for horizontal spacing
                >
                  {/* Image on the left */}
                  <div className="relative w-24 h-24"> 
                    <Image
                      src="https://150763658.v2.pressablecdn.com/wp-content/uploads/2023/02/image-1.webp"
                      alt="Ad Thumbnail"
                      layout="fill" // Makes the image fill the container
                      objectFit="cover" // Ensures the image scales correctly
                      priority={true} // Ensures the image loads eagerly for LCP improvement
                    />
                  </div>

                  {/* Ad Board Details on the right */}
                  <div className="flex-1"> {/* Allows the content to take the remaining space */}
                    <p>
                      <strong>Title:</strong> {adBoard.boardName}
                    </p>
                    <p>
                      <strong>Type:</strong> {adBoard.boardType}
                    </p>
                    <p>
                      <strong>Count:</strong> {adBoard.count}
                    </p>
                    <p>
                      <strong>Location:</strong> {adBoard.location}
                    </p>
                    <p>
                      <strong>Daily Rate:</strong> {adBoard.dailyRate}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
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
                </li>
              ))}
            </ul>

          </div>
        </div>

        {isModalOpen && currentAdBoard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl relative">
              {/* Header */}
              <div className="absolute top-0 left-0 w-full p-4 bg-[#001464] dark:bg-gray-800 rounded-t-lg border-b border-gray-300 dark:border-gray-600">
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? "Edit Inventory" : "Add Inventory"}
                </h2>
              </div>

              {/* Form Content */}
              <div className="mt-16 mb-16">
                <AdBoardForm adBoard={currentAdBoard} onChange={handleAdBoardChange} />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Confirm Delete
              </h3>
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