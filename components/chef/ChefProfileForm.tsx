"use client";

import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { chefProfileSchema, type ChefProfileData } from "@/lib/validations/chef";
import { updateChefProfile } from "@/lib/actions/chef-profile";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ChefProfileFormProps {
    initialData: ChefProfileData;
}

export function ChefProfileForm({ initialData }: ChefProfileFormProps) {
    const [isPending, setIsPending] = useState(false);

    const form: UseFormReturn<ChefProfileData> = useForm<ChefProfileData>({
        resolver: zodResolver(chefProfileSchema),
        defaultValues: initialData,
    });

    async function onSubmit(data: ChefProfileData) {
        setIsPending(true);
        try {
            const result = await updateChefProfile(data);
            if (result.success) {
                toast.success("Profile updated successfully");
            } else {
                toast.error(result.error || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    }

    const certifications = form.watch("certifications") || [];

    const addCertification = () => {
        form.setValue("certifications", [...certifications, ""]);
    };

    const removeCertification = (index: number) => {
        form.setValue(
            "certifications",
            certifications.filter((_, i) => i !== index)
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visual Profile section */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Visuals</CardTitle>
                                <CardDescription>
                                    Update your profile photo and cover image to make a great first impression.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control as any}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    aspectRatio="video"
                                                    value={field.value}
                                                    disabled={isPending}
                                                    onChange={field.onChange}
                                                    onRemove={() => field.onChange("")}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A widescreen image displayed at the top of your profile.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-center -mt-16 relative z-10">
                                    <FormField
                                        control={form.control as any}
                                        name="avatar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="bg-background p-2 rounded-full border shadow-sm">
                                                    <FormControl>
                                                        <ImageUpload
                                                            className="w-32 h-32 rounded-full"
                                                            value={field.value}
                                                            disabled={isPending}
                                                            onChange={field.onChange}
                                                            onRemove={() => field.onChange("")}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control as any}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Chef Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+976 99999999" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Professional details section */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Professional Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control as any}
                                    name="specialty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specialty</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Italian Cuisine, Pastry" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control as any}
                                        name="yearsExperience"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Years of Experience</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="hourlyRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hourly Rate ($)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control as any}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell potential clients about yourself..."
                                                    className="min-h-32"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Certifications</CardTitle>
                                    <CardDescription>Add your relevant culinary certifications.</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addCertification}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {certifications.map((_, index) => (
                                    <div key={index} className="flex gap-2">
                                        <FormField
                                            control={form.control as any}
                                            name={`certifications.${index}`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Certification name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => removeCertification(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {certifications.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No certifications added yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            "Save Profile"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
