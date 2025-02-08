import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrderSummary() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/event/${id}/ordersummary`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Skeleton className="h-10 w-24 mb-8" />
        <div className="flex flex-col lg:flex-row gap-6">
          <Skeleton className="h-[600px] w-full lg:w-3/4" />
          <Skeleton className="h-[400px] w-full lg:w-1/4" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to={'/event/' + event._id}>
        <Button variant="outline" className="mb-8 flex items-center gap-2">
          <IoMdArrowBack className="w-5 h-5" /> Back
        </Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-3/4">
          <CardHeader>
            <h2 className="text-2xl font-bold">Terms & Conditions</h2>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] rounded-md border p-4">
              <ul className="space-y-4 text-sm">
                {[
                  "Refunds will be provided for ticket cancellations made up to 14 days before the event date. After this period, no refunds will be issued.",
                  "Tickets will be delivered to your registered email address as e-tickets. You can print the e-ticket or show it on your mobile device for entry.",
                  "Maximum of 2 tickets per individual to ensure fair distribution.",
                  "For cancellations, attendees will be notified via email with automatic refund processing.",
                  "Tickets for postponed events remain valid for the new date without refund.",
                  "Your privacy is protected under our privacy policy which governs data collection and usage.",
                  "Review and accept our terms before purchase to proceed with ticketing services."
                ].map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:w-1/4">
          <CardHeader>
            <h2 className="text-xl font-bold">Booking Summary</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm">{event.title}</span>
              <span className="font-medium">LKR. {event.ticketPrice}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold">
                <span>TOTAL</span>
                <span>LKR. {event.ticketPrice}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={isCheckboxChecked}
                onCheckedChange={(checked) => setIsCheckboxChecked(checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I have verified the event details and accept the terms and conditions.
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Link to={`/event/${event._id}/ordersummary/paymentsummary`} className="w-full">
              <Button 
                className="w-full"
                disabled={!isCheckboxChecked}
                variant={isCheckboxChecked ? "default" : "secondary"}
              >
                Proceed to Payment
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}