import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { usersQuerySchema } from "@/lib/validations/users";

// GET /api/users - List all customers with pagination, search, and filters
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryResult = usersQuerySchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      search: searchParams.get("search") || undefined,
      userType: searchParams.get("userType") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });

    if (!queryResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: queryResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { page, limit, search, userType, sortBy, sortOrder } =
      queryResult.data;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (userType) {
      where.userType = userType;
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        userType: true,
        organizationName: true,
        companyLegalNo: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List users error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
