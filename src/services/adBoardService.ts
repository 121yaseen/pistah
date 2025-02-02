import {
  createAdBoardAsync,
  deleteAdBoardAsync,
  updateAdBoardAsync,
} from "@/repositories/adBoardRepository";
import { AdBoard, User } from "@/types/ad";

export const createAdBoard = async (adBoard: AdBoard, createdByUser: User) => {
  return await createAdBoardAsync(adBoard, createdByUser);
};

// Delete an Ad Board
export const deleteAdBoard = async (id: string, user: User) => {
  return await deleteAdBoardAsync(id, user);
};

// Update an Ad Board
export const updateAdBoard = async (adBoard: AdBoard, user: User) => {
  return await updateAdBoardAsync(adBoard, user);
};
