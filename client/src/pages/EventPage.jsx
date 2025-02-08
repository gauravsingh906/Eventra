import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  // Fetch event data by ID
  useEffect(() => {
    if (!id) return;
    axios
      .get(`/event/${id}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [id]);

  // Copy link functionality
  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  // WhatsApp share functionality
  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  // Facebook share functionality
  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      linkToShare
    )}`;
    window.open(facebookShareUrl);
  };

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-12 text-white">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {event.image && (
          <motion.img
            src={`${event.image}`}
            alt={event.title}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
       
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Event Details Card */}
        <div className="absolute bottom-0 left-10">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {event.title.toUpperCase()}
          </motion.h1>
        </div>
        <motion.div
          className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Event Details</h2>
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-lg">
                <AiFillCalendar className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Date and Time</h3>
                <p className="text-gray-400">
                  {event.eventDate.split("T")[0]} | {event.eventTime}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <MdLocationPin className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Location</h3>
                <p className="text-gray-400">{event.location}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-2">About the Event</h3>
              <p className="text-gray-400">{event.description}</p>
            </div>

            {/* Organized By */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Organized By</h3>
              <p className="text-gray-400">{event.organizedBy}</p>
            </div>

            {/* Ticket Price */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Ticket Price</h3>
              <p className="text-gray-400">
                {event.ticketPrice === 0
                  ? "Free"
                  : `LKR. ${event.ticketPrice}`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          className="mt-12 bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Share with Friends</h2>
          <div className="flex gap-6">
            <button
              onClick={handleCopyLink}
              className="p-4 bg-gray-700/50 hover:bg-purple-500/10 rounded-lg transition-all duration-300"
            >
              <FaCopy className="w-6 h-6 text-purple-500" />
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="p-4 bg-gray-700/50 hover:bg-green-500/10 rounded-lg transition-all duration-300"
            >
              <FaWhatsappSquare className="w-6 h-6 text-green-500" />
            </button>
            <button
              onClick={handleFacebookShare}
              className="p-4 bg-gray-700/50 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
            >
              <FaFacebook className="w-6 h-6 text-blue-500" />
            </button>
          </div>
        </motion.div>

        {/* Book Ticket Button */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Link to={`/event/${event._id}/ordersummary`}>
            <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              Book Ticket
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}