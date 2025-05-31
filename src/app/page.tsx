
// src/app/page.tsx (Dashboard)
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, MapPin, Share2, Bus, Bike, Car, CarTaxiFront, ListChecks, User, Clock, Route, Users, Search, PersonStanding, Phone, LogOut, HelpCircle, CheckCircle, Languages } from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext"; // Import useLanguage

const translations = {
  en: {
    menuTitle: "Menu",
    termsAndConditions: "Terms and Conditions",
    aboutUs: "About Us",
    yourRides: "Your Rides",
    share: "Share",
    help: "Help",
    signOut: "Sign Out",
    changeLanguage: "हिंदी में बदलें", // Switch to Hindi
    appTitle: "HOPE",
    findRideTitle: "Find a Ride",
    findRideDescription: "Enter your origin and destination to find available rides.",
    fromLabel: "From",
    toLabel: "To",
    originPlaceholder: "e.g. Central Park",
    destinationPlaceholder: "e.g. Times Square",
    availableRidesTitle: "Available Shared Rides",
    loadingRides: "Loading rides...",
    noRidesFound: "No shared rides found matching your criteria.",
    vehicleLabel: "Vehicle",
    genderLabel: "Gender",
    timeLabel: "Time",
    seatingCapacityLabel: "Seating Capacity",
    contactLabel: "Contact",
    callRiderButton: "Call Rider 📞",
    offerRideTitle: "Offer Your Ride",
    shareYourRideButton: "Share Your Ride",
    shareBusRouteButton: "Share a Bus Route & Time",
    bookRideTitle: "Book a Ride",
    bookBikeButton: "Book a Bike",
    bookCarButton: "Book a Car",
    bookAutoButton: "Book an Auto",
    busInfoTitle: "Bus Information",
    busSchedulesButton: "Bus Schedules & Routes",
    helpDialogTitle: "Help & Support",
    helpDialogDescription: "Here's some information to help you use the HOPE app.",
    helpGreeting: "Hello HOPE users,",
    helpShareRide: "Sharing Your Ride:",
    helpShareRideDesc: "Whenever you want to share a ride, you can click on 'Share Your Ride'. After entering the required information, you can easily share your ride details with others.",
    helpFindRide: "Finding a Ride:",
    helpFindRideDesc: "If you need a ride, enter your current location in the 'FROM' field and your destination in the 'TO' field on the dashboard. You will then see available rides matching your search criteria.",
    helpContactResponsibility: "Contacting Users & Responsibility:",
    helpContactResponsibilityDesc: "You can contact ride sharers through the app. However, please be aware that if you engage in any inappropriate, abusive, or \"useless\" communication after contacting, legal action may be taken against you. HOPE and its team are not responsible for user interactions or their consequences. Travel safely and respectfully.",
    helpBusRoutes: "Bus Routes:",
    helpBusRoutesDesc: "Using our HOPE app, you can also find bus schedules and routes. This feature will help you determine which bus to take and its estimated arrival times at various stops.",
    helpBookingRickshaws: "Booking Rickshaws:",
    helpBookingRickshawsDesc: "If you need a rickshaw for shorter distances, you can also book one through the app from the available options.",
    helpContactEmail: "For more information email us at",
    closeButton: "Close",
    rideBookedToastTitle: "Your ride booked.",
    rideBookedToastDesc: "Go to the menu page and check the 'Your Rides' section.",
    bookingErrorToastTitle: "Booking Error",
    bookingErrorToastDesc: "Could not complete the booking process. Please try again.",
    errorSavingRideToastTitle: "Error Saving Ride",
    errorSavingRideToastDesc: "Could not save this ride to 'Your Rides'.",
    sharingFailedToastTitle: "Sharing Failed",
    sharingNotSupportedToastTitle: "Sharing Not Supported",
    sharingNotSupportedToastDesc: "Your browser does not support the Web Share API. You can copy the URL from the address bar."
  },
  hi: {
    menuTitle: "मेनू",
    termsAndConditions: "नियम एवं शर्तें",
    aboutUs: "हमारे बारे में",
    yourRides: "आपकी सवारियाँ",
    share: "साझा करें",
    help: "मदद",
    signOut: "साइन आउट",
    changeLanguage: "Switch to English", // अंग्रेजी में बदलें
    appTitle: "होप",
    findRideTitle: "सवारी खोजें",
    findRideDescription: "उपलब्ध सवारियाँ खोजने के लिए अपना मूल और गंतव्य दर्ज करें।",
    fromLabel: "यहाँ से",
    toLabel: "यहाँ तक",
    originPlaceholder: "उदा. सेंट्रल पार्क",
    destinationPlaceholder: "उदा. टाइम्स स्क्वायर",
    availableRidesTitle: "उपलब्ध साझा सवारियाँ",
    loadingRides: "सवारियाँ लोड हो रही हैं...",
    noRidesFound: "आपके खोज मानदंडों से मेल खाने वाली कोई साझा सवारी नहीं मिली।",
    vehicleLabel: "वाहन",
    genderLabel: "लिंग",
    timeLabel: "समय",
    seatingCapacityLabel: "बैठने की क्षमता",
    contactLabel: "संपर्क",
    callRiderButton: "राइडर को कॉल करें 📞",
    offerRideTitle: "अपनी सवारी दें",
    shareYourRideButton: "सवारी साझा करें",
    shareBusRouteButton: "बस मार्ग साझा करें",
    bookRideTitle: "सवारी बुक करें",
    bookBikeButton: "बाइक बुक करें",
    bookCarButton: "कार बुक करें",
    bookAutoButton: "ऑटो बुक करें",
    busInfoTitle: "बस जानकारी",
    busSchedulesButton: "बस-समय सारिणी",
    helpDialogTitle: "सहायता और समर्थन",
    helpDialogDescription: "होप ऐप का उपयोग करने में आपकी सहायता के लिए यहां कुछ जानकारी दी गई है।",
    helpGreeting: "नमस्ते होप उपयोगकर्ताओं,",
    helpShareRide: "अपनी सवारी साझा करना:",
    helpShareRideDesc: "जब भी आप कोई सवारी साझा करना चाहें, तो आप 'Share Your Ride' पर क्लिक कर सकते हैं। आवश्यक जानकारी दर्ज करने के बाद, आप आसानी से अपनी सवारी का विवरण दूसरों के साथ साझा कर सकते हैं।",
    helpFindRide: "सवारी ढूँढना:",
    helpFindRideDesc: "यदि आपको सवारी की आवश्यकता है, तो डैशबोर्ड पर 'FROM' फ़ील्ड में अपना वर्तमान स्थान और 'TO' फ़ील्ड में अपना गंतव्य दर्ज करें। फिर आपको अपने खोज मानदंडों से मेल खाने वाली उपलब्ध सवारियाँ दिखाई देंगी।",
    helpContactResponsibility: "उपयोगकर्ताओं से संपर्क और जिम्मेदारी:",
    helpContactResponsibilityDesc: "आप ऐप के माध्यम से सवारी साझा करने वालों से संपर्क कर सकते हैं। हालाँकि, कृपया ध्यान रखें कि यदि आप संपर्क करने के बाद किसी भी अनुचित, अपमानजनक, या \"बेकार\" संचार में संलग्न होते हैं, तो आपके खिलाफ कानूनी कार्रवाई की जा सकती है। होप और उसकी टीम उपयोगकर्ताओं की बातचीत या उनके परिणामों के लिए जिम्मेदार नहीं हैं। सुरक्षित और सम्मानपूर्वक यात्रा करें।",
    helpBusRoutes: "बस मार्ग:",
    helpBusRoutesDesc: "हमारे होप ऐप का उपयोग करके, आप बस शेड्यूल और मार्ग भी ढूंढ सकते हैं। यह सुविधा आपको यह निर्धारित करने में मदद करेगी कि कौन सी बस लेनी है और विभिन्न स्टॉप पर उसके अनुमानित आगमन का समय क्या है।",
    helpBookingRickshaws: "रिक्शा बुकिंग:",
    helpBookingRickshawsDesc: "यदि आपको कम दूरी के लिए रिक्शा की आवश्यकता है, तो आप उपलब्ध विकल्पों में से ऐप के माध्यम से एक बुक भी कर सकते हैं।",
    helpContactEmail: "अधिक जानकारी के लिए हमें ईमेल करें",
    closeButton: "बंद करें",
    rideBookedToastTitle: "आपकी सवारी बुक हो गई।",
    rideBookedToastDesc: "मेनू पेज पर जाएं और 'आपकी सवारियाँ' अनुभाग देखें।",
    bookingErrorToastTitle: "बुकिंग में त्रुटि",
    bookingErrorToastDesc: "बुकिंग प्रक्रिया पूरी नहीं हो सकी। कृपया पुनः प्रयास करें।",
    errorSavingRideToastTitle: "सवारी सहेजने में त्रुटि",
    errorSavingRideToastDesc: "इस सवारी को 'आपकी सवारियाँ' में सहेजा नहीं जा सका।",
    sharingFailedToastTitle: "साझा करने में विफल",
    sharingNotSupportedToastTitle: "साझा करना समर्थित नहीं है",
    sharingNotSupportedToastDesc: "आपका ब्राउज़र वेब शेयर एपीआई का समर्थन नहीं करता है। आप एड्रेस बार से यूआरएल कॉपी कर सकते हैं।"
  }
};

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
  const { user, loading: authLoading, signOutUser } = useAuth(); 
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];


  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [allRidesFromDB, setAllRidesFromDB] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return; 
    if (!user && !authLoading) { 
        router.push('/about-us'); 
        return;
    }
    if (user) {
      fetchRides();
    }
  }, [user, authLoading, router]);

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
    setIsLoadingRides(true); 
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
        title: t.errorSavingRideToastTitle,
        description: t.errorSavingRideToastDesc,
        variant: "destructive",
      });
      setIsLoadingRides(false);
      return; 
    }

    try {
      const rideRef = doc(db, "rides", rideToBook.id);
      await deleteDoc(rideRef);
      setAllRidesFromDB(prevRides => prevRides.filter(r => r.id !== rideToBook.id));
      
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" />
            <span>{t.rideBookedToastTitle}</span>
          </div>
        ),
        description: t.rideBookedToastDesc,
        variant: "default",
      });

      if (rideToBook.contactNumber) {
        window.location.href = `tel:${rideToBook.contactNumber}`;
      }

    } catch (error) {
      console.error("Error during booking process:", error);
      toast({
        title: t.bookingErrorToastTitle,
        description: t.bookingErrorToastDesc,
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
      } catch (error) {
        let description = "Could not share the app at this moment. Please try again.";
        if (error instanceof Error && error.name === 'NotAllowedError') {
          description = "Sharing was blocked by your browser. This can happen if the request wasn't triggered by a direct user action or due to security settings.";
        } else if (error instanceof Error && error.name === 'AbortError') {
          description = "Sharing was cancelled.";
        }
        toast({
          title: t.sharingFailedToastTitle,
          description: description,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: t.sharingNotSupportedToastTitle,
        description: t.sharingNotSupportedToastDesc,
        variant: "default",
      });
    }
  };

  if (authLoading) { 
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

  if (!user) {
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
                  <SheetTitle className="text-2xl font-semibold text-foreground">{t.menuTitle}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-3">
                  <Link href="/terms-and-conditions" passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
                      asChild
                    >
                      <a>{t.termsAndConditions}</a>
                    </Button>
                  </Link>
                  <Link href="/about-us" passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
                      asChild
                    >
                      <a>{t.aboutUs}</a>
                    </Button>
                  </Link>
                  <Link href="/your-rides" passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
                      asChild
                    >
                      <a>{t.yourRides}</a>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center"
                    onClick={handleShareApp}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    {t.share}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center"
                    onClick={toggleLanguage}
                  >
                    <Languages className="mr-2 h-5 w-5" />
                    {t.changeLanguage}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-base py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center"
                      >
                        <HelpCircle className="mr-2 h-5 w-5" />
                        {t.help}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-primary flex items-center">
                          <HelpCircle className="mr-2 h-6 w-6" /> {t.helpDialogTitle}
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground pt-2">
                          {t.helpDialogDescription}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4 text-sm">
                        <p className="font-semibold text-lg text-foreground">{t.helpGreeting}</p>
                        
                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">{t.helpShareRide}</h4>
                          <p className="text-muted-foreground">{t.helpShareRideDesc}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">{t.helpFindRide}</h4>
                          <p className="text-muted-foreground">{t.helpFindRideDesc}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">{t.helpContactResponsibility}</h4>
                          <p className="text-muted-foreground">{t.helpContactResponsibilityDesc}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">{t.helpBusRoutes}</h4>
                          <p className="text-muted-foreground">{t.helpBusRoutesDesc}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-md text-foreground mb-1">{t.helpBookingRickshaws}</h4>
                          <p className="text-muted-foreground">{t.helpBookingRickshawsDesc}</p>
                        </div>
                        <div className="pt-2">
                          <h4 className="font-semibold text-md text-foreground mb-1">{t.helpContactEmail}:</h4>
                          <p className="text-muted-foreground">
                            <a href="mailto:help.hope8236@gmail.com" className="text-primary hover:underline">help.hope8236@gmail.com</a>.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            {t.closeButton}
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
                    {t.signOut}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold mx-auto text-foreground">{t.appTitle}</h1>


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
              <h2 id="search-rides-header" className="text-2xl font-semibold text-primary mb-1">{t.findRideTitle}</h2>
              <p className="text-muted-foreground mb-4">{t.findRideDescription}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="origin-search" className="text-sm font-medium text-muted-foreground">{t.fromLabel}</label>
                <Input
                  id="origin-search"
                  type="text"
                  placeholder={t.originPlaceholder}
                  value={originSearch}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 0) {
                      value = value.charAt(0).toUpperCase() + value.slice(1);
                    }
                    setOriginSearch(value);
                  }}
                  className="bg-input border-border placeholder:text-muted-foreground text-foreground rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="destination-search" className="text-sm font-medium text-muted-foreground">{t.toLabel}</label>
                <Input
                  id="destination-search"
                  type="text"
                  placeholder={t.destinationPlaceholder}
                  value={destinationSearch}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 0) {
                      value = value.charAt(0).toUpperCase() + value.slice(1);
                    }
                    setDestinationSearch(value);
                  }}
                  className="bg-input border-border placeholder:text-muted-foreground text-foreground rounded-lg"
                />
              </div>
            </div>
          </section>

          {showRidesList && (
            <section aria-labelledby="available-rides-header" className="space-y-4">
              <h2 id="available-rides-header" className="text-xl font-semibold text-muted-foreground mb-4">{t.availableRidesTitle}</h2>
              {isLoadingRides ? (
                <div className="text-center py-10">
                  <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-muted-foreground">{t.loadingRides}</p>
                </div>
              ) : filteredRides.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRides.map((ride) => (
                    <Card key={ride.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground rounded-lg overflow-hidden flex flex-col">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg text-primary">
                          <User className="mr-2 h-5 w-5" /> {ride.name}
                        </CardTitle>
                        <CardDescription className="text-xs">{t.vehicleLabel}: {ride.vehicle} | {t.genderLabel}: {ride.gender}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1.5 text-sm flex-grow">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{t.timeLabel}:</span>&nbsp;{formatTimeTo12Hour(ride.timeToGo)}
                        </div>
                        <div className="flex items-center">
                          <Route className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{t.fromLabel}:</span>&nbsp;{ride.origin}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{t.toLabel}:</span>&nbsp;{ride.destination}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{t.seatingCapacityLabel}:</span>&nbsp;{ride.seatingCapacity}
                        </div>
                        {ride.contactNumber && (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{t.contactLabel}:</span>&nbsp;
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
                          {t.callRiderButton}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">{t.noRidesFound}</p>
              )}
            </section>
          )}

          <section aria-labelledby="share-ride-header">
            <h2 id="share-ride-header" className="text-lg font-semibold text-muted-foreground mb-4">{t.offerRideTitle}</h2>
            <div className="space-y-3">
              <ServiceButton icon={<Share2 />} label={t.shareYourRideButton} href="/share-ride" />
              <ServiceButton icon={<Bus />} label={t.shareBusRouteButton} href="/share-bus-route"/>
            </div>
          </section>

          <section aria-labelledby="book-ride-header">
            <h2 id="book-ride-header" className="text-lg font-semibold text-muted-foreground mb-4">{t.bookRideTitle}</h2>
            <div className="space-y-3">
              <ServiceButton icon={<Bike />} label={t.bookBikeButton} href="/book/bike" />
              <ServiceButton icon={<Car />} label={t.bookCarButton} href="/book/car" />
              <ServiceButton icon={<CarTaxiFront />} label={t.bookAutoButton} href="/book/auto" />
            </div>
          </section>

          <section aria-labelledby="bus-info-header">
            <h2 id="bus-info-header" className="text-lg font-semibold text-muted-foreground mb-4">{t.busInfoTitle}</h2>
            <div className="space-y-3">
              <ServiceButton icon={<ListChecks />} label={t.busSchedulesButton} href="/bus-schedules" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

    