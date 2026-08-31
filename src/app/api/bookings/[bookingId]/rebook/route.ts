import { NextResponse } from "next/server";
import { db } from "../../../../../../prisma/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId: bookingIdParam } = await context.params;
    const bookingId = Number(bookingIdParam);

    if (!Number.isInteger(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { date, time } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "Date and time are required" },
        { status: 400 }
      );
    }

    // Find the old booking
    const oldBooking = await db.orm.public.Booking.first({
      id: bookingId,
    });

    if (!oldBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Only completed bookings can be re-booked
    if (oldBooking.status !== "Completed") {
      return NextResponse.json(
        { error: "Only completed bookings can be re-booked" },
        { status: 400 }
      );
    }

    // New booking date/time
    const newBookingDate = `${date}T${time}:00`;

    // Check professional availability
    const existingBookings = await db.orm.public.Booking
      .where({
        professionalId: oldBooking.professionalId,
        bookingDate: newBookingDate,
      })
      .all();

    if (existingBookings.length > 0) {
      return NextResponse.json(
        {
          error: "Professional is not available at this time",
        },
        { status: 409 }
      );
    }

    // Create a completely NEW booking
    const newBooking = await db.orm.public.Booking.create({
      service: oldBooking.service,
      bookingDate: newBookingDate,
      status: "Confirmed",
      customerId: oldBooking.customerId,
      professionalId: oldBooking.professionalId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking re-booked successfully",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Re-book API error:", error);

    return NextResponse.json(
      { error: "Failed to re-book appointment" },
      { status: 500 }
    );
  }
}