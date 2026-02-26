"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
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
  serviceTierId: string;
};

type ChefOption = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
};

type BookingListItem = {
  id: string;
  bookingNumber: string;
  serviceType: "CORPORATE" | "PRIVATE" | "WEDDING" | "VIP";
  status: "PENDING" | "CONFIRMED" | "DEPOSIT_PAID" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  eventDate: string;
  eventTime: string;
  guestCount: number;
  venue: string;
  totalPrice: number;
  depositAmount: number | null;
  serviceTier: { id: string; name: string; pricePerGuest: number };
  menu: { id: string; name: string } | null;
  chefProfile: { id: string; dashboardUser: { name: string } } | null;
  createdAt: string;
};

type UserOrdersBookingProps = {
  serviceTiers: ServiceTierOption[];
  menus: MenuOption[];
  chefs: ChefOption[];
  initialBookings: BookingListItem[];
  initialCustomer: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
};

const serviceTypeLabelMap: Record<BookingListItem["serviceType"], string> = {
  CORPORATE: "Corporate",
  PRIVATE: "Private",
  WEDDING: "Wedding",
  VIP: "VIP",
};

const bookingStatusVariant: Record<BookingListItem["status"], string> = {
  PENDING: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  DEPOSIT_PAID: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  IN_PROGRESS: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  CANCELLED: "bg-rose-500/10 text-rose-700 border-rose-500/20",
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

export function UserOrdersBooking({
  serviceTiers,
  menus,
  chefs,
  initialBookings,
  initialCustomer,
}: UserOrdersBookingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingListItem[]>(initialBookings);

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

      setBookings((prev) => [result.data as BookingListItem, ...prev]);
      setStatusMessage("Booking request submitted successfully.");
      form.reset({
        ...values,
        menuId: "",
        chefProfileId: "",
        specialRequests: "",
      });
    } catch {
      setErrorMessage("Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Order</CardTitle>
          <CardDescription>
            Choose your menu, guest count, event details, location, and contact info.
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

              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                Estimated total: <strong>{formatPrice(estimatedTotal)}</strong>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create Booking"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Track your submitted booking requests.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              No bookings yet.
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{booking.bookingNumber}</p>
                    <p className="font-medium">{booking.serviceTier.name}</p>
                  </div>
                  <Badge variant="outline" className={bookingStatusVariant[booking.status]}>
                    {booking.status.replaceAll("_", " ")}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground md:grid-cols-2">
                  <p>
                    {serviceTypeLabelMap[booking.serviceType]} | {booking.guestCount} guests
                  </p>
                  <p>
                    {format(new Date(booking.eventDate), "PPP")} at {booking.eventTime}
                  </p>
                  <p>{booking.venue}</p>
                  <p>Total: {formatPrice(booking.totalPrice)}</p>
                  {booking.menu ? <p>Menu: {booking.menu.name}</p> : <p>Menu: Not selected</p>}
                  <p>
                    Chef: {booking.chefProfile?.dashboardUser.name ?? "No preference"}
                  </p>
                  <p>Submitted: {format(new Date(booking.createdAt), "PPP")}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
