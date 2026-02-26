import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createMenuSchema, menusQuerySchema } from "@/lib/validations/menus";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "dashboard" || session.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryResult = menusQuerySchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      search: searchParams.get("search") || undefined,
      serviceTierId: searchParams.get("serviceTierId") || undefined,
      isActive: searchParams.get("isActive") || "all",
      includeServiceTiers: searchParams.get("includeServiceTiers") || "false",
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
        { status: 400 },
      );
    }

    const {
      page,
      limit,
      search,
      serviceTierId,
      isActive,
      includeServiceTiers,
      sortBy,
      sortOrder,
    } = queryResult.data;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (serviceTierId) {
      where.serviceTierId = serviceTierId;
    }

    if (isActive !== "all") {
      where.isActive = isActive === "true";
    }

    const [total, menus, serviceTiers] = await Promise.all([
      prisma.menu.count({ where }),
      prisma.menu.findMany({
        where,
        include: {
          serviceTier: {
            select: {
              id: true,
              name: true,
              isVIP: true,
            },
          },
          _count: {
            select: {
              items: true,
              bookings: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      includeServiceTiers
        ? prisma.serviceTier.findMany({
            select: {
              id: true,
              name: true,
              isVIP: true,
            },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      success: true,
      data: menus,
      serviceTiers: serviceTiers ?? undefined,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List menus error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "dashboard" || session.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createMenuSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const tier = await prisma.serviceTier.findUnique({
      where: { id: result.data.serviceTierId },
      select: { id: true },
    });

    if (!tier) {
      return NextResponse.json(
        { success: false, error: "Service tier not found" },
        { status: 400 },
      );
    }

    const menu = await prisma.menu.create({
      data: result.data,
      include: {
        serviceTier: {
          select: {
            id: true,
            name: true,
            isVIP: true,
          },
        },
        _count: {
          select: {
            items: true,
            bookings: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu created successfully",
      data: menu,
    });
  } catch (error) {
    console.error("Create menu error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
