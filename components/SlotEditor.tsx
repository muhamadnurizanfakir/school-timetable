import React, { useState, useEffect } from 'react';
import { TimetableSlot, DayOfWeek, DAYS } from '../types';
import { supabase } from '../services/supabase';
import { Button } from './Button';

interface SlotEditorProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
  initialData?: TimetableSlot | null;
}

export const SlotEditor: React.FC<SlotEditorProps> = ({ isOpen, onClose, personId, initialData }) => {
  const [formData, setFormData] = useState({
    day_of_week: 'Monday' as DayOfWeek,
    start_time: '08:00',
    end_time: '09:00',
    subject: '',
    teacher: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        day_of_week: initialData.day_of_week,
        start_time: initialData.start_time.slice(0, 5), // Ensure HH:MM format
        end_time: initialData.end_time.slice(0, 5),
        subject: initialData.subject,
        teacher: initialData.teacher
      });
    } else {
      // Reset defaults for new entry
      setFormData({
        day_of_week: 'Monday',
        start_time: '08:00',
        end_time: '09:00',
        subject: '',
        teacher: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        // Update
        const { error } = await supabase
          .from('timetable_slots')
          .update({
            day_of_week: formData.day_of_week,
            start_time: formData.start_time,
            end_time: formData.end_time,
            subject: formData.subject,
            teacher: formData.teacher
          })
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('timetable_slots')
          .insert([{
            person_id: personId,
            day_of_week: formData.day_of_week,
            start_time: formData.start_time,
            end_time: formData.end_time,
            subject: formData.subject,
            teacher: formData.teacher
          }]);
          
        if (error) throw error;
      }
      onClose();
    } catch (err) {
      console.error("Error saving slot:", err);
      alert("Failed to save slot. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Slot' : 'Add New Slot'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Day</label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({...formData, day_of_week: e.target.value as DayOfWeek})}
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Teacher</label>
            <input
              type="text"
              required
              placeholder="e.g. Mr. Smith"
              value={formData.teacher}
              onChange={(e) => setFormData({...formData, teacher: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Save Slot</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
