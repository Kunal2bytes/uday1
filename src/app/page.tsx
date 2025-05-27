
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, MapPin, Share2, Bus, Bike, Car, CarTaxiFront, ListChecks, User, Clock, Route, Users, Search, PersonStanding, Phone } from "lucide-react";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Ride } from '@/lib/mockData'; 
import { useToast } from "@/hooks/use-toast";
import { formatTimeTo12Hour } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const ServiceButton = ({ icon, label, onClick, href }: { icon: React.ReactNode; label: string; onClick?: () => void; href?: string }) => {
  const buttonContent = (
    <div className="flex items-center space-x-3">
      {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-primary" })}
      <span>{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <Button
          asChild
          className="w-full justify-start text-left py-4 px-5 bg-card hover:bg-accent/80 shadow-md rounded-full text-card-foreground font-medium text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-150 ease-in-out active:scale-[0.98]"
        >
          <a>{buttonContent}</a>
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={onClick}
      className="w-full justify-start text-left py-4 px-5 bg-card hover:bg-accent/80 shadow-md rounded-full text-card-foreground font-medium text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-150 ease-in-out active:scale-[0.98]"
    >
      {buttonContent}
    </Button>
  );
};

export default function DashboardPage() {
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [allRidesFromDB, setAllRidesFromDB] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRides = async () => {
      setIsLoadingRides(true);
      try {
        const ridesCollectionRef = collection(db, "rides");
        // Consider adding orderBy('createdAt', 'desc') if you want to show newest rides first
        const q = query(ridesCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ridesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
        setAllRidesFromDB(ridesData);
      } catch (error) {
        console.error("Error fetching rides from Firestore: ", error);
        toast({
          title: "Error Fetching Rides",
          description: "Could not load rides from the database. Please try again later.",
          variant: "destructive",
        });
      }
      setIsLoadingRides(false);
    };
    fetchRides();
  }, [toast]);

  useEffect(() => {
    const lowerOrigin = originSearch.toLowerCase().trim();
    const lowerDestination = destinationSearch.toLowerCase().trim();

    if (!lowerOrigin && !lowerDestination) {
      setFilteredRides([]);
      return;
    }

    const results = allRidesFromDB.filter(ride => {
      const rideOriginLower = ride.origin.toLowerCase();
      const rideDestinationLower = ride.destination.toLowerCase();
      
      const originMatch = lowerOrigin ? rideOriginLower.includes(lowerOrigin) : true;
      const destinationMatch = lowerDestination ? rideDestinationLower.includes(lowerDestination) : true;
      
      return originMatch && destinationMatch;
    });
    setFilteredRides(results);

  }, [originSearch, destinationSearch, allRidesFromDB]); 

  const showRidesList = originSearch.trim() !== "" || destinationSearch.trim() !== "";

  const handleBookRide = (ride: Ride) => {
    toast({
      title: "Ride Request Sent!",
      description: `Your request for a ride with ${ride.name} has been notionally sent.`,
      variant: "default",
    });
    console.log(`Booking ride with ${ride.name} (ID: ${ride.id}) - Check browser console for this message.`);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share HOPE App',
          text: 'Check out HOPE - a modern transportation app for ride-sharing and booking!',
          url: window.location.href,
        });
        console.log('App shared successfully');
      } catch (error) {
        console.error('Error sharing app:', error);
        let description = "Could not share the app at this moment. Please try again.";
        if (error instanceof Error && error.name === 'NotAllowedError') {
          description = "Sharing was blocked by your browser. This can happen if the request wasn't triggered by a direct user action or due to security settings.";
        } else if (error instanceof Error && error.name === 'AbortError') {
          description = "Sharing was cancelled.";
        }
        toast({
          title: "Sharing Failed",
          description: description,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sharing Not Supported",
        description: "Your browser does not support the Web Share API. You can copy the URL from the address bar.",
        variant: "default",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center">
      <div className="w-full max-w-lg">
        
        <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-sm border-b border-border/40">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="shrink-0">
                  <Menu className="h-6 w-6 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-card text-card-foreground p-6">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-semibold text-foreground">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-3">
                  <Link href="/terms-and-conditions" passHref legacyBehavior>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
                      asChild
                    >
                      <a>Terms and Conditions</a>
                    </Button>
                  </Link>
                  <Link href="/about-us" passHref legacyBehavior>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
                      asChild
                    >
                      <a>About Us</a>
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md">
                    Your Rides
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center"
                    onClick={handleShareApp}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share this App
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold mx-auto text-foreground">HOPE</h1>

            <div className="flex items-center justify-end ml-2 sm:ml-0">
              <Link href="/map" passHref legacyBehavior>
                <Button variant="ghost" size="icon" aria-label="Map" className="shrink-0" asChild>
                  <a><MapPin className="h-5 w-5 text-foreground" /></a>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-10 mt-2">
          <section aria-labelledby="search-rides-header" className="space-y-6 bg-card p-6 rounded-xl shadow-lg">
            <div>
              <h2 id="search-rides-header" className="text-2xl font-semibold text-primary mb-1">Find a Ride</h2>
              <p className="text-muted-foreground mb-4">Enter your origin and destination to find available rides.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="origin-search" className="text-sm font-medium text-muted-foreground">Origin</label>
                <Input
                  id="origin-search"
                  type="text"
                  placeholder="e.g. Central Park"
                  value={originSearch}
                  onChange={(e) => setOriginSearch(e.target.value)}
                  className="bg-input border-border placeholder:text-muted-foreground text-foreground rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="destination-search" className="text-sm font-medium text-muted-foreground">Destination</label>
                <Input
                  id="destination-search"
                  type="text"
                  placeholder="e.g. Times Square"
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  className="bg-input border-border placeholder:text-muted-foreground text-foreground rounded-lg"
                />
              </div>
            </div>
          </section>

          {showRidesList && (
            <section aria-labelledby="available-rides-header" className="space-y-4">
              <h2 id="available-rides-header" className="text-xl font-semibold text-muted-foreground mb-4">Available Shared Rides</h2>
              {isLoadingRides ? (
                <p className="text-center text-muted-foreground py-6">Loading rides...</p>
              ) : filteredRides.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRides.map((ride) => (
                    <Card key={ride.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground rounded-lg overflow-hidden flex flex-col">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg text-primary">
                          <User className="mr-2 h-5 w-5" /> {ride.name}
                        </CardTitle>
                        <CardDescription className="text-xs">Vehicle: {ride.vehicle} | Gender: {ride.gender}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1.5 text-sm flex-grow">
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
                <p className="text-center text-muted-foreground py-6">No shared rides found matching your criteria.</p>
              )}
            </section>
          )}

          <section aria-labelledby="share-ride-header">
            <h2 id="share-ride-header" className="text-lg font-semibold text-muted-foreground mb-4">Offer Your Ride</h2>
            <div className="space-y-3">
              <ServiceButton icon={<Share2 />} label="Share Your Ride" href="/share-ride" />
              <ServiceButton icon={<Bus />} label="Share a Bus Route & Time" href="/share-bus-route"/>
            </div>
          </section>

          <section aria-labelledby="book-ride-header">
            <h2 id="book-ride-header" className="text-lg font-semibold text-muted-foreground mb-4">Book a Ride</h2>
            <div className="space-y-3">
              <ServiceButton icon={<Bike />} label="Book a Bike" href="/book/bike" />
              <ServiceButton icon={<Car />} label="Book a Car" href="/book/car" />
              <ServiceButton icon={<CarTaxiFront />} label="Book an Auto" href="/book/auto" />
            </div>
          </section>

          <section aria-labelledby="bus-info-header">
            <h2 id="bus-info-header" className="text-lg font-semibold text-muted-foreground mb-4">Bus Information</h2>
            <div className="space-y-3">
              <ServiceButton icon={<ListChecks />} label="Bus Schedules & Routes" href="/bus-schedules" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
