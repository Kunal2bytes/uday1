
// src/app/terms-and-conditions/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ShieldCheck, Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function TermsAndConditionsPage() {
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
            <ShieldCheck className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-center sm:text-left text-primary">Terms and Conditions</h1>
          </div>
          <p className="text-muted-foreground text-center sm:text-left">
            Please read our terms, safety guidelines, and responsibilities carefully.
          </p>
        </header>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                Safety Guidelines for Female Passengers
              </CardTitle>
              <CardDescription>To ensure your safety and comfort during every ride, please follow these important precautions:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start">
                <CheckCircle className="mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Check the Child Lock</h4>
                  <p className="text-muted-foreground">Before getting into a vehicle, ensure that the child lock is disabled. You should be able to open the doors from the inside at all times.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Verify Driver and Vehicle Information</h4>
                  <p className="text-muted-foreground">Always check the driver’s name, photo, and vehicle number plate against the details shown in the app before entering the vehicle.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 h-6 w-6 text-primary" />
                User Responsibilities
              </CardTitle>
              <CardDescription>All users of the HOPE app—both passengers and drivers—are expected to maintain a safe, respectful, and lawful environment. By using the app, you agree to the following responsibilities:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-base">For All Users:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  <li>Treat all fellow users with respect and courtesy at all times.</li>
                  <li>Do not use the app for illegal, unsafe, or inappropriate activities.</li>
                  <li>Follow all local traffic laws and safety regulations during your ride.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-base">For Drivers:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  <li>Keep your vehicle clean, roadworthy, and well-maintained.</li>
                  <li>Always carry and keep up-to-date a valid driver’s license, vehicle registration, insurance papers, and any other legally required documents.</li>
                  <li>Use GPS and route tracking to maintain transparency and rider trust.</li>
                  <li>Ensure that child locks and central locking systems do not restrict rider exit.</li>
                  <li>Respect the privacy and comfort of all passengers, especially women and girls.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-destructive">
                <AlertTriangle className="mr-2 h-6 w-6" />
                Disclaimer of Responsibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">HOPE provides safety guidelines and platform features to help ensure a secure experience for all users, especially women and girls. However, if a user or driver fails to follow these safety instructions or violates the platform’s rules, and an issue or incident occurs as a result:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                <li>HOPE will not be held responsible or liable for any harm, loss, or damage caused.</li>
                <li>Each user is responsible for their own actions and for ensuring that all safety precautions are followed during rides.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
