import { AdBoard } from "@/types/ad";

export const createAdBoard = async (
  adBoard: AdBoard | null
): Promise<AdBoard> => {
  if (!adBoard) {
    throw new Error("Ad board data is required");
  }
  const formData = new FormData();

  if (adBoard.image) {
    formData.append("image", adBoard?.image as File);
  }
  formData.append("boardName", adBoard?.boardName ?? "");
  formData.append("location", adBoard?.location ?? "");
  formData.append("dailyRate", adBoard?.dailyRate.toString() ?? "");
  formData.append("ownerContact", adBoard?.ownerContact ?? "");
  formData.append("boardType", adBoard?.boardType ?? "");

  const response = await fetch("/api/adBoard", {
    method: "POST",
    body: formData,
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

export const updateAdBoard = async (
  adBoard: AdBoard | null
): Promise<AdBoard> => {
  if (!adBoard) {
    throw new Error("Ad board data is required");
  }
  const response = await fetch(`/api/adBoard/${adBoard.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adBoard }),
  });

  if (!response.ok) {
    throw new Error("Failed to update ad board");
  }

  return response.json();
};

export const deleteAdBoard = async (id: string): Promise<void> => {
  const response = await fetch(`/api/adBoard?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete ad board");
  }
};
