import { AdBoardType } from "@/app/enums/AdBoardType";

export interface Ad {
  id?: string;
  title: string;
  downloadLink: string;
  adBoardId: string;
  adDisplayStartDate: string;
  adDisplayEndDate: string;
  adDuration: string;
  thumbnailUrl: string;
  remarks: string;
  videoUrl: string;
}

export interface AdWithBoard extends Ad {
  adBoard: AdBoard;
}

export interface AdBoard {
  id?: string;
  images?: File[];
  boardType: AdBoardType;
  boardName: string;
  location: string;
  dailyRate: number;
  ownerContact: string;
  count?: number;
  size?: string;
  more?: string;
  imageUrls?: string[];
}

export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: Company;
  profilePicUrl: string;
}

export interface CustomToken {
  user?: {
    name?: string;
    email?: string;
  };
}
