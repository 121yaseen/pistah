import { AdBoardType } from "@/app/enums/AdBoardType";

export interface Ad {
  id: string;
  title: string;
  downloadLink: string;
  adBoardId: string;
  adDisplayStartDate: string;
  adDisplayEndDate: string;
  adDuration: string;
  thumbnailUrl: string;
  remarks: string;
  videoUrl: string;
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
}

export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicUrl: string | null;
  company: Company | null;
}

export interface CustomToken {
  user?: {
    name?: string;
    email?: string;
  };
}
