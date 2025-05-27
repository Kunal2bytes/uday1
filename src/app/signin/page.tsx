
// src/app/signin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

// Using a generic Google SVG icon as lucide-react doesn't have a direct Google logo
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,11.76 21.35,11.1 21.35,11.1Z" />
  </svg>
);


export default function SignInPage() {
  const { signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirection is handled by AuthProvider.
    // If user becomes non-null while on this page,
    // AuthProvider's effect should redirect them to /about-us.
    if (!authLoading && user) {
      router.push('/about-us');
    }
  }, [user, authLoading, router]);

  const handleSignIn = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your Gmail address.",
        variant: "destructive",
      });
      return;
    }
    // Basic email validation (can be more robust)
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
        });
        return;
    }

    setIsProcessing(true);
    try {
      await signInWithGoogle(email); // Pass email as a hint
      // On success, AuthContext will handle redirection via its useEffect.
    } catch (error) {
      // Error is already handled and toasted in AuthContext's signInWithGoogle
      console.error("Sign-in attempt from SignInPage failed, error handled by AuthContext:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading && !user) { // Show loader if auth is loading and no user yet
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
  
  // If user is already logged in and auth is not loading, AuthContext effect should redirect.
  // This return is for when user is not logged in and auth is not loading.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/10 p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            HOPE
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Helping Others Pave Expenses.
        </p>
        
        <div className="bg-card p-8 rounded-xl shadow-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Sign In or Create Account</h2>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="email-input" className="text-sm font-medium text-muted-foreground">Enter your Gmail</Label>
            <Input
              id="email-input"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border placeholder:text-muted-foreground text-foreground rounded-lg"
              disabled={isProcessing || authLoading}
            />
          </div>

          <Button 
            onClick={handleSignIn} 
            className="w-full py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform duration-150 hover:scale-105 flex items-center justify-center"
            disabled={authLoading || isProcessing}
            size="lg"
          >
            <GoogleIcon />
            <span className="ml-2">{isProcessing ? "Processing..." : "Continue with Google"}</span>
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
