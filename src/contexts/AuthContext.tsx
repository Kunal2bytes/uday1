
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
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming auth is exported from your firebase setup
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier | null;
  sendOtpToPhoneNumber: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<void>;
  confirmOtp: (otp: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
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
          router.push('/signin'); // Redirect to sign-in if trying to access protected page
        }
      } else { // Logged in
        if (isSignInPage) {
          router.push('/about-us'); // If logged in and on signin page, go to about-us
        }
      }
    }
  }, [user, loading, pathname, router]);

  const setupRecaptcha = (containerId: string): RecaptchaVerifier | null => {
    try {
      // Ensure window.recaptchaVerifier is only created once or reset if needed.
      // For invisible reCAPTCHA, it's often best to create it just before signInWithPhoneNumber.
      if ((window as any).recaptchaVerifier && typeof (window as any).recaptchaVerifier.clear === 'function') {
        (window as any).recaptchaVerifier.clear(); // Clear previous instance if any
      }
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible', // Can also be 'normal' for a visible widget
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // This callback is more for visible reCAPTCHA. For invisible, it resolves automatically.
          console.log("reCAPTCHA solved:", response);
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          toast({ title: "reCAPTCHA Expired", description: "Please try sending the OTP again.", variant: "destructive" });
        }
      });
      return (window as any).recaptchaVerifier;
    } catch (error) {
        console.error("Error setting up RecaptchaVerifier: ", error);
        let message = "Could not initialize reCAPTCHA. Please refresh and try again.";
        if (error instanceof FirebaseError) {
            message = error.message;
        }
        toast({ title: "reCAPTCHA Error", description: message, variant: "destructive", duration: 7000 });
        return null;
    }
  };

  const sendOtpToPhoneNumber = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent", description: `An OTP has been sent to ${phoneNumber}.` });
    } catch (error) {
      console.error("Error sending OTP:", error);
      let title = "OTP Send Failed";
      let message = "Could not send OTP. Please check the phone number and try again.";
      if (error instanceof FirebaseError) {
        message = error.message; // Firebase provides descriptive error messages
         if (error.code === 'auth/invalid-phone-number') {
          message = "The phone number format is invalid.";
        } else if (error.code === 'auth/too-many-requests') {
          message = "Too many requests. Please try again later.";
        } else if (error.code === 'auth/captcha-check-failed') {
            message = "reCAPTCHA verification failed. Please ensure it's set up correctly and try again.";
        }
      }
      toast({ title, description: message, variant: "destructive", duration: 7000 });
      // Reset reCAPTCHA verifier if it exists and has a render method, or clear it
      if (appVerifier && typeof appVerifier.clear === 'function') {
        appVerifier.clear();
      }
      throw error; // Re-throw to allow UI to handle (e.g., stop processing spinner)
    } finally {
      setLoading(false);
    }
  };

  const confirmOtp = async (otp: string) => {
    if (!confirmationResult) {
      toast({ title: "Verification Error", description: "No OTP verification process found. Please send OTP first.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      // User is now signed in. onAuthStateChanged will handle the user state update and redirection.
      toast({ title: "Verification Successful!", description: "You are now signed in." });
      // No need to set user here, onAuthStateChanged will do it.
      // Redirection will be handled by the useEffect.
    } catch (error) {
      console.error("Error confirming OTP:", error);
      let title = "OTP Verification Failed";
      let message = "The OTP entered is incorrect or has expired. Please try again.";
       if (error instanceof FirebaseError) {
        message = error.message; // Firebase provides descriptive error messages
        if (error.code === 'auth/invalid-verification-code') {
          message = "Invalid OTP. Please check and try again.";
        } else if (error.code === 'auth/code-expired') {
          message = "The OTP has expired. Please request a new one.";
        }
      }
      toast({ title, description: message, variant: "destructive" });
      throw error; // Re-throw to allow UI to handle
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null); // Explicitly set user to null
      setConfirmationResult(null); // Clear confirmation result
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
    <AuthContext.Provider value={{ user, loading, setupRecaptcha, sendOtpToPhoneNumber, confirmOtp, signOutUser }}>
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
