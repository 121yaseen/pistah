import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiSearch } from "react-icons/bi";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  onTodayClick: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onTodayClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-8 py-8">
      {/* Today Button */}
      <button
        onClick={onTodayClick}
        className="h-16 px-8 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-200 font-semibold text-lg rounded-full shadow-md border border-gray-300 dark:border-gray-700 hover:shadow-lg transition flex items-center justify-center"
      >
        Today
      </button>

      {/* From-To Capsule */}
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-300 dark:border-gray-700 px-6 h-16 w-full max-w-5xl">
        {/* From Date Picker */}
        <div className="flex items-center gap-4 w-full">
          <label className="font-semibold text-gray-700 dark:text-gray-200 text-base whitespace-nowrap">
            From
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Select Date"
            className="bg-transparent text-gray-600 dark:text-gray-300 outline-none text-base w-full"
          />
        </div>

        {/* Vertical Divider */}
        <div className="border-l border-gray-300 dark:border-gray-600 h-8 mx-4"></div>

        {/* To Date Picker */}
        <div className="flex items-center gap-4 w-full">
          <label className="font-semibold text-gray-700 dark:text-gray-200 text-base whitespace-nowrap">
            To
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Select Date"
            className="bg-transparent text-gray-600 dark:text-gray-300 outline-none text-base w-full"
          />
        </div>

        {/* Search Button */}
        <div
          className="
              p-2 
              bg-secondaryBlue
              hover:bg-secondaryBlue
              dark:bg-white
              dark:hover:bg-secondaryBlue
              rounded-full 
              text-white 
              dark:text-secondaryBlue
              dark:hover:text-white
              shadow-md
              cursor-pointer
            "
        >
          <BiSearch size={30} />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
