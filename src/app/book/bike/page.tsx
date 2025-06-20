
// src/app/book/bike/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, User, Clock, Route, MapPin, Users, Bike as BikeIcon, Phone, CheckCircle } from "lucide-react";
import type { Ride } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";
import { formatTimeTo12Hour } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, type Timestamp, doc, deleteDoc } from "firebase/firestore";

const PageVehicleIcon = BikeIcon;
const pageTitle = "Available Bikes";
const vehicleType: Ride["vehicle"] = "bike";

export default function BookBikePage() {
  const [bikeRides, setBikeRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBikeRides = async () => {
      setIsLoading(true);
      try {
        const ridesRef = collection(db, "rides");
        const q = query(ridesRef, where("vehicle", "==", vehicleType), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ridesData = querySnapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() } as Ride));
        setBikeRides(ridesData);
      } catch (error) {
        console.error("Error fetching bike rides:", error);
        toast({ title: "Error", description: "Could not fetch bike rides.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchBikeRides();
  }, [toast]);

  const passengerSeats = (capacity: number) => {
    if (capacity <= 1) return "0 (Driver only)";
    return `${capacity - 1}`;
  };

  const handleBookRide = async (rideToBook: Ride) => {
    try {
      const existingBookedRidesString = localStorage.getItem('bookedRides');
      let bookedRides: Ride[] = existingBookedRidesString ? JSON.parse(existingBookedRidesString) : [];
      const isRideAlreadyBooked = bookedRides.some(bookedRide => bookedRide.id === rideToBook.id);
      if (!isRideAlreadyBooked) {
        bookedRides.push(rideToBook);
        localStorage.setItem('bookedRides', JSON.stringify(bookedRides));
      }
    } catch (e) {
      console.error("Failed to save ride to localStorage:", e);
      toast({
        title: "Error Saving Ride",
        description: "Could not save this ride to 'Your Rides'.",
        variant: "destructive",
      });
      return; 
    }

    try {
      const rideRef = doc(db, "rides", rideToBook.id);
      await deleteDoc(rideRef);
      setBikeRides(prevRides => prevRides.filter(r => r.id !== rideToBook.id));
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" />
            <span>Your ride booked.</span>
          </div>
        ),
        description: "Go to the menu page and check the 'Your Rides' section.",
        variant: "default",
      });
    } catch (error) {
      console.error(`Error deleting ${vehicleType} ride from Firestore:`, error);
      toast({
        title: "Booking Error",
        description: `Could not remove the ${vehicleType} ride from available listings. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <Link href="/" passHref legacyBehavior>
            <Button variant="outline" className="mb-4 group flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-center sm:justify-start mb-2">
            <PageVehicleIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">{pageTitle}</h1>
          </div>
          <p className="text-muted-foreground text-center sm:text-left">
            Browse available {vehicleType}s shared by other users.
          </p>
        </header>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-6">Loading bike rides...</p>
        ) : bikeRides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {bikeRides.map((ride) => (
              <Card key={ride.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground rounded-lg overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg text-primary">
                    <User className="mr-2 h-5 w-5" /> {ride.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Vehicle: {ride.vehicle} | Driver's Gender: {ride.gender}
                    {ride.vehicleNumber && ` | Number: ${ride.vehicleNumber}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm flex-grow">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Time:</span>&nbsp;{formatTimeTo12Hour(ride.timeToGo)}
                  </div>
                  <div className="flex items-center">
                    <Route className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">From:</span>&nbsp;{ride.origin}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">To:</span>&nbsp;{ride.destination}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Passenger Seats:</span>&nbsp;
                    {passengerSeats(ride.seatingCapacity)}
                  </div>
                  {ride.contactNumber && (
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Contact:</span>&nbsp;
                      <a href={`tel:${ride.contactNumber}`} className="text-primary hover:underline">
                        {ride.contactNumber}
                      </a>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-3">
                  <Button
                    onClick={() => handleBookRide(ride)}
                    className="w-full"
                    size="sm"
                  >
                    Book Ride
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <PageVehicleIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-xl font-semibold text-muted-foreground">No {vehicleType} rides found yet.</p>
            <p className="text-sm text-muted-foreground">
              Why not be the first to share one? Or check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
