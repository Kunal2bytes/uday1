
// src/app/map/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Map as MapIcon } from "lucide-react";

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <header className="mb-8">
          <Link href="/" passHref legacyBehavior>
            <Button variant="outline" className="mb-4 group flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-center sm:justify-start mb-2">
            <MapIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">Map View</h1>
          </div>
          <p className="text-muted-foreground text-center sm:text-left">
            View an interactive map below.
          </p>
        </header>

        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="aspect-w-16 aspect-h-9 sm:aspect-h-10 md:aspect-h-12 lg:aspect-h-9 xl:aspect-h-[7.5]"> 
            {/* Maintain a responsive aspect ratio, e.g. 16:9 or similar. Adjust aspect-h-* as needed */}
            {/* Or use a fixed height like h-[400px] sm:h-[500px] md:h-[600px] if preferred over aspect ratio */}
            <iframe
              src="https://maps.google.com/maps?q=world&output=embed&z=1" // Basic embed, q=world to show world, z=1 for zoom level
              width="100%"
              height="100%" // Will fill the aspect ratio container
              style={{ border:0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md w-full h-full"
              title="Google Maps Embed"
            ></iframe>
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            This is a basic Google Maps embed. For full features and customization, a Google Maps API key is typically required.
          </p>
        </div>
      </div>
    </div>
  );
}
