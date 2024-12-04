import React from "react";
import AdItem from "./AdItem";
import { AdWithBoard } from "@/types/ad";

interface AdListProps {
  ads: AdWithBoard[];
}

const AdList: React.FC<AdListProps> = ({ ads }) => {
  // Group ads by boardName
  const groupedAds = ads.reduce((acc, ad) => {
    if (!acc[ad.adBoard.boardName]) {
      acc[ad.adBoard.boardName] = [];
    }
    acc[ad.adBoard.boardName].push(ad);
    return acc;
  }, {} as Record<string, AdWithBoard[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedAds).map(([boardName, ads]) => (
        <div
          key={boardName}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md p-4"
        >
          {/* Section Header */}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {boardName}
          </h2>

          {/* Ads Table */}
          <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">
                  Ad Title
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">
                  Location
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">
                  Duration
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <AdItem key={ad.id} ad={ad} />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default AdList;
