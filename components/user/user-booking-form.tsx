"use client";

import { useMemo, useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Check, ChefHat, FileSignature, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getCreateBookingSchema,
  type CreateBookingData,
} from "@/lib/validations/bookings";

type ServiceTierOption = {
  id: string;
  name: string;
  pricePerGuest: number;
  isVIP: boolean;
};

type MenuOption = {
  id: string;
  name: string;
  description: string | null;
  serviceTierId: string | null;
};

type ChefOption = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
};

type UserBookingFormProps = {
  serviceTiers: ServiceTierOption[];
  menus: MenuOption[];
  chefs: ChefOption[];
  initialCustomer: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
};

const validationMessages = {
  serviceTierRequired: "Please select a service tier",
  serviceTypeRequired: "Please select an event type",
  eventDateInvalid: "Please enter a valid event date",
  eventDateFuture: "Event date cannot be in the past",
  eventTimeInvalid: "Please enter a valid event time",
  guestCountInteger: "Guest count must be a whole number",
  guestCountMin: "Guest count must be at least 1",
  guestCountMax: "Guest count is too large",
  venueMin: "Location must be at least 2 characters",
  venueMax: "Location must be less than 300 characters",
  venueAddressMax: "Address must be less than 500 characters",
  specialRequestsMax: "Special requests must be less than 2000 characters",
  contactNameMin: "Contact name must be at least 2 characters",
  contactNameMax: "Contact name must be less than 100 characters",
  contactPhoneInvalid: "Please enter a valid phone number",
  contactEmailInvalid: "Please enter a valid email address",
  contactEmailMax: "Email must be less than 320 characters",
};

