
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Control } from "react-hook-form";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const stopSchema = z.object({
  stopName: z.string().min(1, "Stop name is required."),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
});

const formSchema = z.object({
  state: z.string().min(2, "State name must be at least 2 characters."),
  district: z.string().min(2, "District name must be at least 2 characters."),
  city: z.string().min(2, "City name must be at least 2 characters."),
  routeNameOrNumber: z.string().min(1, "Route name or number is required."),
  busNumber: z.string().optional(),
  stops: z.array(stopSchema).min(1, "At least one stop is required."),
});

export type ShareBusRouteFormValues = z.infer<typeof formSchema>;

export function ShareBusRouteForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ShareBusRouteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      district: "",
      city: "",
      routeNameOrNumber: "",
      busNumber: "",
      stops: [{ stopName: "", scheduledTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control as Control<ShareBusRouteFormValues>, 
    name: "stops",
  });

  async function onSubmit(data: ShareBusRouteFormValues) {
    setIsSubmitting(true);
    console.log("Submitting bus route data to Firestore:", data);

    const newBusRoutePayload = {
      ...data,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "busRoutes"), newBusRoutePayload);
      console.log("Bus route added to Firestore with ID: ", docRef.id);
      
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" /> 
            <span>Bus Route Shared!</span>
          </div>
        ),
        description: "The bus route details have been saved to the database.",
        variant: "default",
      });
      form.reset();
      if (form.getValues("stops").length === 0) {
        append({ stopName: "", scheduledTime: "" });
      }
    } catch (error) {
      console.error("Error adding bus route to Firestore: ", error);
      toast({
        title: "Error Sharing Route",
        description: "There was a problem saving the bus route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle>Bus Route Details</CardTitle>
        <CardDescription>Enter the specifics of the bus route and its schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. California" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length > 0) {
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                          }
                          field.onChange(value);
                        }}
                        disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Los Angeles County" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length > 0) {
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                          }
                          field.onChange(value);
                        }}
                        disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Los Angeles" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length > 0) {
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                          }
                          field.onChange(value);
                        }}
                        disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="routeNameOrNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Name or Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Route 101, Downtown Express" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length > 0) {
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                          }
                          field.onChange(value);
                        }}
                        disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="busNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bus Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. B-789, V-1234" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length > 0) {
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                          }
                          field.onChange(value);
                        }}
                        disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-lg font-semibold">Stops & Schedule</FormLabel>
              <FormDescription>Add each stop along the route and its scheduled arrival time.</FormDescription>
              {fields.map((item, index) => (
                <div key={item.id} className="mt-4 p-4 border rounded-md space-y-3 bg-muted/30 relative">
                  <FormLabel className="font-medium">Stop {index + 1}</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`stops.${index}.stopName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stop Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Main Street & 1st Ave" 
                              {...field} 
                              onChange={(e) => {
                                let value = e.target.value;
                                if (value.length > 0) {
                                  value = value.charAt(0).toUpperCase() + value.slice(1);
                                }
                                field.onChange(value);
                              }}
                              disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`stops.${index}.scheduledTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scheduled Time (HH:MM)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
                      aria-label="Remove stop"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ stopName: "", scheduledTime: "" })}
                className="mt-4 flex items-center"
                disabled={isSubmitting}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Stop
              </Button>
               <FormField
                control={form.control}
                name="stops"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sharing..." : "Share Bus Route"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Ensure all information is accurate before submitting. This data will be saved permanently.
        </p>
      </CardFooter>
    </Card>
  );
}
