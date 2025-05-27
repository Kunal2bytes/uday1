// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut, AuthError } from 'firebase/auth'; // Import AuthError
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button'; // For loading screen
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/signin';
      const isAboutPage = pathname === '/about-us';
      const isTermsPage = pathname === '/terms-and-conditions'; // Allow unauthenticated access to terms

      if (!user && !isAuthPage && !isTermsPage) { 
        router.push('/signin');
      } else if (user && isAuthPage) {
        router.push('/about-us');
      }
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // Redirection to /about-us will be handled by the useEffect above after auth state changes
    } catch (error) {
      console.error("-----------------------------------------------------");
      console.error("Detailed error during signInWithGoogle:", error);
      
      let title = "Sign-In Failed";
      let description = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        const firebaseError = error as AuthError; // Type assertion to AuthError
        console.error("Error Name:", firebaseError.name);
        console.error("Error Message:", firebaseError.message);
        if (firebaseError.code) {
          console.error("Firebase Error Code:", firebaseError.code);
          if (firebaseError.code === 'auth/unauthorized-domain') {
            title = "Unauthorized Domain";
            description = "This domain is not authorized for Google Sign-In. Please check your Firebase project settings and add 'localhost' (and your production domain) to the authorized domains list for Authentication.";
          } else if (firebaseError.code === 'auth/popup-closed-by-user') {
            title = "Sign-In Cancelled";
            description = "The sign-in popup was closed before completing. Please try again if you wish to sign in.";
          } else if (firebaseError.code === 'auth/cancelled-popup-request') {
            title = "Sign-In Cancelled";
            description = "Multiple sign-in popups were opened. The request was cancelled. Please try again.";
          } else {
            description = `Error: ${firebaseError.message} (Code: ${firebaseError.code})`;
          }
        }
        if ((firebaseError as any).customData) { // Keep customData logging if it exists
          console.error("Firebase Custom Data:", (firebaseError as any).customData);
        }
        if (firebaseError.stack) {
          console.error("Error Stack:", firebaseError.stack);
        }
      }
      console.error("-----------------------------------------------------");
      
      toast({
        title: title,
        description: description,
        variant: "destructive",
        duration: 9000, // Longer duration for important errors
      });
      setLoading(false); 
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/signin'); 
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        title: "Sign-Out Failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
      setLoading(false); 
    }
  };
  
  if (loading) {
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

  if (!user && pathname !== '/signin' && pathname !== '/terms-and-conditions') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Please wait...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
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
