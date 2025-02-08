import  { useContext, useEffect, useRef } from 'react';
import { UserContext } from "../UserContext";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut, User, Calendar, Shield } from 'lucide-react';
import Hammer from 'hammerjs';

export default function UserAccountPage() {
  const { user } = useContext(UserContext);
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (cardRef.current) {
      const hammer = new Hammer(cardRef.current);
      
      // Enable all directions
      hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
      
      // Handle swipe gestures
      hammer.on('swipe', (e) => {
        const card = cardRef.current;
        if (!card) return;
        
        // Reset any existing transforms
        card.style.transition = 'transform 0.5s ease-out';
        
        if (e.direction === Hammer.DIRECTION_LEFT) {
          card.style.transform = 'translateX(-100vw)';
          setTimeout(() => window.location.href = '/', 500);
        } else if (e.direction === Hammer.DIRECTION_UP) {
          card.style.transform = 'translateY(-100vh)';
          // Trigger logout here if needed
        }
      });
      
      // Cleanup
      return () => {
        hammer.destroy();
      };
    }
  }, []);

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Link to="/">
        <Button variant="ghost" className="text-white hover:text-gray-300">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </Link>

      <div className="mt-8 flex flex-col items-center">
        <div 
          ref={cardRef}
          className="w-full max-w-md transform transition-all duration-300 hover:scale-102"
        >
          <Card className="bg-gray-800 border-none shadow-xl">
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute -top-40 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="mt-20 text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user.name}
                  </h2>
                  <p className="text-gray-400 mt-1">{user.email}</p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6">
                  <div className="flex items-center p-4 bg-gray-700 rounded-lg">
                    <User className="w-6 h-6 text-purple-400" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-400">Profile Status</p>
                      <p className="font-semibold">Active</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-700 rounded-lg">
                    <Calendar className="w-6 h-6 text-pink-400" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p className="font-semibold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-700 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-400" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-400">Account Type</p>
                      <p className="font-semibold">{user.role || 'User'}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Swipe left to go home • Swipe up to logout
        </p>
      </div>
    </div>
  );
}