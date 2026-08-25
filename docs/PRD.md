📋 Product Requirements Document QuickRebook — One-Click Re-booking Engine A one-tap re-booking experience for customers and a real-time availability system for professionals.

📑 Document Control

Field	Details
Product	QuickRebook (One-Click Re-booking Engine)
Context	Urban Company — Re-booking Feature
Document Type	Product Requirements Document
Version	v0.1
Status	🟠 Draft — Team Review
Target Release	MVP
Primary Sprint	Sprint 1
Authors	—
Date	25 August 2026

Purpose of this document: Define what QuickRebook must solve and what the MVP must deliver. Technical implementation belongs in HLD.md / LLD.md; interface specs belong in UIUX.md.

🧭 Table of Contents

Executive Summary
Problem Statement
User Needs
Target Users & Personas
Product Vision
Product Goals & Objectives
Success Criteria & Metrics
Product Scope
Core Features & Priorities
Primary User Flows & Use Cases
User Stories
Functional Requirements
Booking Status Model
Non-Functional Requirements
Business Rules
Sprint 1 Feature Scope
Edge Cases & Failure Scenarios
Assumptions & Constraints
Out of Scope
Acceptance Criteria
Open Questions
Team Review & Approval
Definition of Done
Future Enhancements
1. Executive Summary

QuickRebook lets a customer re-book a previously used service with the same professional in one tap, and gives professionals a live calendar showing which slots are already blocked.

Core Experience

Customer taps "Book Again"
        │
        ▼
