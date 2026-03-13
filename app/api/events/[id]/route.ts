import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateEventSchema } from "@/lib/validations/events";

// GET /api/events/:id - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "dashboard") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        chefProfile: {
          include: {
            dashboardUser: {
              select: { name: true },
            },
          },
        },
        companyProfile: {
          include: {
            dashboardUser: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/events/:id - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const body = await request.json();

    const result = updateEventSchema.safeParse(body);
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

    // Check event exists
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    const { eventDate, ...data } = result.data;

    const updateData: Record<string, unknown> = { ...data };
    if (eventDate !== undefined) {
      updateData.eventDate = eventDate ? new Date(eventDate) : null;
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        chefProfile: {
          include: {
            dashboardUser: {
              select: { name: true },
            },
          },
        },
        companyProfile: {
          include: {
            dashboardUser: {
              select: { name: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/events/:id - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    // Check event exists
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
