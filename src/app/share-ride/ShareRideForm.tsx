
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React from "react";
// import type { Ride } from "@/lib/mockData"; // Not directly used for form values
import { db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle } from "lucide-react";

const VALID_VEHICLE_NUMBER_REGEX = /^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$/;

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  contactNumber: z.string()
    .min(10, { message: "Contact number must be at least 10 digits." })
    .max(15, { message: "Contact number can be at most 15 digits." })
    .regex(/^\d+$/, { message: "Contact number must only contain digits." }),
  origin: z.string().min(3, { message: "Origin must be at least 3 characters." }),
  destination: z.string().min(3, { message: "Destination must be at least 3 characters." }),
  timeToGo: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:MM)." }),
  vehicle: z.enum(["bike", "car", "auto"], { required_error: "Please select a vehicle type." }),
  vehicleNumber: z.string()
    .optional()
    .refine(val => !val || val === "" || VALID_VEHICLE_NUMBER_REGEX.test(val), {
      message: "Invalid vehicle number format. Expected: MH 12 DE 1234 or empty.",
    }),
  seatingCapacity: z.coerce.number().int().nonnegative({ message: "Seating capacity cannot be negative." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
}).superRefine((data, ctx) => {
  if (data.vehicle === "bike" && data.seatingCapacity > 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["seatingCapacity"],
      message: "Bike seating capacity cannot be more than 2.",
    });
  }
  if (data.vehicle === "car" && data.seatingCapacity > 7) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["seatingCapacity"],
      message: "Car seating capacity cannot be more than 7.",
    });
  }
  if (data.vehicle === "auto" && data.seatingCapacity > 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["seatingCapacity"],
      message: "Auto seating capacity cannot be more than 6.",
    });
  }
});

export type ShareRideFormValues = z.infer<typeof formSchema>;

export function ShareRideForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<ShareRideFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      origin: "",
      destination: "",
      timeToGo: "",
      vehicleNumber: "",
      seatingCapacity: 0, // Default to 0 or 1 as appropriate
      // vehicle: undefined, // Let user select
      // gender: undefined, // Let user select
    },
  });

  const selectedVehicle = form.watch("vehicle");

  async function onSubmit(data: ShareRideFormValues) {
    setIsSubmitting(true);
    console.log("Share ride data for Firestore:", data);

    const newRidePayload = {
      name: data.fullName,
      origin: data.origin,
      destination: data.destination,
      timeToGo: data.timeToGo,
      vehicle: data.vehicle,
      vehicleNumber: data.vehicleNumber || "", // Store empty string if undefined
      gender: data.gender,
      seatingCapacity: data.seatingCapacity,
      contactNumber: data.contactNumber,
      createdAt: serverTimestamp(), 
    };

    try {
      const docRef = await addDoc(collection(db, "rides"), newRidePayload);
      console.log("Ride added to Firestore with ID: ", docRef.id);
      
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" /> 
            <span>Ride Shared Successfully!</span>
          </div>
        ),
        description: "Your ride details have been submitted and saved to the database.",
        variant: "default",
      });
      form.reset({ 
        fullName: "",
        contactNumber: "",
        origin: "",
        destination: "",
        timeToGo: "",
        vehicleNumber: "",
        vehicle: undefined, 
        seatingCapacity: 0, // Reset to 0 or 1
        gender: undefined,
      });
    } catch (error) {
      console.error("Error adding ride to Firestore: ", error);
      toast({
        title: "Error Sharing Ride",
        description: "There was a problem saving your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle>Ride Details</CardTitle>
        <CardDescription>Enter the specifics of your ride below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field} 
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.length > 0) {
                          value = value.charAt(0).toUpperCase() + value.slice(1);
                        }
                        field.onChange(value);
                      }}
                      disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. 9876543210" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Shivaji Nagar" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length > 0) {
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                          }
                          field.onChange(value);
                        }}
                        disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Kothrud Depot" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length > 0) {
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                          }
                          field.onChange(value);
                        }}
                        disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="timeToGo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time to Go</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormDescription>Use HH:MM format (24-hour).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ex. MH 12 DE 1234" 
                      {...field} 
                      value={field.value || ""} 
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Format: XX 00 XX 0000 (e.g., MH 12 DE 1234)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value} 
                      className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                      disabled={isSubmitting}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bike" id="bike" disabled={isSubmitting}/>
                        </FormControl>
                        <FormLabel htmlFor="bike" className="font-normal">Bike</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="car" id="car" disabled={isSubmitting}/>
                        </FormControl>
                        <FormLabel htmlFor="car" className="font-normal">Car</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="auto" id="auto" disabled={isSubmitting}/>
                        </FormControl>
                        <FormLabel htmlFor="auto" className="font-normal">Auto</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seatingCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seating Capacity (including driver)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="e.g. 2" {...field} 
                      onChange={event => field.onChange(+event.target.value)} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {selectedVehicle === "bike" && <FormDescription>Max 2 for bike.</FormDescription>}
                  {selectedVehicle === "car" && <FormDescription>Max 7 for car.</FormDescription>}
                  {selectedVehicle === "auto" && <FormDescription>Max 6 for auto.</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Your Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value} 
                      className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                      disabled={isSubmitting}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" id="male" disabled={isSubmitting}/>
                        </FormControl>
                        <FormLabel htmlFor="male" className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" id="female" disabled={isSubmitting}/>
                        </FormControl>
                        <FormLabel htmlFor="female" className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" id="other" disabled={isSubmitting}/>
                        </FormControl>
                        <FormLabel htmlFor="other" className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sharing..." : "Share My Ride"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          By submitting, you agree to our terms and conditions for ride sharing.
        </p>
      </CardFooter>
    </Card>
  );
}

