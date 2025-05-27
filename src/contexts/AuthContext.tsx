
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button'; // For loading screen
import { useToast } from "@/hooks/use-toast"; 
import { FirebaseError } from 'firebase/app'; // Import FirebaseError for specific error checking

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
  const { toast } = useToast();

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
      const isTermsPage = pathname === '/terms-and-conditions';

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

      if (error instanceof FirebaseError) {
        console.error("Firebase Error Code:", error.code);
        console.error("Firebase Error Message:", error.message);
        
        if (error.code === 'auth/unauthorized-domain') {
          title = "Configuration Issue: Unauthorized Domain";
          description = "IMPORTANT: Your app's domain (likely 'localhost') is NOT authorized for Google Sign-In in your Firebase project. \n\n1. GO TO: Firebase Console -> project-hope-a64cd -> Authentication -> Settings -> Authorized domains. \n2. ENSURE: 'localhost' is listed (no http://, no port). \n3. VERIFY: Client config in src/lib/firebase.ts has authDomain: 'project-hope-a64cd.firebaseapp.com'. \n4. WAIT: 15-30 mins for settings to propagate. \n5. TRY: Hard refresh (Ctrl+Shift+R) or incognito window.";
        } else if (error.code === 'auth/popup-closed-by-user') {
          title = "Sign-In Cancelled";
          description = "The sign-in popup was closed before completing. Please try again if you wish to sign in.";
        } else if (error.code === 'auth/cancelled-popup-request') {
          title = "Sign-In Cancelled";
          description = "Multiple sign-in popups were opened. The request was cancelled. Please try again.";
        } else {
          // For other Firebase errors, use its message
          description = `Firebase Error: ${error.message} (Code: ${error.code})`;
        }
      } else if (error instanceof Error) { // Fallback for generic JavaScript errors
         console.error("Generic Error Name:", error.name);
         console.error("Generic Error Message:", error.message);
         description = error.message; // Use the generic error message
      }
      console.error("-----------------------------------------------------");
      
      toast({
        title: title,
        description: description,
        variant: "destructive",
        duration: 15000, // Longer duration for important errors
      });
    } finally {
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
    } finally {
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

  if (!user && pathname !== '/signin' && pathname !== '/terms-and-conditions' && pathname !== '/about-us') {
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
