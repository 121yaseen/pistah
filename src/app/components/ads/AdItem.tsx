import { AdWithBoard } from "@/types/ad";
import React from "react";
import LinkButton from "../shared/LinkButton";

interface AdItemProps {
  ad: AdWithBoard; // Use the extended type
}

const AdItem: React.FC<AdItemProps> = ({ ad }) => (
  <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
    <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">
      {ad.title}
    </td>
    <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">
      {ad.adBoard?.boardName || "N/A"}
    </td>
    <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">
      {ad.adBoard?.location || "N/A"}
    </td>
    <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">
      {ad.adDuration}
    </td>
    <td className="py-2 px-4 border-b">
      <LinkButton link={ad.downloadLink} />
    </td>
  </tr>
);

export default AdItem;
