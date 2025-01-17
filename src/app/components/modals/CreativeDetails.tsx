import React, { useEffect } from "react";
import { AdWithBoard } from "@/types/ad";
import Image from "next/image";

interface PreviewAdModalProps {
  ad: AdWithBoard;
  onClose: () => void;
}

const CreativeDetails: React.FC<PreviewAdModalProps> = ({ ad, onClose }) => {
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
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-white">Creative Details</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="flex justify-center w-full">
              <div className="relative items-center w-[200px] h-[150px]">
                <Image
                  src={ad.thumbnailUrl || ""}
                  alt="Ad Thumbnail"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Creative Name
                </h3>
                <strong className="text-md text-gray-900 dark:text-gray-100">
                  {ad.title}
                </strong>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Display Period
                </h3>
                <p className="text-md text-gray-900 dark:text-gray-100">
                  <strong>
                    {new Date(ad.adDisplayStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </strong> -{" "}
                  <strong>
                    {new Date(ad.adDisplayEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </strong>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Details
                </h3>
                <strong className="text-md text-gray-900 dark:text-gray-100 whitespace-pre-line">
                  {ad.remarks}
                </strong>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Creative Video
                </h3>
                <div style={{ marginTop: '8px' }}></div>
                <a
                  href={ad.downloadLink ? ad.downloadLink : ad.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-500 hover:text-white transition text-center whitespace-nowrap"
                >
                  Download
                </a>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Inventory
                </h3>
                <strong className="text-md text-gray-900 dark:text-gray-100">
                  {ad.adBoard.boardName}
                </strong>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Duration  
                </h3>
                <strong className="text-md text-gray-900 dark:text-gray-100">
                  {ad.adDuration} seconds
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="w-25 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreativeDetails;
