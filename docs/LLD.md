3. LLD (Low-Level Design)
3.1 Core Data Model
sql
-- Customers
Customer(
  customer_id PK,
  name, phone, email,
  addresses JSONB,      -- list of saved addresses
  created_at
)

-- Professionals
Professional(
  professional_id PK,
  name, phone, rating,
  service_categories JSONB,
  service_areas JSONB    -- geo/pincode coverage
)

-- Bookings (booking history + new bookings, same table)
Booking(
  booking_id PK,
  customer_id FK,
  professional_id FK,
  service_id FK,
  address_id,
  slot_start TIMESTAMP,
  slot_end TIMESTAMP,
  status ENUM('CREATED','CONFIRMED','COMPLETED','CANCELLED'),
  source ENUM('FRESH','REBOOK'),
  parent_booking_id NULLABLE,  -- points to the original booking if source=REBOOK
  idempotency_key UNIQUE,
  created_at
)

-- Slot/Calendar (source of truth for professional availability)
ProfessionalSlot(
  slot_id PK,
  professional_id FK,
  slot_start TIMESTAMP,
  slot_end TIMESTAMP,
  status ENUM('OPEN','HELD','BOOKED'),
  held_until TIMESTAMP NULLABLE,   -- for short-TTL soft locks
  booking_id FK NULLABLE,
  UNIQUE(professional_id, slot_start)
)

Index: ProfessionalSlot(professional_id, slot_start, status) for fast calendar-grid reads. Index: Booking(customer_id, created_at DESC) for booking history pagination.

3.2 API Contracts

a) Initialize rebooking screen (parallel aggregation)

GET /v1/rebook/init?orderId={orderId}

Response 200:
{
  "customer": { "id": ..., "name": ..., "addresses": [...] },
  "bookingHistory": [ { "bookingId": ..., "service": ..., "professionalId": ..., "date": ... }, ... ],
  "originalProfessional": {
      "id": ..., "name": ..., "rating": ...,
      "availableSlots": [ { "start": ..., "end": ... }, ... ]  // may be empty
  },
  "alternateProfessionals": [ ... ]   // populated only if originalProfessional has no slots
}

Internally, the BFF fires 3 concurrent requests (Promise.all / async gather) to Customer Service, Booking History Service, Availability Service, with a per-call timeout (e.g., 800ms) and partial-result tolerance.

b) Hold a slot (optional soft-lock while user is on payment screen)

POST /v1/slots/hold
{ "professionalId": ..., "slotStart": ..., "idempotencyKey": ... }

Response 200: { "holdId": ..., "expiresAt": ... }
Response 409: { "error": "SLOT_UNAVAILABLE" }

c) Confirm booking

POST /v1/bookings
{
  "customerId": ..., "professionalId": ..., "serviceId": ...,
  "slotStart": ..., "addressId": ...,
  "sourceOrderId": ...,          -- original booking being repeated
  "idempotencyKey": ...
}

Response 201: { "bookingId": ..., "status": "CONFIRMED" }
Response 409: { "error": "SLOT_ALREADY_TAKEN" }

d) Professional calendar

GET /v1/professionals/{id}/calendar?from=...&to=...

Response 200:
{ "slots": [ { "start": ..., "end": ..., "status": "OPEN|HELD|BOOKED" }, ... ] }
3.3 Sequence Diagram — Rebooking Happy Path
Professional App
Notification Svc
Booking Svc
Availability Svc
Booking History Svc
Customer Svc
Rebooking BFF
Customer App
Professional App
Notification Svc
Booking Svc
Availability Svc
Booking History Svc
Customer Svc
Rebooking BFF
Customer App
par
[parallel fetch]
GET /rebook/init?orderId=123
get customer profile
get booking history
get professional slots
profile
history
slots
aggregated response
POST /slots/hold (slotStart, idempotencyKey)
mark slot HELD (short TTL)
ok
holdId + expiresAt
POST /bookings (confirm + payment)
mark slot BOOKED (atomic CAS on status)
ok
persist Booking row
201 CONFIRMED
booking confirmed event
push - new booking blocks calendar
confirmation notification
3.4 Concurrency Control on Slot Booking

To prevent double-booking when two customers race for the same slot:

ProfessionalSlot has a unique constraint on (professional_id, slot_start).
Booking confirm does a conditional update: UPDATE ProfessionalSlot SET status='BOOKED', booking_id=? WHERE slot_id=? AND status IN ('OPEN','HELD') AND (held_by = ? OR held_until < NOW()) — this is a compare-and-swap; if 0 rows affected, return 409 SLOT_ALREADY_TAKEN.
A background job periodically reaps expired HELD slots back to OPEN.
3.5 Idempotency Handling
idempotency_key is unique-indexed on Booking. If a POST /bookings arrives with a key that already exists, return the existing booking record instead of creating a new one (safe retry).
3.6 Edge Cases Handled
Case	Handling
Original professional fully booked	Return empty availableSlots, populate alternateProfessionals
Network drop after hold, before confirm	Hold auto-expires via TTL, slot reopens
Double-tap "Book Again"	Idempotency key dedupes at Booking Service
Professional goes offline/inactive between last order and rebook	Availability Service filters out inactive professionals before returning slots
Address from old order no longer valid (e.g., deleted)	Fallback to customer's default/current primary address, flagged in UI for confirmation