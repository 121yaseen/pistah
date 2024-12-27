import {
  createAdBoardAsync,
  deleteAdBoardAsync,
  updateAdBoardAsync,
} from "@/repositories/adBoardRepository";
import { AdBoard } from "@/types/ad";

export const createAdBoard = async (adBoard: AdBoard): Promise<unknown> => {
  const response = await createAdBoardAsync(adBoard);
  return response;
};

// Delete an Ad Board
export const deleteAdBoard = async (id: string): Promise<unknown> => {
  const response = await deleteAdBoardAsync(id);
  return response;
};

// Update an Ad Board
export const updateAdBoard = async (adBoard: AdBoard): Promise<unknown> => {
  const response = await updateAdBoardAsync(adBoard);
  return response;
};
