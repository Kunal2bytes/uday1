
// src/app/about-us/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Users, Target, Info, Lightbulb, Share2, Search, Bus } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-8">
          <Link href="/" passHref legacyBehavior>
            <Button variant="outline" className="mb-4 group flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-center sm:justify-start mb-2">
            <Info className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">About Us</h1>
          </div>
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
        </div>
      </div>
    </div>
  );
}
