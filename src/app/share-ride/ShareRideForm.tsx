
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
import { mockRides, type Ride } from "@/lib/mockData"; // Import mockRides and Ride type

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
  seatingCapacity: z.coerce.number().int().positive({ message: "Seating capacity must be a positive number." }),
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
  const form = useForm<ShareRideFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      origin: "",
      destination: "",
      timeToGo: "",
      seatingCapacity: 1,
      // vehicle: undefined, // Let user select
      // gender: undefined, // Let user select
    },
  });

  const selectedVehicle = form.watch("vehicle");

  function onSubmit(data: ShareRideFormValues) {
    console.log("Share ride data:", data);

    const newRide: Ride = {
      id: `ride-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Simple unique ID
      name: data.fullName,
      origin: data.origin,
      destination: data.destination,
      timeToGo: data.timeToGo,
      vehicle: data.vehicle,
      gender: data.gender,
      seatingCapacity: data.seatingCapacity,
      contactNumber: data.contactNumber,
      // distanceKm is not collected in this form, so it will be undefined for new rides
    };

    mockRides.push(newRide);
    console.log("Updated mockRides:", mockRides);


    toast({
      title: "Ride Shared Successfully!",
      description: "Your ride details have been submitted and are now visible.",
      variant: "default",
    });
    form.reset({ // Reset form to default values or specific empty states
      fullName: "",
      contactNumber: "",
      origin: "",
      destination: "",
      timeToGo: "",
      vehicle: undefined, 
      seatingCapacity: 1, 
      gender: undefined,
    });
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
                    <Input placeholder="e.g. John Doe" {...field} />
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
                    <Input type="tel" placeholder="e.g. 9876543210" {...field} />
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
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Central Park" {...field} />
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
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Times Square" {...field} />
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
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>Use HH:MM format (24-hour).</FormDescription>
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
                      value={field.value} // Ensure value is controlled
                      className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bike" id="bike" />
                        </FormControl>
                        <FormLabel htmlFor="bike" className="font-normal">Bike</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="car" id="car" />
                        </FormControl>
                        <FormLabel htmlFor="car" className="font-normal">Car</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="auto" id="auto" />
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
                    <Input type="number" min="1" placeholder="e.g. 2" {...field} 
                      onChange={event => field.onChange(+event.target.value)} // Ensure value is number
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
                      value={field.value} // Ensure value is controlled
                      className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" id="male"/>
                        </FormControl>
                        <FormLabel htmlFor="male" className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" id="female"/>
                        </FormControl>
                        <FormLabel htmlFor="female" className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" id="other"/>
                        </FormControl>
                        <FormLabel htmlFor="other" className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg">Share My Ride</Button>
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
