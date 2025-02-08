import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {/* Company Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-white text-2xl font-bold">Evento EMS</h3>
          <p className="text-sm leading-relaxed">
            Empowering your events with seamless management solutions.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-sky-400 transition-all duration-300 transform hover:scale-110">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-110">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-700 transition-all duration-300 transform hover:scale-110">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-white text-xl font-semibold">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link to="/events" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                Events
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-white text-xl font-semibold">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300">
              <Mail className="h-4 w-4" />
              <span>info@eventoems.com</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300">
              <Phone className="h-4 w-4" />
              <span>+1 (234) 567-890</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300">
              <MapPin className="h-4 w-4" />
              <span>123 Event St, Event City</span>
            </li>
          </ul>
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-white text-xl font-semibold">Stay Updated</h3>
          <p className="text-sm leading-relaxed">Subscribe to our newsletter for the latest event updates.</p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors duration-300 text-sm">
              Subscribe
            </button>
          </div>
        </motion.div>

      </div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-gray-800 py-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Evento EMS. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1 animate-pulse" />
            <span>by Evento Team</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}