# End-to-End Workflows

## 1. Admin setup

1.  Admin signs in.
2.  Creates/imports bus master data and enters official capacity for
    every bus.
3.  Creates routes, ordered stops, stop coordinates and route geometry.
4.  Configures Shift 1 (08:20--14:40) and Shift 2 (10:30--17:00).
5.  Creates schedules for service dates/recurrences.
6.  Assigns bus, driver, conductor and passengers to each schedule.
7.  Reviews import and assignment validation errors.
8.  Starts operations only after required records are complete.

## 2. Shift-specific Excel import

1.  Admin chooses import type.
2.  Admin chooses Shift 1 or Shift 2 for shift-specific data.
3.  Uploads the matching template.
4.  Backend checks extension, size, required headers, field formats and
    stable IDs.
5.  Backend validates referenced bus/route/stop/passenger/staff records.
6.  UI shows valid rows, invalid rows, duplicate/update/new counts and a
    downloadable error report.
7.  Admin confirms.
8.  Backend commits the validated batch safely and writes an import
    audit record.
9.  Admin sees a summary. A Shift 1 import cannot mutate Shift 2
    records.
10. For partial failures, behavior must be explicit: prefer
    all-or-nothing for tightly related assignment imports, or clearly
    documented per-row commits for independent master-data rows.

## 3. Passenger daily flow

1.  Passenger signs in.
2.  Backend returns the passenger's own approved assignment(s).
3.  Passenger sees bus, route, boarding stop, shift and assignment
    status.
4.  Passenger opens live tracking; frontend subscribes only to
    authorized route/trip updates.
5.  Passenger sees location freshness, remaining route distance, ETA and
    occupancy.
6.  Passenger may view other active buses that serve the relevant stop
    and route direction.
7.  Passenger may request an assignment/stop change; the official
    assignment changes only after required approval.
8.  Passenger may submit a complaint or permitted stop/arrival report.

## 4. Driver trip flow

1.  Driver signs in and selects an assigned scheduled trip.
2.  Backend verifies driver assignment, schedule and no conflicting
    active trip.
3.  Driver starts trip.
4.  Device requests/uses location permission and posts GPS updates.
5.  Backend validates coordinates, timestamp and trip status.
6.  Current trip location is persisted; authorized clients receive
    `trip:location.updated`.
7.  Driver sees next stops and eligible alternate buses.
8.  Driver ends trip; backend marks trip completed and stops accepting
    normal GPS writes for it.
9.  Location is marked completed/offline, not left indefinitely live.

## 5. Conductor occupancy flow

1.  Conductor opens assigned active trip.
2.  System shows capacity and latest count, including whether the count
    is unknown or stale.
3.  Conductor enters a starting count or confirms current count.
4.  For boarding/alighting, conductor changes count through explicit
    controls.
5.  Backend validates count and calculates available seats.
6.  Backend saves update with actor and timestamp, then broadcasts to
    authorized clients.
7.  If full, the UI shows full status and triggers alternative-bus
    lookup.
8.  Corrections require a reason and are audited.

## 6. Full bus and alternate bus workflow

1.  Bus A's confirmed occupancy reaches its configured capacity or
    conductor marks it full.
2.  Backend updates Bus A's status and checks active trips serving the
    same stop, direction and route.
3.  Candidate bus must have sufficiently fresh, confirmed spare
    capacity.
4.  Passenger/staff UI shows candidate bus, next relevant stop,
    live/stale location, ETA and seats available.
5.  Staff coordinate the actual boarding decision.
6.  If transfer is confirmed, record a transfer operation with an
    idempotency key and update both trip counts consistently.
7.  Recompute availability and broadcast the new counts.
8.  If no candidate qualifies, show "No confirmed alternative currently
    available"; do not invent one.

## 7. Passenger reports on behalf of another person

1.  Submitter selects self-report or on-behalf report.
2.  Backend captures submitter identity and target reference only as
    allowed by policy.
3.  Require appropriate consent/verification for another person's
    personal details.
4.  Mark report as unverified until confirmed by an authorized source.
5.  Do not change official GPS, timetable or assignment based only on a
    passenger report.
6.  Authorized staff/admin may review or resolve it.

## 8. Complaints

1.  Passenger submits category and description.
2.  Backend saves complaint with `submitted` status and reference code.
3.  Passenger can view only their complaints.
4.  Admin reviews and changes status with a response.
5.  Notification is saved for the passenger.
6.  Resolution history is retained.

## 9. Shift boundary and next trip

-   Each trip has its own ID and occupancy history.
-   A completed trip's occupancy must not automatically become the next
    trip's occupancy.
-   The next trip begins with unknown/unconfirmed occupancy until staff
    records a count.
-   A bus can operate in both shifts only when its schedules and active
    trips do not conflict.
-   Shift time overlap is permitted in the schedule data; actual
    vehicle/driver/conductor conflicts must be validated.

## 10. Failure cases

-   GPS permission denied: show tracking unavailable; do not create fake
    coordinates.
-   Driver loses network: retain last update timestamp and show stale
    status.
-   Occupancy not updated: show unknown/stale, not zero passengers.
-   Excel invalid: do not commit invalid data; show row-level reasons.
-   No alternate bus: communicate no confirmed alternative.
-   Socket disconnected: reconnect and fetch current REST state.
-   Notification provider unavailable: keep in-app record and disclose
    external delivery failure if applicable.
