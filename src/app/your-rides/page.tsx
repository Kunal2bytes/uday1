
// src/app/your-rides/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, User, Clock, Route, MapPin, Users, PersonStanding, Phone, Trash2, PackageOpen } from "lucide-react";
import type { Ride } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";
import { formatTimeTo12Hour } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function YourRidesPage() {
  const [bookedRides, setBookedRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedRidesString = localStorage.getItem('bookedRides');
      if (storedRidesString) {
        const ridesFromStorage: Ride[] = JSON.parse(storedRidesString);
        // Sort by createdAt if available, most recent first
        ridesFromStorage.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          }
          // Fallback if createdAt is missing, though unlikely with Firestore data
          return 0; 
        });
        setBookedRides(ridesFromStorage);
      }
    } catch (error) {
      console.error("Error loading booked rides from localStorage:", error);
      toast({ title: "Error", description: "Could not load your booked rides.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  const passengerSeats = (capacity: number) => {
    if (capacity <= 1) return "0 (Driver only)";
    return `${capacity - 1}`;
  };

  const handleRemoveRide = (rideIdToRemove: string) => {
    try {
      const updatedRides = bookedRides.filter(ride => ride.id !== rideIdToRemove);
      setBookedRides(updatedRides);
      localStorage.setItem('bookedRides', JSON.stringify(updatedRides));
      toast({
        title: "Ride Removed",
        description: "The ride has been removed from Your Rides.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error removing ride from localStorage:", error);
      toast({ title: "Error", description: "Could not remove the ride.", variant: "destructive" });
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
            <PackageOpen className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">Your Booked Rides</h1>
          </div>
          <p className="text-muted-foreground text-center sm:text-left">
            Here are the rides you've booked.
          </p>
        </header>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-6">Loading your rides...</p>
        ) : bookedRides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {bookedRides.map((ride) => (
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
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full flex items-center">
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will remove the ride from your booked list. It cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveRide(ride.id)}>
                          Yes, Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <PackageOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">You haven't booked any rides yet.</p>
            <p className="text-sm text-muted-foreground">
              Find a ride on the dashboard and click "Book Ride" to add it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

    