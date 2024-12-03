import React from 'react';
import { AdBoardFormProps } from './adBoard';

const AdBoardForm: React.FC<AdBoardFormProps> = ({
    adBoard,
    onChange,
}) => {
    return (
        <div className="border rounded p-4">
            <div className="grid grid-cols-2 gap-4 items-center mb-4">
                <label className="font-medium">Ad Space Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        onChange('pic', e.target.files?.[0] || null)
                    }
                    className="p-2 border rounded border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-800"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center mb-4">
                <label className="font-medium">Type of Ad Space</label>
                <input
                    required
                    type="text"
                    value={adBoard.type}
                    onChange={(e) => onChange('type', e.target.value)}
                    className="p-2 border rounded border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-800"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center mb-4">
                <label className="font-medium">Size</label>
                <input
                    required
                    type="text"
                    value={adBoard.size}
                    onChange={(e) => onChange('size', e.target.value)}
                    className="p-2 border rounded border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-800"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center mb-4">
                <label className="font-medium">Number of spaces</label>
                <input
                    required
                    type="number"
                    value={adBoard.count}
                    onChange={(e) =>
                        onChange('count', parseInt(e.target.value, 10))
                    }
                    className="p-2 border rounded border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-800"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center mb-4">
                <label className="font-medium">Locations served</label>
                <input
                    required
                    type="text"
                    value={adBoard.location}
                    onChange={(e) => onChange('location', e.target.value)}
                    className="p-2 border rounded border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-800"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center mb-4">
                <label className="font-medium">Tell us more</label>
                <textarea
                        value={adBoard.more}
                        rows={4}
                        onChange={(e) => onChange('more', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800" />
            </div>
        </div>
    );
};

export default AdBoardForm;
