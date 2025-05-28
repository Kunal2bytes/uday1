
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Auth, User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming auth is exported from firebase.ts
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInOrUpWithEmailAndDummyPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// WARNING: THIS IS A FIXED DUMMY PASSWORD AND IS NOT SECURE FOR PRODUCTION.
// It's used here to fulfill the UI requirement of "enter email and go"
// while still creating a Firebase User object.
const DUMMY_PASSWORD = "dummyPrototypePassword!123";

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
      const isPublicPage = pathname === '/about-us' || pathname === '/terms-and-conditions';
      const isSignInPage = pathname === '/signin';

      if (!user) { // Not logged in
        if (!isPublicPage && !isSignInPage) {
          router.push('/signin'); 
        }
      } else { // Logged in
        if (isSignInPage) {
          router.push('/about-us'); // After sign-in, go to about-us
        }
      }
    }
  }, [user, loading, pathname, router]);

  const signInOrUpWithEmailAndDummyPassword = async (email: string) => {
    setLoading(true);
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, email, DUMMY_PASSWORD);
      // Successful sign-in, onAuthStateChanged will update user state and trigger redirection
      toast({ title: "Welcome Back!", description: "Signed in successfully." });
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/user-not-found') {
        // User not found, try to create a new user
        try {
          await createUserWithEmailAndPassword(auth, email, DUMMY_PASSWORD);
          // Successful creation, onAuthStateChanged will update user state and trigger redirection
          toast({ title: "Account Created!", description: "Welcome to HOPE!" });
        } catch (creationError) {
          console.error("Error creating user:", creationError);
          if (creationError instanceof FirebaseError) {
            toast({ title: "Account Creation Failed", description: creationError.message, variant: "destructive" });
          } else {
            toast({ title: "Account Creation Failed", description: "An unknown error occurred.", variant: "destructive" });
          }
        }
      } else if (error instanceof FirebaseError && error.code === 'auth/wrong-password') {
        // This case implies the email exists but DUMMY_PASSWORD is wrong,
        // which shouldn't happen if all users are created with the same dummy password.
        // However, it's a possible state if data was manually changed or from previous auth systems.
        toast({ title: "Sign-In Failed", description: "Incorrect credentials (this shouldn't happen with the dummy password system).", variant: "destructive" });
        console.error("Sign-in failed (wrong-password):", error);
      } else if (error instanceof FirebaseError) {
        toast({ title: "Sign-In Error", description: error.message, variant: "destructive" });
        console.error("Sign-in error:", error);
      } else {
        toast({ title: "Sign-In Error", description: "An unknown error occurred.", variant: "destructive" });
        console.error("Unknown sign-in error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null and trigger redirection
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
    <AuthContext.Provider value={{ user, loading, signInOrUpWithEmailAndDummyPassword, signOutUser }}>
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
