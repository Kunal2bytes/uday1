
"use client"; 

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, MapPin, Clock, ListChecks, BusFront } from "lucide-react";
import type { BusRoute } from '@/lib/mockData';
import { mockBusRoutes } from '@/lib/mockData';
import { formatTimeTo12Hour } from "@/lib/utils";

export default function BusSchedulesPage() {
  // Use state to ensure mockBusRoutes is fresh on client, especially if it's mutated elsewhere
  const [routes, setRoutes] = useState<BusRoute[]>([]);

  useEffect(() => {
    // Simulate fetching or ensuring the latest mock data is used
    setRoutes([...mockBusRoutes]);
  }, []);


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
            <ListChecks className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">Bus Schedules & Routes</h1>
          </div>
          <p className="text-muted-foreground text-center sm:text-left">
            Browse available bus routes and their schedules shared by conductors/drivers.
          </p>
        </header>

        {routes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground rounded-lg overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-xl text-primary">
                    <BusFront className="mr-2 h-6 w-6" /> {route.routeNameOrNumber}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {route.city}, {route.district}, {route.state}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-grow">
                  <h4 className="font-semibold text-base text-muted-foreground">Stops & Schedule:</h4>
                  {route.stops.length > 0 ? (
                    <ul className="space-y-2 pl-1">
                      {route.stops.map((stop, index) => (
                        <li key={index} className="flex items-center justify-between border-b border-border/50 pb-1 last:border-b-0 last:pb-0">
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
                            <span>{stop.stopName}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
                            <span>{formatTimeTo12Hour(stop.scheduledTime)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No stops listed for this route.</p>
                  )}
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground/80">Route ID: {route.id}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <ListChecks className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">No bus schedules have been shared yet.</p>
            <p className="text-sm text-muted-foreground">Ask a bus conductor or driver to share a route!</p>
          </div>
        )}
      </div>
    </div>
  );
}
