"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { AdWithBoard } from "@/types/ad";
import { fetchAds } from "@/app/services/adService";
import AdBoardList from "./AdBoardList";
import DateRangePicker from "../shared/DateRangePicker";

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const formattedStartDate = startDate?.toISOString().split("T")[0];
  const {
    data: ads,
    error,
    isValidating,
  } = useSWR<AdWithBoard[]>(`/api/ads`, () => fetchAds(formattedStartDate));

  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  };

  return (
    <div className="p-6 bg-dashboardBg text-gray-700 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onTodayClick={handleTodayClick}
        />
      </div>

      {/* Content */}
      <div>
        {error ? (
          <div className="text-red-500">Error loading ads.</div>
        ) : isValidating && !ads ? (
          <div>Loading ads...</div>
        ) : ads && ads.length > 0 ? (
          <AdBoardList ads={ads} />
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No ads available for the selected date.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
