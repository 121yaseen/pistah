"use client";

import React, { useState } from "react";
import AdBoardForm from "./publisherForm";
import { AdBoard } from "./adBoard";
import DarkModeToggle from "../components/shared/DarkModeToggleButton";

const CustomerDetailsPage: React.FC = () => {
    const [adBoards, setAdBoards] = useState<AdBoard[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAdBoard, setCurrentAdBoard] = useState<AdBoard | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentAdBoard({ pic: null, type: "", count: 0, location: "", size: "", more: "" });
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

    const handleAdBoardChange = (field: keyof AdBoard, value: string | File | number | null) => {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Customer data:", adBoards);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="mx-auto p-6">
                <div className="flex justify-end mb-6">
                    <DarkModeToggle />
                </div>
                <h1 className="text-2xl font-bold mb-6 text-center">Create your profile with us</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-6 mx-auto">
                        <div className="flex items-center mb-4">
                            <label className="w-1/4 font-medium mb-2">Profile Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-3/4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-white dark:bg-gray-800"
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="w-1/4 font-medium mb-2">Profile Picture</label>
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                required
                                className="w-3/4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-white dark:bg-gray-800"
                            />
                        </div>

                        <div className="flex items-start mb-4">
                            <label className="w-1/4 font-medium mb-2">Tell us more about you</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                className="w-3/4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-white dark:bg-gray-800"
                            />
                        </div>

                        <div className="flex items-start mb-4">
                            <label className="w-1/4 font-medium mb-2">Locations you serve</label>
                            <textarea
                                name="locations"
                                rows={4}
                                required
                                className="w-3/4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-white dark:bg-gray-800"
                            />
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                className="w-1/4 px-3 py-2 bg-green-500 dark:bg-green-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>

                    <div className="w-full md:w-1/2 mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Ad Spaces</h3>
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded">
                                Add your Ad Space
                            </button>
                        </div>
                        <hr className="border-t border-gray-300 dark:border-gray-600 my-4" />
                        <ul className="space-y-4">
                            {adBoards.map((adBoard, index) => (
                                <li
                                    key={index}
                                    className="border p-4 rounded flex justify-between items-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                >
                                    <div>
                                        <p>
                                            <strong>Type:</strong> {adBoard.type}
                                        </p>
                                        <p>
                                            <strong>Count:</strong> {adBoard.count}
                                        </p>
                                        <p>
                                            <strong>Location:</strong> {adBoard.location}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(index)}
                                            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeAdBoard(index)}
                                            className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {isModalOpen && currentAdBoard && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-4xl w-full">
                            <h2 className="text-xl font-semibold mb-4">
                                {isEditing ? "Edit Ad Space" : "Add Ad Space"}
                            </h2>
                            <AdBoardForm
                                adBoard={currentAdBoard}
                                onChange={handleAdBoardChange}
                            />
                            <div className="flex justify-end mt-4 gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={isEditing ? handleEditAdBoard : handleAddAdBoard}
                                    className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded"
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

export default CustomerDetailsPage;
