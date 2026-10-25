# Product Requirements --- Smart Campus Transport Management System

**Version:** 0.1-draft\
**Status:** Awaiting team approval\
**Project context:** Campus bus tracking and transport operations (SIH
25013 context)

## 1. Product goal

Provide a reliable, usable transport system where authorized passengers
can view the bus assigned to them, follow live bus location and ETA, see
occupancy/capacity across eligible buses on the same route, and receive
operational notifications. Transport staff update real operational
information. Admin manages buses, routes, schedules, assignments and
bulk imports.

The system must not present simulated data as live data.

## 2. Portals and roles

### 2.1 Passenger Portal

Audience: students, teachers and other authorized campus passengers. Do
not name this portal "Student Portal".

Capabilities: - Sign in and view/edit permitted profile fields. - View
assigned bus, route, boarding stop and shift. - Request a bus, route,
stop or shift change; changes to official assignments require approval
where configured. - View bus location on a map, last update time, route,
upcoming stops, distance remaining and ETA when data is available. -
View capacity, current passenger count, estimated available seats and
timestamp of last occupancy update. - View other active buses serving
the same route and relevant upcoming stop, with their capacity,
occupancy freshness, location and ETA. - Receive relevant bus-full,
delay, route, complaint and service notifications. - Submit complaints
and track status. - Submit a stop/arrival report for self or on behalf
of another person only where allowed; clearly record submitter, subject,
consent/authorization status, timestamp and verification state. Do not
expose another person's private profile information.

### 2.2 Transport Staff Portal

One portal for Driver and Conductor accounts. The interface may share
common pages, but backend permissions must distinguish `driver` and
`conductor`. An account may hold both roles if admin assigns both.

Common capabilities: - View own assigned bus, route, shift, active trip,
stops and staff assignment. - View live status and available capacity of
other eligible buses on the same route. - Receive operational alerts and
see last-update timestamps. - Report an operational issue.

Driver-only capabilities: - Start/end assigned trip. - Share phone GPS
while on an active trip, subject to device permissions. - View route and
trip status. - Report route obstruction or location/trip issue.

Conductor-only capabilities: - Update passenger count using
boarding/alighting controls. - Correct an occupancy count and provide a
reason where appropriate. - Mark bus full when capacity is reached. -
Record passenger transfer/redistribution when operationally confirmed. -
See occupancy and alternate-bus information.

If one staff member performs both jobs, admin grants both roles to the
same account. Do not duplicate the person's account merely because they
have two roles.

### 2.3 Admin Portal

-   Manage users and roles.
-   Create/edit buses and define official passenger capacity.
-   Manage routes, ordered stops, stop coordinates and schedules.
-   Configure two shifts initially:
    -   Shift 1: 08:20--14:40
    -   Shift 2: 10:30--17:00
-   Assign bus, driver, conductor and passengers to the correct
    route/shift/schedule.
-   Manage assignment requests and official stop/route changes.
-   Upload CSV/XLSX data by selecting shift (for shift-specific data)
    and import type.
-   Validate file, preview changes, show row-level errors, confirm
    commit and show import summary.
-   Manage complaints, notifications and operational reports.
-   View audit history for sensitive edits and imports.

## 3. Occupancy and capacity rules

-   Admin enters each bus's official maximum passenger capacity.
-   Conductor updates actual passenger count, or the count is supplied
    by a verified future integration.
-   `availableSeats = max(0, capacity - currentPassengerCount)`.
-   Reject or flag passenger counts below zero or above configured
    capacity; do not silently clamp bad input.
-   Every occupancy update belongs to a specific active trip and
    includes source, updater and timestamp.
-   A trip's occupancy starts as unknown/unconfirmed until a staff
    member records a starting count. Do not assume the bus is empty.
-   Mark occupancy as stale after a configurable threshold; stale data
    must not be represented as live.
-   "Full" means current confirmed count is at capacity, or conductor
    explicitly marks full with a reason/status. If the count conflicts
    with capacity, show a data-quality warning.
-   No automatic passenger counting is claimed without sensors or a
    verified counting mechanism.

## 4. Cross-bus availability and passenger redistribution

When a bus is full or nearly full: 1. Find other active trips that serve
the passenger's relevant stop and compatible route/direction. 2. Exclude
inactive buses, buses not serving the stop, buses with stale/unknown
occupancy (unless shown clearly as unverified), and buses without
confirmed spare capacity. 3. Display bus identifier, next relevant stop,
location, ETA, available seats and last occupancy update. 4. Notify
relevant users where appropriate. 5. Staff coordinate the transfer.
Record boarding/alighting on the correct trip and update both buses
through the backend. 6. Avoid double-counting. Transfer records must be
idempotent or otherwise protected against duplicate submissions.

The system recommends alternatives; it must not claim that a seat is
guaranteed unless a reservation/seat allocation feature is explicitly
approved.

## 5. Live tracking and ETA

-   Baseline source: driver's phone GPS during an active trip.
-   Browser/device permission, connectivity and background-location
    restrictions can affect updates.
