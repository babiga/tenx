"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import {
  updateCustomerSchema,
  type UpdateCustomerData,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserStatusBadge } from "./user-status-badge";
import { Separator } from "@/components/ui/separator";
import type { Customer } from "./customers-columns";

interface CustomerFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  mode: "view" | "edit";
  onSuccess: (customer: Customer) => void;
}

export function CustomerFormSheet({
  open,
  onOpenChange,
  customer,
  mode,
  onSuccess,
}: CustomerFormSheetProps) {
  const [isPending, setIsPending] = useState(false);
  const isEdit = mode === "edit";

  const form = useForm<UpdateCustomerData>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      name: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name || "",
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    }
  }, [customer, form]);

  async function onSubmit(data: UpdateCustomerData) {
    if (!customer) return;

    setIsPending(true);
    try {
      const response = await fetch(`/api/users/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || "Failed to update customer");
        return;
      }

      toast.success("Customer updated successfully");
      onSuccess(result.data);
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Customer" : "Customer Details"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update customer information"
              : "View customer information"}
          </SheetDescription>
        </SheetHeader>

        {/* Profile Header */}
        <div className="flex items-center gap-4 py-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={customer.avatar || undefined} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{customer.name}</h3>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            <div className="flex gap-2">
              <UserStatusBadge type="userType" value={customer.userType} />
            </div>
          </div>
        </div>

        <Separator />

        {isEdit ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col gap-4 py-4"
            >
              <FormField
                control={form.control}
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
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

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter address"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {customer.userType === "CORPORATE" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Organization</label>
                    <Input
                      value={customer.organizationName || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Company Legal No
                    </label>
                    <Input
                      value={customer.companyLegalNo || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </>
              )}

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
        ) : (
          <div className="flex flex-1 flex-col gap-4 py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="mt-1">{customer.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    First Name
                  </label>
                  <p className="mt-1">{customer.firstName || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </label>
                  <p className="mt-1">{customer.lastName || "-"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="mt-1">{customer.phone || "-"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="mt-1">{customer.address || "-"}</p>
              </div>

              {customer.userType === "CORPORATE" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Organization
                    </label>
                    <p className="mt-1">{customer.organizationName || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Company Legal No
                    </label>
                    <p className="mt-1">{customer.companyLegalNo || "-"}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Joined
                </label>
                <p className="mt-1">
                  {formatDistanceToNow(new Date(customer.createdAt), {
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
