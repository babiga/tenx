import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createBookingApiSchema } from "@/lib/validations/bookings";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userType !== "customer") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId: session.userId },
      include: {
        serviceTier: {
          select: {
            id: true,
            name: true,
            pricePerGuest: true,
          },
        },
        menu: {
          select: {
            id: true,
            name: true,
          },
        },
        chefProfile: {
          select: {
            id: true,
            dashboardUser: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: bookings.map((booking) => ({
        ...booking,
        totalPrice: Number(booking.totalPrice),
        depositAmount: booking.depositAmount ? Number(booking.depositAmount) : null,
        serviceTier: {
          ...booking.serviceTier,
          pricePerGuest: Number(booking.serviceTier.pricePerGuest),
        },
      })),
    });
  } catch (error) {
    console.error("List bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "customer") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = createBookingApiSchema.safeParse(body);

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

    const data = result.data;
    const eventDate = new Date(`${data.eventDate}T00:00:00`);
    if (Number.isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid event date" },
        { status: 400 },
      );
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (eventDate < today) {
      return NextResponse.json(
        { success: false, error: "Event date cannot be in the past" },
        { status: 400 },
      );
    }

    const explicitServiceTierId = data.serviceTierId?.trim() || null;

    const resolvedServiceTier = explicitServiceTierId
      ? await prisma.serviceTier.findUnique({
        where: { id: explicitServiceTierId },
        select: {
          id: true,
          pricePerGuest: true,
          isVIP: true,
          sortOrder: true,
        },
      })
      : await prisma.serviceTier.findFirst({
        where: data.serviceType === "VIP" ? { isVIP: true } : { isVIP: false },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          pricePerGuest: true,
          isVIP: true,
          sortOrder: true,
        },
      });

    const serviceTier = resolvedServiceTier
      ?? await prisma.serviceTier.findFirst({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          pricePerGuest: true,
          isVIP: true,
          sortOrder: true,
        },
      });

    if (!serviceTier) {
      return NextResponse.json(
        { success: false, error: "No service tier is configured" },
        { status: 400 },
      );
    }

    const requestedMenuIds = Array.from(
      new Set(
        [...(data.menuIds ?? []), ...(data.menuId ? [data.menuId] : [])]
          .map((menuId) => menuId.trim())
          .filter((menuId) => menuId.length > 0),
      ),
    );

    const selectedMenus = requestedMenuIds.length > 0
      ? await prisma.menu.findMany({
        where: {
          id: { in: requestedMenuIds },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          serviceTierId: true,
        },
      })
      : [];

    if (requestedMenuIds.length > 0 && selectedMenus.length !== requestedMenuIds.length) {
      return NextResponse.json(
        { success: false, error: "One or more selected menus are not available" },
        { status: 400 },
      );
    }

    const invalidTierMenu = selectedMenus.find(
      (menu) => menu.serviceTierId && menu.serviceTierId !== serviceTier.id,
    );
    if (invalidTierMenu) {
      return NextResponse.json(
        { success: false, error: "One or more menus do not match selected service type package" },
        { status: 400 },
      );
    }

    if (data.chefProfileId) {
      const chef = await prisma.chefProfile.findUnique({
        where: { id: data.chefProfileId },
        include: {
          dashboardUser: {
            select: {
              role: true,
              isActive: true,
              isVerified: true,
            },
          },
        },
      });

      if (
        !chef ||
        chef.dashboardUser.role !== "CHEF" ||
        !chef.dashboardUser.isActive ||
        !chef.dashboardUser.isVerified
      ) {
        return NextResponse.json(
          { success: false, error: "Selected chef is not available" },
          { status: 400 },
        );
      }
    }

    const totalPrice = Number(serviceTier.pricePerGuest) * data.guestCount;
    const depositAmount = Number((totalPrice * 0.3).toFixed(2));

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: data.contactName.trim(),
        phone: data.contactPhone.trim(),
      },
    });

    const requestDetails: string[] = [];
    if (data.specialRequests?.trim()) {
      requestDetails.push(data.specialRequests.trim());
    }
    if (selectedMenus.length > 1) {
      const namesById = new Map(selectedMenus.map((menu) => [menu.id, menu.name]));
      const orderedNames = requestedMenuIds
        .map((menuId) => namesById.get(menuId))
        .filter((menuName): menuName is string => Boolean(menuName));
      requestDetails.push(`Selected menus: ${orderedNames.join(", ")}`);
    }
    const normalizedContactEmail = data.contactEmail.trim();
    if (normalizedContactEmail !== user.email) {
      requestDetails.push(`Contact email for this booking: ${normalizedContactEmail}`);
    }

    const primaryMenuId = requestedMenuIds[0] ?? null;

    const booking = await prisma.booking.create({
      data: {
        customerId: session.userId,
        serviceTierId: serviceTier.id,
        menuId: primaryMenuId,
        chefProfileId: data.chefProfileId || null,
        serviceType: data.serviceType,
        eventDate,
        eventTime: data.eventTime,
        guestCount: data.guestCount,
        venue: data.venue.trim(),
        venueAddress: data.venueAddress?.trim() || null,
        specialRequests: requestDetails.length > 0 ? requestDetails.join("\n") : null,
        totalPrice,
        depositAmount,
      },
      include: {
        serviceTier: {
          select: {
            id: true,
            name: true,
            pricePerGuest: true,
          },
        },
        menu: {
          select: {
            id: true,
            name: true,
          },
        },
        chefProfile: {
          select: {
            id: true,
            dashboardUser: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...booking,
        totalPrice: Number(booking.totalPrice),
        depositAmount: booking.depositAmount ? Number(booking.depositAmount) : null,
        serviceTier: {
          ...booking.serviceTier,
          pricePerGuest: Number(booking.serviceTier.pricePerGuest),
        },
      },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
