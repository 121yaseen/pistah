"use client";

import React, { useState } from "react";
import AdBoardForm from "./publisherForm";
import { AdBoard } from "@/types/ad";
import { AdBoardType } from "../enums/AdBoardType";

const PublisherProfilePage: React.FC = () => {
  const [adBoards, setAdBoards] = useState<AdBoard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdBoard, setCurrentAdBoard] = useState<AdBoard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleAddAdBoard = () => {
    if (currentAdBoard) {
      setAdBoards([...adBoards, currentAdBoard]);
      closeModal();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting ad boards to the backend:", adBoards);

    // Simulate sending to a backend
    try {
      const response = await fetch("/api/adBoards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adBoards }),
      });
      if (response.ok) {
        alert("Ad boards saved successfully!");
      } else {
        console.error("Failed to save ad boards");
      }
    } catch (error) {
      console.error("Error saving ad boards:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-10">
          Create Your Profile
        </h1>
        <div className="flex flex-col md:flex-row gap-12">
          {/* Profile Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  About You
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Locations You Serve
                </label>
                <textarea
                  name="locations"
                  rows={4}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Save
              </button>
            </div>
          </form>

          {/* Ad Boards Section */}
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ad Spaces</h2>
              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add Ad Space
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
                    <button
                      type="button"
                      onClick={() => openEditModal(index)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAdBoard(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && currentAdBoard && (
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
        )}
      </div>
    </div>
  );
};

export default PublisherProfilePage;
