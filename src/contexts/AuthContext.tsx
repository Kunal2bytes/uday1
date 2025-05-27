
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase'; 
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
  user: FirebaseUser | null; 
  loading: boolean;
  signInWithGoogle: (emailHint?: string) => Promise<void>; 
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    if (!loading) {
      const isPublicPage = pathname === '/about-us' || pathname === '/terms-and-conditions';
      const isSignInPage = pathname === '/signin';

      if (!user) { // Not logged in
        if (!isPublicPage && !isSignInPage) {
          router.push('/signin');
        }
      } else { // Logged in
        if (isSignInPage) {
          router.push('/about-us'); // After login, always go to about-us first
        }
      }
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = async (emailHint?: string) => {
    setLoading(true);
    if (emailHint) {
      googleProvider.setCustomParameters({ login_hint: emailHint });
    }
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting user and redirecting to /about-us
    } catch (error) {
      console.error("-----------------------------------------------------");
      console.error("Detailed error during signInWithGoogle:", error);
      
      let title = "Sign-In Failed";
      let description = "An unexpected error occurred. Please try again.";

      if (error instanceof FirebaseError) {
        console.error("Firebase Error Code:", error.code);
        console.error("Firebase Error Message:", error.message);
        if (error.code === 'auth/popup-closed-by-user') {
          title = "Sign-In Cancelled";
          description = "The sign-in process was cancelled.";
        } else if (error.code === 'auth/unauthorized-domain') {
          title = "Sign-In Error: Unauthorized Domain";
          description = "This domain is not authorized for Google Sign-In. Please check your Firebase project console settings for 'localhost' and your production domain under Authentication > Settings > Authorized domains. Ensure your client-side `authDomain` in `firebase.ts` is correct. Wait for propagation and try a hard refresh or incognito window.";
          toast({ title, description, variant: "destructive", duration: 15000 });
        } else {
          description = `Error: ${error.message} (Code: ${error.code})`;
        }
      } else if (error instanceof Error) {
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        description = error.message;
      }
      toast({ title, description, variant: "destructive", duration: 9000 });
    } finally {
      setLoading(false);
      googleProvider.setCustomParameters({}); // Clear custom params like login_hint
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting user to null
      router.push('/signin'); // Redirect to signin page after sign out
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
  
  // Show global loader for initial auth check or during transitions on sensitive pages
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
