
// src/app/book/auto/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, User, Clock, Route, MapPin, Users, PersonStanding, CarTaxiFront as AutoIcon, Phone } from "lucide-react";
import type { Ride } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";
import { formatTimeTo12Hour } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"; // Ensure Timestamp is imported

const PageVehicleIcon = AutoIcon;
const pageTitle = "Available Autos";
const vehicleType: Ride["vehicle"] = "auto";

export default function BookAutoPage() {
  const [autoRides, setAutoRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAutoRides = async () => {
      setIsLoading(true);
      try {
        const ridesRef = collection(db, "rides");
        const q = query(ridesRef, where("vehicle", "==", vehicleType), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ridesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
        setAutoRides(ridesData);
      } catch (error) {
        console.error("Error fetching auto rides:", error);
        toast({ title: "Error", description: "Could not fetch auto rides.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchAutoRides();
  }, [toast]);

  const passengerSeats = (capacity: number) => {
    if (capacity <= 1) return "0 (Driver only)";
    return `${capacity - 1}`;
  };

  const handleBookRide = (ride: Ride) => {
    toast({
      title: "Auto Ride Request Sent!",
      description: `Your request for an auto ride with ${ride.name} has been notionally sent.`,
      variant: "default",
    });
    console.log(`Booking auto ride with ${ride.name} (ID: ${ride.id}) - Check browser console for this message.`);
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
          <p className="text-center text-muted-foreground py-6">Loading auto rides...</p>
        ) : autoRides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {autoRides.map((ride) => (
              <Card key={ride.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground rounded-lg overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg text-primary">
                    <User className="mr-2 h-5 w-5" /> {ride.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Vehicle: {ride.vehicle} | Driver's Gender: {ride.gender}
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
          <p className="text-center text-muted-foreground py-6">
            No {vehicleType} rides found.
          </p>
        )}
      </div>
    </div>
  );
}
