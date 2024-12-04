import { AdBoard } from "@/types/ad";
import React, { createContext, useContext, useState } from "react";

type PublisherState = {
  adBoards: AdBoard[];
  addAdBoard: (board: AdBoard) => void;
  editAdBoard: (index: number, board: AdBoard) => void;
  removeAdBoard: (index: number) => void;
};

const PublisherContext = createContext<PublisherState | undefined>(undefined);

export const PublisherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adBoards, setAdBoards] = useState<AdBoard[]>([]);

  const addAdBoard = (board: AdBoard) => {
    setAdBoards((prev) => [...prev, board]);
  };

  const editAdBoard = (index: number, board: AdBoard) => {
    setAdBoards((prev) =>
      prev.map((item, idx) => (idx === index ? board : item))
    );
  };

  const removeAdBoard = (index: number) => {
    setAdBoards((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <PublisherContext.Provider
      value={{ adBoards, addAdBoard, editAdBoard, removeAdBoard }}
    >
      {children}
    </PublisherContext.Provider>
  );
};

export const usePublisherState = () => {
  const context = useContext(PublisherContext);
  if (!context) {
    throw new Error(
      "usePublisherState must be used within a PublisherProvider"
    );
  }
  return context;
};
