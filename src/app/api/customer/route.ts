import { NextResponse } from "next/server";
import { db } from "../../../../prisma/db";

export async function GET() {
  try {
    const customer = await db.orm.public.User.first({
      email: "arya@gmail.com",
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const bookings = await db.orm.public.Booking
      .include("professional")
      .where({
        customerId: customer.id,
      })
      .all();

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      },

      bookings: bookings.map((booking) => ({
        id: booking.id,
        service: booking.service,
        professional: booking.professional.name,
        bookingDate: booking.bookingDate,
        status: booking.status,
      })),
    });
  } catch (error) {
    console.error("Customer API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 }
    );
  }
}