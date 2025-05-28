
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
  distanceKm?: number; // Optional: Only relevant for auto pre-filtering if re-implemented
  createdAt?: Timestamp; // For Firestore serverTimestamp
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

// mockBusRoutes array is removed as data will now be fetched from Firestore.
// Example structure (for reference, not used in code anymore):
// export let mockBusRoutes: BusRoute[] = [
//     {
//     id: "br1",
//     state: "California",
//     district: "Los Angeles County",
//     city: "Los Angeles",
//     routeNameOrNumber: "Route 66 Express",
//     busNumber: "B-101",
//     stops: [
//       { stopName: "Downtown LA", scheduledTime: "08:00" },
//       { stopName: "Hollywood", scheduledTime: "08:30" },
//       { stopName: "Santa Monica Pier", scheduledTime: "09:15" },
//     ],
//     createdAt: undefined, 
//   },
// ];
