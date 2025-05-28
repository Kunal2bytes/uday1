
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
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  const { signInOrUpWithEmailAndDummyPassword, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/about-us'); // If user is already authenticated, redirect to about-us
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
      await signInOrUpWithEmailAndDummyPassword(email);
      // On success, AuthContext's onAuthStateChanged will update user state 
      // and its useEffect will handle redirection to /about-us
    } catch (error) {
      // Error is already handled and toasted in AuthContext's signInOrUpWithEmailAndDummyPassword
      console.error("Sign-in attempt from SignInPage failed, error handled by AuthContext:", error);
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
          Helping Others Pave Expenses.
        </p>
        
        <div className="bg-card p-8 rounded-xl shadow-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Enter App</h2>
          
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
            <LogIn className="mr-2 h-5 w-5" />
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
