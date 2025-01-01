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
                  className="flex justify-between items-center border-b last:border-none pb-4"
                >
                  {/* Thumbnail and Ad Info */}
                  <div className="flex items-center gap-6">
                    {/* Circular Thumbnail */}
                    <div className="relative w-16 h-16">
                      <Image
                        src={
                          ad.thumbnailUrl ||
                          "https://150763658.v2.pressablecdn.com/wp-content/uploads/2023/02/image-1.webp"
                        }
                        alt="Ad Thumbnail"
                        className="rounded-full"
                        layout="fill" // Makes the image fill the container
                        objectFit="cover" // Ensures the image scales correctly
                        priority={true} // Ensures the image loads eagerly for LCP improvement
                      />
                    </div>

                    {/* Ad Title and Location */}
                    <div className="font-semibold text-xl text-gray-800 dark:text-gray-100">
                      {ad.title}
                    </div>
                  </div>
                  {/* Ad Duration */}
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    {ad.adDuration}
                  </div>
                  {/* Download Button */}
                  <a
                    href={ad.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-500 hover:text-white transition text-center"
                    style={{
                      maxWidth: "120px",
                    }}
                  >
                    Download
                  </a>
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
