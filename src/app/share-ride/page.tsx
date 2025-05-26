
import { ShareRideForm } from './ShareRideForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShareRidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <Link href="/" passHref legacyBehavior>
            <Button variant="outline" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center sm:text-left text-primary">Share Your Ride</h1>
          <p className="text-muted-foreground text-center sm:text-left">
            Fill in the details below to offer a ride to fellow commuters.
          </p>
        </header>
        <ShareRideForm />
      </div>
    </div>
  );
}
