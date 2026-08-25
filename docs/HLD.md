2.1 Actors & Context
Customer App/Web
Professional App
Booking Service (core orchestrator)
Customer Service (profile + history)
Professional Service (profile, ratings)
Availability/Calendar Service (slot state, source of truth for blocking)
Notification Service (push/SMS/email)
Payment Service (existing, reused)
Search/Ranking Service (for alternate-professional suggestions)
2.2 Architecture Diagram
Client
1. GET /rebook/init?orderId
parallel call
parallel call
parallel call
fallback if unavailable
2. confirm slot + pay
lock + write slot
create booking record
push
push/sms
websocket/poll push
Customer App
Professional App
API Gateway
Rebooking BFF /Orchestrator
Customer Service
Booking History Service
Availability Service
Customer DB
Bookings DB
Slot/Calendar DB - cache +source of truth
Ranking Service
Booking Service
Payment Service
Notification Service
2.3 Key Design Decisions

a) Parallel data loading on rebooking screen The Rebooking BFF (Backend-for-Frontend) issues concurrent async calls to Customer Service, Booking History Service, and Availability Service, then aggregates. This avoids a waterfall (customer → then history → then availability) and directly satisfies "customer details load alongside booking history in parallel."

b) Availability Service as single source of truth All slot reads/writes for a professional go through one service backed by a DB with row-level locking (or optimistic concurrency) on (professional_id, slot_start). A Redis-backed short-TTL hold layer sits in front to reduce DB contention during the "browsing slots" phase, but the final confirm always does a strongly-consistent write against the DB.

c) Same-professional-first, graceful fallback Booking Service first tries to reserve a slot with the original professional; if none exists in the requested window, it calls Ranking Service for alternates, keeping the same service/address pre-filled.

d) Idempotency Client generates an idempotency key (e.g., UUID) per rebooking attempt; Booking Service dedupes on this key so retries/double-taps are safe.

e) Professional calendar real-time updates Availability Service publishes slot-state changes to a message broker (Kafka/SNS); Professional App subscribes via WebSocket/push notification or falls back to short-interval polling.

f) Caching Customer profile and recent booking history are cached (Redis, TTL ~minutes) since they're read-heavy and tolerate slight staleness; availability data is not cached for writes, only for initial slot-grid rendering with a "confirm re-validates" pattern.

2.4 Failure Handling
If Availability Service times out during parallel fetch, BFF still returns customer + history (partial render), and UI shows a "loading slots" skeleton with retry.
If slot confirm fails due to a race (someone else took it), return 409 and refresh the slot grid.
Payment failure after slot lock → release lock after TTL expiry (e.g., 5 min) via a background reaper job.