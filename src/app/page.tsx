
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, MapPin, Share2, Bus, Bike, Car, CarTaxiFront, ListChecks } from "lucide-react";
import React from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
          className="w-full justify-start text-left py-4 px-5 bg-white hover:bg-slate-100 shadow-md rounded-full text-slate-800 font-medium text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-150 ease-in-out active:scale-[0.98]"
        >
          <a>{buttonContent}</a>
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={onClick}
      className="w-full justify-start text-left py-4 px-5 bg-white hover:bg-slate-100 shadow-md rounded-full text-slate-800 font-medium text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-150 ease-in-out active:scale-[0.98]"
    >
      {buttonContent}
    </Button>
  );
};

export default function DashboardPage() {
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
            
            <h1 className="text-xl font-bold mx-auto hidden sm:block text-foreground">Dashboard</h1>

            <div className="flex-1 sm:flex-none flex items-center justify-end sm:justify-start ml-2 sm:ml-0">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-input border-border placeholder:text-muted-foreground rounded-full h-10 text-sm pl-9 pr-3 text-foreground"
                />
              </div>
              <Button variant="ghost" size="icon" aria-label="Map" className="ml-1 shrink-0">
                <MapPin className="h-5 w-5 text-foreground" />
              </Button>
            </div>
          </div>
          <h1 className="sm:hidden text-xl font-bold text-center pb-2 text-foreground">Dashboard</h1>
        </header>

        <main className="p-4 sm:p-6 space-y-10 mt-2">
          {/* Share a Ride Section */}
          <section aria-labelledby="share-ride-header">
            <h2 id="share-ride-header" className="text-lg font-semibold text-muted-foreground mb-4">Share a Ride</h2>
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
