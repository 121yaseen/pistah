import { createAdBoardAsync } from "@/repositories/adBoardRepository";
import { AdBoard } from "@/types/ad";

export const createAdBoard = async (adBoard: AdBoard): Promise<unknown> => {
  const response = await createAdBoardAsync(adBoard);
  return response;
};
