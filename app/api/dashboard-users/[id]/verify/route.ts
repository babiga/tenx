import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toggleVerifySchema } from "@/lib/validations/users";

// PATCH /api/dashboard-users/[id]/verify - Toggle isVerified status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getSession();
    if (
      !session ||
      session.userType !== "dashboard" ||
      session.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const result = toggleVerifySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.dashboardUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Dashboard user not found" },
        { status: 404 }
      );
    }

    // Update user
    const user = await prisma.dashboardUser.update({
      where: { id },
      data: { isVerified: result.data.isVerified },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: result.data.isVerified
        ? "User verified successfully"
        : "User unverified successfully",
      data: user,
    });
  } catch (error) {
    console.error("Toggle verify status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
