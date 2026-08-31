import { db } from "../prisma/db";

async function main() {
  const customer = await db.orm.public.User.create({
    email: "arya@gmail.com",
    username: "arya",
    name: "Arya",
    phone: "9876543210",
    address: "Udaipur",
  });

  const rahul = await db.orm.public.Professional.create({
    name: "Rahul Sharma",
    phone: "9876543211",
  });

  const priya = await db.orm.public.Professional.create({
    name: "Priya Sharma",
    phone: "9876543212",
  });

  await db.orm.public.Booking.create({
    service: "AC Repair",
    bookingDate: "2026-08-20T10:00:00Z",
    status: "Completed",
    customerId: customer.id,
    professionalId: rahul.id,
  });

  await db.orm.public.Booking.create({
    service: "Home Cleaning",
    bookingDate: "2026-08-15T10:00:00Z",
    status: "Completed",
    customerId: customer.id,
    professionalId: priya.id,
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });