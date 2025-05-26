
// src/app/book/bike/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, User, Clock, Route, MapPin, Users, PersonStanding, Bike as BikeIcon, Phone } from "lucide-react";
import type { Ride } from '@/lib/mockData';
import { mockRides } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";

const PageVehicleIcon = BikeIcon;
const pageTitle = "Available Bikes";
const vehicleType: Ride["vehicle"] = "bike";

export default function BookBikePage() {
  const filteredRides = mockRides.filter(ride => ride.vehicle === vehicleType);
  const { toast } = useToast();

  const passengerSeats = (capacity: number) => {
    if (capacity <= 1) return "0 (Driver only)";
    return `${capacity - 1}`;
  };

  const handleBookRide = (ride: Ride) => {
    toast({
      title: "Bike Ride Request Sent!",
      description: `Your request for a bike ride with ${ride.name} has been notionally sent.`,
      variant: "default",
    });
    console.log(`Booking bike ride with ${ride.name} (ID: ${ride.id})`);
    // In a real app, this would trigger backend logic
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

        {filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredRides.map((ride) => (
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
                    <span className="font-medium">Time:</span>&nbsp;{ride.timeToGo}
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
