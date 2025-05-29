
// src/app/page.tsx (Dashboard)
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, MapPin, Share2, Bus, Bike, Car, CarTaxiFront, ListChecks, User, Clock, Route, Users, Search, PersonStanding, Phone, LogOut, HelpCircle, CheckCircle } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { collection, getDocs, query, orderBy, Timestamp, doc, deleteDoc, where } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
  const { user, loading: authLoading, signOutUser } = useAuth(); // Use Firebase user object
  const router = useRouter();

  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [allRidesFromDB, setAllRidesFromDB] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return; 
    if (!user && !authLoading) { 
        // AuthContext will handle redirection to /signin
        return;
    }
    // If user is authenticated, proceed to fetch rides
    if (user) {
      fetchRides();
    }
  }, [user, authLoading, router]); // Removed fetchRides from dependency array

  const fetchRides = async () => {
    setIsLoadingRides(true);
    try {
      const ridesCollectionRef = collection(db, "rides");
      const q = query(ridesCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const ridesData = querySnapshot.docs.map(docSnapshot => { 
        const data = docSnapshot.data();
        return { 
          id: docSnapshot.id, 
          ...data,
          // Ensure createdAt is properly cast if needed, but usually spread works if types match
          createdAt: data.createdAt as Timestamp 
        } as Ride;
      });
      setAllRidesFromDB(ridesData);
    } catch (error) {
      console.error("Error fetching rides from Firestore: ", error);
      toast({
        title: "Error Fetching Rides",
        description: "Could not load rides. Please check your connection or try again later.",
        variant: "destructive",
      });
    }
    setIsLoadingRides(false);
  };
  
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

  const handleBookAndCallRider = async (rideToBook: Ride) => {
    setIsLoadingRides(true); // Indicate processing
    // 1. Save to localStorage ("Your Rides")
    try {
      const existingBookedRidesString = localStorage.getItem('bookedRides');
      let bookedRides: Ride[] = existingBookedRidesString ? JSON.parse(existingBookedRidesString) : [];
      const isRideAlreadyBooked = bookedRides.some(bookedRide => bookedRide.id === rideToBook.id);
      if (!isRideAlreadyBooked) {
        bookedRides.push(rideToBook); 
        localStorage.setItem('bookedRides', JSON.stringify(bookedRides));
        console.log("Ride saved to Your Rides (localStorage).");
      } else {
        console.log("Ride already in Your Rides (localStorage).");
      }
    } catch (e) {
      console.error("Failed to save ride to localStorage:", e);
      toast({
        title: "Error Saving Ride",
        description: "Could not save this ride to 'Your Rides'.",
        variant: "destructive",
      });
      setIsLoadingRides(false);
      return; 
    }

    // 2. Delete from Firestore
    try {
      const rideRef = doc(db, "rides", rideToBook.id);
      await deleteDoc(rideRef);
      console.log(`Ride ${rideToBook.id} deleted from Firestore.`);

      // 3. Update local UI list
      setAllRidesFromDB(prevRides => prevRides.filter(r => r.id !== rideToBook.id));
      // setFilteredRides will update automatically due to allRidesFromDB change in useEffect

      // 4. Show success toast
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

      // 5. Programmatically open dialer if contact number exists
      if (rideToBook.contactNumber) {
        window.location.href = `tel:${rideToBook.contactNumber}`;
      }

    } catch (error) {
      console.error("Error during booking process:", error);
      toast({
        title: "Booking Error",
        description: "Could not complete the booking process. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsLoadingRides(false);
    }
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

  // AuthContext's global loading screen handles the initial check.
  // This component's specific loader is for its own data fetching.
  if (authLoading) { // Still wait for auth to be fully resolved before rendering dashboard attempts
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  // If not authLoading and no user, AuthProvider should have redirected.
  // This is a fallback or for when user state changes after initial load.
  if (!user) {
    // AuthProvider should redirect to /signin. This just prevents rendering dashboard content prematurely.
    return null; 
  }


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
                  <Link href="/your-rides" passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
                      asChild
                    >
                      <a>Your Rides</a>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center"
                    onClick={handleShareApp}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center"
                      >
                        <HelpCircle className="mr-2 h-5 w-5" />
                        Help
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-primary flex items-center">
                          <HelpCircle className="mr-2 h-6 w-6" /> Help & Support
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground pt-2">
                          Here's some information to help you use the HOPE app.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4 text-sm">
                        <p className="font-semibold text-lg text-foreground">Hello HOPE users,</p>
                        
                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">Sharing Your Ride:</h4>
                          <p className="text-muted-foreground">
                            Whenever you want to share a ride, you can click on 'Share Your Ride'. 
                            After entering the required information, you can easily share your ride details with others.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">Finding a Ride:</h4>
                          <p className="text-muted-foreground">
                            If you need a ride, enter your current location in the 'FROM' field and your destination in the 'TO' field on the dashboard. 
                            You will then see available rides matching your search criteria.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">Contacting Users & Responsibility:</h4>
                          <p className="text-muted-foreground">
                            You can contact ride sharers through the app. However, please be aware that if you engage in any inappropriate, abusive, or "useless" communication after contacting, 
                            legal action may be taken against you. HOPE and its team are not responsible for user interactions or their consequences. Travel safely and respectfully.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">Bus Routes:</h4>
                          <p className="text-muted-foreground">
                            Using our HOPE app, you can also find bus schedules and routes. This feature will help you determine which bus to take and its estimated arrival times at various stops.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">Booking Rickshaws:</h4>
                          <p className="text-muted-foreground">
                            If you need a rickshaw for shorter distances, you can also book one through the app from the available options.
                          </p>
                        </div>
                        <div className="pt-2">
                          <h4 className="font-semibold text-md text-foreground mb-1">Contact Us:</h4>
                          <p className="text-muted-foreground">
                            For more information email us at <a href="mailto:hopsupport@gmail.com" className="text-primary hover:underline">hopsupport@gmail.com</a>.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base py-3 px-4 text-destructive hover:bg-destructive/80 hover:text-destructive-foreground rounded-md flex items-center"
                    onClick={signOutUser}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out
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
                <label htmlFor="origin-search" className="text-sm font-medium text-muted-foreground">From</label>
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
                <label htmlFor="destination-search" className="text-sm font-medium text-muted-foreground">TO</label>
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
                <div className="text-center py-10">
                  <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-muted-foreground">Loading rides...</p>
                </div>
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
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Capacity:</span>&nbsp;{ride.seatingCapacity}
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
                          onClick={() => handleBookAndCallRider(ride)}
                          className="w-full" 
                          size="sm"
                          disabled={isLoadingRides || !ride.contactNumber} 
                        >
                          Call Rider 📞
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
