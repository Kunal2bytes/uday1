
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Firebase Auth (Google specific) is no longer used for sign-in.
// import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
// import { auth, googleProvider } from '@/lib/firebase'; // auth and googleProvider might not be needed if no Firebase Auth features are used.
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
// FirebaseError might still be useful if other Firebase services are used and can throw it.
// For now, we'll use generic Error for simplicity of this specific change.

interface AuthContextType {
  userEmail: string | null; // Changed from Firebase User to string (email)
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>; // New sign-in method
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for a saved email on initial load
    try {
      const storedEmail = localStorage.getItem('hopeUserEmail');
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    } catch (error) {
      console.error("Error reading email from localStorage:", error);
      // Potentially localStorage is not available (e.g. SSR or privacy settings)
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isSignInPage = pathname === '/signin';
      const isPublicInfoPage = pathname === '/terms-and-conditions' || pathname === '/about-us';

      if (!userEmail) { // If no email (user is not "logged in")
        if (!isSignInPage && !isPublicInfoPage) {
          router.push('/about-us'); // Default to about-us if not logged in and trying to access other pages
        }
      } else { // If email exists (user is "logged in")
        if (isSignInPage) {
          router.push('/'); // If logged in and on signin page, go to dashboard
        }
        // If on about-us, they can proceed to dashboard via its button.
      }
    }
  }, [userEmail, loading, pathname, router]);

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    try {
      // Basic validation (already done in SignInPage, but good to have defense in depth)
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format provided to signInWithEmail.");
      }
      setUserEmail(email);
      localStorage.setItem('hopeUserEmail', email);
      // Redirection logic in the useEffect hook will handle navigation.
      // Typically, after setting userEmail, the effect will push to '/' if on '/signin',
      // or allow access to '/about-us' from where user can navigate.
    } catch (error) {
      console.error("Error during signInWithEmail:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
         description = error.message;
      }
      toast({
        title: "Sign-In Process Error",
        description: description,
        variant: "destructive",
        duration: 9000,
      });
      throw error; // Re-throw to be caught by the calling page if needed
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      setUserEmail(null);
      localStorage.removeItem('hopeUserEmail');
      router.push('/about-us'); // Redirect to about-us after sign out
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
  
  if (loading && (pathname === '/signin' || pathname === '/about-us' || pathname === '/')) {
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
    <AuthContext.Provider value={{ userEmail, loading, signInWithEmail, signOutUser }}>
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
