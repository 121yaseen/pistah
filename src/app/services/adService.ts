import { AdWithBoard } from "@/types/ad";

export const fetchAds = async (date?: string): Promise<AdWithBoard[]> => {
  const today = new Date();
  const formattedDate = date || today.toISOString().split("T")[0];

  const response = await fetch("/api/ads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date: formattedDate }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ads");
  }

  const data: AdWithBoard[] = await response.json();
  return data;
};
