
// src/app/signin/page.tsx
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

// Google Icon SVG (inline for simplicity)
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export default function SignInPage() {
  const { signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  React.useEffect(() => {
    // Redirection is handled by AuthProvider.
    // If user becomes non-null while on this page (e.g. after successful sign-in), 
    // AuthProvider's effect should redirect them to the dashboard.
    if (!authLoading && user) {
      router.push('/'); // Or /about-us if that's the next step
    }
  }, [user, authLoading, router]);

  const handleSignIn = async () => {
    if (!email.trim()) {
      toast({ 
        title: "Email Required", 
        description: "Please enter your Gmail address.", 
        variant: "destructive" 
      });
      return;
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ 
        title: "Invalid Email", 
        description: "Please enter a valid Gmail address.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      await signInWithGoogle(email);
      // On success, onAuthStateChanged in AuthContext will update user state,
      // and useEffect in AuthContext or this page will handle redirection.
    } catch (error) {
      // Error is already handled (toast shown) in AuthContext's signInWithGoogle
      console.error("Sign-in attempt from SignInPage failed, error handled by AuthContext.");
    }
  };

  if (authLoading && !user) { // Show a page-specific loader if global loader isn't covering this scenario
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading...</p>
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
          <h2 className="text-2xl font-semibold text-card-foreground">Join Our Community</h2>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Enter your Gmail</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border placeholder:text-muted-foreground text-foreground rounded-lg"
              disabled={authLoading}
            />
          </div>
          
          <Button 
            onClick={handleSignIn} 
            className="w-full py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform duration-150 hover:scale-105"
            disabled={authLoading}
            size="lg"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          <p className="text-xs text-muted-foreground mt-6">
            By signing up, you agree to our <Link href="/terms-and-conditions" className="underline hover:text-primary">Terms of Service</Link>.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Your journey towards easier commutes starts here.
        </p>
      </div>
    </div>
  );
}
