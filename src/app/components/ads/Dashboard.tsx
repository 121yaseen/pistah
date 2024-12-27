"use client";

import React, { useEffect, useState } from "react";
import { AdWithBoard } from "@/types/ad";
import { fetchAds } from "@/app/services/adService";
import AdBoardList from "./AdBoardList";
import DateRangePicker from "../shared/DateRangePicker";
import Loader from "../shared/LoaderComponent";

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [ads, setAds] = useState<AdWithBoard[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate || new Date());
  const formattedEndDate = formatDate(endDate || new Date());

  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      fetchAds(formattedStartDate, formattedEndDate).then(
        (data) => {
          setAds(data);
          setError(false);
          setLoading(false);
        },
        (err) => {
          setError(true);
          console.error(err);
          setLoading(false);
        }
      );
    }
  }, []);

  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  };

  const handleSearch = () => {
    setLoading(true);
    fetchAds(formattedStartDate, formattedEndDate).then(
      (data) => {
        setAds(data);
        setError(false);
        setLoading(false);
      },
      (err) => {
        setError(true);
        console.error(err);
        setLoading(false);
      }
    );
  };

  return (
    <div className="bg-dashboardBg text-gray-700 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {/* Header */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onTodayClick={handleTodayClick}
        onSearch={handleSearch} // Pass handleSearch to DateRangePicker
      />

      {/* Content */}
      <div>
        {error ? (
          <div className="text-red-500">Error loading ads.</div>
        ) : !ads || loading ? (
          <Loader isVisible={true} />
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
