import { AdBoard } from "@/types/ad";

export const createAdBoard = async (
  adBoard: AdBoard | null
): Promise<AdBoard> => {
  if (!adBoard) {
    throw new Error("Ad board data is required");
  }
  const response = await fetch("/api/adBoard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adBoard }),
  });

  if (!response.ok) {
    throw new Error("Failed to create ad board");
  }

  return response.json();
};

export const fetchAdBoards = async (): Promise<AdBoard[]> => {
  const response = await fetch("/api/adBoard");
  if (!response.ok) {
    throw new Error("Failed to fetch ad boards");
  }
  return response.json();
};
