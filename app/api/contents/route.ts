import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  siteContentSchema,
  contentsQuerySchema,
} from "@/lib/validations/contents";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryResult = contentsQuerySchema.safeParse({
      type: searchParams.get("type") || undefined,
      isActive: searchParams.get("isActive") || "all",
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 100,
      sortBy: searchParams.get("sortBy") || "sortOrder",
      sortOrder: searchParams.get("sortOrder") || "asc",
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

    const { type, isActive, page, limit, sortBy, sortOrder } = queryResult.data;

    const where: any = {};
    if (type) where.type = type;
    if (isActive !== "all") where.isActive = isActive === "true";

    const total = await prisma.siteContent.count({ where });
    const contents = await prisma.siteContent.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: contents,
      pagination: {
        totalPages: Math.ceil(total / limit),
        total,
        limit,
        page,
      },
    });
  } catch (error) {
    console.error("List contents error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      session.userType !== "dashboard" ||
      session.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = siteContentSchema.safeParse(body);

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

    const content = await prisma.siteContent.create({
      data: result.data,
    });

    return NextResponse.json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (error) {
    console.error("Create content error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
