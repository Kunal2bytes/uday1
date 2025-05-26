
// src/app/map/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
            This is where the interactive map would be displayed.
          </p>
        </header>

        <div className="bg-card p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <Image
            src="https://placehold.co/800x600.png"
            alt="Placeholder map"
            width={800}
            height={600}
            className="rounded-lg shadow-md"
            data-ai-hint="world map"
          />
          <p className="mt-4 text-muted-foreground">
            Interactive map integration coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
