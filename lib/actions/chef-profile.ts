"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  chefProfileSchema,
  type ChefProfileData,
} from "@/lib/validations/chef";
import { revalidatePath } from "next/cache";

export async function updateChefProfile(data: ChefProfileData) {
  const session = await getSession();

  if (!session || session.role !== "CHEF") {
    throw new Error("Unauthorized");
  }

  const validatedData = chefProfileSchema.parse(data);

  const { name, phone, avatar, ...profileData } = validatedData;

  try {
    await prisma.$transaction([
      prisma.dashboardUser.update({
        where: { id: session.userId },
        data: {
          name,
          phone,
          avatar,
        },
      }),
      prisma.chefProfile.update({
        where: { dashboardUserId: session.userId },
        data: {
          ...profileData,
          updatedAt: new Date(),
        },
      }),
    ]);

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update chef profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
