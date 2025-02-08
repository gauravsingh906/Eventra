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
import { CreditCard, Phone, Mail, User, Calendar, Lock } from "lucide-react";
import Qrcode from 'qrcode';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <Skeleton className="h-20 w-48 rounded-xl" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6">
      <Link to={`/event/${event._id}/ordersummary`}>
        <Button variant="outline" className="mb-6 flex items-center gap-2 hover:bg-gray-200">
          <IoMdArrowBack className="w-5 h-5" /> Back
        </Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader className="bg-blue-500 text-white rounded-t-2xl p-4">
              <h2 className="text-xl font-bold text-center">Complete Your Purchase</h2>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.details.name}
                    onChange={(e) => handleChange('details', e)}
                    className={`rounded-xl focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.details.email}
                    onChange={(e) => handleChange('details', e)}
                    className={`rounded-xl focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              <Button 
                onClick={createTicket}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl py-3 hover:from-blue-600 hover:to-indigo-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay LKR. ${event.ticketPrice}`}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/3">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="bg-indigo-500 text-white rounded-t-2xl p-4 text-center">
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.eventDate.split("T")[0]} - {event.eventTime}</p>
                <p className="font-semibold mt-2">Price: LKR. {event.ticketPrice}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}