import React from 'react';
import { TimetableSlot, formatTime } from '../types';

interface TimetableSlotCardProps {
  slot: TimetableSlot;
  isAdmin: boolean;
  onEdit: (slot: TimetableSlot) => void;
  onDelete: (id: string) => void;
}

export const TimetableSlotCard: React.FC<TimetableSlotCardProps> = ({ slot, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="bg-white border-l-4 border-indigo-500 shadow-sm rounded-r-md p-3 mb-3 relative group">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800 text-lg">{slot.subject}</h4>
          <p className="text-sm text-gray-600 font-medium">{slot.teacher}</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-semibold">
            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
          </span>
        </div>
      </div>
      
      {isAdmin && (
        <div className="mt-3 flex justify-end space-x-2 border-t pt-2 border-gray-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(slot)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(slot.id)}
            className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
