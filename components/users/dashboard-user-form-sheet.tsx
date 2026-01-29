"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { UserStatusBadge } from "./user-status-badge";
import { Separator } from "@/components/ui/separator";
import type { DashboardUser } from "./dashboard-users-columns";

interface DashboardUserFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: DashboardUser | null;
  mode: "create" | "edit" | "view";
  onSuccess: (user: DashboardUser) => void;
}

export function DashboardUserFormSheet({
  open,
  onOpenChange,
  user,
  mode,
  onSuccess,
}: DashboardUserFormSheetProps) {
  const [isPending, setIsPending] = useState(false);
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const createForm = useForm<CreateDashboardUserData>({
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

  const editForm = useForm<UpdateDashboardUserData>({
    resolver: zodResolver(updateDashboardUserSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user && (isEdit || isView)) {
      editForm.reset({
        name: user.name || "",
        phone: user.phone || "",
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

  async function onCreateSubmit(data: CreateDashboardUserData) {
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
        toast.error(result.error || "Failed to create user");
        return;
      }

      toast.success("Dashboard user created successfully");
      onSuccess(result.data);
      onOpenChange(false);
      createForm.reset();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  async function onEditSubmit(data: UpdateDashboardUserData) {
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
        toast.error(result.error || "Failed to update user");
        return;
      }

      toast.success("Dashboard user updated successfully");
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
            {isCreate
              ? "Create Dashboard User"
              : isEdit
              ? "Edit Dashboard User"
              : "User Details"}
          </SheetTitle>
          <SheetDescription>
            {isCreate
              ? "Create a new admin, chef, or company account"
              : isEdit
              ? "Update user information"
              : "View user information"}
          </SheetDescription>
        </SheetHeader>

        {/* Profile Header (for edit/view) */}
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
                  <UserStatusBadge type="role" value={user.role} />
                  <UserStatusBadge type="active" value={user.isActive} />
                  <UserStatusBadge type="verified" value={user.isVerified} />
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Create Form */}
        {isCreate && (
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onCreateSubmit)}
              className="flex flex-1 flex-col gap-4 py-4"
            >
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+976 99999999"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="CHEF">Chef</SelectItem>
                        <SelectItem value="COMPANY">Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="mt-auto pt-4">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create User"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}

        {/* Edit Form */}
        {isEdit && user && (
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="flex flex-1 flex-col gap-4 py-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={user.email} disabled className="bg-muted" />
              </div>

              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+976 99999999"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input value={user.role} disabled className="bg-muted" />
              </div>

              <SheetFooter className="mt-auto pt-4">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}

        {/* View Mode */}
        {isView && user && (
          <div className="flex flex-1 flex-col gap-4 py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="mt-1">{user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="mt-1">{user.phone || "-"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Role
                </label>
                <div className="mt-1">
                  <UserStatusBadge type="role" value={user.role} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <UserStatusBadge type="active" value={user.isActive} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Verified
                  </label>
                  <div className="mt-1">
                    <UserStatusBadge type="verified" value={user.isVerified} />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Login
                </label>
                <p className="mt-1">
                  {user.lastLoginAt
                    ? formatDistanceToNow(new Date(user.lastLoginAt), {
                        addSuffix: true,
                      })
                    : "Never"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="mt-1">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <SheetFooter className="mt-auto pt-4">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
