
// src/lib/mockData.ts
import type { Timestamp } from 'firebase/firestore';

export interface Ride {
  id: string; // This will be the Firestore document ID when fetched
  name: string;
  origin: string;
  destination: string;
  timeToGo: string;
  vehicle: "bike" | "car" | "auto";
  gender: "male" | "female" | "other";
  seatingCapacity: number; // Total capacity including driver
  contactNumber?: string;
  distanceKm?: number;
  createdAt?: Timestamp; // For Firestore serverTimestamp, updated from any
}

// --- Bus Route Data ---
export interface BusStop {
  stopName: string;
  scheduledTime: string; // HH:MM format
}

export interface BusRoute {
  id: string; // This will be the Firestore document ID
  state: string;
  district: string;
  city: string;
  routeNameOrNumber: string;
  busNumber?: string;
  stops: BusStop[];
  createdAt?: Timestamp; // For Firestore serverTimestamp
}

// This array will store shared bus routes.
// Exported as `let` to allow modification by the form for demo purposes.
// This will also be moved to Firestore in a future step.
export let mockBusRoutes: BusRoute[] = [
    {
    id: "br1",
    state: "California",
    district: "Los Angeles County",
    city: "Los Angeles",
    routeNameOrNumber: "Route 66 Express",
    busNumber: "B-101",
    stops: [
      { stopName: "Downtown LA", scheduledTime: "08:00" },
      { stopName: "Hollywood", scheduledTime: "08:30" },
      { stopName: "Santa Monica Pier", scheduledTime: "09:15" },
    ],
    createdAt: undefined, // Or an actual Timestamp if needed for mock
  },
  {
    id: "br2",
    state: "New York",
    district: "New York County",
    city: "New York City",
    routeNameOrNumber: "Crosstown M57",
    busNumber: "B-202",
    stops: [
      { stopName: "72nd St & Broadway", scheduledTime: "10:00" },
      { stopName: "5th Ave & 57th St", scheduledTime: "10:20" },
      { stopName: "1st Ave & 57th St", scheduledTime: "10:45" },
    ],
    createdAt: undefined, // Or an actual Timestamp if needed for mock
  },
];
