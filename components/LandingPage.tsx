import React from 'react';
import { Person } from '../types';

interface LandingPageProps {
  persons: Person[];
  onSelectPerson: (personId: string) => void;
  loading: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ persons, onSelectPerson, loading }) => {
  // Helper to determine logo (mirroring logic from App.tsx for consistency)
  const getLogo = (person: Person) => {
    if (person.logo_url) return person.logo_url;
    const name = person.name.toUpperCase();
    if (name.includes('AKIF')) {
      return 'https://mrgjokwsphsgxekkwhdb.supabase.co/storage/v1/object/sign/logo/sks7.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZWRhMDhkZi1kMWQ0LTQyMmEtYWQzYi05ZGQzNjEwOTIzMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL3NrczcucG5nIiwiaWF0IjoxNzY4MTk4MDg5LCJleHAiOjMzNDQ5OTgwODl9.2cA2tivxT7DjKMMTHqBlxDlYCqy1zB9uT2mraX-wj3c';
    }
    if (name.includes('ADEEB') || name.includes('KHADIJAH')) {
      return 'https://mrgjokwsphsgxekkwhdb.supabase.co/storage/v1/object/sign/logo/smksgramal.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZWRhMDhkZi1kMWQ0LTQyMmEtYWQzYi05ZGQzNjEwOTIzMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL3Nta3NncmFtYWwucG5nIiwiaWF0IjoxNzY4MTk4MTY2LCJleHAiOjMzNDQ5OTgxNjZ9.QRAAPemCubDjrSlq_moLMTrKnN1Ol6DNx0L0JOHckK8';
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Emblem_of_Malaysia.svg/244px-Emblem_of_Malaysia.svg.png';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 font-medium">Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          School Timetable Portal
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select a student below to view their weekly class schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {persons.map((person) => (
          <button
            key={person.id}
            onClick={() => onSelectPerson(person.id)}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 overflow-hidden text-center flex flex-col h-64 transform hover:-translate-y-1"
          >
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 group-hover:bg-indigo-50/30 transition-colors">
              <img
                src={getLogo(person)}
                alt={`${person.name} logo`}
                className="h-32 w-auto object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6 border-t border-gray-100 bg-white relative flex items-center justify-center">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {person.name}
              </h3>
              {/* Optional: Simple arrow indicator that stays on the right, or could be removed for pure centering */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {persons.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new person in the database.</p>
        </div>
      )}
    </div>
  );
};
