import React from "react";
import { AdWithBoard } from "@/types/ad";
import Image from "next/image"; // Import the Image component from Next.js

interface AdBoardListProps {
  ads: AdWithBoard[];
}

const AdBoardList: React.FC<AdBoardListProps> = ({ ads }) => {
  // Group ads by Ad Board
  const groupedAds = ads.reduce((acc, ad) => {
    const boardName = ad.adBoard.boardName;
    if (!acc[boardName]) acc[boardName] = [];
    acc[boardName].push(ad);
    return acc;
  }, {} as Record<string, AdWithBoard[]>);

  return (
    <div className="space-y-8 flex flex-col items-center pb-12">
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
                    <div className="relative" style={{ width: "180px", height: "140px" }}>
                      <Image
                        src={ad.thumbnailUrl || ""}                        
                        alt="Ad Thumbnail"
                        className="rounded-sm"
                        layout="fill"
                        objectFit="cover"
                        priority={true}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="font-semibold text-2xl text-gray-800 dark:text-gray-100 truncate">
                        {ad.title}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Duration: {ad.adDuration}
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
                  <div className="col-span-3 flex justify-center">
                    <a
                      href={ad.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-500 hover:text-white transition text-center whitespace-nowrap"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default AdBoardList;
