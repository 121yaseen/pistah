import { AdBoard } from "@/types/ad";

export interface AdBoardFormProps {
  adBoard: AdBoard;
  onChange: (
    field: keyof AdBoard,
    value: string | File | number | null
  ) => void;
}
