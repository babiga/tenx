"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersDataTable } from "@/components/users/users-data-table";
import { getEventsColumns, type EventItem } from "@/components/events/events-columns";
import { EventFormSheet } from "@/components/events/event-form-sheet";
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

export default function EventsManagementPage() {
    const [user, setUser] = useState<any>(null);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sheet state
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [sheetMode, setSheetMode] = useState<"create" | "edit" | "view">("view");

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAdmin = user?.role === "ADMIN";

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

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/events?limit=100");
            const result = await response.json();
            if (result.success) {
                setEvents(result.data);
            }
        } catch {
            toast.error("Failed to load events");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
        fetchEvents();
    }, [fetchSession, fetchEvents]);

    const handleCreate = () => {
        setSelectedEvent(null);
        setSheetMode("create");
        setSheetOpen(true);
    };

    const handleView = (event: EventItem) => {
        setSelectedEvent(event);
        setSheetMode("view");
        setSheetOpen(true);
    };

    const handleEdit = (event: EventItem) => {
        setSelectedEvent(event);
        setSheetMode("edit");
        setSheetOpen(true);
    };

    const handleDelete = (event: EventItem) => {
        setEventToDelete(event);
        setDeleteDialogOpen(true);
    };

    const handleToggleFeatured = async (event: EventItem) => {
        try {
            const response = await fetch(`/api/events/${event.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFeatured: !event.isFeatured }),
            });
            const result = await response.json();
            if (result.success) {
                setEvents((prev) =>
                    prev.map((e) =>
                        e.id === event.id ? { ...e, isFeatured: !e.isFeatured } : e
                    )
                );
                toast.success(
                    event.isFeatured
                        ? "Event unfeatured"
                        : "Event featured"
                );
            }
        } catch {
            toast.error("Failed to toggle featured status");
        }
    };

    const onDeleteConfirmed = async () => {
        if (!eventToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/events/${eventToDelete.id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!result.success) {
                toast.error(result.error || "Failed to delete event");
                return;
            }

            toast.success("Event deleted successfully");
            setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
            setEventToDelete(null);
            setDeleteDialogOpen(false);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = useMemo(
        () =>
            getEventsColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
                onToggleFeatured: handleToggleFeatured,
                role: user?.role,
            }),
        [handleDelete, handleEdit, handleToggleFeatured, handleView, user?.role]
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 lg:px-6 px-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div>
                    <h1 className="text-2xl font-bold">Events Management</h1>
                    <p className="text-muted-foreground">
                        Manage portfolio events showcased on your platform
                    </p>
                </div>
                {isAdmin && (
                    <Button onClick={handleCreate}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Event
                    </Button>
                )}
            </div>

            <div className="px-4 lg:px-6">
                <UsersDataTable
                    columns={columns as any}
                    data={events}
                    searchPlaceholder="Search events by title..."
                    searchColumn="title"
                />
            </div>

            <EventFormSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                event={selectedEvent}
                mode={sheetMode}
                onSuccess={fetchEvents}
            />

            {eventToDelete && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <strong>{eventToDelete.title}</strong>?
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onDeleteConfirmed}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
