
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button'; 
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from 'firebase/app'; 

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (emailHint?: string) => Promise<void>; // Added emailHint
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
      const isSignInPage = pathname === '/signin';
      const isPublicInfoPage = pathname === '/terms-and-conditions' || pathname === '/about-us';

      if (!user) { 
        if (!isSignInPage && !isPublicInfoPage) {
          router.push('/about-us');
        }
      } else { 
        if (isSignInPage) {
          router.push('/'); 
        }
      }
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = async (emailHint?: string) => {
    setLoading(true);
    try {
      if (emailHint) {
        googleProvider.setCustomParameters({ login_hint: emailHint });
      } else {
        // Ensure no lingering hints
        googleProvider.setCustomParameters({});
      }
      await signInWithPopup(auth, googleProvider);
      // Successful sign-in, user state will update via onAuthStateChanged
      // Redirection logic in the useEffect hook will handle navigation.
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
          description = "IMPORTANT: Your app's domain (likely 'localhost') is NOT authorized for Google Sign-In in your Firebase project. \n\n1. GO TO: Firebase Console -> your project -> Authentication -> Settings -> Authorized domains. \n2. ENSURE: 'localhost' is listed (no http://, no port). \n3. VERIFY: Client config in src/lib/firebase.ts has authDomain matching your Firebase project. \n4. WAIT: 15-30 mins for settings to propagate. \n5. TRY: Hard refresh (Ctrl+Shift+R) or incognito window.";
        } else if (error.code === 'auth/popup-closed-by-user') {
          title = "Sign-In Cancelled";
          description = "The sign-in popup was closed before completing. Please try again if you wish to sign in.";
        } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-blocked') {
          title = "Sign-In Problem";
          description = "The sign-in popup was cancelled or blocked by the browser. Please ensure popups are allowed and try again.";
        } else {
          description = `Firebase Error: ${error.message} (Code: ${error.code})`;
        }
      } else if (error instanceof Error) {
         console.error("Generic Error Name:", error.name);
         console.error("Generic Error Message:", error.message);
         description = error.message;
      }
      console.error("-----------------------------------------------------");

      toast({
        title: title,
        description: description,
        variant: "destructive",
        duration: 15000, 
      });
      throw error; 
    } finally {
      setLoading(false);
      // Clear custom parameters after attempt so they don't affect next generic sign-in
      googleProvider.setCustomParameters({});
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/about-us'); 
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

  if (loading && (pathname === '/signin' || pathname === '/about-us' || pathname === '/')) { // Show global loader for key pages during auth init
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
