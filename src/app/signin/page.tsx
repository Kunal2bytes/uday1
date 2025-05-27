// src/app/signin/page.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

// Google Icon SVG (inline for simplicity)
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export default function SignInPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Redirection is handled by AuthProvider now.
    // This page will simply render if user is null and not loading.
    // If user becomes non-null, AuthProvider will redirect.
  }, [user, loading, router]);

  // AuthProvider shows a global loader. 
  // If we reach here and user is already set (e.g. due to fast auth state recovery),
  // AuthProvider's effect should redirect. For safety, can return null or minimal UI.
  if (!loading && user) {
    return null; // Or a minimal "Redirecting..." specific to this page if preferred
  }
  
  // If loading, AuthProvider shows global loader.
  // If !loading and !user, this component renders.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/10 p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            HOPE
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Helping Others Pave Expenses.
        </p>
        
        <div className="bg-card p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Join Our Community</h2>
          <Button 
            onClick={signInWithGoogle} 
            className="w-full py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform duration-150 hover:scale-105"
            disabled={loading} // Disable button while any auth operation is loading
            size="lg"
          >
            <GoogleIcon />
            Sign Up with Google
          </Button>
          <p className="text-xs text-muted-foreground mt-6">
            By signing up, you agree to our <Link href="/terms-and-conditions" className="underline hover:text-primary">Terms of Service</Link>.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Your journey towards easier commutes starts here.
        </p>
      </div>
    </div>
  );
}
