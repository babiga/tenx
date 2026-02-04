"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { StarIcon } from "lucide-react";

import {
    createDashboardUserSchema,
    updateDashboardUserSchema,
    type CreateDashboardUserData,
    type UpdateDashboardUserData,
} from "@/lib/validations/users";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { Separator } from "@/components/ui/separator";
import type { ChefUser } from "./chefs-columns";

interface ChefFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: ChefUser | null;
    mode: "create" | "edit" | "view";
    onSuccess: (user: ChefUser) => void;
}

export function ChefFormSheet({
    open,
    onOpenChange,
    user,
    mode,
    onSuccess,
}: ChefFormSheetProps) {
    const [isPending, setIsPending] = useState(false);
    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isView = mode === "view";

    const createForm = useForm<CreateDashboardUserData & { specialty?: string; hourlyRate?: number }>({
        resolver: zodResolver(createDashboardUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            role: "CHEF",
        },
    });

    const editForm = useForm<UpdateDashboardUserData & { specialty?: string; hourlyRate?: number }>({
        resolver: zodResolver(updateDashboardUserSchema),
        defaultValues: {
            name: "",
            phone: "",
            specialty: "",
            hourlyRate: 0,
        },
    });

    useEffect(() => {
        if (user && (isEdit || isView)) {
            editForm.reset({
                name: user.name || "",
                phone: user.phone || "",
                specialty: user.chefProfile?.specialty || "",
                hourlyRate: user.chefProfile?.hourlyRate || 0,
            });
        }
        if (isCreate) {
            createForm.reset({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                role: "CHEF",
            });
        }
    }, [user, mode, createForm, editForm, isCreate, isEdit, isView]);

    async function onCreateSubmit(data: any) {
        setIsPending(true);
        try {
            const { confirmPassword, ...submitData } = data;
            const response = await fetch("/api/dashboard-users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error || "Failed to create chef");
                return;
            }

            toast.success("Chef created successfully");
            onSuccess(result.data);
            onOpenChange(false);
            createForm.reset();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    }

    async function onEditSubmit(data: any) {
        if (!user) return;

        setIsPending(true);
        try {
            const response = await fetch(`/api/dashboard-users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error || "Failed to update chef");
                return;
            }

            toast.success("Chef updated successfully");
            onSuccess(result.data);
            onOpenChange(false);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    }

    const initials = user
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "";

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>
                        {isCreate ? "Add New Chef" : isEdit ? "Edit Chef Profle" : "Chef Details"}
                    </SheetTitle>
                    <SheetDescription>
                        {isCreate
                            ? "Create a new chef account with professional details"
                            : isEdit
                                ? "Update chef information and culinary specialty"
                                : "View chef information and ratings"}
                    </SheetDescription>
                </SheetHeader>

                {user && !isCreate && (
                    <>
                        <div className="flex items-center gap-4 py-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.avatar || undefined} />
                                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex gap-2">
                                    <UserStatusBadge type="active" value={user.isActive} />
                                    <div className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full text-xs font-medium">
                                        <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {user.chefProfile?.rating.toFixed(1) || "0.0"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                    </>
                )}

                {isCreate && (
                    <Form {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex flex-1 flex-col gap-4 py-4">
                            <FormField
                                control={createForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={createForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl><PasswordInput placeholder="••••••••" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm</FormLabel>
                                            <FormControl><PasswordInput placeholder="••••••••" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={createForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone (Optional)</FormLabel>
                                        <FormControl><Input placeholder="+976 99999999" {...field} value={field.value ?? ""} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={createForm.control}
                                    name="specialty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specialty (Optional)</FormLabel>
                                            <FormControl><Input placeholder="e.g. Italian" {...field} value={field.value ?? ""} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="hourlyRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hourly Rate ($)</FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <SheetFooter className="mt-auto pt-4">
                                <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
                                <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Chef"}</Button>
                            </SheetFooter>
                        </form>
                    </Form>
                )}

                {isEdit && user && (
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="flex flex-1 flex-col gap-4 py-4">
                            <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl><Input placeholder="+976 99999999" {...field} value={field.value ?? ""} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={editForm.control}
                                    name="specialty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specialty</FormLabel>
                                            <FormControl><Input placeholder="e.g. Italian" {...field} value={field.value ?? ""} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="hourlyRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hourly Rate ($)</FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <SheetFooter className="mt-auto pt-4">
                                <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
                                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button>
                            </SheetFooter>
                        </form>
                    </Form>
                )}

                {isView && user && (
                    <div className="flex flex-1 flex-col gap-4 py-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-muted-foreground">Email</label><p className="font-medium">{user.email}</p></div>
                            <div><label className="text-muted-foreground">Phone</label><p className="font-medium">{user.phone || "-"}</p></div>
                            <div><label className="text-muted-foreground">Specialty</label><p className="font-medium">{user.chefProfile?.specialty || "Not set"}</p></div>
                            <div><label className="text-muted-foreground">Hourly Rate</label><p className="font-medium">${Number(user.chefProfile?.hourlyRate || 0).toFixed(2)}</p></div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Created</span>
                                <span>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Last Login</span>
                                <span>{user.lastLoginAt ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true }) : "Never"}</span>
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
