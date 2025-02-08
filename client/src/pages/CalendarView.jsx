/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameDay } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const EventCard = ({ event, onClick }) => (
  <Card className="hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/50">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 truncate">{event.title}</h3>
          <p className="text-sm text-gray-500">{format(new Date(event.eventDate), 'PPP')}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 text-white text-xs font-medium">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-8">
              <button
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>

              <h2 className="text-3xl font-bold text-gray-800">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>

              <button
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-100 rounded-md">
                  {day}
                </div>
              ))}

              {emptyCells.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square p-2 bg-gray-50 rounded-md" />
              ))}

              {daysInMonth.map((date) => {
                const dayEvents = getEventsByDate(date);
                const isCurrentDay = isSameDay(new Date(), date);

                return (
                  <div
                    key={date.toISOString()}
                    className={`aspect-square p-2 bg-white rounded-lg border transition-transform hover:shadow-lg hover:scale-105 ${isCurrentDay ? 'ring-2 ring-primary' : 'border-gray-200'}`}
                  >
                    <div className={`font-medium mb-1 ${isCurrentDay ? 'text-primary' : 'text-gray-700'}`}>
                      {format(date, 'd')}
                    </div>

                    <div className="space-y-1 max-h-[80%] overflow-y-auto">
                      {dayEvents.map((event) => (
                        <button
                          key={event._id}
                          onClick={() => handleEventClick(event._id)}
                          className="w-full text-left px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors truncate font-medium"
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
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
