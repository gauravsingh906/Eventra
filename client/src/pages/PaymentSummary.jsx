import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowBack } from 'react-icons/io';
import { UserContext } from '../UserContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { CreditCard, Phone, Mail, User } from "lucide-react";
import Qrcode from 'qrcode';
import { Calendar, Lock } from "lucide-react";

export default function PaymentSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    details: {
      name: user?.name || '',
      email: user?.email || '',
      contactNo: '',
    },
    payment: {
      nameOnCard: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    }
  });

  const [errors, setErrors] = useState({});

  const defaultTicketState = {
    userid: user?._id || '',
    eventid: '',
    ticketDetails: {
      name: user?.name || '',
      email: user?.email || '',
      eventname: '',
      eventdate: '',
      eventtime: '',
      ticketprice: '',
      qr: '',
    }
  };

  const [ticketDetails, setTicketDetails] = useState(defaultTicketState);

  useEffect(() => {
    if (!id) {
      toast.error("Event ID not found");
      navigate('/');
      return;
    }
    
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`/event/${id}/ordersummary/paymentsummary`);
        setEvent(response.data);
        setTicketDetails(prev => ({
          ...prev,
          eventid: response.data._id,
          ticketDetails: {
            ...prev.ticketDetails,
            eventname: response.data.title,
            eventdate: response.data.eventDate.split("T")[0],
            eventtime: response.data.eventTime,
            ticketprice: response.data.ticketPrice,
          }
        }));
      } catch (error) {
        toast.error("Failed to fetch event details");
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.details.name) newErrors.name = "Name is required";
    if (!formData.details.email) newErrors.email = "Email is required";
    if (!formData.details.contactNo) newErrors.contactNo = "Contact number is required";
    if (!formData.payment.nameOnCard) newErrors.nameOnCard = "Card name is required";
    if (!formData.payment.cardNumber) newErrors.cardNumber = "Card number is required";
    if (!formData.payment.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!formData.payment.cvv) newErrors.cvv = "CVV is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (section, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const generateQRCode = async (name, eventName) => {
    try {
      return await Qrcode.toDataURL(`Event Name: ${eventName}\nName: ${name}`);
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      const qrCode = await generateQRCode(
        formData.details.name,
        ticketDetails.ticketDetails.eventname
      );

      if (!qrCode) {
        throw new Error("Failed to generate QR code");
      }

      const updatedTicketDetails = {
        ...ticketDetails,
        ticketDetails: {
          ...ticketDetails.ticketDetails,
          name: formData.details.name,
          email: formData.details.email,
          qr: qrCode,
        }
      };

      await axios.post('/tickets', updatedTicketDetails);
      
      toast.success("Payment successful! Your ticket has been created.");
      navigate('/wallet');
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200 p-6">
        <Skeleton className="h-10 w-24 mb-8" />
        <div className="flex flex-col lg:flex-row gap-6">
          <Skeleton className="h-[600px] w-full lg:w-2/3" />
          <Skeleton className="h-[400px] w-full lg:w-1/3" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <Link to={`/event/${event._id}/ordersummary`}>
        <Button variant="outline" className="mb-8 flex items-center gap-2">
          <IoMdArrowBack className="w-5 h-5" /> Back
        </Button>
      </Link>

     

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.details.name}
                        onChange={(e) => handleChange('details', e)}
                        className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.details.email}
                        onChange={(e) => handleChange('details', e)}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNo">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactNo"
                        name="contactNo"
                        value={formData.details.contactNo}
                        onChange={(e) => handleChange('details', e)}
                        className={`pl-10 ${errors.contactNo ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.contactNo && <p className="text-sm text-red-500">{errors.contactNo}</p>}
                  </div>
                </div>
              </div>

              <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Payment Details</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name on Card */}
        <div className="space-y-2">
          <Label htmlFor="nameOnCard" className="text-gray-700 dark:text-gray-300">Name on Card</Label>
          <Input
            id="nameOnCard"
            name="nameOnCard"
            value={formData.payment.nameOnCard}
            onChange={(e) => handleChange('payment', e)}
            placeholder="John Doe"
            className={`rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.nameOnCard ? 'border-red-500' : ''}`}
          />
          {errors.nameOnCard && <p className="text-sm text-red-500">{errors.nameOnCard}</p>}
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-gray-700 dark:text-gray-300">Card Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="cardNumber"
              name="cardNumber"
              value={formData.payment.cardNumber}
              onChange={(e) => handleChange('payment', e)}
              placeholder="1234 5678 9012 3456"
              className={`pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.cardNumber ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <Label htmlFor="expiryDate" className="text-gray-700 dark:text-gray-300">Expiry Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.payment.expiryDate}
              onChange={(e) => handleChange('payment', e)}
              className={`pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.expiryDate ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
        </div>

        {/* CVV */}
        <div className="space-y-2">
          <Label htmlFor="cvv" className="text-gray-700 dark:text-gray-300">CVV</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="cvv"
              name="cvv"
              type="password"
              maxLength="3"
              placeholder="•••"
              value={formData.payment.cvv}
              onChange={(e) => handleChange('payment', e)}
              className={`pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.cvv ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
        </div>
      </div>
    </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.eventDate.split("T")[0]}</p>
                <p className="text-sm text-gray-600">{event.eventTime}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span>1 Ticket</span>
                  <span className="font-semibold">LKR. {event.ticketPrice}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>LKR. {event.ticketPrice}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={createTicket}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay LKR. ${event.ticketPrice}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}