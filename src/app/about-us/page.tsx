
// src/app/about-us/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Info, Lightbulb, Search, Bus, CheckCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext'; 
import { useRouter } from 'next/navigation'; 

export default function AboutUsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false); // For the "Got it" button

  // This page is public, AuthProvider handles redirection if a user
  // tries to access protected routes without auth.
  // If user is already authenticated, they can still view this page.

  const handleGotItClick = async () => {
    setIsProcessing(true);
    // If user is authenticated, go to dashboard
    // If not, clicking "Got it" implies they need to sign in first.
    // However, the dashboard itself is protected by AuthContext which will redirect to /signin.
    // So, we can always just try to go to the dashboard.
    router.push('/');
    // setIsProcessing(false); // Navigation will occur
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-8">
          <div className="flex items-center justify-center sm:justify-start mb-2 pt-8 sm:pt-12">
            <Info className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">Welcome to HOPE!</h1>
          </div>
           <p className="text-muted-foreground text-center sm:text-left">
            Learn a bit about us and our mission before you get started.
          </p>
        </header>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 h-6 w-6 text-primary" />
                Our Team & Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Koushal Mahajan and Uday Jatale, both Computer Science Engineering students, have partnered to develop this app with a shared vision:
              </p>
              <blockquote className="pl-4 border-l-4 border-primary italic text-foreground/90">
                To make transportation more affordable, accessible, and environmentally friendly for everyone—especially those who do not own a bike or car, or rely on public buses.
              </blockquote>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="mr-2 h-6 w-6 text-primary" />
                Purpose of the App
              </CardTitle>
              <CardDescription>The idea behind this app is simple but powerful:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                If someone is traveling alone by bike or car and either wants to share the cost of fuel or prefers not to travel alone, they can use the “Share Your Ride” feature. By entering their ride details, they can connect with others who are going to the same destination but don’t have a vehicle.
              </p>
              <p className="text-foreground/90 font-medium">This allows users to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                <li>Split the cost of fuel</li>
                <li>Reduce the number of vehicles on the road</li>
                <li>Minimize pollution</li>
                <li>Travel more socially and safely</li>
              </ul>
              <p className="text-muted-foreground">
                If both users have a vehicle and are heading to the same place, they can still connect and choose to travel together on just one bike or car to save fuel and help the environment.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Lightbulb className="mr-2 h-6 w-6 text-primary" />
                Additional Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start">
                <Search className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Nearby Auto-Rickshaws</h4>
                  <p className="text-muted-foreground">You can also search for nearby auto-rickshaws for short-distance travel.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Bus className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Bus Schedule & Route Finder</h4>
                  <p className="text-muted-foreground">If you're new to a city, district, or state and don’t know the bus routes, the app includes a bus schedule and route finder. Simply select the state and district, enter the city or village name, and you'll get accurate information about available bus services.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-10 mb-6">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8 rounded-lg shadow-md transition-transform duration-150 hover:scale-105 flex items-center"
              onClick={handleGotItClick}
              disabled={isProcessing || authLoading} // Disable if auth is loading generally, or this button is processing
            >
              {isProcessing ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <CheckCircle className="mr-2 h-5 w-5" />}
              {isProcessing ? "Proceeding..." : "Got it! Let's Go"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
