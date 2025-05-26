
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
  distanceKm?: number; // Optional, primarily for auto filtering (distance from user's current location - simulated)
}

export const mockRides: Ride[] = [
  { id: "1", name: "Alice Wonderland", origin: "Central Park", destination: "Times Square", timeToGo: "09:00", vehicle: "car", gender: "female", seatingCapacity: 4 },
  { id: "2", name: "Bob The Builder", origin: "Brooklyn Bridge", destination: "Grand Central", timeToGo: "10:30", vehicle: "bike", gender: "male", seatingCapacity: 2 }, // Bike capacity usually 1 passenger + driver
  { id: "3", name: "Charlie Chaplin", origin: "Downtown Core", destination: "Wall Street", timeToGo: "08:15", vehicle: "auto", gender: "male", seatingCapacity: 3, distanceKm: 0.8 },
  { id: "4", name: "Diana Prince", origin: "Times Square", destination: "Central Park", timeToGo: "17:00", vehicle: "car", gender: "female", seatingCapacity: 3 },
  { id: "5", name: "Edward Scissorhands", origin: "Grand Central", destination: "Brooklyn Bridge", timeToGo: "18:30", vehicle: "car", gender: "male", seatingCapacity: 5 },
  { id: "6", name: "Fiona Gallagher", origin: "Wall Street", destination: "University Campus", timeToGo: "09:45", vehicle: "auto", gender: "female", seatingCapacity: 2, distanceKm: 0.5 },
  { id: "7", name: "Gary Goodspeed", origin: "City Park", destination: "Mall", timeToGo: "11:00", vehicle: "bike", gender: "male", seatingCapacity: 1 }, // Bike capacity driver only
  { id: "8", name: "Helen Parr", origin: "Suburbia", destination: "Downtown Core", timeToGo: "14:30", vehicle: "car", gender: "female", seatingCapacity: 6 },
  { id: "9", name: "Ian Lightfoot", origin: "Market District", destination: "Library", timeToGo: "16:00", vehicle: "auto", gender: "male", seatingCapacity: 4, distanceKm: 1.5 }, // This auto is > 1km
  { id: "10", name: "Jessica Rabbit", origin: "Old Town", destination: "Cinema", timeToGo: "19:00", vehicle: "auto", gender: "female", seatingCapacity: 3, distanceKm: 0.2 },
];
