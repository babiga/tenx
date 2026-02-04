import { getCurrentUserWithProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChefProfileForm } from "@/components/chef/ChefProfileForm";
import type { ChefProfileData } from "@/lib/validations/chef";

export default async function ChefProfilePage() {
    const user = await getCurrentUserWithProfile();

    if (!user || user.role !== "CHEF") {
        redirect("/dashboard");
    }

    const chefProfile = user.chefProfile;

    if (!chefProfile) {
        // This shouldn't happen based on schema but handle it just in case
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-destructive">Chef profile not found.</p>
            </div>
        );
    }

    const initialData: ChefProfileData = {
        name: user.name,
        phone: user.phone || "",
        avatar: user.avatar || "",
        coverImage: chefProfile.coverImage || "",
        specialty: chefProfile.specialty,
        bio: chefProfile.bio || "",
        yearsExperience: chefProfile.yearsExperience,
        hourlyRate: Number(chefProfile.hourlyRate),
        certifications: chefProfile.certifications || [],
    };

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 lg:gap-8 lg:py-8">
            <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold lg:text-3xl">Chef Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your public profile information and culinary credentials.
                </p>
            </div>

            <div className="px-4 lg:px-6 max-w-6xl mx-auto w-full">
                <ChefProfileForm initialData={initialData} />
            </div>
        </div>
    );
}
