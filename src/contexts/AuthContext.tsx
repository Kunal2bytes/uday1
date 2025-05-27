
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  userEmail: string | null; // Changed from FirebaseUser to string | null
  loading: boolean;
  signInWithEnteredEmail: (email: string) => Promise<void>; // Renamed and changed signature
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_EMAIL_KEY = 'hopeAppUserEmail';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for a persisted email on initial load
    try {
      const storedEmail = localStorage.getItem(USER_EMAIL_KEY);
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      // Handle environments where localStorage might not be available or is restricted
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isPublicPage = pathname === '/about-us' || pathname === '/terms-and-conditions';
      const isSignInPage = pathname === '/signin';

      if (!userEmail) { // Not "logged in"
        if (!isPublicPage && !isSignInPage) {
          router.push('/about-us'); // Default to about-us if not logged in and trying to access protected page
        }
      } else { // "Logged in"
        if (isSignInPage) {
          router.push('/'); // If logged in and on signin page, go to dashboard
        }
      }
    }
  }, [userEmail, loading, pathname, router]);

  const signInWithEnteredEmail = async (email: string) => {
    setLoading(true);
    // Basic email validation (can be more robust)
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
        });
        setLoading(false);
        return;
    }
    try {
      localStorage.setItem(USER_EMAIL_KEY, email);
      setUserEmail(email);
      // After "signing in" with email, redirect to dashboard
      router.push('/'); 
    } catch (error) {
      console.error("Error during simulated sign-in:", error);
      toast({ title: "Error", description: "Could not save email.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(USER_EMAIL_KEY);
      setUserEmail(null);
      router.push('/signin'); // Redirect to signin page after sign out
    } catch (error)      {
      console.error("Error signing out: ", error);
      toast({
        title: "Sign-Out Failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Show global loader for initial localStorage check or during transitions
  if (loading && (pathname === '/' || pathname === '/signin' || pathname === '/about-us')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading HOPE...</p>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ userEmail, loading, signInWithEnteredEmail, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
