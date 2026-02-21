"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, UsersIcon } from "lucide-react";

import {
    createEventSchema,
    updateEventSchema,
} from "@/lib/validations/events";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { EventItem } from "./events-columns";

interface EventFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: EventItem | null;
    mode: "create" | "edit" | "view";
    onSuccess: () => void;
}

const eventTypeLabels: Record<string, string> = {
    WEDDING: "Wedding",
    CORPORATE: "Corporate",
    PRIVATE: "Private",
    SOCIAL: "Social",
};

const eventTypeColors: Record<string, string> = {
    WEDDING: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    CORPORATE: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PRIVATE: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    SOCIAL: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export function EventFormSheet({
    open,
    onOpenChange,
    event,
    mode,
    onSuccess,
}: EventFormSheetProps) {
    const [isPending, setIsPending] = useState(false);
    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isView = mode === "view";

    const createForm = useForm({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            title: "",
            description: "",
            eventType: "CORPORATE",
            guestCount: 50,
            eventDate: "",
            images: [],
            isFeatured: false,
            chefProfileId: null,
            companyProfileId: null,
        },
    });

    const editForm = useForm({
        resolver: zodResolver(updateEventSchema),
        defaultValues: {
            title: "",
            description: "",
            eventType: "CORPORATE",
            guestCount: 50,
            eventDate: "",
            isFeatured: false,
        },
    });

    useEffect(() => {
        if (event && (isEdit || isView)) {
            editForm.reset({
                title: event.title || "",
                description: event.description || "",
                eventType: event.eventType,
                guestCount: event.guestCount,
                eventDate: event.eventDate
                    ? new Date(event.eventDate).toISOString().split("T")[0]
                    : "",
                isFeatured: event.isFeatured,
            });
        }
        if (isCreate) {
            createForm.reset({
                title: "",
                description: "",
                eventType: "CORPORATE",
                guestCount: 50,
                eventDate: "",
                images: [],
                isFeatured: false,
                chefProfileId: null,
                companyProfileId: null,
            });
        }
    }, [event, mode, createForm, editForm, isCreate, isEdit, isView]);

    async function onCreateSubmit(data: any) {
        setIsPending(true);
        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error || "Failed to create event");
                return;
            }

            toast.success("Event created successfully");
            onSuccess();
            onOpenChange(false);
            createForm.reset();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    }

    async function onEditSubmit(data: any) {
        if (!event) return;

        setIsPending(true);
        try {
            const response = await fetch(`/api/events/${event.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error || "Failed to update event");
                return;
            }

            toast.success("Event updated successfully");
            onSuccess();
            onOpenChange(false);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    }

    function renderFormFields(form: any) {
        return (
            <>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Event title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the event..."
                                    rows={3}
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="WEDDING">Wedding</SelectItem>
                                        <SelectItem value="CORPORATE">Corporate</SelectItem>
                                        <SelectItem value="PRIVATE">Private</SelectItem>
                                        <SelectItem value="SOCIAL">Social</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        placeholder="50"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Date (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <FormLabel>Featured Event</FormLabel>
                                <FormDescription className="text-xs">
                                    Featured events are highlighted on the public website
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>
                        {isCreate ? "Add New Event" : isEdit ? "Edit Event" : "Event Details"}
                    </SheetTitle>
                    <SheetDescription>
                        {isCreate
                            ? "Create a new portfolio event"
                            : isEdit
                                ? "Update event information"
                                : "View event details"}
                    </SheetDescription>
                </SheetHeader>

                {event && !isCreate && (
                    <>
                        <div className="flex items-center gap-3 py-4">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge
                                        variant="outline"
                                        className={eventTypeColors[event.eventType] || ""}
                                    >
                                        {eventTypeLabels[event.eventType]}
                                    </Badge>
                                    {event.isFeatured && (
                                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Separator />
                    </>
                )}

                {isCreate && (
                    <Form {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex flex-1 flex-col gap-4 py-4">
                            {renderFormFields(createForm)}
                            <SheetFooter className="mt-auto pt-4">
                                <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
                                <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Event"}</Button>
                            </SheetFooter>
                        </form>
                    </Form>
                )}

                {isEdit && event && (
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="flex flex-1 flex-col gap-4 py-4">
                            {renderFormFields(editForm)}
                            <SheetFooter className="mt-auto pt-4">
                                <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
                                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button>
                            </SheetFooter>
                        </form>
                    </Form>
                )}

                {isView && event && (
                    <div className="flex flex-1 flex-col gap-4 py-4 text-sm">
                        {event.description && (
                            <div>
                                <label className="text-muted-foreground">Description</label>
                                <p className="font-medium mt-1">{event.description}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-muted-foreground">Guest Count</label>
                                <p className="font-medium flex items-center gap-1.5">
                                    <UsersIcon className="h-3.5 w-3.5" />
                                    {event.guestCount}
                                </p>
                            </div>
                            <div>
                                <label className="text-muted-foreground">Event Date</label>
                                <p className="font-medium flex items-center gap-1.5">
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    {event.eventDate
                                        ? format(new Date(event.eventDate), "MMM d, yyyy")
                                        : "Not set"}
                                </p>
                            </div>
                            <div>
                                <label className="text-muted-foreground">Chef</label>
                                <p className="font-medium">
                                    {event.chefProfile?.dashboardUser?.name || "—"}
                                </p>
                            </div>
                            <div>
                                <label className="text-muted-foreground">Company</label>
                                <p className="font-medium">
                                    {event.companyProfile?.dashboardUser?.name || "—"}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Created</span>
                                <span>{format(new Date(event.createdAt), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Updated</span>
                                <span>{format(new Date(event.updatedAt), "MMM d, yyyy")}</span>
                            </div>
                        </div>
                        <SheetFooter className="mt-auto pt-4">
                            <SheetClose asChild><Button variant="outline" className="w-full">Close</Button></SheetClose>
                        </SheetFooter>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
