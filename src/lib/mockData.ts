
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
  vehicleNumber?: string; // Added vehicle number field
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
