
// src/lib/mockData.ts

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
  // Optional: Firestore specific fields if needed, e.g., createdAt
  createdAt?: any; // For Firestore serverTimestamp
}

/*
// mockRides is being replaced by Firestore.
// This data will now be stored and fetched from the "rides" collection in Firestore.
// The pages displaying rides (dashboard, book/bike, book/car, book/auto)
// will need to be updated to fetch data from Firestore.
export let mockRides: Ride[] = [
  { id: "1", name: "Alice Wonderland", origin: "Central Park", destination: "Times Square", timeToGo: "09:00", vehicle: "car", gender: "female", seatingCapacity: 4, contactNumber: "555-0101" },
  { id: "2", name: "Bob The Builder", origin: "Brooklyn Bridge", destination: "Grand Central", timeToGo: "10:30", vehicle: "bike", gender: "male", seatingCapacity: 2, contactNumber: "555-0102" },
  { id: "3", name: "Charlie Chaplin", origin: "Downtown Core", destination: "Wall Street", timeToGo: "08:15", vehicle: "auto", gender: "male", seatingCapacity: 3, distanceKm: 0.8, contactNumber: "555-0103" },
  { id: "4", name: "Diana Prince", origin: "Times Square", destination: "Central Park", timeToGo: "17:00", vehicle: "car", gender: "female", seatingCapacity: 3, contactNumber: "555-0104" },
  { id: "5", name: "Edward Scissorhands", origin: "Grand Central", destination: "Brooklyn Bridge", timeToGo: "18:30", vehicle: "car", gender: "male", seatingCapacity: 5, contactNumber: "555-0105" },
  { id: "6", name: "Fiona Gallagher", origin: "Wall Street", destination: "University Campus", timeToGo: "09:45", vehicle: "auto", gender: "female", seatingCapacity: 2, distanceKm: 0.5, contactNumber: "555-0106" },
  { id: "7", name: "Gary Goodspeed", origin: "City Park", destination: "Mall", timeToGo: "11:00", vehicle: "bike", gender: "male", seatingCapacity: 1, contactNumber: "555-0107" },
  { id: "8", name: "Helen Parr", origin: "Suburbia", destination: "Downtown Core", timeToGo: "14:30", vehicle: "car", gender: "female", seatingCapacity: 6, contactNumber: "555-0108" },
  { id: "9", name: "Ian Lightfoot", origin: "Market District", destination: "Library", timeToGo: "16:00", vehicle: "auto", gender: "male", seatingCapacity: 4, distanceKm: 1.5, contactNumber: "555-0109" },
  { id: "10", name: "Jessica Rabbit", origin: "Old Town", destination: "Cinema", timeToGo: "19:00", vehicle: "auto", gender: "female", seatingCapacity: 3, distanceKm: 0.2, contactNumber: "555-0110" },
];
*/

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
  createdAt?: any; // For Firestore serverTimestamp
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
  },
];

