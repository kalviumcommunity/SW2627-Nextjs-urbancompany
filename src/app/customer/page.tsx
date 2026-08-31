"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  service: string;
  professional: string;
  bookingDate: string;
  status: string;
};

type Customer = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string;
  address: string | null;
};

type CustomerResponse = {
  customer: Customer;
  bookings: Booking[];
};

export default function CustomerPage() {
  const [data, setData] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await fetch("/api/customer");

        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }

        const result: CustomerResponse = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">
          Loading your dashboard...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No customer data found.</p>
      </main>
    );
  }

  const { customer, bookings } = data;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Urban Company
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Customer Dashboard
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
              {customer.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {customer.name} 👋
          </h2>

          <p className="text-gray-600 mt-2">
            Here&apos;s an overview of your account and recent bookings.
          </p>
        </section>

        {/* Customer details */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your registered customer information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-medium text-gray-900">
                {customer.name ?? "Not available"}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium text-gray-900">
                {customer.phone ?? "Not available"}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">
                {customer.email}
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium text-gray-900">
                {customer.address ?? "Not available"}
              </p>
            </div>
          </div>
        </section>

        {/* Booking history */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Booking History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your previous Urban Company services
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500">
                You don&apos;t have any bookings yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.service}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Booking #{booking.id}
                      </p>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Professional
                      </p>

                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {booking.professional}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Date
                      </p>

                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {new Date(
                          booking.bookingDate
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}