# Data Model and API Contract --- Initial Draft

**Important:** This is a starting contract. Finalize and review it
before implementation. All IDs should use one consistent format (MongoDB
ObjectId or UUID) across the API.

## 1. Common conventions

-   JSON over HTTPS.
-   Timestamps stored in UTC as ISO 8601; display local campus time
    (Asia/Kolkata).
-   Stable identifiers for imported entities (e.g. `busCode`,
    `routeCode`, `stopCode`, `passengerCode`, `scheduleCode`).
-   Every protected endpoint authenticates the caller and checks both
    role and object-level access.
-   Standard success shape may be `{ "data": ..., "meta": ... }`.
-   Standard error shape:
    `{ "error": { "code": "CAPACITY_EXCEEDED", "message": "Passenger count exceeds bus capacity", "details": [] } }`.
-   Never expose password hashes, tokens or private contact details
    through general bus/route responses.

## 2. Core collections

### users

-   `_id`
-   `institutionalId` (unique where available)
-   `displayName`
-   `email` (unique where available)
-   `phone` (private, access-controlled)
-   `passwordHash` or external-auth identifier
-   `roles`: one or more of `passenger`, `driver`, `conductor`, `admin`
-   `passengerType`: `student`, `teacher`, `staff`, `other` (for
    passenger accounts)
-   `status`: `active`, `suspended`, `pending`
-   `createdAt`, `updatedAt`

### buses

-   `_id`
-   `busCode` (unique)
-   `registrationNumber` (access-controlled as appropriate)
-   `capacity` (positive integer; meaning must be configured: seats or
    total permitted passengers)
-   `capacityType`: `seated_only` or `total_passengers` (final enum to
    be approved)
-   `status`: `active`, `maintenance`, `inactive`
-   `createdAt`, `updatedAt`

### routes

-   `_id`
-   `routeCode` (unique)
-   `name`
-   `direction` or direction code where relevant
-   `stopIds` in ordered sequence or separate route-stop records
-   `geometry` (GeoJSON LineString or reference to route geometry)
-   `status`
-   `createdAt`, `updatedAt`

### stops

-   `_id`
-   `stopCode` (unique)
-   `name`
-   `location`: GeoJSON Point `[longitude, latitude]`
-   `status`
-   `createdAt`, `updatedAt`

### shiftSchedules

-   `_id`
-   `scheduleCode` (stable unique import key)
-   `shiftCode`: `SHIFT_1` or `SHIFT_2` initially
-   `startTimeLocal`: `08:20` or `10:30`
-   `endTimeLocal`: `14:40` or `17:00`
-   `serviceDate` or recurrence/calendar fields (define before
    implementation)
-   `routeId`
-   `busId`
-   `driverId`
-   `conductorId`
-   `status`
-   `createdAt`, `updatedAt`

### passengerAssignments

-   `_id`
-   `assignmentCode` (stable unique import key)
-   `passengerId`
-   `scheduleId`
-   `routeId`
-   `busId`
-   `boardingStopId`
-   `status`: `pending`, `approved`, `active`, `ended`, `rejected`
-   `validFrom`, `validTo`
-   `createdBy`, `updatedAt`

### trips

-   `_id`
-   `tripCode`
-   `scheduleId`
-   `busId`
-   `routeId`
-   `driverId`
-   `conductorId`
-   `status`: `scheduled`, `active`, `completed`, `cancelled`
-   `startedAt`, `endedAt`
-   `lastLocationAt`
-   `locationStatus`: `unknown`, `live`, `stale`, `offline`
-   `createdAt`, `updatedAt`

### busLocations

-   `_id`
-   `tripId`
-   `busId`
-   `coordinates`: longitude, latitude
-   `accuracyMeters` if available
-   `recordedAt`
-   `receivedAt`
-   Optional retention/aggregation policy to be agreed.

### occupancyUpdates

-   `_id`
-   `tripId`
-   `busId`
-   `passengerCount`
-   `capacitySnapshot`
-   `availableSeats`
-   `status`: `confirmed`, `stale`, `disputed`
-   `source`: `conductor_manual`, `verified_integration`,
    `admin_correction`
-   `updatedBy`
-   `reason` for corrections
-   `recordedAt`

### passengerTransfers

-   `_id`
-   `transferCode` (idempotency key)
-   `fromTripId`, `toTripId`
-   `passengerCount`
-   `originStopId` or transfer stop
-   `status`: `proposed`, `confirmed`, `cancelled`
-   `confirmedBy`
-   `createdAt`, `confirmedAt`

### importJobs

-   `_id`
-   `importCode`
-   `importType`
-   `shiftCode` when applicable
-   `fileName`
-   `uploadedBy`
-   `status`: `uploaded`, `validated`, `committed`, `failed`,
    `cancelled`
