import React from "react";
import { AdBoard } from "./adBoard";

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
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Board Name
        </label>
        <input
          type="text"
          value={adBoard.boardName}
          onChange={(e) => onChange("boardName", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Location
        </label>
        <input
          type="text"
          value={adBoard.location}
          onChange={(e) => onChange("location", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        />
      </div>

      {/* Dimensions */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Dimensions
        </label>
        <input
          type="text"
          value={adBoard.dimensions}
          onChange={(e) => onChange("dimensions", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        />
      </div>

      {/* Board Type */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Board Type
        </label>
        <select
          value={adBoard.boardType}
          onChange={(e) => onChange("boardType", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        >
          <option value="Static">Static</option>
          <option value="Digital">Digital</option>
          <option value="Moving Digital">Moving Digital</option>
        </select>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Is Available
        </label>
        <input
          type="checkbox"
          checked={adBoard.isAvailable}
          onChange={(e) => onChange("isAvailable", e.target.checked)}
          className="mr-2"
        />
        Available
      </div>

      {/* Daily Rate */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Daily Rate
        </label>
        <input
          type="number"
          value={adBoard.dailyRate}
          onChange={(e) => onChange("dailyRate", parseFloat(e.target.value))}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        />
      </div>

      {/* Operational Hours */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Operational Hours
        </label>
        <input
          type="text"
          value={adBoard.operationalHours}
          onChange={(e) => onChange("operationalHours", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        />
      </div>

      {/* Owner Contact */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Owner Contact
        </label>
        <input
          type="text"
          value={adBoard.ownerContact}
          onChange={(e) => onChange("ownerContact", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        />
      </div>

      {/* Last Maintenance Date */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Last Maintenance Date
        </label>
        <input
          type="date"
          value={adBoard.lastMaintenanceDate}
          onChange={(e) => onChange("lastMaintenanceDate", e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        />
      </div>
    </div>
  );
};

export default AdBoardForm;