function formatPrice(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function UserBookingForm({
  serviceTiers,
  menus,
  chefs,
  initialCustomer,
}: UserBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<CreateBookingData>({
    resolver: zodResolver(getCreateBookingSchema((key) => validationMessages[key as keyof typeof validationMessages])),
    defaultValues: {
      serviceTierId: serviceTiers[0]?.id ?? "",
      menuId: "",
      chefProfileId: "",
      serviceType: "CORPORATE",
      eventDate: "",
      eventTime: "18:00",
      guestCount: 20,
      venue: "",
      venueAddress: initialCustomer.address ?? "",
      specialRequests: "",
      contactName: initialCustomer.name,
      contactPhone: initialCustomer.phone ?? "",
      contactEmail: initialCustomer.email,
    },
  });

  const selectedTierId = form.watch("serviceTierId");
  const guestCount = Number(form.watch("guestCount") || 0);
  const tier = serviceTiers.find((item) => item.id === selectedTierId) ?? null;

  const filteredMenus = useMemo(
    () => menus.filter((menu) => menu.serviceTierId === selectedTierId),
    [menus, selectedTierId],
  );

  const estimatedTotal = tier ? tier.pricePerGuest * guestCount : 0;

  async function onSubmit(values: CreateBookingData) {
    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    const payload = {
      ...values,
      menuId: values.menuId?.trim() ? values.menuId : null,
      chefProfileId: values.chefProfileId?.trim() ? values.chefProfileId : null,
      venueAddress: values.venueAddress?.trim() || null,
      specialRequests: values.specialRequests?.trim() || null,
      contactName: values.contactName.trim(),
      contactPhone: values.contactPhone.trim(),
      contactEmail: values.contactEmail.trim(),
      venue: values.venue.trim(),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to create booking.");
        return;
      }

      setStatusMessage("Booking request submitted successfully.");
  form.reset({
        ...values,
        menuId: "",
        chefProfileId: "",
        specialRequests: "",
      });
      setCurrentStep(0);
    } catch {
      setErrorMessage("Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  }

  type BookingStep = {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    fields: Path<CreateBookingData>[];
  };

  const bookingSteps: BookingStep[] = [
    {
      id: 1,
      title: "Service Selection",
      description: "Choose your tier, preferred menu, and chef.",
      icon: Check,
      fields: ["serviceTierId"],
    },
    {
      id: 2,
      title: "Event Details",
      description: "Set guest count, schedule, and venue details.",
      icon: Calendar,
      fields: ["guestCount", "eventDate", "eventTime", "serviceType", "venue"],
    },
    {
      id: 3,
      title: "Contact & Notes",
      description: "Confirm contact details and any special requests.",
      icon: ChefHat,
      fields: ["contactName", "contactPhone", "contactEmail"],
    },
    {
      id: 4,
      title: "Review & Submit",
      description: "Verify all information before submitting.",
      icon: FileSignature,
      fields: [],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const isFinalStep = currentStep === bookingSteps.length - 1;

  async function handleNextStep() {
    const step = bookingSteps[currentStep];
    const isValid = step.fields.length === 0
      ? true
      : await form.trigger(step.fields, { shouldFocus: true });

    if (!isValid) {
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, bookingSteps.length - 1));
  }

  function handleBackStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleStepClick(index: number) {
    if (index === currentStep) {
      return;
    }

    if (index < currentStep) {
      setCurrentStep(index);
      return;
    }

    const step = bookingSteps[currentStep];
    const isValid = step.fields.length === 0
      ? true
      : await form.trigger(step.fields, { shouldFocus: true });

    if (isValid) {
      setCurrentStep(index);
    }
  }

  const selectedMenu = filteredMenus.find((menu) => menu.id === form.watch("menuId"));
  const selectedChef = chefs.find((chef) => chef.id === form.watch("chefProfileId"));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Order</CardTitle>
        <CardDescription>
          Complete each step to submit a reliable booking request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {statusMessage && (
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                {statusMessage}
              </div>
            )}
            {errorMessage && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 relative lg:grid-cols-4">
              <div className="absolute left-0 top-8 hidden h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
              {bookingSteps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const circleClass = isCompleted
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : isCurrent
                    ? "border-primary/50 bg-primary/10"
                    : "border-white/10 bg-card";

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => void handleStepClick(index)}
                    className="group relative z-10 flex flex-col items-center text-center"
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full border transition-colors ${circleClass}`}>
                      <step.icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                    </div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                  </button>
                );
              })}
            </div>

            {currentStep === 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="serviceTierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Tier</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("menuId", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceTiers.map((serviceTier) => (
                            <SelectItem key={serviceTier.id} value={serviceTier.id}>
                              {serviceTier.name} ({formatPrice(serviceTier.pricePerGuest)} / guest)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="menuId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menu (Optional)</FormLabel>
                      <Select
                        value={field.value || "none"}
                        onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a menu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No specific menu</SelectItem>
                          {filteredMenus.map((menu) => (
                            <SelectItem key={menu.id} value={menu.id}>
                              {menu.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chefProfileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chef (Optional)</FormLabel>
                      <Select
                        value={field.value || "none"}
                        onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a chef" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No preference</SelectItem>
                          {chefs.map((chef) => (
                            <SelectItem key={chef.id} value={chef.id}>
                              {chef.name} ({chef.specialty})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="guestCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <Input type="date" min={getTodayDate()} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CORPORATE">Corporate</SelectItem>
                          <SelectItem value="PRIVATE">Private</SelectItem>
                          <SelectItem value="WEDDING">Wedding</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Venue or location name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venueAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Street, district, city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+976XXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Dietary requirements, setup notes, additional details..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 rounded-md border bg-muted/20 p-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Service Tier</p>
                    <p className="font-medium">{tier?.name ?? "Not selected"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Event Type</p>
                    <p className="font-medium">{form.getValues("serviceType")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Menu</p>
                    <p className="font-medium">{selectedMenu?.name ?? "No specific menu"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Chef</p>
                    <p className="font-medium">{selectedChef ? `${selectedChef.name} (${selectedChef.specialty})` : "No preference"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Guests</p>
                    <p className="font-medium">{guestCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Event Date & Time</p>
                    <p className="font-medium">{form.getValues("eventDate")} at {form.getValues("eventTime")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Venue</p>
                    <p className="font-medium">{form.getValues("venue")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact</p>
                    <p className="font-medium">{form.getValues("contactName")} | {form.getValues("contactPhone")}</p>
                    <p className="text-muted-foreground">{form.getValues("contactEmail")}</p>
                  </div>
                </div>

                <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  Estimated total: <strong>{formatPrice(estimatedTotal)}</strong>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={handleBackStep} disabled={currentStep === 0 || isSubmitting}>
                Back
              </Button>

              {isFinalStep ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Create Booking"}
                </Button>
              ) : (
                <Button type="button" onClick={() => void handleNextStep()} disabled={isSubmitting}>
                  Continue
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