-   `rowCount`, `validCount`, `errorCount`
-   `errors` (bounded; store detailed report separately for large
    imports)
-   `createdAt`, `committedAt`

### complaints

-   `_id`
-   `complaintCode`
-   `submittedBy`
-   `category`
-   `description`
-   `relatedTripId` optional
-   `status`: `submitted`, `in_progress`, `resolved`, `rejected`
-   `assignedTo` optional
-   `adminResponse` optional
-   `createdAt`, `updatedAt`, `resolvedAt`

### notifications

-   `_id`
-   `recipientId` or authorized audience reference
-   `type`
-   `title`
-   `message`
-   `relatedEntityType`, `relatedEntityId`
-   `readAt`
-   `createdAt`

### auditLogs

-   `_id`
-   `actorId`
-   `action`
-   `entityType`, `entityId`
-   `before`/`after` summary with sensitive values redacted
-   `importJobId` optional
-   `createdAt`

## 3. Essential indexes and integrity rules

-   Unique: `busCode`, `routeCode`, `stopCode`, stable import codes, and
    institutionally unique account IDs where available.
-   Query indexes: `trips(status, routeId)`, `trips(busId, status)`,
    `occupancyUpdates(tripId, recordedAt)`,
    `passengerAssignments(passengerId, status)`,
    `shiftSchedules(shiftCode, serviceDate)`,
    `notifications(recipientId, createdAt)`.
-   Validate that passenger count is an integer and not negative or
    greater than approved capacity without an explicit reviewed
    exception.
-   Enforce at most one conflicting active assignment/trip per
    applicable business rule.
-   Validate route-stop membership and shift compatibility on the
    server.
-   Do not assume MongoDB multi-document atomicity without using a
    transaction on a supported replica set or designing idempotent
    operations.

## 4. Proposed REST API groups

Prefix: `/api/v1`

### Authentication

-   `POST /auth/login`
-   `POST /auth/logout`
-   `GET /auth/me`
-   `POST /auth/refresh` only if refresh-token design is adopted

### Passenger

-   `GET /passenger/me/assignments`
-   `GET /passenger/me/bus`
-   `GET /passenger/routes/:routeId/available-buses`
-   `POST /passenger/assignment-requests`
-   `POST /passenger/stop-reports`
-   `GET /passenger/complaints`
-   `POST /passenger/complaints`
-   `GET /passenger/notifications`

### Transport staff

-   `GET /staff/me/assignments`
-   `POST /staff/trips/:tripId/start`
-   `POST /staff/trips/:tripId/end`
-   `POST /staff/trips/:tripId/location`
-   `GET /staff/trips/:tripId/occupancy`
-   `POST /staff/trips/:tripId/occupancy`
-   `POST /staff/transfers`
-   `GET /staff/routes/:routeId/available-buses`
-   `POST /staff/operational-reports`

### Admin

-   CRUD `/admin/users`
-   CRUD `/admin/buses`
-   CRUD `/admin/routes`
-   CRUD `/admin/stops`
-   CRUD `/admin/shift-schedules`
-   CRUD `/admin/passenger-assignments`
-   `POST /admin/imports/validate`
-   `POST /admin/imports/:importId/commit`
-   `GET /admin/imports/:importId/report`
-   `GET /admin/complaints`
-   `PATCH /admin/complaints/:complaintId`
-   `GET /admin/reports/operations`
-   `GET /admin/audit-logs`

CRUD means create/read/update/delete only where safe and approved;
destructive actions should generally be soft-deleted and audited.

## 5. Real-time Socket.IO event contract (proposed names)

Server to authorized clients: - `trip:location.updated` -
`trip:status.updated` - `trip:occupancy.updated` -
`route:availability.updated` - `notification:created` -
`complaint:status.updated`

Client requests: - Prefer REST for durable writes. If socket mutations
are later introduced, they need the same auth/validation/idempotency
checks. - `trip:subscribe` may be used only after server verifies access
to the trip/route. - Clients must refetch after reconnect and handle
missed events.

Suggested event payload envelope:

``` json
{
  "schemaVersion": 1,
  "eventId": "server-generated-id",
  "occurredAt": "2026-10-24T08:00:00.000Z",
  "entityId": "trip-id",
  "data": {}
}
```

## 6. Occupancy API invariants

-   The server computes `availableSeats`; clients must not submit it as
    authoritative.
-   Each update references an active trip assigned to the actor.
-   Validate role, trip, bus capacity, current count and timestamp.
-   For transfer operations, use an idempotency key and record both
    source and destination trip.
-   Broadcast only after successful persistence.
-   Include `recordedAt`, `receivedAt` and freshness status.
