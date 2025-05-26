
// src/lib/mockData.ts

export interface Ride {
  id: string;
  name: string;
  origin: string;
  destination: string;
  timeToGo: string;
  vehicle: "bike" | "car" | "auto";
  gender: "male" | "female" | "other";
  seatingCapacity: number; // Total capacity including driver
  contactNumber?: string; // Added from share form
  distanceKm?: number; // Optional, primarily for auto filtering (distance from user's current location - simulated)
}

export let mockRides: Ride[] = [
  { id: "1", name: "Alice Wonderland", origin: "Central Park", destination: "Times Square", timeToGo: "09:00", vehicle: "car", gender: "female", seatingCapacity: 4, contactNumber: "555-0101" },
  { id: "2", name: "Bob The Builder", origin: "Brooklyn Bridge", destination: "Grand Central", timeToGo: "10:30", vehicle: "bike", gender: "male", seatingCapacity: 2, contactNumber: "555-0102" }, // Bike capacity usually 1 passenger + driver
  { id: "3", name: "Charlie Chaplin", origin: "Downtown Core", destination: "Wall Street", timeToGo: "08:15", vehicle: "auto", gender: "male", seatingCapacity: 3, distanceKm: 0.8, contactNumber: "555-0103" },
  { id: "4", name: "Diana Prince", origin: "Times Square", destination: "Central Park", timeToGo: "17:00", vehicle: "car", gender: "female", seatingCapacity: 3, contactNumber: "555-0104" },
  { id: "5", name: "Edward Scissorhands", origin: "Grand Central", destination: "Brooklyn Bridge", timeToGo: "18:30", vehicle: "car", gender: "male", seatingCapacity: 5, contactNumber: "555-0105" },
  { id: "6", name: "Fiona Gallagher", origin: "Wall Street", destination: "University Campus", timeToGo: "09:45", vehicle: "auto", gender: "female", seatingCapacity: 2, distanceKm: 0.5, contactNumber: "555-0106" },
  { id: "7", name: "Gary Goodspeed", origin: "City Park", destination: "Mall", timeToGo: "11:00", vehicle: "bike", gender: "male", seatingCapacity: 1, contactNumber: "555-0107" }, // Bike capacity driver only
  { id: "8", name: "Helen Parr", origin: "Suburbia", destination: "Downtown Core", timeToGo: "14:30", vehicle: "car", gender: "female", seatingCapacity: 6, contactNumber: "555-0108" },
  { id: "9", name: "Ian Lightfoot", origin: "Market District", destination: "Library", timeToGo: "16:00", vehicle: "auto", gender: "male", seatingCapacity: 4, distanceKm: 1.5, contactNumber: "555-0109" }, // This auto is > 1km
  { id: "10", name: "Jessica Rabbit", origin: "Old Town", destination: "Cinema", timeToGo: "19:00", vehicle: "auto", gender: "female", seatingCapacity: 3, distanceKm: 0.2, contactNumber: "555-0110" },
];

// --- Bus Route Data ---
export interface BusStop {
  stopName: string;
  scheduledTime: string; // HH:MM format
}

export interface BusRoute {
  id: string;
  state: string;
  district: string;
  city: string;
  routeNameOrNumber: string;
  stops: BusStop[];
  // Potentially add conductorName, busNumber etc. if needed later
}

// This array will store shared bus routes.
// Exported as `let` to allow modification by the form for demo purposes.
export let mockBusRoutes: BusRoute[] = [
    {
    id: "br1",
    state: "California",
    district: "Los Angeles County",
    city: "Los Angeles",
    routeNameOrNumber: "Route 66 Express",
    stops: [
      { stopName: "Downtown LA", scheduledTime: "08:00" },
      { stopName: "Hollywood", scheduledTime: "08:30" },
      { stopName: "Santa Monica Pier", scheduledTime: "09:15" },
    ],
  },
  {
    id: "br2",
    state: "New York",
    district: "New York County",
    city: "New York City",
    routeNameOrNumber: "Crosstown M57",
    stops: [
      { stopName: "72nd St & Broadway", scheduledTime: "10:00" },
      { stopName: "5th Ave & 57th St", scheduledTime: "10:20" },
      { stopName: "1st Ave & 57th St", scheduledTime: "10:45" },
    ],
  },
];
