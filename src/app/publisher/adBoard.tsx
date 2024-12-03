// export type AdBoard = {
//     pic: File | null;
//     type: string;
//     count: number;
//     location: string;
//     size: string;
//     more: string
// };

export interface AdBoardFormProps {
  adBoard: AdBoard;
  onChange: (
    field: keyof AdBoard,
    value: string | File | number | null
  ) => void;
}

export interface AdBoard {
  id?: number; // Optional unique identifier for the board
  pic: File | null; // Image of the ad board
  boardType?: "Static" | "Digital" | "Moving Digital"; // Optional type of board
  boardName: string; // Name of the board
  location: string; // Address or location details
  dimensions: string; // Dimensions of the board (e.g., "10x20 ft")
  dailyRate: number; // Rental rate per day
  operationalHours: string; // Operational hours (e.g., "9 AM - 6 PM")
  ownerContact: string; // Contact details for the board owner
  lastMaintenanceDate: string; // Date of last maintenance in ISO format
  count: number; // Number of similar boards
  size: string; // Additional size details
  more: string; // Any extra details about the board
  isAvailable: boolean; // Availability status
}

export const getDefaultAdBoard = (): AdBoard => ({
  id: undefined,
  pic: null, // Default to no image
  boardType: "Static", // Default board type
  boardName: "", // Empty string for board name
  location: "", // Empty string for location
  dimensions: "", // Empty string for dimensions
  dailyRate: 0, // Default daily rate
  operationalHours: "", // Empty string for operational hours
  ownerContact: "", // Empty string for owner contact
  lastMaintenanceDate: new Date().toISOString().split("T")[0], // Default to today's date
  count: 1, // Default count
  size: "", // Empty string for size
  more: "", // Empty string for additional details
  isAvailable: true, // Default to available
});
