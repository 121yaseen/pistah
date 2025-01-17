import React, { useEffect, useState } from "react";
import { AdWithBoard } from "@/types/ad";
import Image from "next/image"; // Import the Image component from Next.js
import PencilIcon from "@/icons/pencilIcon";
import DeleteIcon from "@/icons/deleteIcon";
import CreativeDetails from "../modals/CreativeDetails";
import { useToast } from "@/app/context/ToastContext";
import Loader from "../shared/LoaderComponent";
import CreateAdModal from "../modals/CreateAdModal";

interface AdBoardListProps {
  ads: AdWithBoard[];
  reloadAds: () => void;
}

const AdBoardList: React.FC<AdBoardListProps> = ({ ads, reloadAds }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdWithBoard | null>(null);
  const [editMode, setEditMode] = useState(false);

  const openEditModal = (ad: AdWithBoard) => {
    setSelectedAd(ad);
    setEditMode(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen || isDeleteConfirmationOpen || isPreviewModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup when the component is unmounted
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isDeleteConfirmationOpen, isPreviewModalOpen]);
  const [deleteIndex, setDeleteIndex] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Group ads by Ad Board
  const groupedAds = ads.reduce((acc, ad) => {
    const boardName = ad.adBoard.boardName;
    if (!acc[boardName]) acc[boardName] = [];
    acc[boardName].push(ad);
    return acc;
  }, {} as Record<string, AdWithBoard[]>);

  const openPreviewModal = (ad: AdWithBoard) => {
    setSelectedAd(ad);
    setIsPreviewModalOpen(true);
  };

  const openDeleteConfirmModal = (id: string) => {
    setDeleteIndex(id);
    setIsDeleteConfirmationOpen(true);
  };

  const deleteAdBoard = async (adId: string) => {
    try {
      const response = await fetch(`/api/creative/${adId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          `Failed to delete ad. Server responded with ${response.status}: ${message}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting ad:", error);
      throw error;
    }
  };

  const handleDeleteConfirmation = async () => {
    setLoading(true);
    if (deleteIndex && deleteIndex !== "") {
      deleteAdBoard(deleteIndex)
        .then(
          () => {
            addToast("Creative deleted successfully!", "success");
          },
          () => {
            addToast("Failed to delete Creative!", "error");
          }
        )
        .finally(async () => {
          await reloadAds();
          setLoading(false);
        });
    } else {
      addToast("Creative Id is undefined!", "error");
    }
    setIsDeleteConfirmationOpen(false);
    setDeleteIndex("");
  };

  return (
    <div className="space-y-8 flex flex-col items-center pb-12">
      {loading && <Loader isVisible={true} />}
      {Object.entries(groupedAds).map(([boardName, boardAds]) => {
        const location = boardAds[0].adBoard.location;
        return (
          <div
            key={boardName}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-6xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {boardName}
              </h2>
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                {location}
              </h3>
            </div>
            {/* Ads List */}
            <ul className="space-y-6">
              {boardAds.map((ad) => (
                <li
                  key={ad.id}
                  className="grid grid-cols-12 gap-4 items-center border-b dark:border-gray-700 last:border-none pb-2"
                >
                  {/* Column 1: Thumbnail and Ad Info (25%) */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div
                      className="relative"
                      style={{ width: "180px", height: "140px" }}
                    >
                      <Image
                        src={ad.thumbnailUrl || ""}
                        alt="Ad Thumbnail"
                        className="rounded-lg"
                        layout="fill"
                        objectFit="cover"
                        priority={true}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="font-semibold text-xl text-gray-800 dark:text-gray-100 truncate">
                        {ad.title}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Duration: {ad.adDuration}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => openPreviewModal(ad)}
                          className="w-18 px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition text-center"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Remarks (50%) */}
                  <div className="col-span-5 px-4">
                    <p className="text-md text-gray-800 dark:text-gray-300 whitespace-pre-line line-clamp-5">
                      {ad.remarks}
                    </p>
                  </div>

                  {/* Column 3: Download Button (25%) */}
                  <div className="col-span-3 flex items-center gap-4 justify-end">
                    <a
                      href={ad.downloadLink ? ad.downloadLink : ad.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-500 hover:text-white transition text-center whitespace-nowrap"
                    >
                      Download
                    </a>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(ad)}
                        className="p-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition flex items-center justify-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteConfirmModal(ad.id ?? "")}
                        className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {isDeleteConfirmationOpen && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this creative ?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirmation()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isPreviewModalOpen && selectedAd && (
        <CreativeDetails
          ad={selectedAd}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}

      {/* Create Ad Modal */}
      {isModalOpen && (
        <CreateAdModal
          onClose={() => {
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedAd(null);
          }}
          editMode={editMode}
          adToEdit={selectedAd}
        />
      )}
    </div>
  );
};

export default AdBoardList;