-   GPS updates include trip ID, coordinates, timestamp and accuracy
    when available.
-   Reject impossible/invalid coordinates and stale/out-of-order
    updates.
-   The UI shows last update time and an offline/stale state.
-   Distance/ETA require route geometry and a routing/estimation
    strategy. Straight-line distance must not be mislabeled as road
    distance.
-   Use a free/open-source routing option or an explicitly documented
    approximation; verify provider usage limits before deployment.
-   Do not show fabricated moving markers, fake ETAs or simulated
    occupancy in production.

## 6. Shift and import separation

-   Use one database with separate shift/schedule/trip records and
    explicit references.
-   Shift-specific imports must require a selected shift.
-   Import type must be selected (routes/stops, passenger assignments,
    trip/staff assignments, etc.).
-   Shared master data (e.g. bus identity/capacity) must use its own
    import type and explicit update rules.
-   Import preview is mandatory before commit.
-   Validate schema, IDs, references, duplicate rows, times, capacities
    and route/shift compatibility.
-   A Shift 1 import must not overwrite Shift 2 records; enforce this in
    service logic and tests.
-   Re-uploading the same stable IDs should update intended records
    rather than create duplicates.
-   Keep import audit history and row-level results. For destructive or
    large updates, support rollback or a reviewed corrective import.

## 7. Stop and arrival reports

-   Store who submitted the report, who/what it concerns,
    route/stop/trip, submitted time, source and verification status.
-   A passenger may report on behalf of another passenger only under a
    clearly defined policy; do not reveal private data or allow
    impersonation.
-   Student/passenger-submitted reports do not alter official GPS or
    timetable automatically.
-   A request for a new official stop is a request until authorized
    staff/admin approve it.
-   Distinguish GPS-derived ETA, staff-confirmed information and
    passenger-submitted reports.

## 8. Complaints and notifications

Complaints: - Create, list own complaints, view status, and add
permitted follow-up. - Admin can assign/update status and record
resolution. - Suggested statuses: `submitted`, `in_progress`,
`resolved`, `rejected`. - Enforce passenger privacy and admin/staff
permissions.

Notifications: - Store notification record and recipient(s). - In-app
notifications are baseline. - Push/email/SMS are optional integrations
only after free availability, credentials, consent and limits are
confirmed. - Do not claim delivery if only a database notification was
created.

## 9. Non-functional requirements

-   Authentication and server-side role authorization on every protected
    operation.
-   Validate all inputs on the backend.
-   Keep passwords hashed using a suitable password-hashing library.
-   Use HTTPS in deployed environments.
-   Store secrets in environment variables and never commit them.
-   Log important admin edits, imports, trip start/end, occupancy
    corrections and transfer actions.
-   Support responsive mobile use.
-   Provide loading, empty, stale, offline, permission-denied and error
    states.
-   Avoid leaking student/passenger personal details in public bus
    views.
-   Provide understandable accessibility labels and keyboard focus.
-   Automated tests for role access, shift isolation, import safety,
    capacity calculations and transfer handling.

## 10. Out of scope for initial release

Unless explicitly approved later: - AI/ML prediction features. -
Camera-based passenger counting. - Dedicated IoT/GPS hardware
procurement. - Paid map, SMS or push APIs. - Payment/ticketing, seat
reservation and fare collection. - Public display of passenger
identities. - Automatic route changes without admin approval.

## 11. Acceptance criteria

The initial release is acceptable only when: - Passenger, Driver,
Conductor and Admin permissions are enforced by the backend. - A
passenger can view their assigned bus and relevant public alternatives
without seeing another passenger's private data. - Driver GPS updates
reach authorized clients and stale/offline states work. - ETA/distance
are clearly defined and not fabricated. - Admin-defined capacity and
conductor occupancy updates produce correct availability. - Full-bus
alternatives only include compatible active trips serving the relevant
stop. - Transfer/occupancy updates do not double-count. - Shift 1 and
Shift 2 imports and assignments are isolated and tested. - Excel import
preview, validation, row errors and audit record work. - Complaints and
in-app notifications persist in the database. - Deployed app is tested
on real phones/accounts; demo data is clearly labeled.

## 12. Decisions requiring team approval before coding

1.  Are tracking pages private to authenticated campus users, or can the
    public view bus locations?
2.  How are passengers assigned initially: admin import, self-selection
    request, or both?
3.  Is a passenger allowed to select any bus, or only request a change
    to an approved assignment?
4.  What exact information may be submitted on behalf of another
    passenger, and what consent/verification is required?
5.  Who may request temporary stop changes during a live trip?
6.  What is the approved route source and who will supply route geometry
    and stop coordinates?
7.  Who owns deployment accounts and the production database?
8.  What occupancy freshness threshold should trigger a stale label?
9.  Does "capacity" mean seats only, or total permitted passengers
    including standing passengers? Define per bus and display the
    meaning clearly.
10. Which free-tier hosting provider is available to the team, and what
    are its current limits?
