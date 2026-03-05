"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type BookingStatus = "PENDING" | "CONFIRMED" | "DEPOSIT_PAID" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

type BookingDetail = {
  id: string;
  bookingNumber: string;
  serviceType: "CORPORATE" | "PRIVATE" | "WEDDING" | "VIP" | "OTHER";
  status: BookingStatus;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  venue: string;
  venueAddress: string | null;
  specialRequests: string | null;
  totalPrice: number;
  depositAmount: number | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    userType: "INDIVIDUAL" | "CORPORATE";
  };
  serviceTier: {
    id: string;
    name: string;
    pricePerGuest: number;
    isVIP: boolean;
  };
  menu: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  chefProfile: {
    id: string;
    specialty: string;
    dashboardUser: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
  } | null;
  contract: {
    id: string;
    status: "DRAFT" | "SENT" | "SIGNED" | "COMPLETED" | "CANCELLED";
    signatureUrl: string | null;
    signedAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  payments: Array<{
    id: string;
    amount: number;
    method: "QPAY" | "BANK_TRANSFER";
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
    transactionId: string | null;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    invoice: {
      id: string;
      invoiceNumber: string;
      subtotal: number;
      tax: number;
      total: number;
      issuedAt: string;
      paidAt: string | null;
      dueDate: string | null;
    } | null;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    createdAt: string;
    customer: {
      id: string;
      name: string;
      email: string;
    };
  }>;
};

const statusClasses: Record<BookingStatus, string> = {
  PENDING: "border-amber-500/30 text-amber-700",
  CONFIRMED: "border-blue-500/30 text-blue-700",
  DEPOSIT_PAID: "border-cyan-500/30 text-cyan-700",
  IN_PROGRESS: "border-indigo-500/30 text-indigo-700",
  COMPLETED: "border-emerald-500/30 text-emerald-700",
  CANCELLED: "border-rose-500/30 text-rose-700",
};

function formatAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("PENDING");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const bookingId = params.id;

  const fetchBooking = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dashboard-bookings/${bookingId}`);
      const result = await response.json();
      if (!result.success) {
        toast.error(result.error || "Failed to load booking details");
        return;
      }

      setBooking(result.data);
      setSelectedStatus(result.data.status);
    } catch {
      toast.error("Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const statusOptions = useMemo(
    () =>
      ["PENDING", "CONFIRMED", "DEPOSIT_PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const,
    [],
  );

  const handleSaveStatus = useCallback(async () => {
    if (!booking) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/dashboard-bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const result = await response.json();
      if (!result.success) {
        toast.error(result.error || "Failed to update booking status");
        return;
      }

      setBooking((prev) => (prev ? { ...prev, ...result.data } : prev));
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setIsUpdating(false);
    }
  }, [booking, selectedStatus]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="px-4 py-6 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Not Found</CardTitle>
            <CardDescription>The requested booking could not be loaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <a href="/dashboard/bookings">Back to bookings</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-start justify-between gap-4 px-4 lg:px-6">
        <div>
          <p className="text-xs text-muted-foreground">Booking #{booking.bookingNumber}</p>
          <h1 className="text-2xl font-bold">Booking Detail</h1>
          <p className="text-muted-foreground">
            Created {format(new Date(booking.createdAt), "MMM d, yyyy HH:mm")}
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/dashboard/bookings">Back to list</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Core event and service information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline" className={statusClasses[booking.status]}>
                  {booking.status.replaceAll("_", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Service Type</p>
                <p>{booking.serviceType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Service Tier</p>
                <p>{booking.serviceTier.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Guest Count</p>
                <p>{booking.guestCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Event Date</p>
                <p>{format(new Date(booking.eventDate), "PPP")} at {booking.eventTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Venue</p>
                <p>{booking.venue}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Venue Address</p>
                <p>{booking.venueAddress || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Preferred Chef</p>
                <p>{booking.chefProfile?.dashboardUser.name || "No preference"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Menu</p>
                <p>{booking.menu?.name || "Not selected"}</p>
              </div>
            </div>

            <Separator />

            <div className="text-sm">
              <p className="text-muted-foreground">Special Requests</p>
              <p>{booking.specialRequests || "None"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Status</CardTitle>
            <CardDescription>Update booking lifecycle state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={(value: BookingStatus) => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveStatus} disabled={isUpdating || selectedStatus === booking.status} className="w-full">
              {isUpdating ? "Saving..." : "Save Status"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {booking.customer.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {booking.customer.email}</p>
            <p><span className="text-muted-foreground">Phone:</span> {booking.customer.phone || "N/A"}</p>
            <p><span className="text-muted-foreground">Type:</span> {booking.customer.userType}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Price / Guest:</span> {formatAmount(booking.serviceTier.pricePerGuest)}</p>
            <p><span className="text-muted-foreground">Total:</span> {formatAmount(booking.totalPrice)}</p>
            <p><span className="text-muted-foreground">Deposit:</span> {booking.depositAmount ? formatAmount(booking.depositAmount) : "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {booking.contract ? (
              <>
                <p><span className="text-muted-foreground">Status:</span> {booking.contract.status}</p>
                <p><span className="text-muted-foreground">Signed:</span> {booking.contract.signedAt ? format(new Date(booking.contract.signedAt), "PPP") : "Not signed"}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No contract created yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>{booking.payments.length} payment record(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments recorded</p>
            ) : (
              booking.payments.map((payment) => (
                <div key={payment.id} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{formatAmount(payment.amount)}</p>
                    <Badge variant="outline">{payment.status}</Badge>
                  </div>
                  <p className="text-muted-foreground">Method: {payment.method}</p>
                  <p className="text-muted-foreground">
                    Created: {format(new Date(payment.createdAt), "MMM d, yyyy HH:mm")}
                  </p>
                  {payment.paidAt ? (
                    <p className="text-muted-foreground">Paid: {format(new Date(payment.paidAt), "MMM d, yyyy HH:mm")}</p>
                  ) : null}
                  {payment.invoice ? (
                    <p className="text-muted-foreground">Invoice #{payment.invoice.invoiceNumber}</p>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>{booking.reviews.length} review(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            ) : (
              booking.reviews.map((review) => (
                <div key={review.id} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.customer.name}</p>
                    <Badge variant="outline">{review.rating} / 5</Badge>
                  </div>
                  {review.title ? <p className="mt-1 font-medium">{review.title}</p> : null}
                  {review.comment ? <p className="mt-1 text-muted-foreground">{review.comment}</p> : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted {format(new Date(review.createdAt), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
