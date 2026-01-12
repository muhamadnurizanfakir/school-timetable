import React, { useMemo } from 'react';
import { TimetableSlot, DAYS, getSubjectColor, getMinutesFromTime, formatTime } from '../types';

interface PrintableTimetableProps {
  slots: TimetableSlot[];
  personName: string;
  logoUrl?: string;
}

export const PrintableTimetable: React.FC<PrintableTimetableProps> = ({ slots, personName, logoUrl }) => {
  // 1. Calculate the Time Grid
  // We need to find every unique start and end time to create our grid columns.
  const timeGrid = useMemo(() => {
    const times = new Set<number>();
    
    // Default bounds (e.g., 7:30 AM to 6:30 PM if empty)
    times.add(7 * 60 + 30);
    times.add(18 * 60 + 30);

    slots.forEach(slot => {
      times.add(getMinutesFromTime(slot.start_time));
      times.add(getMinutesFromTime(slot.end_time));
    });

    const sortedTimes = Array.from(times).sort((a, b) => a - b);
    
    // Create intervals [start, end, duration]
    const intervals: { start: number; end: number; label: string }[] = [];
    for (let i = 0; i < sortedTimes.length - 1; i++) {
      intervals.push({
        start: sortedTimes[i],
        end: sortedTimes[i+1],
        label: `${formatMinToTime(sortedTimes[i])} - ${formatMinToTime(sortedTimes[i+1])}`
      });
    }
    return intervals;
  }, [slots]);

  // Default logo if none provided
  const displayLogo = logoUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Emblem_of_Malaysia.svg/244px-Emblem_of_Malaysia.svg.png';

  return (
    <div className="w-full bg-white p-4">
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-2">
        <div className="flex items-center justify-center space-x-6">
            {/* 
              Using object-contain to preserve aspect ratio. 
              The block class ensures it behaves like a block element.
            */}
            {displayLogo && (
              <img 
                src={displayLogo} 
                alt="School Logo" 
                className="h-24 w-auto object-contain block"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase font-sans">{personName || 'TIMETABLE'}</h1>
                <p className="text-gray-600 text-sm mt-1 uppercase tracking-widest">School Schedule • {new Date().getFullYear()}</p>
            </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="w-full border-2 border-gray-800 rounded-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 w-20 text-center font-bold text-gray-800 bg-gray-200">
                DAY
              </th>
              {timeGrid.map((interval, idx) => (
                <th key={idx} className="border border-gray-400 p-1 text-[10px] text-center font-medium text-gray-600 w-24 h-12 bg-gray-50">
                  <div className="flex flex-col justify-center h-full">
                     <span>{formatMinToTime(interval.start)}</span>
                     <span className="text-gray-400 text-[8px]">-</span>
                     <span>{formatMinToTime(interval.end)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => {
              const daySlots = slots.filter((s) => s.day_of_week === day);
              
              const cells = [];
              let skipCount = 0;

              for (let i = 0; i < timeGrid.length; i++) {
                if (skipCount > 0) {
                    skipCount--;
                    continue;
                }

                const interval = timeGrid[i];
                
                // Find slots that START exactly at this interval's start
                const slotsStartingHere = daySlots.filter(s => getMinutesFromTime(s.start_time) === interval.start);

                if (slotsStartingHere.length > 0) {
                    const maxEnd = Math.max(...slotsStartingHere.map(s => getMinutesFromTime(s.end_time)));
                    
                    // Calculate how many intervals this covers
                    let span = 0;
                    for (let j = i; j < timeGrid.length; j++) {
                        if (timeGrid[j].end <= maxEnd) span++;
                        else break;
                    }
                    
                    skipCount = span - 1;

                    // Render the cell
                    const color = getSubjectColor(slotsStartingHere[0].subject);
                    const isMulti = slotsStartingHere.length > 1;
                    
                    cells.push(
                        <td key={i} colSpan={span} className={`border border-gray-400 p-1 relative ${color.bg} align-top`}>
                            {/* Flex-col ensures vertical stacking of items */}
                            <div className={`w-full h-full min-h-[80px] flex flex-col justify-center items-center`}>
                                {slotsStartingHere.map((slot, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`
                                        flex-1 flex flex-col items-center justify-center text-center w-full 
                                        ${isMulti && idx > 0 ? 'border-t border-gray-400/50 pt-1' : ''}
                                      `}
                                    >
                                        <div className={`
                                          font-black ${color.text} leading-tight uppercase
                                          ${isMulti ? 'text-sm' : 'text-xl'}
                                        `}>
                                            {slot.subject}
                                        </div>
                                        {slot.teacher && (
                                            <div className="text-[10px] font-semibold text-gray-600 mt-0.5 bg-white/40 px-1 rounded">
                                                {slot.teacher}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </td>
                    );

                } else {
                    cells.push(<td key={i} className="border border-gray-400 bg-white"></td>);
                }
              }

              return (
                <tr key={day}>
                  <td className="border border-gray-400 p-4 font-black text-2xl text-center text-gray-800 bg-white h-24">
                    {day.substring(0, 2)}
                  </td>
                  {cells}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-[10px] text-gray-500 flex justify-between">
         <span>Generated automatically by School Timetable System</span>
         <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// Helper for pure minutes to "HH:MM"
const formatMinToTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')}`;
};
