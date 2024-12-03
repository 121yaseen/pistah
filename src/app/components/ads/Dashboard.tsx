"use client";

import React, { useState } from "react";
import useSWR from "swr";
import AdList from "./AdList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AdWithBoard } from "@/types/ad";
import { fetchAds } from "@/app/services/adService";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Dynamically construct the SWR key based on the selected date
  const formattedDate = selectedDate?.toISOString().split("T")[0];
  const {
    data: ads,
    error,
    isValidating,
  } = useSWR<AdWithBoard[]>(
    formattedDate ? `/api/ads?date=${formattedDate}` : null,
    () => fetchAds(formattedDate)
  );

  return (
    <div className="p-6 bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <label htmlFor="date-picker" className="text-lg font-medium">
          Select Date:
        </label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
        />
      </div>
      {error && (
        <div className="text-red-500 dark:text-red-300">
          Error loading ads. Please try again.
        </div>
      )}
      {isValidating && !ads && (
        <div className="text-center text-gray-700 dark:text-gray-300">
          Loading ads...
        </div>
      )}
      {ads?.length ? (
        <>
          <h2 className="text-xl mb-4">Total Ads: {ads.length}</h2>
          <AdList ads={ads} />
        </>
      ) : (
        !isValidating && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No ads available for the selected date.
          </p>
        )
      )}
    </div>
  );
};

export default Dashboard;
