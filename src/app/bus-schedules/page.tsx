
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, MapPin, Clock, ListChecks, BusFront, Search } from "lucide-react";
import type { BusRoute } from '@/lib/mockData'; // BusRoute interface will be used
import { formatTimeTo12Hour } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function BusSchedulesPage() {
  const [allRoutesFromDB, setAllRoutesFromDB] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [cityQuery, setCityQuery] = useState<string>("");

  const [displayRoutes, setDisplayRoutes] = useState<BusRoute[]>([]);
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchBusRoutes = async () => {
      setIsLoading(true);
      try {
        const routesRef = collection(db, "busRoutes");
        const q = query(routesRef, orderBy("createdAt", "desc")); // Order by most recent
        const querySnapshot = await getDocs(q);
        const routesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BusRoute));
        setAllRoutesFromDB(routesData);
      } catch (error) {
        console.error("Error fetching bus routes from Firestore:", error);
        toast({ title: "Error", description: "Could not fetch bus routes.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchBusRoutes();
  }, [toast]);

  useEffect(() => {
    if (allRoutesFromDB.length > 0) {
      const uniqueStates = Array.from(new Set(allRoutesFromDB.map(route => route.state))).sort();
      setStates(uniqueStates);
    } else {
      setStates([]);
    }
  }, [allRoutesFromDB]);

  useEffect(() => {
    if (selectedState) {
      const uniqueDistricts = Array.from(
        new Set(
          allRoutesFromDB
            .filter(route => route.state === selectedState)
            .map(route => route.district)
        )
      ).sort();
      setDistricts(uniqueDistricts);
    } else {
      setDistricts([]);
    }
    setSelectedDistrict(""); 
  }, [selectedState, allRoutesFromDB]);

  useEffect(() => {
    if (!selectedState && !selectedDistrict && !cityQuery.trim()) {
      setDisplayRoutes([]);
      setFiltersApplied(false);
      return;
    }

    setFiltersApplied(true);
    let filtered = [...allRoutesFromDB];

    if (selectedState) {
      filtered = filtered.filter(route => route.state === selectedState);
    }
    if (selectedDistrict) {
      filtered = filtered.filter(route => route.district === selectedDistrict);
    }
    if (cityQuery.trim()) {
      filtered = filtered.filter(route =>
        route.city.toLowerCase().includes(cityQuery.trim().toLowerCase())
      );
    }
    setDisplayRoutes(filtered);
  }, [selectedState, selectedDistrict, cityQuery, allRoutesFromDB]);

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
            Filter by location to find bus routes shared by conductors/drivers.
          </p>
        </header>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-primary" /> Filter Bus Routes
            </CardTitle>
            <CardDescription>Select state, district, and city/village to find relevant routes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="state-select">State</Label>
                <Select onValueChange={setSelectedState} value={selectedState}>
                  <SelectTrigger id="state-select">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district-select">District</Label>
                <Select onValueChange={setSelectedDistrict} value={selectedDistrict} disabled={!selectedState || districts.length === 0}>
                  <SelectTrigger id="district-select">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city-input">City / Village</Label>
                <Input
                  id="city-input"
                  placeholder="Enter City or Village"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-muted-foreground">Loading bus routes...</p>
          </div>
        ) : !filtersApplied && allRoutesFromDB.length > 0 ? (
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <ListChecks className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">Please use the filters above to find bus routes.</p>
            <p className="text-sm text-muted-foreground">Select a state to begin.</p>
          </div>
        ) : filtersApplied && displayRoutes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayRoutes.map((route) => (
              <Card key={route.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground rounded-lg overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-xl text-primary">
                    <BusFront className="mr-2 h-6 w-6" /> {route.routeNameOrNumber}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {route.city}, {route.district}, {route.state}
                    {route.busNumber && ` | Bus No: ${route.busNumber}`}
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
        ) : ( // Covers all other cases: (isLoading=false AND filtersApplied AND displayRoutes.length === 0) OR (isLoading=false AND allRoutesFromDB.length === 0)
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">
              {allRoutesFromDB.length === 0 && !filtersApplied ? "No bus routes have been shared yet." : "No bus schedules found matching your criteria."}
            </p>
            <p className="text-sm text-muted-foreground">
              {allRoutesFromDB.length === 0 && !filtersApplied ? "Be the first to share a route!" : "Try adjusting your filters or ask a conductor to share a route for this area."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
