import { AdWithBoard } from "@/types/ad";

export const fetchAds = async (
  startDate?: string,
  endDate?: string
): Promise<AdWithBoard[]> => {
  // Fetch ads from the API with the given date range
  const response = await fetch(
    `/api/creatives?startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch ads");
  }

  const data: AdWithBoard[] = await response.json();
  return data;
};
