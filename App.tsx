import React, { useEffect, useState, useMemo } from 'react';
import { supabase, isConfigured } from './services/supabase';
import { Person, TimetableSlot, DAYS, getMinutesFromTime } from './types';
import { AuthModal } from './components/AuthModal';
import { TimetableSlotCard } from './components/TimetableSlotCard';
import { SlotEditor } from './components/SlotEditor';
import { Button } from './components/Button';

function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Auth State
  // Initialize with null to avoid Promise issues during render
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  const isAdmin = useMemo(() => {
    return !!session;
  }, [session]);

  // If credentials are missing, show the setup screen immediately
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full text-center">
          <div className="mb-6 flex justify-center">
            <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Setup Required</h1>
          <p className="text-gray-600 mb-6">
            The application is running, but it's not connected to Supabase yet.
          </p>
          
          <div className="text-left bg-gray-100 p-4 rounded-md mb-6 font-mono text-sm overflow-x-auto">
            <p className="font-bold text-gray-700 mb-2">Status:</p>
            <p className="text-red-600">❌ Missing Environment Variables</p>
            <p className="text-gray-500 mt-1">VITE_SUPABASE_URL</p>
            <p className="text-gray-500">VITE_SUPABASE_ANON_KEY</p>
          </div>

          <div className="space-y-4 text-left">
            <h3 className="font-bold text-gray-800">Next Steps:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Complete the Supabase setup.</li>
              <li>Add the environment variables to your Vercel project settings.</li>
              <li>Redeploy or restart the application.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // 1. Initial Data Fetch & Auth Listener
  useEffect(() => {
    // Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Fetch Persons
    const fetchPersons = async () => {
      if (!isConfigured) return;
      
      const { data, error } = await supabase.from('persons').select('*').order('name');
      if (error) {
         console.error('Error loading persons:', error);
         setLoading(false);
      } else if (data) {
        setPersons(data);
        // Default selection logic: ADEEB RAZIN or first available
        const defaultPerson = data.find(p => p.name.toUpperCase() === 'ADEEB RAZIN');
        if (defaultPerson) setSelectedPersonId(defaultPerson.id);
        else if (data.length > 0) setSelectedPersonId(data[0].id);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchPersons();

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Slots when Person Changes & Realtime Subscription
  useEffect(() => {
    if (!selectedPersonId || !isConfigured) return;

    const fetchSlots = async () => {
      const { data, error } = await supabase
        .from('timetable_slots')
        .select('*')
        .eq('person_id', selectedPersonId);
      
      if (error) console.error('Error fetching slots:', error);
      else setSlots(data || []);
    };

    fetchSlots();

    // Realtime Subscription
    const channel = supabase
      .channel('timetable_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timetable_slots',
          filter: `person_id=eq.${selectedPersonId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSlots(prev => [...prev, payload.new as TimetableSlot]);
          } else if (payload.eventType === 'DELETE') {
            setSlots(prev => prev.filter(slot => slot.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setSlots(prev => prev.map(slot => slot.id === payload.new.id ? payload.new as TimetableSlot : slot));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPersonId]);

  // 3. Derived State: Group slots by Day
  const slotsByDay = useMemo(() => {
    const grouped: Record<string, TimetableSlot[]> = {};
    DAYS.forEach(day => {
      grouped[day] = slots
        .filter(s => s.day_of_week === day)
        .sort((a, b) => getMinutesFromTime(a.start_time) - getMinutesFromTime(b.start_time));
    });
    return grouped;
  }, [slots]);

  // Helper to group slots that share the EXACT same time
  const groupSlotsByTime = (daySlots: TimetableSlot[]) => {
    const timeGroups: TimetableSlot[][] = [];
    
    daySlots.forEach(slot => {
      const lastGroup = timeGroups[timeGroups.length - 1];
      
      if (lastGroup && lastGroup.length > 0) {
        const lastSlot = lastGroup[0];
        // Check if times match
        if (lastSlot.start_time === slot.start_time && lastSlot.end_time === slot.end_time) {
          lastGroup.push(slot);
          return;
        }
      }
      // Start new group
      timeGroups.push([slot]);
    });
    
    return timeGroups;
  };

  // Handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    const { error } = await supabase.from('timetable_slots').delete().eq('id', id);
    if (error) alert('Error deleting slot');
  };

  const handleEditSlot = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setIsEditorOpen(true);
  };

  const handleAddSlot = () => {
    setEditingSlot(null);
    setIsEditorOpen(true);
  };

  if (loading && isConfigured) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-medium">Loading Timetable...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-indigo-600 hidden sm:block">School Timetable</h1>
              <span className="text-xs text-gray-500 hidden sm:block">Realtime Updates</span>
            </div>
            
            {/* Person Selector */}
            <div className="relative">
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="appearance-none bg-indigo-50 border border-indigo-200 text-indigo-900 py-2 pl-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
              >
                {persons.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div>
            {isAdmin ? (
               <div className="flex items-center space-x-2">
                 <span className="text-xs text-gray-500 hidden sm:inline mr-2">Admin Mode</span>
                 <Button variant="primary" onClick={handleAddSlot} className="text-sm">
                   + Add Slot
                 </Button>
                 <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                 </button>
               </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                Admin Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedPersonId ? (
          <div className="text-center py-20 text-gray-500">
            No active schedules found. Admin needs to set up Persons.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {DAYS.map(day => {
              const daySlots = slotsByDay[day] || [];
              // Group slots by time for side-by-side rendering
              const timeGroups = groupSlotsByTime(daySlots);

              return (
                <div key={day} className="flex flex-col">
                  <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-t-lg text-center uppercase tracking-wide text-sm mb-2">
                    {day}
                  </div>
                  <div className="flex-1 space-y-2 min-h-[100px]">
                    {timeGroups.length > 0 ? (
                      timeGroups.map((group, groupIndex) => {
                        const isMulti = group.length > 1;
                        return (
                          <div 
                            key={groupIndex} 
                            className={`w-full ${isMulti ? 'grid grid-cols-2 gap-2' : ''}`}
                          >
                            {group.map(slot => (
                              <TimetableSlotCard
                                key={slot.id}
                                slot={slot}
                                isAdmin={!!isAdmin}
                                onEdit={handleEditSlot}
                                onDelete={handleDeleteSlot}
                                className="h-full" 
                              />
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center p-6 text-gray-400 text-sm">
                        No classes
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {isEditorOpen && selectedPersonId && (
        <SlotEditor 
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          personId={selectedPersonId}
          initialData={editingSlot}
        />
      )}
    </div>
  );
}

export default App;
