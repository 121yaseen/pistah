import { AdBoard } from "@/types/ad";
import React from "react";

interface AdBoardFormProps {
  adBoard: AdBoard;
  onChange: (
    field: keyof AdBoard,
    value: string | number | boolean | null
  ) => void;
}

const AdBoardForm: React.FC<AdBoardFormProps> = ({ adBoard, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Board Name */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
        Inventory Name
        </label>
        <input
          type="text"
          placeholder="Inventory Name"
          value={adBoard.boardName}
          onChange={(e) => onChange("boardName", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Location
        </label>
        <input
          type="text"
          placeholder="Location"
          value={adBoard.location}
          onChange={(e) => onChange("location", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Board Type */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Board Type
        </label>
        <select
          value={adBoard.boardType}
          onChange={(e) => onChange("boardType", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
        >
          <option value="Static">Static</option>
          <option value="Digital">Digital</option>
          <option value="Moving Digital">Moving Digital</option>
        </select>
      </div>

      {/* Daily Rate */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Daily Rate (₹)
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-black dark:text-white">₹</span>
          <input
            type="number"
            value={adBoard.dailyRate}
            onChange={(e) => onChange("dailyRate", parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
            placeholder="1500"
          />
        </div>
      </div>

      {/* Owner Contact */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Contact (+91)
        </label>
        <input
          type="text"
          value={adBoard.ownerContact}
          placeholder="Contact"
          onChange={(e) => onChange("ownerContact", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 bg-gray-100 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
};

export default AdBoardForm;
