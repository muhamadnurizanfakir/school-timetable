import React from 'react';
import { TimetableSlot, formatTime, getSubjectColor } from '../types';

interface TimetableSlotCardProps {
  slot: TimetableSlot;
  isAdmin: boolean;
  onEdit: (slot: TimetableSlot) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export const TimetableSlotCard: React.FC<TimetableSlotCardProps> = ({ slot, isAdmin, onEdit, onDelete, className = '' }) => {
  const color = getSubjectColor(slot.subject);

  return (
    <div className={`${color.bg} ${color.border} border rounded-lg p-3 shadow-sm relative group transition-all hover:shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-2 mb-1">
             <span className={`${color.label} ${color.text} text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider`}>
               {slot.subject.substring(0, 3)}
             </span>
             <span className={`text-xs ${color.text} font-medium`}>
               {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
             </span>
          </div>
          <h4 className={`font-bold ${color.text} text-base truncate leading-tight`}>{slot.subject}</h4>
          <p className={`text-xs ${color.text} opacity-80 font-medium mt-1 truncate`}>{slot.teacher}</p>
        </div>
      </div>
      
      {isAdmin && (
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(slot)}
            className="bg-white/50 hover:bg-white text-gray-700 p-1 rounded backdrop-blur-sm shadow-sm"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(slot.id)}
            className="bg-white/50 hover:bg-red-100 text-red-600 p-1 rounded backdrop-blur-sm shadow-sm"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
