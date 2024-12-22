import { AdWithBoard } from "@/types/ad";

export const fetchAds = async (date?: string): Promise<AdWithBoard[]> => {
  console.log(date);
  const response = await fetch("/api/ads", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ads");
  }

  const data: AdWithBoard[] = await response.json();
  return data;
};