Customer details + booking history load in parallel
        │
        ▼
   🟡 SLOT SELECTION (original professional's calendar)
        │
        │ Slot confirmed + paid
        ▼
 ┌───────────────┐
 │               │
 ▼               ▼
🔵 CONFIRMED   🔴 SLOT UNAVAILABLE
 │               │
 │               ▼
 │        Alternate professionals suggested
 │
 ▼
Professional's calendar updates in real time

Product Value

User	Value
👤 Customer	Rebooks a trusted professional in one tap, without re-entering details
🧰 Professional	Sees an always-accurate calendar, never gets double-booked

MVP Focus The MVP focuses on four core capabilities:

One-tap rebooking from past order history
Parallel loading of customer details + booking history
Same-professional-first slot selection with live availability
Professional-facing calendar showing blocked/booked slots
2. Problem Statement
2.1 Customer Problem

After a good experience with a professional, customers who want that same person again have to manually re-enter their address, service type, and preferences, and have no easy way to check that professional's availability.

2.2 Professional Problem

Professionals need an accurate, real-time view of their booked slots so new bookings — including rebookings — don't collide with existing commitments.

2.3 Product Problem to Solve

The product must provide a fast, reliable rebooking path that:

pre-fills the previous order's service and address details;
loads customer profile and booking history without a slow, sequential wait;
tries to reserve the same professional first;
shows the professional's calendar with blocked slots so no double-booking occurs; and
falls back gracefully to alternate professionals when the original is unavailable.

💡 Problem Statement: How might we let a customer rebook a trusted professional in one tap while guaranteeing the professional's calendar stays accurate and conflict-free?

3. User Needs
3.1 Customer Needs

Customers need to:

Rebook a past service without re-entering details.
See the same professional's next available slots immediately.
Know quickly if that professional isn't available, and see alternatives.
Trust that a confirmed slot is actually locked in (no surprise conflicts).
3.2 Professional Needs

Professionals need to:

See a calendar of their upcoming bookings.
Have blocked/booked slots reflected accurately and immediately.
Not be double-booked by two customers for the same slot.
Receive notice when a new booking (including a rebooking) lands on their calendar.
4. Target Users & Personas

👤 Persona A — Repeat Customer

Attribute	Description
Role	Existing Urban Company customer with at least one past booking
Primary Goal	Quickly rebook a professional they've used and liked before
Pain Points	Re-entering address/service details; not knowing if the same pro is free
Needs	One-tap rebook, fast slot visibility, graceful fallback

Scenario: "The same electrician fixed my wiring last month and did a great job. I want to book him again without typing out my address and issue from scratch."

🧰 Persona B — Service Professional

Attribute	Description
Role	Independent professional (plumber, electrician, technician, etc.)
Primary Goal	Keep a full, accurate calendar and avoid conflicting bookings
Pain Points	Double-bookings, stale calendar views, last-minute conflicts
Needs	Real-time blocked-slot view, reliable notifications

Scenario: "I want my calendar to always show what's actually booked, including when a past customer rebooks me directly, so I never show up to two jobs at once."

5. Product Vision

Make rebooking a trusted professional effortless for customers, while guaranteeing professionals a calendar that is always accurate and free of conflicts.

Product Principles

Principle	Meaning
Speed	Rebooking should feel instant — no redundant data entry, no slow waterfall loads
Trust	A confirmed slot must be a genuinely locked slot
Continuity	Customers should be able to keep working with a professional they liked
Accuracy	A professional's calendar must always reflect reality
Graceful degradation	If the exact rebooking isn't possible, offer the next-best option
6. Product Goals & Objectives
6.1 Primary Goals
Goal	Objective
🎯 Frictionless Rebooking	Let customers rebook in one tap with pre-filled details
⚡ Fast Parallel Load	Load customer details and booking history concurrently, not sequentially
🔒 Slot Integrity	Guarantee no two customers can confirm the same professional slot
📅 Calendar Accuracy	Give professionals a real-time, correct view of blocked slots
🔁 Graceful Fallback	Suggest alternate professionals when the original is unavailable
6.2 Product Objectives

The MVP must:

Show a "Book Again" action on past orders.
On tap, fetch customer details and booking history in parallel.
Pre-fill service, address, and instructions from the original order.
Show the original professional's live calendar of open/blocked slots.
Lock a slot on selection and confirm it atomically on payment.
Update the professional's calendar in near real time on confirmation.
Offer alternate professionals if the original has no matching slot.
7. Success Criteria & Metrics
7.1 Customer Success Criteria
Rebooking screen shows customer details and booking history without a visible sequential delay.
"Book Again" produces a pre-filled booking request matching the original order's service/address.
Confirmed slot is never later invalidated by a conflicting booking.
7.2 Professional Success Criteria
Calendar reflects new bookings (including rebookings) without manual refresh.
No professional receives two confirmed bookings for the same slot.
7.3 Product Quality Metrics
Metric	Purpose
Rebooking conversion rate	% of "Book Again" taps that end in a confirmed booking
Time-to-confirm (rebooking flow)	Speed of the one-tap flow vs. the standard flow
Double-booking incident rate	Should be zero
Same-professional fulfillment rate	% of rebookings that land with the original professional vs. an alternate
Calendar sync latency	Time between booking confirmation and calendar update on the professional's device

Note: Numeric targets should be agreed by the team before final MVP sign-off.

8. Product Scope
✅ 8.1 MVP Scope

The MVP covers:

"Book Again" entry point on past orders
Parallel fetch of customer details + booking history
Same-professional slot lookup
Slot hold → confirm flow with atomic locking
Alternate-professional fallback when no slot is available
Professional-facing calendar with blocked/booked slots
Real-time (or near-real-time) calendar updates
Success/error feedback on booking confirmation

Scope Rule: New functionality should not be added to Sprint 1 without explicit team agreement and re-prioritization.

9. Core Features & Priorities

Priority Definitions

Priority	Meaning
P0 — Must Have	Required for MVP / Sprint 1 core workflow
P1 — Should Have	Important, can follow the core workflow if time is constrained
P2 — Could Have	Useful enhancement, not required for MVP
P3 — Out of Scope	Explicitly excluded from the current release
ID	Feature	Priority	User	Description
F-01	Book Again entry point	P0	Customer	CTA on past order that starts the rebooking flow
F-02	Parallel data load	P0	Customer	Customer details + booking history fetched concurrently
F-03	Pre-filled booking details	P0	Customer	Service, address, instructions carried over from original order
F-04	Same-professional slot lookup	P0	Customer	Show original professional's live availability
F-05	Slot hold & confirm	P0	Customer	Short-TTL soft lock, atomic confirm on payment
F-06	Alternate professional fallback	P0	Customer	Suggest alternates when original has no slot
F-07	Professional calendar view	P0	Professional	Calendar showing open/blocked/booked slots
F-08	Real-time calendar sync	P0	Professional	Calendar updates on new booking without manual refresh
F-09	Success/error feedback	P0	Both	Clear confirmation or failure messaging
F-10	Booking history filters (by professional, date)	P1	Customer	Easier browsing of past orders to rebook from
F-11	Favorite professional shortcut	P2	Customer	Rebook top professional directly from home screen
F-12	Calendar block reasons (leave, personal)	P2	Professional	Let professionals self-block slots
F-13	Dynamic/surge pricing on rebooking	P3	Both	Reused from existing pricing engine, not modified here
F-14	Dispute/refund handling on rebooked orders	P3	Both	Handled by existing support flows
F-15	AI professional recommendation ranking	P3	Customer	Smarter alternate-professional suggestions
10. Primary User Flows & Use Cases
10.1 Customer Flow
flowchart TD
    A[Open Past Orders] --> B[Tap Book Again]
    B --> C[Parallel Load: Customer Details + Booking History]
    C --> D{Original Professional Available?}
    D -->|Yes| E[Select Slot]
    D -->|No| F[Alternate Professionals Suggested]
    F --> E
    E --> G[Hold Slot]
    G --> H[Confirm + Pay]
    H --> I[Booking Confirmed]
    I --> J[Professional Calendar Updated]
10.2 Professional Flow
flowchart TD
    A[Open Calendar] --> B[View Open/Blocked Slots]
    B --> C{New Booking Event}
    C -->|Rebooking or Fresh Booking| D[Slot Marked Booked]
    D --> E[Calendar Refreshed in Real Time]
UC-01 — Customer Rebooks Same Professional
Field	Details
Actor	Customer
Precondition	Customer has at least one past completed order
Trigger	Customer taps "Book Again"
Outcome	Booking created with the original professional

Main Flow

Customer opens order history.
Customer taps "Book Again" on a past order.
System fetches customer details and booking history in parallel.
System fetches the original professional's live calendar.
Customer selects an open slot.
System holds the slot.
Customer confirms and pays.
System atomically books the slot and creates the booking record.
Professional's calendar updates.
UC-02 — Original Professional Unavailable
Field	Details
Actor	Customer
Precondition	Original professional has no open slot matching the request
Trigger	System returns an empty slot list for the original professional
Outcome	Customer is offered alternates and can still complete a booking

Main Flow

System detects no available slots for the original professional.
System fetches ranked alternate professionals.
Customer selects an alternate.
Flow continues as in UC-01 from slot selection.
UC-03 — Professional Views Calendar
Field	Details
Actor	Professional
Precondition	Professional is authenticated
Trigger	Professional opens the calendar screen
Outcome	Professional sees accurate open/blocked slots

Main Flow

Professional opens the calendar.
System displays slots for the selected date range with status (open/held/booked).
New bookings appear without manual refresh.
UC-04 — Slot Conflict During Confirm
Field	Details
Actor	Customer
Precondition	Two customers attempt to hold/confirm the same slot
Trigger	Second customer's confirm request arrives after the first succeeds
Outcome	Second customer is told the slot is taken and shown a refreshed slot list
11. User Stories

👤 Customer Stories

US-C01 — Book Again As a customer, I want a "Book Again" button on my past orders so that I don't have to manually re-enter my service and address details.

US-C02 — Fast Screen Load As a customer, I want my profile and booking history to load together quickly so that the rebooking screen doesn't feel slow.

US-C03 — See Same Professional's Slots As a customer, I want to see the same professional's available slots immediately so that I can pick a time without back-and-forth.

US-C04 — Get Alternates When Needed As a customer, I want to be shown alternate professionals if my preferred one isn't free so that I'm not blocked from booking.

US-C05 — Trust My Confirmed Slot As a customer, I want my confirmed slot to be guaranteed so that I don't get a surprise cancellation due to a conflict.

🧰 Professional Stories

US-P01 — See Blocked Slots As a professional, I want my calendar to show blocked/booked slots clearly so that I can plan my day.

US-P02 — Real-Time Calendar Updates As a professional, I want new bookings to appear on my calendar without me refreshing so that I always see my current schedule.

US-P03 — Never Get Double-Booked As a professional, I want the system to guarantee I can't be booked twice for the same slot so that I don't face scheduling conflicts.

12. Functional Requirements
12.1 Rebooking Initiation
ID	Requirement
FR-01	System must display a "Book Again" action on each past order.
FR-02	Tapping "Book Again" must trigger parallel fetches of customer details and booking history.
FR-03	System must pre-fill service type, add-ons, address, and instructions from the original order.
12.2 Slot Selection
ID	Requirement
FR-04	System must fetch the original professional's live availability.
FR-05	If no slot is available, system must fetch and display ranked alternate professionals.
FR-06	Selecting a slot must place a short-TTL hold on it.
12.3 Booking Confirmation
ID	Requirement
FR-07	Confirming a held slot must atomically transition it to booked, or fail with a clear conflict error.
FR-08	A duplicate confirm request (same idempotency key) must not create a duplicate booking.
FR-09	System must provide clear success/error feedback to the customer.
12.4 Professional Calendar
ID	Requirement
FR-10	Professional must be able to view a calendar of open/held/booked slots.
FR-11	New bookings must be reflected on the professional's calendar without a manual refresh.
13. Booking Status Model
13.1 MVP Statuses
Status	Meaning	Set By	Initial State
🟡 Held	Slot temporarily reserved during checkout	System	No
🔵 Confirmed	Slot booked and paid for	System	No
🟢 Completed	Service has been delivered	Professional/System	No
🔴 Cancelled	Booking or hold was cancelled/expired	Customer/System	No
13.2 Status Lifecycle
                 ┌──────────────┐
                 │  🟡 HELD     │
                 └──────┬───────┘
                        │ payment success        │ TTL expiry / cancel
                        ▼                         ▼
                 ┌──────────────┐          ┌──────────────┐
                 │ 🔵 CONFIRMED │          │ 🔴 CANCELLED │
                 └──────┬───────┘          └──────────────┘
                        │ service delivered
                        ▼
                 ┌──────────────┐
                 │ 🟢 COMPLETED │
                 └──────────────┘

MVP Decision: Held, Confirmed, Completed, and Cancelled are the only statuses in scope. Additional statuses require approval.

14. Non-Functional Requirements
ID	Category	Requirement
NFR-01	Performance	Rebooking screen should render meaningfully within ~1.5s
NFR-02	Concurrency	Slot confirmation must be strongly consistent — no double-booking
NFR-03	Reliability	Booking creation and slot state changes must be durable
NFR-04	Security	Only authenticated customers can book; only authorized professionals see their own calendar
NFR-05	Consistency	Professional calendar view must reflect the latest successfully saved slot state
NFR-06	Scalability	System should handle peak-hour booking spikes without degrading slot-lock correctness
NFR-07	Idempotency	Retried or duplicate confirm requests must not create duplicate bookings
15. Business Rules
ID	Rule
BR-01	Every new booking must start as Held before becoming Confirmed.
BR-02	A slot can only be Confirmed for one booking at a time.
BR-03	Only the assigned professional's calendar reflects their own bookings.
BR-04	An expired Held slot automatically reopens for other customers.
BR-05	Rebooking must reuse the original order's service and address unless the customer edits them.
BR-06	Alternate professionals are only suggested if the original professional has no matching slot.
16. Sprint 1 Feature Scope

🎯 Sprint 1 Objective: Deliver the minimum end-to-end workflow: Customer taps Book Again → parallel load → slot selection with original professional → hold → confirm → professional calendar updates in real time — including alternate-professional fallback.

16.1 Sprint 1 Backlog
Priority	Feature	Sprint 1
P0	Book Again entry point	✅
P0	Parallel data load	✅
P0	Pre-filled booking details	✅
P0	Same-professional slot lookup	✅
P0	Slot hold & confirm	✅
P0	Alternate professional fallback	✅
P0	Professional calendar view	✅
P0	Real-time calendar sync	✅
P0	Success/error feedback	✅
P1	Booking history filters	❌
P2	Favorite professional shortcut	❌
P2	Calendar self-block by professional	❌
P3	Dynamic pricing changes	❌
P3	Dispute/refund handling	❌
P3	AI ranking for alternates	❌
17. Edge Cases & Failure Scenarios
ID	Scenario	Expected Behaviour
EC-01	Original professional has zero open slots	Show alternates; do not dead-end the flow
EC-02	Two customers hold the same slot simultaneously	Second hold request fails with a conflict error
EC-03	Customer double-taps "Book Again"	Idempotency key prevents duplicate booking
EC-04	Network drop between hold and confirm	Hold expires via TTL and slot reopens automatically
EC-05	Payment fails after slot hold	Slot is released back to Open after hold TTL
EC-06	Original order's address was deleted	Fall back to customer's default address, flagged for confirmation
EC-07	Availability service is slow/times out on parallel load	Customer details and history still render; slot section shows a retry state
EC-08	Professional goes inactive between original order and rebooking	Original professional filtered out; alternates shown
18. Assumptions & Constraints
18.1 Assumptions
Customers are authenticated before booking.
Professionals are authenticated before viewing their calendar.
The platform already supports service catalog, professional profiles, and payments.
Booking and slot data can be persistently stored.
18.2 Constraints
Sprint 1 must remain focused on the rebooking + calendar problem.
Technical architecture is not prescribed by this PRD (see HLD/LLD).
Payment processing is treated as an existing, reused capability.
New features require explicit team agreement and re-prioritization.
19. Out of Scope
❌ Dynamic/surge pricing changes
❌ Dispute and refund handling
❌ Professional onboarding/verification
❌ AI-based professional ranking
❌ Customer-professional messaging
❌ Multi-service bundled rebooking
❌ Professional self-blocking of slots (unless separately approved)
❌ Favorite-professional shortcuts (unless separately approved)
20. Acceptance Criteria
20.1 Product Definition
 Problem statement is clearly defined
 Customer and professional needs are documented
 Target users/personas are identified
 Product goals and objectives are documented
 Success criteria and measurement areas are documented
20.2 Feature Definition
 Core features are documented and prioritized (P0–P3)
 Sprint 1 feature scope is explicitly defined
 Major user stories are documented
 Major user flows/use cases are documented
20.3 Customer Workflow
 Customer can tap "Book Again" and see pre-filled details
 Customer details and booking history load in parallel
 Customer sees original professional's available slots
 Customer is shown alternates when original is unavailable
 Customer's confirmed slot cannot be double-booked
20.4 Professional Workflow
 Professional can view a calendar of open/blocked slots
 Calendar updates in real time on new bookings
 No professional receives two confirmed bookings for one slot
20.5 Requirements Quality
 Functional requirements are clear to the development team
 Non-functional requirements are documented
 Business rules are documented
 Edge cases are identified
 Assumptions and constraints are documented
 Out-of-scope items are documented
21. Open Questions
ID	Question	Status
OQ-01	How long should a slot hold TTL last?	TBD
OQ-02	How many alternate professionals should be suggested?	TBD
OQ-03	Should rebooking allow editing the address, or only reuse it?	TBD
OQ-04	What real-time delay is acceptable for calendar sync?	TBD
OQ-05	What numerical performance/reliability targets define MVP sign-off?	TBD
22. Team Review & Approval

This PRD must be reviewed by the team before technical design and implementation begin.

Review Checklist

 Problem statement agreed
 Target users agreed
 Product goals agreed
 Feature priorities agreed
 Sprint 1 scope agreed
 User flows agreed
 Acceptance criteria agreed
 Out-of-scope items agreed
 Open questions resolved or accepted as TBD
 Final PRD committed to repository
23. Definition of Done

The PRD is Done when:

 Problem statement is clearly defined
 User needs are documented
 Target users/personas are identified
 Product vision and goals are documented
 Success criteria are documented
 Core features are documented and prioritized
 Sprint 1 scope is clearly defined and agreed
 Major user stories/use cases are documented
 Primary user flows are covered
 Functional requirements are clear to developers
 Non-functional requirements are documented
 Business rules and edge cases are documented
 Assumptions and constraints are documented
 Out-of-scope items are documented
 Acceptance criteria are defined
 Open product decisions are identified
 Final PRD is committed to the repository
24. Future Enhancements

Potential future versions may include:

Favorite-professional quick rebooking from the home screen
Professional self-blocking of personal/leave time
Smarter alternate-professional ranking (AI-based)
Notifications reminding customers to rebook after a service
Booking history filters by professional/date/service
Multi-service bundled rebooking

Future enhancements must not expand Sprint 1 scope unless the team explicitly re-prioritizes the backlog.

🔗 Related Project Documents

Document	Responsibility
PRD.md	What the product must solve and deliver
HLD.md	High-level system architecture
LLD.md	Detailed technical design
UIUX.md	How the product will look and behave