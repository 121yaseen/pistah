import { AdBoardType } from "@/app/enums/AdBoardType";

export interface Ad {
  id: string;
  title: string;
  downloadLink?: string;
  adBoardId: string;
  adDisplayStartDate: string;
  adDisplayEndDate: string;
  adDuration: string;
  thumbnailUrl?: string;
  remarks?: string;
  videoUrl?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdWithBoard extends Ad {
  adBoard: AdBoard;
}

export interface AdBoard {
  id: string;
  boardName: string;
  location: string;
  description?: string; // Added optional description field
  boardType: AdBoardType;
  dailyRate: number;
  operationalHours: string;
  ownerContact: string;
  lastMaintenanceDate: string;
  imageUrl: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  dimensions: string;
  isAvailable: boolean;
  images?: File[];
  bookings?: Booking[]; // Added for SSP users to see booked ads
}

export interface Booking {
  id: string;
  userId: string;
  adId: string;
  adBoardId: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicUrl?: string;
  company?: Company | null;
  role: Role; // Ensuring correct role typing
}

export enum Role {
  OWNER = "OWNER",
  ADVERTISER = "ADVERTISER",
}

export interface CustomToken {
  user?: {
    id: string;
    name?: string;
    email?: string;
    role: "SSP" | "DSP";
  };
}
