import React from "react";
import { AdWithBoard } from "@/types/ad";

interface AdItemProps {
  ad: AdWithBoard;
}

const AdItem: React.FC<AdItemProps> = ({ ad }) => (
  <tr>
    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">
      {ad.title}
    </td>
    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">
      {ad.adBoard.location}
    </td>
    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">
      {ad.adDuration}
    </td>
    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">
      <a
        href={ad.downloadLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Download
      </a>
    </td>
  </tr>
);

export default AdItem;
