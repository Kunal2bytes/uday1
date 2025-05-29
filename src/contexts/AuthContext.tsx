
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { 
  Auth, 
  User, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInOrUpWithPhoneNumber: (rawPhoneNumber: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_PASSWORD = "dummyPassword123!"; // Store securely in a real app, but for prototype this is fine.
const DUMMY_DOMAIN = "@phone.app";

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
          router.push('/about-us'); 
        }
      }
    }
  }, [user, loading, pathname, router]);

  const signInOrUpWithPhoneNumber = async (rawPhoneNumber: string) => {
    setLoading(true);
    const fullPhoneNumber = `+91${rawPhoneNumber}`;
    const emailForAuth = `${fullPhoneNumber}${DUMMY_DOMAIN}`;

    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, emailForAuth, DUMMY_PASSWORD);
      toast({ title: "Welcome Back!", description: "Signed in successfully." });
      // onAuthStateChanged will handle user state and redirection
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
        // User not found or invalid credential, try to create a new user
        try {
          await createUserWithEmailAndPassword(auth, emailForAuth, DUMMY_PASSWORD);
          toast({ title: "Account Created!", description: "Successfully signed up and logged in." });
          // onAuthStateChanged will handle user state and redirection
        } catch (createError) {
          console.error("Error creating user:", createError);
          let createTitle = "Sign-Up Failed";
          let createMessage = "Could not create your account. Please try again.";
          if (createError instanceof FirebaseError) {
            if (createError.code === 'auth/email-already-in-use') {
              createMessage = "This phone number is already associated with an account. Try signing in or check the number.";
            } else if (createError.code === 'auth/weak-password') {
              createMessage = "The password (dummy) is too weak. This is an app issue."; // Should not happen with fixed dummy
            } else {
              createMessage = createError.message;
            }
          }
          toast({ title: createTitle, description: createMessage, variant: "destructive" });
        }
      } else {
        // Other sign-in errors
        console.error("Error signing in:", error);
        let title = "Sign-In Failed";
        let message = "An unexpected error occurred during sign-in.";
        if (error instanceof FirebaseError) {
          message = error.message;
        }
        toast({ title, description: message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // setUser(null); // onAuthStateChanged will handle this
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
    <AuthContext.Provider value={{ user, loading, signInOrUpWithPhoneNumber, signOutUser }}>
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
