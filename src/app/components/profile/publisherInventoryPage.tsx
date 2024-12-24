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

const PublisherInventoryPage: React.FC = () => {
  const [adBoards, setAdBoards] = useState<AdBoard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdBoard, setCurrentAdBoard] = useState<AdBoard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const { addToast } = useToast();

  useEffect(() => {
    const loadAdBoards = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAdBoards(); // Fetch data from the service
        setAdBoards(data); // Update state with fetched data
      } catch (error) {
        console.error("Error loading ad boards:", error);
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
      dailyRate: 1500, // Default daily rate in rupees
      ownerContact: "",
      count: 1,
      size: "",
      more: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing ad space
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
    try {
      await createAdBoard(currentAdBoard);
      if (currentAdBoard) {
        setAdBoards([...adBoards, currentAdBoard]);
        addToast("Inventory added successfully!", "success");
        closeModal();
      }
    } catch (error) {
      addToast("Failed to add inventory.", "error");
      console.log(error);
    }
  };

  const handleEditAdBoard = () => {
    if (currentAdBoard !== null && editingIndex !== null) {
      const updatedAdBoards = [...adBoards];
      updatedAdBoards[editingIndex] = currentAdBoard;
      setAdBoards(updatedAdBoards);
      closeModal();
    }
  };

  const removeAdBoard = (index: number) => {
    setAdBoards(adBoards.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Loader isVisible={isLoading} />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-10">My Inventory</h1>
        <div className="flex justify-center">
          {/* Ad Boards Section */}
          <div className="w-full max-w-6xl">
            <div className="flex justify-end items-center mb-6 space-x-2">
              <span className="text-gray-900 dark:text-gray-100 text-2xl font-bold">Add Inventory</span>
              <button type="button" onClick={openAddModal}
                className="border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition">
                <AddIcon />
              </button>
            </div>
            <ul className="space-y-4">
              {adBoards.map((adBoard, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
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
                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => openEditModal(index)}
                      className="p-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px", }} >
                      <PencilIcon />
                    </button>
                    <button type="button"
                      onClick={() => removeAdBoard(index)}
                      className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px", }} >
                      <DeleteIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Modal */}
        {
          isModalOpen && currentAdBoard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">
                  {isEditing ? "Edit Ad Space" : "Add Ad Space"}
                </h3>
                <AdBoardForm
                  adBoard={currentAdBoard}
                  onChange={handleAdBoardChange}
                />
                <div className="flex justify-end mt-4 space-x-2">
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
          )
        }
      </div >
    </div >
  );
};

export default PublisherInventoryPage;
