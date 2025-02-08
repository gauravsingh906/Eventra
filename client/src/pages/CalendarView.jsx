import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameDay } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onClick }) => (
  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
          <p className="text-sm text-gray-500">{format(new Date(event.eventDate), 'PPP')}</p>
        </div>
        <div className="px-2 py-1 rounded bg-primary/10 text-primary text-sm">
          {event.type || 'Event'}
        </div>
      </div>
    </CardContent>
  </Card>
);

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const emptyCells = Array.from({ length: firstDayOfWeek });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsByDate = (date) => {
    return filteredEvents.filter((event) => 
      format(new Date(event.eventDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-8">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>

              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-50 rounded">
                  {day}
                </div>
              ))}

              {emptyCells.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square p-2 bg-gray-50/50 rounded" />
              ))}

              {daysInMonth.map((date) => {
                const dayEvents = getEventsByDate(date);
                const isCurrentDay = isSameDay(new Date(), date);

                return (
                  <div
                    key={date.toISOString()}
                    className={`aspect-square p-2 bg-white rounded border transition-all hover:shadow-md ${isCurrentDay ? 'ring-2 ring-primary' : 'border-gray-200'}`}
                  >
                    <div className={`font-medium mb-1 ${isCurrentDay ? 'text-primary' : 'text-gray-700'}`}>
                      {format(date, 'd')}
                    </div>

                    <div className="space-y-1 max-h-[80%] overflow-y-auto">
                      {dayEvents.map((event) => (
                        <button
                          key={event._id}
                          onClick={() => handleEventClick(event._id)}
                          className="w-full text-left px-2 py-1 text-xs md:text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors truncate font-medium"
                          title={event.title}
                        >
                          {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} onClick={() => handleEventClick(event._id)} />
              ))
            ) : (
              <p className="text-gray-500">No upcoming events found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CalendarView;
