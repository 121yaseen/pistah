import { AdBoard } from "@/types/ad";

export const createAdBoard = async (
  adBoard: AdBoard | null
): Promise<unknown> => {
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

export const fetchAdBoards = async () => {
  const response = await fetch("/api/adBoard");
  if (!response.ok) {
    throw new Error("Failed to fetch ad boards");
  }
  return response.json();
};
