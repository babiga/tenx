"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; name: string; email: string };
  userType: "customer" | "dashboard";
  onDeleted: () => void;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  userType,
  onDeleted,
}: DeleteUserDialogProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    setIsPending(true);
    try {
      const endpoint =
        userType === "customer"
          ? `/api/users/${user.id}`
          : `/api/dashboard-users/${user.id}`;

      const response = await fetch(endpoint, { method: "DELETE" });
      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || "Failed to delete user");
        return;
      }

      toast.success("User deleted successfully");
      onDeleted();
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                Are you sure you want to delete <strong>{user.name}</strong> (
                {user.email})? This action cannot be undone.
              </p>
              {userType === "customer" && (
                <p className="mt-2 text-destructive">
                  Warning: This will also delete all associated bookings and
                  reviews.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
