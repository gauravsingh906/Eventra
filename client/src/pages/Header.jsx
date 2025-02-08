import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { 
  LogOut, 
  Search, 
  PlusCircle, 
  Wallet, 
  Calendar, 
  Bell, 
  Menu, 
  X,
  User 
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("/events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  async function logout() {
    await axios.post('/logout');
    setUser(null);
  }

  return (
    <header className="bg-gray-900 text-white py-4 px-6 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 tracking-wide drop-shadow-md">
        Eventra
      </div>
    </Link>

        {/* Search Bar */}
        <div className="flex-grow mx-8 max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchQuery && (
              <Card className="absolute top-full mt-2 w-full bg-gray-800 border-none shadow-xl rounded-xl z-50">
                {events
                  .filter((event) =>
                    event.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((event) => (
                    <Link 
                      key={event._id} 
                      to={`/event/${event._id}`}
                      className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                    >
                      {event.title}
                    </Link>
                  ))
                }
              </Card>
            )}
          </div>
        </div>

        {/* Navigation and User Actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/createEvent" 
              className="flex items-center text-white hover:text-purple-400 transition-colors"
            >
              <PlusCircle className="mr-2" />
              Create Event
            </Link>
            <Link 
              to="/calendar" 
              className="flex items-center text-white hover:text-purple-400 transition-colors"
            >
              <Calendar className="mr-2" />
              Calendar
            </Link>
            <Bell className="text-white hover:text-purple-400 transition-colors cursor-pointer" />
          </div>

          {/* User Section */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center bg-gray-800 px-3 py-2 rounded-full hover:bg-purple-800 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name.toUpperCase()}
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <Link 
                    to="/useraccount" 
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <User className="mr-2" /> Account
                  </Link>
                  <Link 
                    to="/wallet" 
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <Wallet className="mr-2" /> Wallet
                  </Link>
                  <button 
                    onClick={logout} 
                    className="w-full text-left px-4 py-2 text-white hover:bg-red-600 transition-colors flex items-center"
                  >
                    <LogOut className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-gray-900 z-50">
          <div className="px-6 pt-4 pb-8 space-y-4">
            <Link 
              to="/createEvent" 
              className="block py-2 border-b border-gray-800 flex items-center"
            >
              <PlusCircle className="mr-4" /> Create Event
            </Link>
          
            <Link 
              to="/calendar" 
              className="block py-2 border-b border-gray-800 flex items-center"
            >
              <Calendar className="mr-4" /> Calendar
            </Link>
   
          </div>
        </div>
      )}
    </header>
  );
}