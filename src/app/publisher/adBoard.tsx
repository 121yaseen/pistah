export type AdBoard = {
    pic: File | null;
    type: string;
    count: number;
    location: string;
    size: string;
    more: string
};

export interface AdBoardFormProps {
    adBoard: AdBoard;
    onChange: (field: keyof AdBoard, value: string | File | number | null) => void;
}
