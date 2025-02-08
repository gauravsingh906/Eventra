import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function TicketPage() {
  const { user } = useContext(UserContext);
  const [userTickets, setUserTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/tickets/user/${user._id}`);
      setUserTickets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      toast.error("Could not fetch tickets. Please try again.");
      setIsLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`/tickets/${ticketId}`);
      fetchTickets();
      toast.success("Ticket deleted successfully.");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Could not delete ticket. Please try again.");
    }
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-500 p-6">
        <div className="w-full max-w-4xl space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="w-full h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex pt-16 flex-col items-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-500 p-6">
      <div className="w-full max-w-4xl">
        <Link to="/">
          <Button 
            variant="outline" 
            className="mb-6 flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50"
          >
            <IoMdArrowBack className="w-5 h-5" /> Back to Home
          </Button>
        </Link>

        {userTickets.length === 0 ? (
          <div className="text-center text-white">
            <p>No tickets found. Book an event to see your tickets!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTickets.map((ticket) => (
              <Card 
                key={ticket._id} 
                className="bg-gray-200 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform "
              >
                <CardContent className="p-4 relative">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
                      >
                        <RiDeleteBinLine className="h-6 w-6" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Ticket?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this ticket? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTicket(ticket._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div 
                    onClick={() => openTicketDetails(ticket)}
                    className="cursor-pointer"
                  >
                    <img 
                      src={ticket.ticketDetails.qr} 
                      alt="QR Code" 
                      className="w-32 h-32 mx-auto object-cover rounded-md mb-4"
                    />
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-indigo-700">
                        {ticket.ticketDetails.eventname.toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {ticket.ticketDetails.eventdate.split("T")[0]} | {ticket.ticketDetails.eventtime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent>
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.ticketDetails.eventname}</DialogTitle>
                <DialogDescription>Ticket Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p><strong>Date:</strong> {selectedTicket.ticketDetails.eventdate.split("T")[0]}</p>
                <p><strong>Time:</strong> {selectedTicket.ticketDetails.eventtime}</p>
                <p><strong>Name:</strong> {selectedTicket.ticketDetails.name}</p>
                <p><strong>Email:</strong> {selectedTicket.ticketDetails.email}</p>
                <p><strong>Price:</strong> Rs. {selectedTicket.ticketDetails.ticketprice}</p>
                <p><strong>Ticket ID:</strong> {selectedTicket._id}</p>
              </div>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
