
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  userPhoneNumber: string | null; // Stores "+91XXXXXXXXXX"
  loading: boolean;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>; // phoneNumber includes country code
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_PHONE_KEY = 'hopeAppUserPhoneNumber';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for a saved phone number on initial load
    try {
      const storedPhoneNumber = localStorage.getItem(LOCAL_STORAGE_PHONE_KEY);
      if (storedPhoneNumber) {
        setUserPhoneNumber(storedPhoneNumber);
      }
    } catch (e) {
      console.error("Error reading from localStorage", e);
      // Potentially toast an error or handle gracefully
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isPublicPage = pathname === '/about-us' || pathname === '/terms-and-conditions';
      const isSignInPage = pathname === '/signin';

      if (!userPhoneNumber) { // Not "logged in"
        if (!isPublicPage && !isSignInPage) {
          router.push('/signin'); // Redirect to sign-in if trying to access protected page
        }
      } else { // "Logged in"
        if (isSignInPage) {
          router.push('/about-us'); // If logged in and on signin page, go to about-us
        }
      }
    }
  }, [userPhoneNumber, loading, pathname, router]);

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    setLoading(true);
    try {
      // Basic validation, though more robust validation might be needed
      if (!phoneNumber.startsWith("+91") || phoneNumber.length !== 13) {
          throw new Error("Invalid phone number format for prototype sign-in.");
      }
      setUserPhoneNumber(phoneNumber);
      localStorage.setItem(LOCAL_STORAGE_PHONE_KEY, phoneNumber);
      toast({ title: "Welcome!", description: `Proceeding with ${phoneNumber}.` });
      // Redirection to /about-us will be handled by the useEffect above
    } catch (error) {
      console.error("Error during prototype sign-in with phone number:", error);
      let message = "An unknown error occurred.";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({ title: "Sign-In Error", description: message, variant: "destructive" });
      setLoading(false); // Ensure loading is false on error
      throw error; // Re-throw if caller needs to handle it
    }
    // setLoading(false) will be handled by the state update triggering the redirection useEffect
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      setUserPhoneNumber(null);
      localStorage.removeItem(LOCAL_STORAGE_PHONE_KEY);
      router.push('/signin'); // Redirect to sign-in page after sign out
    } catch (error) {
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

  // Global loading screen for critical path loading
  if (loading && (pathname !== '/about-us' && pathname !== '/terms-and-conditions' && pathname !== '/signin')) {
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
    <AuthContext.Provider value={{ userPhoneNumber, loading, signInWithPhoneNumber, signOutUser }}>
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
