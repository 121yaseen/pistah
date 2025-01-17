import React, { useEffect } from "react";
import { AdWithBoard } from "@/types/ad";
import Image from "next/image";

interface PreviewAdModalProps {
  ad: AdWithBoard;
  onClose: () => void;
}

const CreativeDetails: React.FC<PreviewAdModalProps> = ({ ad, onClose }) => {
  const downloadUrl = ad.downloadLink ? ad.downloadLink : ad.videoUrl;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[600px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-white">Creative Details</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="relative w-full h-[200px]">
              <Image
                src={ad.thumbnailUrl || ""}
                alt="Ad Thumbnail"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Creative Name
                </h3>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {ad.title}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Inventory
                </h3>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {ad.adBoard.boardName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Duration
                </h3>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {ad.adDuration} seconds
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Display Period
                </h3>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {new Date(ad.adDisplayStartDate).toLocaleDateString()} -{" "}
                  {new Date(ad.adDisplayEndDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Details
                </h3>
                <p className="text-lg text-gray-900 dark:text-gray-100 whitespace-pre-line">
                  {ad.remarks}
                </p>
              </div>

              {downloadUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Download Link
                  </h3>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    {downloadUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreativeDetails;
