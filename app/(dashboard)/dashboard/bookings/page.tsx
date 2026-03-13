"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UsersDataTable } from "@/components/users/users-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getBookingsColumns,
  type BookingRecord,
} from "@/components/bookings/bookings-columns";

export default function BookingsPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const result = await response.json();
      if (result.success) {
        setUser(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dashboard-bookings?limit=300&sortOrder=desc");
      const result = await response.json();
      if (!result.success) {
        toast.error(result.error || "Failed to load bookings");
        return;
      }

      setBookings(result.data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
    fetchBookings();
  }, [fetchSession, fetchBookings]);

  const handleUpdateStatus = useCallback(
    async (booking: BookingRecord, status: BookingRecord["status"]) => {
      try {
        const response = await fetch(`/api/dashboard-bookings/${booking.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const result = await response.json();

        if (!result.success) {
          toast.error(result.error || "Failed to update booking status");
          return;
        }

        setBookings((prev) => prev.map((row) => (row.id === booking.id ? result.data : row)));
        toast.success("Booking status updated");
      } catch {
        toast.error("Failed to update booking status");
      }
    },
    [],
  );

  const columns = useMemo(
    () => getBookingsColumns({ onUpdateStatus: handleUpdateStatus, role: user?.role }),
    [handleUpdateStatus, user?.role],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground">
          Review bookings, monitor status, and open each booking for full details.
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <UsersDataTable
          columns={columns as any}
          data={bookings}
          searchPlaceholder="Search by booking number, customer, or venue..."
          searchColumn="bookingNumber"
          filterColumn="status"
          filterOptions={[
            { label: "Pending", value: "PENDING" },
            { label: "Confirmed", value: "CONFIRMED" },
            { label: "Deposit Paid", value: "DEPOSIT_PAID" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Cancelled", value: "CANCELLED" },
          ]}
        />
      </div>
    </div>
  );
}
