
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, MapPin, Share2, Bus, Bike, Car, CarTaxiFront, ListChecks, User, Clock, Route } from "lucide-react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Ride {
  id: string;
  name: string;
  origin: string;
  destination: string;
  timeToGo: string; // e.g., "10:30"
  vehicle: "bike" | "car" | "auto";
  gender: "male" | "female" | "other";
}

const mockRides: Ride[] = [
  { id: "1", name: "Alice Wonderland", origin: "Central Park", destination: "Times Square", timeToGo: "09:00", vehicle: "car", gender: "female" },
  { id: "2", name: "Bob The Builder", origin: "Brooklyn Bridge", destination: "Grand Central", timeToGo: "10:30", vehicle: "bike", gender: "male" },
  { id: "3", name: "Charlie Chaplin", origin: "Central Park", destination: "Wall Street", timeToGo: "08:15", vehicle: "auto", gender: "male" },
  { id: "4", name: "Diana Prince", origin: "Times Square", destination: "Central Park", timeToGo: "17:00", vehicle: "car", gender: "female" },
  { id: "5", name: "Edward Scissorhands", origin: "Grand Central", destination: "Brooklyn Bridge", timeToGo: "18:30", vehicle: "car", gender: "male" },
  { id: "6", name: "Fiona Gallagher", origin: "Wall Street", destination: "Central Park", timeToGo: "09:45", vehicle: "auto", gender: "female" },
];


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
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]); // Initialize with empty array

  useEffect(() => {
    const lowerOrigin = originSearch.toLowerCase().trim();
    const lowerDestination = destinationSearch.toLowerCase().trim();

    if (!lowerOrigin && !lowerDestination) {
      setFilteredRides([]); // Clear rides if both search inputs are empty
      return;
    }

    setFilteredRides(
      mockRides.filter(ride => {
        const matchesOrigin = lowerOrigin ? ride.origin.toLowerCase().includes(lowerOrigin) : true;
        const matchesDestination = lowerDestination ? ride.destination.toLowerCase().includes(lowerDestination) : true;
        return matchesOrigin && matchesDestination;
      })
    );
  }, [originSearch, destinationSearch]);

  const showRidesList = originSearch.trim() !== "" || destinationSearch.trim() !== "";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center">
      <div className="w-full max-w-lg"> {/* Max width for content area */}
        
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
                  <Button variant="ghost" className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md">
                    Terms and Conditions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md">
                    About Us
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md">
                    Your Rides
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold mx-auto hidden sm:block text-foreground">TransitGo</h1>

            <div className="flex-1 sm:flex-none flex items-center justify-end sm:justify-start ml-2 sm:ml-0">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Global Search..."
                  className="w-full bg-input border-border placeholder:text-muted-foreground rounded-full h-10 text-sm pl-9 pr-3 text-foreground"
                />
              </div>
              <Button variant="ghost" size="icon" aria-label="Map" className="ml-1 shrink-0">
                <MapPin className="h-5 w-5 text-foreground" />
              </Button>
            </div>
          </div>
          <h1 className="sm:hidden text-xl font-bold text-center pb-2 text-foreground">TransitGo</h1>
        </header>

        <main className="p-4 sm:p-6 space-y-10 mt-2">
          {/* Ride Search Section */}
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

          {/* Available Rides Section - Conditionally Rendered */}
          {showRidesList && (
            <section aria-labelledby="available-rides-header" className="space-y-4">
              <h2 id="available-rides-header" className="text-xl font-semibold text-muted-foreground mb-4">Available Rides</h2>
              {filteredRides.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRides.map((ride) => (
                    <Card key={ride.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground rounded-lg overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg text-primary">
                          <User className="mr-2 h-5 w-5" /> {ride.name}
                        </CardTitle>
                        <CardDescription className="text-xs">Vehicle: {ride.vehicle} | Gender: {ride.gender}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1.5 text-sm">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">No rides found matching your criteria. Try adjusting your search.</p>
              )}
            </section>
          )}

          {/* Share a Ride Section */}
          <section aria-labelledby="share-ride-header">
            <h2 id="share-ride-header" className="text-lg font-semibold text-muted-foreground mb-4">Offer Your Ride</h2>
            <div className="space-y-3">
              <ServiceButton icon={<Share2 />} label="Share Your Ride" href="/share-ride" />
              <ServiceButton icon={<Bus />} label="Share a Bus Route & Time" />
            </div>
          </section>

          {/* Book a Ride Section */}
          <section aria-labelledby="book-ride-header">
            <h2 id="book-ride-header" className="text-lg font-semibold text-muted-foreground mb-4">Book a Ride</h2>
            <div className="space-y-3">
              <ServiceButton icon={<Bike />} label="Book a Bike" />
              <ServiceButton icon={<Car />} label="Book a Car" />
              <ServiceButton icon={<CarTaxiFront />} label="Book an Auto" />
            </div>
          </section>

          {/* Bus Information Section */}
          <section aria-labelledby="bus-info-header">
            <h2 id="bus-info-header" className="text-lg font-semibold text-muted-foreground mb-4">Bus Information</h2>
            <div className="space-y-3">
              <ServiceButton icon={<ListChecks />} label="Bus Schedules & Routes" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

