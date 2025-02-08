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
      <div className="min-h-screen bg-gray-100 p-6">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to={`/event/${event._id}/ordersummary`}>
        <Button variant="outline" className="mb-8 flex items-center gap-2">
          <IoMdArrowBack className="w-5 h-5" /> Back
        </Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardHeader>
              <h2 className="text-2xl font-bold text-center text-gray-800">Complete Your Purchase</h2>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.details.name}
                    onChange={(e) => handleChange('details', e)}
                    className={`rounded-md ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.details.email}
                    onChange={(e) => handleChange('details', e)}
                    className={`rounded-md ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={formData.details.contactNo}
                  onChange={(e) => handleChange('details', e)}
                  className={`rounded-md ${errors.contactNo ? 'border-red-500' : ''}`}
                />
                {errors.contactNo && <p className="text-sm text-red-500">{errors.contactNo}</p>}
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-xl hover:from-indigo-500 hover:to-blue-500 transition"
                onClick={createTicket}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay LKR. ${event.ticketPrice}`}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:w-1/3">
          <Card className="bg-gray-50 shadow-md rounded-xl p-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <h3 className="font-bold">{event.title}</h3>
              <p>{event.eventDate.split("T")[0]} | {event.eventTime}</p>
              <p>1 Ticket - <strong>LKR. {event.ticketPrice}</strong></p>
              <hr />
              <p className="font-bold text-lg">Total: LKR. {event.ticketPrice}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
