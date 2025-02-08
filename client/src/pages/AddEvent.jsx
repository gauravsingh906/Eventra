/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserContext } from '../UserContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2Icon, Calendar, Clock, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';

export default function AddEvent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    owner: '',
    title: '',
    optional: '',
    description: '',
    organizedBy: '',
    eventDate: '',
    eventTime: '',
    location: '',
    ticketPrice: 0,
    image: null,
    likes: 0
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, owner: user.name }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files?.length) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    const submitPromise = axios.post('/createEvent', submissionData, {
      headers: { 'Content-Type': 'multipart/form-data' } ,withCredentials: true
    });

    toast.promise(submitPromise, {
      loading: 'Creating event...',
      success: () => {
        setTimeout(() => navigate('/events'), 1000);
        return 'Event created successfully!';
      },
      error: 'Failed to create event. Please try again.',
    });

    try {
      await submitPromise;
    } catch {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        <Icon className="w-5 h-5" />
      </div>
      <Input {...props} className={`pl-10 ${props.className}`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Event Title</Label>
                <InputField
                  icon={Calendar}
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                />
              </div>
              <div className="space-y-2">
  <Label htmlFor="organizedBy" className="text-sm font-medium">Organized By</Label>
  <InputField
    icon={MapPin} // You can choose a different icon if you prefer
    id="organizedBy"
    name="organizedBy"
    required
    value={formData.organizedBy}
    onChange={handleChange}
    placeholder="Enter organizer's name"
  />
</div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <InputField
                    icon={Calendar}
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Event Time</Label>
                  <InputField
                    icon={Clock}
                    id="eventTime"
                    name="eventTime"
                    type="time"
                    required
                    value={formData.eventTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <InputField
                  icon={MapPin}
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Event location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                <InputField
                  icon={DollarSign}
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.ticketPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[120px] resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="image">Event Image</Label>
                <div className="mt-1">
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors duration-200">
                      <ImageIcon className="w-8 h-8 text-blue-500" />
                      <span className="mt-2 text-base leading-normal text-gray-600">Select an image</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-white"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/events')}
                disabled={isSubmitting}
                className="w-32"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-32 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}