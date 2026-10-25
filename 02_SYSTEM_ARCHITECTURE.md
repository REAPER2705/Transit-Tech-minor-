# System Architecture

**Status:** Proposed architecture; audit the existing repository before
replacing any working implementation.

## 1. High-level architecture

``` mermaid
flowchart TD
    P[Passenger Portal]
    S[Transport Staff Portal]
    A[Admin Portal]
    FE[React + Vite Frontend]
    API[Express REST API]
    AUTH[Authentication + Role Authorization]
    DB[(MongoDB)]
    RT[Socket.IO Real-time Gateway]
    GPS[Driver Phone GPS]
    MAP[Leaflet + OpenStreetMap]
    ROUTE[Routing / ETA Service]
    IMPORT[CSV/XLSX Import Validator]
    NOTIF[In-app Notification Service]

    P --> FE
    S --> FE
    A --> FE
    FE --> API
    FE --> RT
    FE --> MAP
    GPS --> API
    API --> AUTH
    API --> DB
    API --> IMPORT
    API --> NOTIF
    API <--> RT
    RT <--> DB
    API --> ROUTE
```

## 2. Proposed baseline stack

-   Frontend: React, Vite, TypeScript, Tailwind CSS.
-   Mapping: Leaflet + OpenStreetMap tiles, following tile-provider
    usage policies.
-   Backend: Node.js + Express.
-   Real-time: Socket.IO.
-   Database: MongoDB Community locally; production database provider
    chosen only after checking current free-tier limits and terms.
-   Spreadsheet parsing: an actively maintained XLSX parser or CSV
    parser; validate server-side.
-   Tests: Vitest/Jest as appropriate, Supertest for API tests,
    Playwright for end-to-end tests.
-   API documentation: OpenAPI YAML.
-   Diagrams: Mermaid in Markdown.

## 3. Application layers

1.  UI layer: role-aware navigation, forms, maps and loading/error/stale
    states.
2.  API layer: request validation, authentication, authorization, rate
    limits and consistent errors.
3.  Domain/service layer: trip lifecycle, assignment checks, occupancy,
    transfers, imports, complaints and notifications.
4.  Persistence layer: models, indexes, atomic updates where needed and
    audit records.
5.  Real-time layer: authorized Socket.IO rooms/events. Clients must not
    choose arbitrary room IDs without server-side membership checks.
6.  External resources: map tiles and optional routing. App must fail
    gracefully if an external service is unavailable.

## 4. Real-time event principles

-   REST endpoints remain the source of truth for durable state changes.
-   Socket.IO broadcasts state changes after successful database writes.
-   Events include schema version, event ID, entity/trip ID and server
    timestamp.
-   Clients must handle reconnects by fetching current state through
    REST.
-   Do not treat socket messages as proof of authorization; validate
    every mutation on the server.
-   Use trip/route-scoped rooms, with membership checked server-side.
-   Avoid broadcasting personal passenger data in route-wide rooms.

## 5. Tracking lifecycle

-   A driver may start only an assigned trip and only when no
    conflicting active trip exists.
-   GPS writes require authenticated driver permissions and an active
    assigned trip.
-   Save timestamped location records or a current-location record plus
    history according to retention requirements.
-   End trip marks it inactive and stops accepting new GPS updates for
    that trip.
-   If updates stop, mark the trip location stale/offline after the
    configured threshold.

## 6. ETA strategy

-   Use route geometry and a routing/ETA strategy documented in the
    product configuration.
-   Prefer a self-hostable open-source routing engine only if the team
    can operate it; otherwise evaluate a free endpoint and its usage
    policy/limits.
-   For MVP, if road ETA cannot be reliably calculated, label it
    "estimated" and show the method and last GPS update. Do not imply
    guaranteed arrival.
-   Keep straight-line distance, route distance and remaining route
    distance as distinct concepts.

## 7. Deployment principles

-   Separate development, test and production environment variables.
-   No secrets in source control.
-   Use HTTPS in production.
-   Health endpoint should report application health without exposing
    secrets.
-   Add structured logs and safe error handling.
-   Verify sleeping/cold-start, database connection limits, persistent
    storage and WebSocket support for the selected free host.
-   Free-tier terms change; confirm current limits before committing to
    a provider.

## 8. Security baseline

-   Role checks enforced in backend middleware and domain services.
-   Object-level authorization: users may only access permitted
    assignments/complaints/profile records.
-   Password hashing, secure cookies or carefully handled JWTs, rate
    limiting and input validation.
-   Restrict CORS to approved frontend origins in production.
-   File upload size/type limits and parser error handling.
-   Prevent spreadsheet formula injection when exporting untrusted text
    to CSV.
-   Audit admin imports and operational corrections.
