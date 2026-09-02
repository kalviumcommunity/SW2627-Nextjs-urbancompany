import { NextResponse } from "next/server";
import { db } from "../../../../../../prisma/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const professionalId = Number(id);

    if (!Number.isInteger(professionalId)) {
      return NextResponse.json(
        { error: "Invalid professional ID" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    // Validate date format: YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Date must be in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    // Find professional
    const professional = await db.orm.public.Professional.first({
      id: professionalId,
    });

    if (!professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    // Get bookings for this professional
    const bookings = await db.orm.public.Booking
      .where({
        professionalId,
      })
      .all();

    // Only return bookings for the requested date
    const bookingsForDate = bookings.filter((booking) => {
      const bookingDate = String(booking.bookingDate);

      return bookingDate.startsWith(date);
    });

    return NextResponse.json({
      professional: {
        id: professional.id,
        name: professional.name,
      },
      date,
      bookedSlots: bookingsForDate.map((booking) => ({
        bookingId: booking.id,
        service: booking.service,
        bookingDate: booking.bookingDate,
        status: booking.status,
      })),
    });
  } catch (error) {
    console.error("Calendar API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch professional calendar" },
      { status: 500 }
    );
  }
}