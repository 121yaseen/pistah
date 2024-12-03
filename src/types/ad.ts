import { AdBoardType } from "@/app/enums/AdBoardType";

export interface Ad {
  id: number;
  title: string;
  downloadLink: string;
  adBoardId: number;
  adDisplayStartDate: string;
  adDisplayEndDate: string;
  adDuration: string;
}

export type AdBoard =
  | {
      boardType: AdBoardType.STATIC;
      id: number;
      boardName: string;
      location: string;
      dimensions: string;
      isAvailable: boolean;
      dailyRate: number;
      operationalHours: string;
      ownerContact: string;
      lastMaintenanceDate: Date;
      additionalNotes?: string;
    }
  | {
      boardType: AdBoardType.DIGITAL | AdBoardType.MOVING_DIGITAL;
      id: number;
      boardName: string;
      location: string;
      dimensions: string;
      isAvailable: boolean;
      dailyRate: number;
      operationalHours: string;
      ownerContact: string;
      lastMaintenanceDate: Date;
      digitalFeatures: string[];
      mobilityDetails?: string; // Only for moving digital boards
      additionalNotes?: string;
    };

export interface AdWithBoard extends Ad {
  adBoard?: AdBoard | null;
}
