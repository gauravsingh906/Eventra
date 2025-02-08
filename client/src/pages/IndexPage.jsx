import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Clock, 
  Ticket, 
  ArrowRightCircle, 
  Quote,
  Heart,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function IndexPage() {
  const [events, setEvents] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    "Connecting people through unforgettable experiences.",
    "Discover events that ignite your passion.",
    "Every event is a new adventure waiting for you.",
    "Celebrate life with events that matter.",
    "Your next unforgettable moment starts here."
  ];

  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(quoteInterval);
  }, []);

  const handleLike = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === eventId
          ? { ...event, liked: !event.liked, likes: event.liked ? event.likes - 1 : (event.likes || 0) + 1 }
          : event
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="../src/assets/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Discover Amazing Events
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-gray-300 italic flex items-center justify-center">
              <Quote className="w-6 h-6 text-pink-400 mr-3" />
              {quotes[currentQuote]}
              <Quote className="w-6 h-6 text-pink-400 ml-3 rotate-180" />
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
        >
          Explore Events
        </motion.button>
      </div>
    </section>
        {/* Featured Events */}
        <section className="px-6 py-16 bg-gray-850">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-center underline underline-offset-8 decoration-gray-400 text-pink-500 mb-12"

          >
            Featured Events
          </motion.h2>

          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {events.map((event) => (
              <motion.div
                key={event._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-pink-500/50 transition duration-300 relative"
              >
                <div className="relative">
                  <img
                    src={`${event.image}`}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleLike(event._id)}
                    className="absolute top-4 right-4 p-2 bg-black/90 rounded-full hover:bg-pink-500 hover:text-white transition duration-300"
                  >
                    <Heart className="w-5 h-5" /> {event.likes || 0}
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-white truncate">
                    {event.title.toUpperCase()}
                  </h3>

                  <div className="flex items-center space-x-3 text-gray-400">
                    <CalendarDays className="w-5 h-5" />
                    <span>{event.eventDate.split("T")[0]}</span>
                    <Clock className="w-5 h-5 ml-3" />
                    <span>{event.eventTime}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <span className="truncate">{event.location || 'Online'}</span>
                    <Ticket className="w-5 h-5 ml-3" />
                    <span>{event.ticketPrice === 0 ? 'Free' : `Rs. ${event.ticketPrice}`}</span>
                  </div>

                  <Link to={`/event/${event._id}`} className="block mt-4">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Reserve Spot
                      <ArrowRightCircle className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-900 to-pink-900 text-white text-center py-16">
          <motion.h3
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Create Memories?
          </motion.h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-purple-900 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Start Exploring
          </motion.button>
        </section>
      </main>
    </div>
  );
}