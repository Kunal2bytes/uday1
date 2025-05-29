
// src/app/signin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn } from 'lucide-react'; // Replaced Smartphone

export default function SignInPage() {
  const { user, loading: authLoading, signInOrUpWithPhoneNumber } = useAuth();
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/about-us'); 
    }
  }, [user, authLoading, router]);

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and limit to 10
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      if (error) setError(""); // Clear error when user types
    }
  };

  const validatePhoneNumber = (number: string): boolean => {
    if (number.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }
    // Already ensured numeric by handleMobileInputChange, but double check
    if (!/^\d{10}$/.test(number)) {
      setError("Mobile number must contain only digits.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignIn = async () => {
    if (!validatePhoneNumber(mobileNumber)) {
      return;
    }
    setIsProcessing(true);
    setError("");
    try {
      await signInOrUpWithPhoneNumber(mobileNumber);
      // On success, AuthContext's onAuthStateChanged will handle redirection
    } catch (err) {
      // Error is handled by toast in AuthContext
      console.error("Sign-in/up error from SignInPage:", err);
      // setError("Failed to sign in. Please try again."); // Generic, AuthContext shows specific toast
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (authLoading && !user) { 
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading Sign-In...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/10 p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            HOPE
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Helping Others Pave Expenses. <br/> Sign in with your Mobile Number.
        </p>
        
        <div className="bg-card p-8 rounded-xl shadow-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-card-foreground">
            Enter Mobile Number
          </h2>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="mobile-input" className="text-sm font-medium text-muted-foreground">Your Mobile Number</Label>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-2 border border-border rounded-l-md bg-muted text-muted-foreground text-sm">
                +91
              </span>
              <Input
                id="mobile-input"
                type="tel" // Use "tel" for semantic phone number input
                placeholder="XXXXXXXXXX"
                value={mobileNumber}
                onChange={handleMobileInputChange}
                className="bg-input border-border placeholder:text-muted-foreground text-foreground rounded-r-md focus:border-primary focus:ring-primary flex-1 min-w-0"
                disabled={isProcessing || authLoading}
                maxLength={10}
              />
            </div>
            {error && <p className="text-sm text-destructive pt-1">{error}</p>}
          </div>
          <Button 
            onClick={handleSignIn} 
            className="w-full py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform duration-150 hover:scale-105 flex items-center justify-center"
            disabled={authLoading || isProcessing || mobileNumber.length !== 10}
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" /> {/* Changed icon to LogIn */}
            <span>{isProcessing ? "Processing..." : "Go"}</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-6">
            By proceeding, you agree to our <Link href="/terms-and-conditions" className="underline hover:text-primary">Terms of Service</Link>.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Your journey towards easier commutes starts here.
        </p>
      </div>
    </div>
  );
}
