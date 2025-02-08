
import { 
  Github,
  
  Instagram, 
  Twitter,
  Linkedin,
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Upper Footer Section */}
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-indigo-500" />
              <span className="text-2xl font-bold text-white">Eventra</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your events into unforgettable experiences. Eventra provides cutting-edge event management solutions for organizers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Our Services</h3>
            <ul className="space-y-4">
              {['Event Planning', 'Venue Management', 'Ticket Solutions', 'Virtual Events', 'Analytics Dashboard'].map((service) => (
                <li key={service} className="group flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Partner Program', 'Press Kit'].map((item) => (
                <li key={item} className="group flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-400">
                <PhoneCall className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">contact@Eventra.io</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">88 Innovation Hub, Silicon Valley, CA 94025</span>
              </li>
            </ul>
            <div className="pt-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Subscribe to newsletter" 
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-md text-sm transition-colors duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Eventra. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;