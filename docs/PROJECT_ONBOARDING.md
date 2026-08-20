# Arch of Oxford — Project Onboarding Guide

A concise reference for developers picking up the Arch codebase. Arch is a mobile platform for Oxford students, alumni, staff, and Friends of Oxford, covering dating (Bridge), events, jobs, study buddies, and real-time chat with voice/video calls.

The system spans **three codebases** that work together:

| Codebase | Path (local) | Purpose |
|---|---|---|
| **Mobile app** | `Arch-Oxford-fronted/` | React Native app (Expo) for iOS & Android |
| **Backend API** | `Arch-Oxford-backend/` | ASP.NET Core REST API + SignalR hub |
| **Admin dashboard** | `WEBs/Dashboard-Arch/` | Vue 3 web panel for staff and administrators |

| URL | What it serves |
|---|---|
| `https://api.arch-api.co.uk` | Production API |
| `https://api.arch-api.co.uk/api-dev` | Development API (used by dev builds and admin panel) |
| `https://arch-api.co.uk` | Admin dashboard (static SPA on VPS) |

> **Note:** This document lives in the mobile and backend repos (`Arch/docs/` and `Arch-Oxford-backend/docs/`). The admin dashboard has its own README in `Dashboard-Arch/`.

---

## Repository Overview

```
Arch-Oxford-fronted/          Arch-Oxford-backend/           Dashboard-Arch/
├── Arch/                     ├── ArchAPI/                   └── arch-web/
│   ├── app/                  │   ├── Program.cs                 ├── src/views/
│   ├── components/           │   ├── Controllers/               ├── src/services/Api.ts
│   ├── service/              │   ├── Services/                  ├── vite.config.js
│   ├── context/              │   ├── Hubs/ChatHub.cs            └── dist/  (production build)
│   ├── eas.json              │   ├── Dockerfile
│   └── app.json              ├── docker-compose.yml
└── README.md                 ├── ENTORNOS.md
                              └── docs/
```

---

## Languages & Why We Use Them

| Language | Frontend | Backend | Why |
|---|---|---|---|
| **TypeScript** | ✅ Mobile + Admin | — | Static typing for React Native and Vue dashboard codebases. |
| **JavaScript** | ✅ Config only | — | Expo/React Native config files (`babel.config.js`, `metro.config.js`, `ApiConfig.js`). |
| **C# (.NET 9)** | — | ✅ Primary | Server-side logic, DI, middleware, controllers, and SignalR hubs. |
| **SQL** | — | ✅ Via EF Core | PostgreSQL schema managed through Entity Framework migrations. |
| **HTML** | — | ✅ Email templates | Transactional emails in `ArchAPI/wwwroot/email-templates/`. |
| **JSON** | ✅ `app.json`, `.env` | ✅ `appsettings*.json` | Configuration for both apps and build pipelines. |

---

## Frontend (`Arch-Oxford-fronted`)

### Stack

| Technology | Version (approx.) | Role |
|---|---|---|
| **Expo** | 54 | Build toolchain, native modules, dev client, EAS builds. |
| **React Native** | 0.81 | Cross-platform mobile UI. |
| **React** | 19 | Component model and hooks. |
| **TypeScript** | 5.9 | Type safety across the codebase. |
| **Expo Router** | 6 | File-based routing — folder structure under `app/` defines routes. |

### Key Libraries

| Category | Library | Role |
|---|---|---|
| **HTTP** | Axios (`service/apiClient.ts`) | REST client with JWT, retries on 429/5xx, session expiry handling. |
| **Real-time** | `@microsoft/signalr` (`service/SignalRService.ts`) | WebSocket hub for chat, presence, typing, and call signalling. |
| **Offline** | `@nozbe/watermelondb` (`database/`) | Local SQLite cache for chat messages. |
| **Secure storage** | `expo-secure-store` | Encrypted JWT and sensitive user data. |
| **Persistence** | `@react-native-async-storage/async-storage` | General key-value storage. |
| **UI / gestures** | Reanimated, Gesture Handler, Skia, Moti | Swipe cards, animations, draggable photo grids. |
| **Media** | expo-image, expo-camera, expo-audio, expo-image-picker | Photos, voice messages, QR scanning. |
| **Location** | expo-location | Study Buddies "near me". |
| **Auth** | expo-local-authentication | Face ID / biometric login. |
| **Push** | expo-notifications | Device token registration and notification handling. |
| **Payments** | `@stripe/stripe-react-native` | Event ticket card payments. |
| **Subscriptions** | expo-iap | Apple In-App Purchases. |
| **Calls** | `@livekit/react-native`, livekit-client | Audio/video calls (tokens from backend). |
| **Monitoring** | `@sentry/react-native` | Crash reporting and performance tracing. |
| **Network status** | `@react-native-community/netinfo` | Online/offline detection. |

### Folder Structure

```
Arch/
├── app/                  # Routes (Expo Router)
│   ├── _layout.tsx       # Root: providers, splash, tab bar, SignalR init
│   ├── (auth)/           # Login, registration, verification
│   ├── (tabs)/           # Main tabs: chats, dating, study buddies…
│   ├── (staff)/          # Staff-only (e.g. QR scanner)
│   └── legal/            # Terms, privacy, cookies
├── components/
│   ├── screens/          # Full-screen views
│   ├── chats/            # Chat & Study Buddies UI
│   ├── modals/           # Bottom sheets and overlays
│   ├── layout/           # Tab bars, MainLayout
│   ├── calls/            # Incoming call overlay
│   └── ui/               # Reusable primitives
├── service/              # API clients — one file per domain (see table below)
├── context/              # Global state: Auth, Events, Tabs, Calls, Entitlements
├── hooks/                # Biometrics, Stripe, device type, app config
├── config/               # API base URL (`ApiConfig.js`)
├── database/             # WatermelonDB schema and models
├── utils/                # Notification routing, Oxford term weeks, etc.
├── constants/            # Theme, typography, spacing
└── assets/               # Images, icons, sounds
```

**Entry point:** `app/_layout.tsx` — wraps providers, initialises Sentry, lazily loads SignalR and push services.

**Routing:** Route groups like `(auth)` and `(tabs)` are excluded from the URL. Dynamic segments use brackets: `chat/[id].tsx`.

### Frontend Services (`service/`)

Each file maps roughly to a backend controller or domain:

| Service file | Domain |
|---|---|
| `apiClient.ts` | Shared HTTP layer (all REST calls go through here) |
| `tokenService.ts` | JWT read/write via Secure Store |
| `SignalRService.ts` | Real-time hub connection and event handlers |
| `ChatService.ts` / `ChatCacheService.ts` | Chat REST + local cache |
| `CallService.ts` | LiveKit call lifecycle |
| `SwipeService.ts` / `LikeService.ts` / `MatchService.ts` | Dating swipe and matches |
| `DatingProfileService.ts` / `DatingPhotoService.ts` | Dating profiles and photos |
| `StudyStateService.ts` / `SubjectService.ts` / `NearbyStudyBuddiesService.ts` | Study Buddies |
| `JobService.ts` / `CandidateProfileService.ts` | Jobs board |
| `NotificationService.ts` / `PushNotificationService.ts` | In-app and push notifications |
| `SubscriptionService.ts` / `EntitlementsService.ts` / `IAPService.ts` | Premium and Apple IAP |
| `AlumniService.ts` / `VouchService.ts` | Alumni verification and vouches |
| `GoogleCalendarService.ts` | Calendar integration |
| `BlockService.ts` / `ReportService.ts` | Safety and moderation |

### Running the Frontend

```bash
cd Arch-Oxford-fronted/Arch
npm install
cp .env.example .env          # set EXPO_PUBLIC_API_BASE_URL
npm start                     # Expo Go
npm run start:devclient       # custom dev client (push, IAP, native modules)
```

| Environment variable | Purpose |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Backend URL (required in production) |

Dev fallbacks if unset: `localhost:5011` (iOS/web), `10.0.2.2:5011` (Android emulator).

---

## Backend (`Arch-Oxford-backend`)

### Stack

| Technology | Version | Role |
|---|---|---|
| **ASP.NET Core** | 9.0 | Web host, controllers, middleware, DI. |
| **Entity Framework Core** | 9.0 | ORM for PostgreSQL. |
| **PostgreSQL** | 16 (AWS RDS) | Primary database. |
| **SignalR** | Built-in | Real-time chat hub at `/hubs/chat`. |
| **Docker** | — | Containerised deployment (`ArchAPI/Dockerfile`). |

### Key Libraries

| Category | Library | Role |
|---|---|---|
| **Database** | Npgsql + EF Core | PostgreSQL access; dynamic JSON columns enabled. |
| **Auth** | JWT Bearer | Stateless auth for REST and SignalR. |
| **Passwords** | BCrypt.Net-Next | Password hashing. |
| **Rate limiting** | System.Threading.RateLimiting | Brute-force protection on auth endpoints. |
| **Real-time** | SignalR (`Hubs/ChatHub.cs`) | Messaging, receipts, presence, call events. |
| **Payments** | Stripe.net | Event ticket payments, setup intents, refunds. |
| **Storage** | AWSSDK.S3 | Photos, chat media, alumni documents. |
| **Moderation** | AWSSDK.Rekognition | Profile photo validation. |
| **Calls** | Livekit.Server.Sdk.Dotnet | LiveKit token generation and call management. |
| **Monitoring** | Sentry.AspNetCore | Error tracking; sensitive headers filtered. |
| **Queries** | Dapper | Lightweight SQL where EF Core is not ideal. |
| **Docs** | Swashbuckle.AspNetCore | Swagger/OpenAPI (development). |
| **Crypto** | System.Security.Cryptography.Pkcs | Chat message encryption. |

**External HTTP integrations** (registered in `Program.cs`):

| Integration | Purpose |
|---|---|
| Expo Push (`exp.host`) | Mobile push notifications |
| PassKit / Passcreator | Apple Wallet event tickets |
| Apple IAP | Subscription receipt verification |
| Google Calendar | Calendar sync for events |
| Nominatim | Geocoding for locations |

### Folder Structure

```
ArchAPI/
├── Program.cs            # Bootstrap: DI, middleware, hubs, health checks
├── Controllers/          # REST endpoints (~40 controllers)
├── Services/             # Business logic
│   ├── Abstractions/     # Interfaces (IChatService, IUserService, …)
│   └── PassKit/          # Apple Wallet ticket generation
├── Repositories/         # Data access layer
│   └── Abstractions/
├── Hubs/
│   └── ChatHub.cs        # SignalR: messages, presence, call signalling
├── Models/               # EF Core entities (User, Match, Event, …)
├── DTOs/                 # Request/response shapes (grouped by domain)
├── Data/
│   └── AppDbContext.cs   # DbContext and entity configuration
├── Migrations/           # EF Core schema migrations
├── Middleware/           # ErrorHandlingMiddleware, SignalRSslMiddleware
├── Utils/                # Helpers (e.g. UserTypeValidator)
├── wwwroot/              # Static files, email HTML templates, AASA file
├── appsettings.json      # Production config
├── appsettings.Development.json
├── appsettings.Development2.json
└── Dockerfile
```

**Layering rule:** Controllers are thin → Services hold business logic → Repositories access data. Never expose `Models/` directly; always return `DTOs/`.

### `Program.cs` — What Happens at Startup

`Program.cs` is the single entry point. In order, it:

1. **Configures Sentry** — error tracking with sensitive header filtering.
2. **Registers EF Core** — PostgreSQL via Npgsql with retry and dynamic JSON.
3. **Sets up JSON serialisation** — camelCase for JavaScript compatibility.
4. **Adds rate limiting** — policies for auth, password reset, and verification only.
5. **Registers SignalR** — camelCase JSON protocol for the frontend.
6. **Configures JWT auth** — including SignalR token via `?access_token=`.
7. **Registers all services** — ~50 scoped/singleton services (see below).
8. **Configures AWS** — S3 and Rekognition clients.
9. **Maps middleware pipeline:**
   ```
   ForwardedHeaders → CORS → SentryTracing → ErrorHandling
   → SignalRSsl → StaticFiles → Authentication → Authorization
   → RateLimiter → Controllers + ChatHub
   ```
10. **Maps health checks** — `/api/_health`, `/api/_health/db`, `/api/_health/signalr`, etc.

### Backend Services (registered in DI)

| Service | Responsibility |
|---|---|
| `UserService` | User CRUD, profiles, account deletion |
| `AuthController` → (inline) | Login, register, token refresh |
| `SwipeService` / `MatchService` / `SuperLikeService` | Dating swipe, matching, superlikes |
| `ChatService` | Message persistence, read receipts |
| `EncryptionService` | End-to-end chat message encryption |
| `PushNotificationService` | Expo push delivery |
| `NotificationService` | In-app notification records |
| `LiveKitService` | Call token generation |
| `EventService` | Event CRUD and user registrations |
| `StudyStateService` | Study Buddy states and invites |
| `SubjectService` / `SubjectSeedService` | Subject normalisation and seeding |
| `JobService` / `CandidateProfileService` | Jobs board |
| `StripePaymentController` services | Payment intents, refunds |
| `EntitlementsService` / `AppleIapService` | Subscription entitlements |
| `AlumniVerificationService` | Document upload and review workflow |
| `VouchService` | Friend-of-Oxford vouch system |
| `EmailService` | Transactional emails from HTML templates |
| `S3Service` / `ChatMediaS3Service` / `DatingPhotoS3Service` | File uploads to AWS |
| `PasscreatorService` | Apple Wallet `.pkpass` generation |
| `GoogleCalendarService` | Event calendar sync |
| `LoginAttemptService` | In-memory brute-force tracking |
| `LocationSeedBackgroundService` | Auto-seeds Oxford locations on startup |
| `SubjectSeedBackgroundService` | Auto-seeds subjects on startup |

### Key Controllers by Domain

| Domain | Controller(s) |
|---|---|
| Auth & users | `AuthController`, `UsersController`, `FriendsOfOxfordController` |
| Dating | `SwipeController`, `MatchController`, `LikesController`, `DatingProfileController`, `SuperLikeController` |
| Chat | `ChatController` + `ChatHub` (SignalR) |
| Calls | `CallController`, `LiveKitWebhookController` |
| Study Buddies | `StudyStateController`, `SubjectController`, `LocationsController` |
| Events & tickets | `EventsController`, `ReservationController`, `TicketsController`, `PassKitController` |
| Jobs | `JobsController`, `CandidateProfilesController` |
| Payments | `StripePaymentController`, `EntitlementsController`, `CouponsController` |
| Alumni | `AlumniVerificationController`, `AdminAlumniController`, `VouchesController` |
| Admin & safety | `AppConfigController`, `AdminReportsController`, `ReportController`, `BlockController` |

### Running the Backend

```bash
cd Arch-Oxford-backend/ArchAPI
dotnet restore
ASPNETCORE_ENVIRONMENT=Development dotnet run    # port 5011
```

| Environment | Port | Config file | Database |
|---|---|---|---|
| `Development` | 5011 | `appsettings.Development.json` | Shared dev RDS |
| `Development2` | 5012 | `appsettings.Development2.json` | Personal dev DB |
| Production | 5000 | `appsettings.json` | Production RDS |

See `ENTORNOS.md` in the backend repo for migrations, Docker, and full environment details.

**Useful endpoints once running:**

| Endpoint | Purpose |
|---|---|
| `GET /api/_health` | API health check |
| `GET /api/_health/db` | Database connectivity |
| `GET /api/_health/signalr` | SignalR hub status |
| `/hubs/chat` | SignalR WebSocket hub |
| Swagger (dev only) | Auto-generated API docs |

---

## How Frontend & Backend Connect

```
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND  (Arch-Oxford-fronted/Arch)                        │
│                                                              │
│  app/ → components/ → service/ → context/                    │
│         │                    │                               │
│         │  REST              │  WebSocket                    │
│         ▼                    ▼                               │
│    apiClient.ts         SignalRService.ts                    │
│    (Axios + JWT)        (@microsoft/signalr + JWT)           │
└─────────┬────────────────────────┬───────────────────────────┘
          │  HTTPS /api/*          │  WSS /hubs/chat
          ▼                        ▼
┌──────────────────────────────────────────────────────────────┐
│  BACKEND  (Arch-Oxford-backend/ArchAPI)                      │
│                                                              │
│  Controllers → Services → Repositories → AppDbContext       │
│  ChatHub ←→ ChatService / PushNotificationService            │
└─────────┬──────────┬──────────┬──────────┬──────────────────┘
          ▼          ▼          ▼          ▼
     PostgreSQL    AWS S3     Stripe    LiveKit
                              Expo Push
```

### REST request flow

1. **Screen** renders and calls a **service** (`service/ChatService.ts`).
2. Service calls **`apiClient.ts`**, which attaches the JWT from `tokenService`.
3. Request hits a **Controller** (`Controllers/ChatController.cs`).
4. Controller delegates to a **Service** (`Services/ChatService.cs`).
5. Service uses **Repositories** and **EF Core** to read/write PostgreSQL.

### Real-time flow (chat, calls, presence)

1. On login, `SignalRService.ts` connects to `/hubs/chat?access_token=<JWT>`.
2. `ChatHub.cs` authenticates the connection and adds the user to their match groups.
3. When a message is sent, the hub broadcasts to group members.
4. If the recipient is offline, `PushNotificationService` sends via Expo Push.

### Push notification flow

1. Frontend registers device token via `PushNotificationService.ts` → `NotificationController`.
2. Backend stores token in `PushTokenRepository`.
3. On events (new match, message, etc.), backend sends to `exp.host` API.
4. User taps notification → `utils/NotificationNavigation.ts` routes to the correct screen.

---

## Feature Domains — Where to Look

| Feature | Frontend | Backend |
|---|---|---|
| Authentication | `context/AuthContext.tsx`, `app/(auth)/` | `AuthController`, `UserService` |
| Bridge (dating) | `app/dating.tsx`, `service/SwipeService.ts` | `SwipeController`, `MatchController`, `LikeRepository` |
| Chat | `app/(tabs)/chat/`, `service/ChatService.ts`, `service/SignalRService.ts` | `ChatController`, `ChatHub`, `ChatService`, `EncryptionService` |
| Voice/video calls | `app/(tabs)/chat/call.tsx`, `service/CallService.ts` | `CallController`, `LiveKitService` |
| Study Buddies | `app/(tabs)/study-buddies.tsx`, `service/StudyStateService.ts` | `StudyStateController`, `SubjectController`, `LocationsController` |
| Events & booking | `app/events.tsx`, `components/screens/TinderEventsScreen.tsx` | `EventsController`, `ReservationController`, `StripePaymentController`, `PassKitController` |
| Jobs | `app/jobs.tsx`, `service/JobService.ts` | `JobsController`, `CandidateProfilesController` |
| Push notifications | `service/PushNotificationService.ts`, `utils/NotificationNavigation.ts` | `PushNotificationService`, `NotificationController` |
| Subscriptions | `context/EntitlementsContext.tsx`, `expo-iap` | `EntitlementsController`, `AppleIapService` |
| Alumni verification | `app/(auth)/alumni-signup.tsx`, `service/AlumniService.ts` | `AlumniVerificationController`, `AlumniDocumentS3Service` |
| Friends of Oxford | `app/(auth)/friend-of-oxford-register.tsx` | `FriendsOfOxfordController`, `VouchService` |
| Apple Wallet tickets | `hooks/useAppleWallet.ts` | `PassKitController`, `PasscreatorService` |
| Google Calendar | `service/GoogleCalendarService.ts` | `GoogleCalendarController` |

---

## Shared Conventions

| Convention | Detail |
|---|---|
| **JSON casing** | Both API and SignalR serialise to **camelCase** for JavaScript compatibility. |
| **Auth token** | Stored in Secure Store (frontend); sent as `Authorization: Bearer …` on REST and `?access_token=…` on SignalR. |
| **Service naming** | Frontend `ChatService.ts` ↔ backend `ChatController` + `ChatService.cs`. |
| **DTOs** | Backend never exposes entity models directly — always mapped to DTOs. |
| **Error monitoring** | Sentry on both sides; sensitive headers filtered server-side. |
| **Rate limiting** | Backend only — auth, password reset, and verification endpoints. No global limit on normal traffic. |
| **User types** | Students, alumni, staff, Friends of Oxford — validated server-side via `UserTypeValidator`. |

---

## Infrastructure & Hosting

### Overview

```
                         Hostinger VPS
                    ┌──────────────────────────────┐
                    │  Repo: ~/arch                │
                    │                              │
                    │  Nginx (443, SSL/Let's Encrypt)│
                    │  config: /etc/nginx/conf.d/  │
                    │          arch.conf           │
                    │         ↓ proxy              │
                    │  Docker                      │
                    │   arch-api      → :5000→8080 │  Production → arch DB
                    │   arch-api-dev  → :5012→8080 │  Development → archdev DB
                    │                              │
                    │  arch-api.co.uk → admin SPA  │  (static Vue dist/)
                    └──────────────┬───────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
   AWS RDS (PostgreSQL)      AWS S3 (eu-west-2)       Hostinger SMTP
   archdev + arch            Public + Private          no-reply@arch-api.co.uk
```

Transactional emails: **Hostinger SMTP** (`smtp.hostinger.com`, from `no-reply@arch-api.co.uk` — see `Email` section in `appsettings.json`).

> **Credentials:** Database passwords, AWS keys, and JWT secrets live in `appsettings*.json` on the server. **Never commit these to Git.** Ask the team lead for VPS SSH access.

---

### Hostinger VPS — ports, Docker & Nginx

Everything below comes from the repo files: `docker-compose.yml`, `nginx/arch.conf`, `scripts/deploy.sh`, `scripts/dev.sh`, and `ArchAPI/Properties/launchSettings.json`.

#### Port map (Oxford)

| Where it runs | How | Host port | Container port | ASP.NET env | Container name | Config file | Database |
|---|---|---|---|---|---|---|---|
| **Your PC** (`dotnet run`) | Kestrel directly | **5011** | — | `Development` | — | `appsettings.Development.json` | **archdev** |
| **VPS** (production API) | Docker service `api` | **5000** (localhost only) | **8080** | `Production` | `arch-api` | `appsettings.json` | **arch** |
| **VPS** (development API) | Docker service `api-dev` | **5012** (localhost only) | **8080** | `Development` | `arch-api-dev` | `appsettings.Development.json` | **archdev** |

Inside each container the app listens on **8080** (`ASPNETCORE_URLS=http://0.0.0.0:8080`). Docker maps that to the host ports above, bound to **127.0.0.1 only** — nothing is exposed publicly except through Nginx.

Local **`dotnet run`** uses port **5011** (`launchSettings.json`) — this is **not** Docker. Use this for day-to-day coding on your machine.

#### Public URLs (Nginx → Docker)

Nginx config: `Arch-Oxford-backend/nginx/arch.conf` (deployed to `/etc/nginx/conf.d/arch.conf` on the VPS).  
Domain: **`api.arch-api.co.uk`** — HTTPS via Let's Encrypt (`/etc/letsencrypt/live/api.arch-api.co.uk/`).

| Public URL | Proxied to | Purpose |
|---|---|---|
| `https://api.arch-api.co.uk/api/…` | `127.0.0.1:5000` | **Production** REST API |
| `https://api.arch-api.co.uk/api-dev/…` | `127.0.0.1:5012` (rewrites `/api-dev` → `/api`) | **Development** REST API on VPS |
| `wss://api.arch-api.co.uk/hubs/chat` | `127.0.0.1:5000` | **Production** SignalR |
| `wss://api.arch-api.co.uk/hubs-dev/chat` | `127.0.0.1:5012` | **Development** SignalR on VPS |
| `https://api.arch-api.co.uk/auth/google` | `127.0.0.1:5000` | Google OAuth callback (prod) |
| `https://api.arch-api.co.uk/auth-dev/google` | `127.0.0.1:5012` | Google OAuth callback (dev) |

The mobile app picks the hub path automatically in `SignalRService.ts`: `/hubs-dev/chat` when the API base URL contains `api-dev`, otherwise `/hubs/chat`.

Admin dashboard: **`https://arch-api.co.uk`** (`App:FrontendUrl` in `appsettings.json`). Static Vue build — the Nginx vhost for this domain is **not** in this repo (managed on the VPS separately).

> **Note:** The same `nginx/arch.conf` also routes **Harvard** APIs on ports **5001** (prod) and **5013** (dev). Those are separate projects on the shared VPS — not defined in our `docker-compose.yml`.

---

#### Docker services (`docker-compose.yml`)

```yaml
# Production
api:
  container_name: arch-api
  ASPNETCORE_ENVIRONMENT: Production
  ports: "127.0.0.1:5000:8080"
  healthcheck: GET http://localhost:8080/api/_health

# Development (on VPS)
api-dev:
  container_name: arch-api-dev
  ASPNETCORE_ENVIRONMENT: Development
  ports: "127.0.0.1:5012:8080"
  healthcheck: GET http://localhost:8080/api/_health
```

Build context: `./ArchAPI/Dockerfile` (multi-stage .NET 9 SDK build → aspnet runtime, exposes 8080).

---

#### VPS deploy commands (what we actually use)

The repo on the VPS lives at **`~/arch`**. Two scripts in `scripts/`:

**Full deploy** (prod + dev containers + Nginx reload) — `scripts/deploy.sh`:

```bash
cd ~/arch
./scripts/deploy.sh
```

What it does step by step:
1. `docker compose -f ~/arch/docker-compose.yml up -d --build` — rebuild and start **both** `api` and `api-dev`
2. `sudo cp ~/arch/nginx/arch.conf /etc/nginx/conf.d/arch.conf`
3. `sudo nginx -t && sudo systemctl reload nginx`
4. Prints container status and test URLs

**Deploy only the dev container** — `scripts/dev.sh`:

```bash
cd ~/arch
./scripts/dev.sh
```

What it does:
1. `docker compose up -d --build api-dev` — rebuild and start **only** `arch-api-dev`
2. Prints status and test URL

**Manual commands** (equivalent to what the scripts run):

```bash
cd ~/arch

# Start / rebuild everything
docker compose up -d --build

# Start / rebuild prod only
docker compose up -d --build api

# Start / rebuild dev only
docker compose up -d --build api-dev

# View logs
docker compose logs -f api          # production
docker compose logs -f api-dev      # development

# Stop
docker compose stop api
docker compose stop api-dev

# Container status
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

**Verify after deploy** (from `deploy.sh`):

```bash
# On the VPS (local port)
curl -i http://127.0.0.1:5000/api/_health

# Public HTTPS
curl -i https://api.arch-api.co.uk/api/_health
curl -i https://api.arch-api.co.uk/api-dev/_health   # dev container via nginx
```

**Apply EF migrations on prod** (after deploy, coordinate with team):

```bash
cd ~/arch/ArchAPI
ASPNETCORE_ENVIRONMENT=Production dotnet ef database update --context AppDbContext
```

Or exec into the running container if .NET SDK is not installed on the host.

---

#### Docker on your local machine (optional)

Same `docker-compose.yml` works locally to mimic the VPS setup:

```bash
cd Arch-Oxford-backend

docker compose up -d --build api       # prod config → localhost:5000
docker compose up -d --build api-dev   # dev config  → localhost:5012

curl http://127.0.0.1:5000/api/_health
curl http://127.0.0.1:5012/api/_health
```

This is **not** the normal local workflow — most developers use `dotnet run` on port **5011** instead.

---

### AWS — RDS (PostgreSQL)

Both databases run on **Amazon RDS** in **`eu-west-2` (London)**. They are separate RDS instances (or endpoints) with different database names and credentials — **never mix them up**.

#### Dev vs Prod at a glance

| | **Development (shared)** | **Production** |
|---|---|---|
| **Purpose** | Day-to-day dev, migrations, QA against dev API | Live users, App Store builds, admin panel in prod |
| **ASP.NET env** | `Development` | `Production` (default) |
| **Config file** | `appsettings.Development.json` | `appsettings.json` |
| **RDS host** | `archdev.cbawme0m4p8x.eu-west-2.rds.amazonaws.com` | `arch.cbawme0m4p8x.eu-west-2.rds.amazonaws.com` |
| **Database name** | `archdev` | `arch` |
| **DB user** | `archdev` | `postgres` |
| **Port** | `5432` | `5432` |
| **API URL** | `https://api.arch-api.co.uk/api-dev` (remote) or `http://localhost:5011` (local) | `https://api.arch-api.co.uk/api` |
| **Used by** | `dotnet run` (5011), VPS `arch-api-dev` (5012), EAS dev/preview builds, admin dev | VPS `arch-api` (5000), EAS production builds, admin prod |

#### Which clients talk to which database

```
Mobile (EAS development/preview)  ──►  /api-dev  ──►  VPS :5012 (arch-api-dev) ──►  archdev
Mobile (EAS production)           ──►  /api      ──►  VPS :5000 (arch-api)      ──►  arch
Admin panel (npm run dev)         ──►  /api-dev  ──►  VPS :5012                 ──►  archdev
Admin panel (dist/ on VPS)        ──►  /api      ──►  VPS :5000                 ──►  arch
dotnet run on your PC (port 5011) ──►  localhost ──►  archdev (direct RDS)
```

You do **not** need PostgreSQL installed locally — `dotnet run` with `Development` connects straight to the shared **archdev** RDS.

#### Development2 (optional — personal isolated database)

Documented in `ENTORNOS.md`. For developers who need their **own** RDS instance (risky migrations, schema experiments). Requires creating `appsettings.Development2.json` (not in the repo). Uses `ASPNETCORE_ENVIRONMENT=Development2`.

⚠️ Do not confuse with VPS port **5012** — that is the shared **`arch-api-dev`** Docker container (`Development` env), not Development2.

#### Connecting with DBeaver (or any PostgreSQL client)

Use **two separate connections** — one for dev, one for prod. Both use **PostgreSQL**, port **5432**, authentication **Database Native**.

**Development (`archdev`):**

| Field | Value |
|---|---|
| Host | `archdev.cbawme0m4p8x.eu-west-2.rds.amazonaws.com` |
| Port | `5432` |
| Database | `archdev` |
| Username | `archdev` |
| Password | From `appsettings.Development.json` → `ConnectionStrings:Default` |
| JDBC URL | `jdbc:postgresql://archdev.cbawme0m4p8x.eu-west-2.rds.amazonaws.com:5432/archdev` |

**Production (`arch`):**

| Field | Value |
|---|---|
| Host | `arch.cbawme0m4p8x.eu-west-2.rds.amazonaws.com` |
| Port | `5432` |
| Database | `arch` |
| Username | `postgres` |
| Password | From `appsettings.json` → `ConnectionStrings:Default` |
| JDBC URL | `jdbc:postgresql://arch.cbawme0m4p8x.eu-west-2.rds.amazonaws.com:5432/arch` |

**DBeaver steps:**

1. **Database** → **New Database Connection** → **PostgreSQL**.
2. On the **General** tab, enter Host, Port, Database, Username, and Password as above.
3. **Test Connection** — if it fails, check your IP is allowed in the RDS security group (AWS console) or use a VPN if the team requires it.
4. Name the connection clearly, e.g. `Arch DEV (archdev)` and `Arch PROD (arch)` — colour-code prod red if your client supports it.
5. **Read-only on prod** unless you are doing a planned maintenance — prefer inspecting data via dev and applying changes through migrations.

> ⚠️ The hostnames are similar (`archdev.*` vs `arch.*`) — double-check the connection name before running any query or script.

#### Migrations — which database do they hit?

See [Entity Framework Core & migrations](#entity-framework-core--migrations) for the full workflow and commands.

| Command context | Database affected |
|---|---|
| `ASPNETCORE_ENVIRONMENT=Development` + `dotnet ef database update` | **archdev** (shared dev) |
| `ASPNETCORE_ENVIRONMENT=Development2` + `dotnet ef database update` | Your personal DB only |
| `ASPNETCORE_ENVIRONMENT=Production` + `dotnet ef database update` | **arch (PROD)** — ⚠️ avoid unless doing a planned release |

**Rule:** Always create and test migrations on **archdev** first. Coordinate with the team before applying anything to **arch (prod)**.

#### Verifying which database you are connected to

When the API starts, check the logs for the RDS hostname, or hit:

```powershell
curl http://localhost:5011/api/_health/db
# Response includes "provider": "Npgsql.EntityFrameworkCore.PostgreSQL"
```

Before running migrations, confirm the environment variable:

```powershell
echo $env:ASPNETCORE_ENVIRONMENT   # should be "Development", not "Production"
```

**Connection string key:** `ConnectionStrings:Default` in the active `appsettings` file for your environment.

---

### AWS — S3 (two buckets)

Both buckets are in **`eu-west-2`**. Names are configured via `AWS:S3:PublicBucket` and `AWS:S3:PrivateBucket` in `appsettings.json`.

| Bucket | Config key | Access | Used for |
|---|---|---|---|
| **Public** | `AWS:S3:PublicBucket` | Direct HTTPS URLs | Event images (`events/`), job images (`jobs/`), dating profile photos, general profile pictures |
| **Private** | `AWS:S3:PrivateBucket` | Pre-signed URLs (time-limited) | Chat images & voice messages (`chat/{matchId}/`), alumni verification documents |

**Which service uses which bucket:**

| Service class | Bucket |
|---|---|
| `S3Service`, `ImageService`, `DatingPhotoS3Service` | Public |
| `ChatMediaS3Service`, `AlumniDocumentS3Service` | Private |

Private bucket files are never publicly listed — the API generates pre-signed URLs (typically 7-day expiry for chat media) when the client requests them.

**AWS Rekognition** (same AWS account) moderates dating profile photos uploaded via `DatingPhotoS3Service`.

---

### Other external services

| Service | Used by | Purpose |
|---|---|---|
| **Stripe** | Mobile + API | Event ticket payments, superlike purchases |
| **LiveKit Cloud** | Mobile + API | Audio/video calls (`wss://*.livekit.cloud`) |
| **Expo Push** | API → Mobile | Push notifications via `exp.host` |
| **Sentry** | Mobile + API | Error tracking (see below) |
| **Apple IAP** | Mobile + API | Subscriptions and consumables |
| **PassKit / Passcreator** | API | Apple Wallet event tickets |
| **Google Calendar** | API + Mobile | Event calendar sync |

---

## Sentry — Error Monitoring

Sentry is configured on **both** the mobile app and the backend API. Dashboard: [sentry.io](https://sentry.io) — organisation **`arch-4a`**.

### Mobile app (React Native)

| Item | Detail |
|---|---|
| **Package** | `@sentry/react-native` (~7.2) |
| **Expo plugin** | `@sentry/react-native/expo` in `app.json` — org `arch-4a`, project `arch-mobile` |
| **Init file** | `service/monitoring/sentry.ts` |
| **Called from** | `app/_layout.tsx` → `initSentry()` before first render |
| **DSN env var** | `EXPO_PUBLIC_SENTRY_DSN` (in `.env.production` / EAS build env) |
| **Metro config** | `metro.config.js` uses `getSentryExpoConfig()` for source map upload |
| **User context** | `setSentryUser()` called on login/logout in `_layout.tsx` |
| **Release tag** | `arch-mobile@{version}` from `app.json` |
| **Sample rates** | 100% traces in production (reduce to 0.2–0.5 when traffic grows); 0% in dev |
| **Session Replay** | 10% of sessions, 100% of error sessions |
| **Filtered errors** | 401 / "Token expired" events are dropped in `beforeSend` |

If `EXPO_PUBLIC_SENTRY_DSN` is missing, Sentry silently skips initialisation — the app still runs.

### Backend (ASP.NET Core)

| Item | Detail |
|---|---|
| **Package** | `Sentry.AspNetCore` (6.x) |
| **Config** | `Program.cs` → `builder.WebHost.UseSentry(...)` |
| **DSN key** | `Sentry:Dsn` in `appsettings.json` (fallback hardcoded in `Program.cs`) |
| **Middleware** | `app.UseSentryTracing()` — before controllers/hubs |
| **Filtered headers** | `Authorization`, `Cookie`, `X-Api-Key` stripped before send |
| **Sample rate** | `TracesSampleRate = 1.0` (100% — reduce in high-traffic prod) |

Performance fixes related to Sentry reports are documented in `Arch-Oxford-backend/CORRECCIONES_SENTRY.md` (N+1 queries, DbContext in background tasks, SignalR hub exceptions).

### Frontend HTTP errors

`service/apiClient.ts` also reports unexpected API failures to Sentry via `@sentry/react-native`.

---

## Mobile App — Local Development

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 20+ | Required by Expo 54 |
| **npm** | Latest | Package manager |
| **Expo CLI / EAS CLI** | Latest | `npm install -g eas-cli` for builds |
| **Android Studio** | Latest | For Android emulator and SDK |
| **Xcode** | 15+ | macOS only — for iOS Simulator |
| **Custom dev client** | — | Required for push notifications, IAP, LiveKit, and biometrics (Expo Go is insufficient) |

### First-time setup

```powershell
cd Arch-Oxford-fronted\Arch
npm install

# Copy and edit environment file
copy .env.example .env.development
```

**`.env.development`** (adjust to your setup):

```env
# Backend running locally on port 5011
EXPO_PUBLIC_API_BASE_URL=http://localhost:5011

# Android emulator — use 10.0.2.2 instead of localhost:
# EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5011

# Physical device on same Wi-Fi — use your machine's LAN IP:
# EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:5011

# Optional: Sentry (leave blank to disable in dev)
# EXPO_PUBLIC_SENTRY_DSN=https://...@....ingest.de.sentry.io/...
```

### Running with Android Studio (emulator)

1. Open **Android Studio** → **Device Manager** → create/start an AVD (Pixel, API 34+).
2. Ensure the backend is running (see [Backend local setup](#backend--local-setup)).
3. Start the app:

```powershell
cd Arch-Oxford-fronted\Arch

# Option A — Expo dev client (recommended)
npm run start:devclient
# Then press "a" in the terminal to open on Android

# Option B — direct Android launch
npm run android:dev
```

4. If the app cannot reach the API, switch `EXPO_PUBLIC_API_BASE_URL` to `http://10.0.2.2:5011` (Android emulator alias for host `localhost`).

### Running on iOS Simulator (macOS only)

```bash
cd Arch-Oxford-fronted/Arch
npm run start:devclient
# Press "i" to open iOS Simulator
# Use EXPO_PUBLIC_API_BASE_URL=http://localhost:5011
```

### Running on a physical device

1. Build and install a **development client** first (see [EAS builds](#mobile-app--eas-builds--app-store) — `development` profile).
2. Connect phone and PC to the same Wi-Fi.
3. Set `EXPO_PUBLIC_API_BASE_URL=http://<your-pc-lan-ip>:5011`.
4. Run `npm run start:devclient` and scan the QR code with the dev client app.

### Useful npm scripts

| Command | Purpose |
|---|---|
| `npm start` | Expo Go (limited — missing native modules) |
| `npm run start:devclient` | Dev client with hot reload |
| `npm run start:devclient:clear` | Same, clearing Metro cache |
| `npm run android:dev` | Start + open Android directly |
| `npm run ios:dev` | Start + open iOS Simulator |
| `npm run lint` | ESLint |

---

## Mobile App — EAS Builds & App Store

Builds are managed with **EAS Build** (Expo Application Services). Config: `Arch/eas.json`. EAS project ID: `78a59dc3-232e-4f15-ac93-2ec4c5bdae2b` (in `app.json`).

### Prerequisites

```powershell
npm install -g eas-cli
eas login                    # Expo account with access to the Arch project
```

You also need access to the **Apple Developer** account (`com.nebulasx.arch`) and **App Store Connect**.

### Build profiles (`eas.json`)

| Profile | API URL | Distribution | Use case |
|---|---|---|---|
| `development` | `api-dev` | Internal (dev client) | Daily dev with native modules |
| `preview` | `api-dev` | Internal | QA / TestFlight internal testing |
| `production` | `/api` (prod) | App Store | Live release |

All profiles set `SENTRY_ALLOW_FAILURE=true` so a Sentry upload error does not fail the build.

### Building

```powershell
cd Arch-Oxford-fronted\Arch

# Development client (install once per native dependency change)
eas build --profile development --platform ios
eas build --profile development --platform android

# QA / internal testing
eas build --profile preview --platform ios

# Production release
eas build --profile production --platform ios
eas build --profile production --platform android
```

Builds run on Expo's cloud servers. Monitor progress at [expo.dev](https://expo.dev) or in the terminal.

`production` profile has `"autoIncrement": true` — EAS bumps `buildNumber` (iOS) automatically.

### Submitting to App Store Connect (iOS)

After a successful **production** iOS build:

```powershell
# Submit the latest production build to App Store Connect
eas submit --platform ios --profile production
```

EAS uploads the `.ipa` to App Store Connect. You will need:
- Apple ID with App Store Connect access
- App-specific password or App Store Connect API key (EAS prompts on first run)

**Typical release flow:**

1. Update `version` in `app.json` if needed (currently `1.3`, buildNumber managed by EAS).
2. `eas build --profile production --platform ios`
3. `eas submit --platform ios --profile production`
4. In **App Store Connect** → TestFlight for internal QA, then submit for App Review.
5. For Android: `eas build --profile production --platform android` → download AAB → upload to Google Play Console manually or via `eas submit --platform android`.

### Environment variables in EAS builds

Production secrets (`EXPO_PUBLIC_API_BASE_URL`, Stripe publishable key, Sentry DSN) are set in `eas.json` under each profile's `env` block. For sensitive values not in `eas.json`, use EAS Secrets:

```powershell
eas secret:create --name EXPO_PUBLIC_SENTRY_DSN --value "https://..." --scope project
```

---

## Backend — Local Setup

### Prerequisites

| Tool | Version |
|---|---|
| **.NET SDK** | 9.0 |
| **EF Core CLI** | `dotnet tool install --global dotnet-ef` |
| **Docker** (optional) | For containerised local run |

### Running the API locally

```powershell
cd Arch-Oxford-backend\ArchAPI

# Shared development database (port 5011)
$env:ASPNETCORE_ENVIRONMENT = "Development"
dotnet restore
dotnet run
```

Verify it works:

```powershell
curl http://localhost:5011/api/_health
curl http://localhost:5011/api/_health/db
```

SignalR hub: `ws://localhost:5011/hubs/chat?access_token=<JWT>`

### Environment options

| Environment | Command | Port | Database |
|---|---|---|---|
| **Development** (shared) | `$env:ASPNETCORE_ENVIRONMENT="Development"` | 5011 | **archdev** on `archdev.cbawme0m4p8x.eu-west-2.rds.amazonaws.com` |
| **Development2** (personal) | `$env:ASPNETCORE_ENVIRONMENT="Development2"` | 5012 | Your own RDS — create `appsettings.Development2.json` |
| **Production** (local test) | `$env:ASPNETCORE_ENVIRONMENT="Production"` | 5000 | **arch** on `arch.cbawme0m4p8x.eu-west-2.rds.amazonaws.com` — **avoid for daily dev** |

Full details: `Arch-Oxford-backend/ENTORNOS.md`.

### Entity Framework Core & migrations

The backend uses **Entity Framework Core 9** with the **Npgsql** provider to map C# classes to PostgreSQL tables. Schema changes are **never** applied by hand — EF generates migration files that version-control the database structure.

#### Key files

| Path | Role |
|---|---|
| `ArchAPI/Models/` | Entity classes (e.g. `User.cs`, `Match.cs`, `CallLog.cs`) — one class ≈ one table |
| `ArchAPI/Data/AppDbContext.cs` | DbContext — registers all entities as `DbSet<T>` and holds relationship/index configuration in `OnModelCreating` |
| `ArchAPI/Migrations/` | Auto-generated migration files — **commit these to Git** |
| `ArchAPI/Migrations/AppDbContextModelSnapshot.cs` | Current schema snapshot — updated on every `migrations add` |

When you add or change an entity, EF compares your models against the snapshot and generates SQL (`Up` / `Down` methods) to bring the database in line.

#### One-time CLI setup

Install the EF Core global tool (once per machine):

```powershell
dotnet tool install --global dotnet-ef

# Verify installation
dotnet ef --version

# Upgrade if already installed
dotnet tool update --global dotnet-ef
```

The project already references `Microsoft.EntityFrameworkCore.Design` in `ArchBackend.csproj` — required for the CLI to work.

---

#### Workflow: changing entities

Typical flow when you add a column, new table, or relationship:

```
1. Edit entity in Models/          (and/or AppDbContext.OnModelCreating)
2. dotnet ef migrations add …      → generates files in Migrations/
3. Review the generated migration  → check Up()/Down() SQL looks correct
4. dotnet ef database update       → applies to archdev (DEV)
5. Test the API locally
6. Commit Models/ + Migrations/ to Git
7. Deploy API + run database update on prod (planned release only)
```

**Example — adding a new field to an existing entity:**

```powershell
# 1. Edit ArchAPI/Models/CallLog.cs (add property)
# 2. If needed, update AppDbContext.OnModelCreating for indexes/constraints

$env:ASPNETCORE_ENVIRONMENT = "Development"
cd Arch-Oxford-backend\ArchAPI

# 3. Generate migration (use a descriptive PascalCase name)
dotnet ef migrations add AddDurationToCallLogs --context AppDbContext

# 4. Inspect ArchAPI/Migrations/<timestamp>_AddDurationToCallLogs.cs

# 5. Apply to dev database (archdev)
dotnet ef database update --context AppDbContext
```

**Example — adding a brand-new entity:**

```powershell
# 1. Create ArchAPI/Models/MyNewEntity.cs
# 2. Add DbSet<MyNewEntity> in AppDbContext.cs
# 3. Configure relationships in OnModelCreating if needed

$env:ASPNETCORE_ENVIRONMENT = "Development"
cd Arch-Oxford-backend\ArchAPI

dotnet ef migrations add AddMyNewEntityTable --context AppDbContext
dotnet ef database update --context AppDbContext
```

---

#### EF CLI commands reference

Always run from `Arch-Oxford-backend/ArchAPI/` with the correct `ASPNETCORE_ENVIRONMENT` set.

| Command | Purpose |
|---|---|
| `dotnet ef migrations add <Name> --context AppDbContext` | Generate a new migration from entity changes |
| `dotnet ef database update --context AppDbContext` | Apply all pending migrations to the target database |
| `dotnet ef database update <MigrationName> --context AppDbContext` | Migrate up to a specific migration (or roll back to it) |
| `dotnet ef migrations list --context AppDbContext` | Show applied vs pending migrations |
| `dotnet ef migrations remove --context AppDbContext` | Delete the **last** migration (only if not yet applied to any shared DB) |
| `dotnet ef migrations script --context AppDbContext` | Print SQL for all pending migrations (review before prod) |
| `dotnet ef migrations script FromMigration ToMigration --context AppDbContext` | SQL between two specific migrations |

**PowerShell — apply all pending migrations to dev:**

```powershell
$env:ASPNETCORE_ENVIRONMENT = "Development"
cd Arch-Oxford-backend\ArchAPI
dotnet ef database update --context AppDbContext
```

**PowerShell — roll back dev to a previous migration:**

```powershell
$env:ASPNETCORE_ENVIRONMENT = "Development"
cd Arch-Oxford-backend\ArchAPI
dotnet ef database update 20260212085508_AddCallLogs --context AppDbContext
```

**Bash (macOS/Linux):**

```bash
export ASPNETCORE_ENVIRONMENT=Development
cd Arch-Oxford-backend/ArchAPI
dotnet ef migrations add YourMigrationName --context AppDbContext
dotnet ef database update --context AppDbContext
```

---

#### Naming conventions

- Migration names: **PascalCase**, descriptive verb + noun — e.g. `AddCallLogs`, `AddVoiceMessageFields`, `MakeJobOrganizationIdNullable`.
- EF prefixes files with a timestamp: `20260212085508_AddCallLogs.cs`.
- One logical change per migration when possible — easier to review and roll back.

---

#### What to commit

After `migrations add`, commit **all** of these together with your entity changes:

```
ArchAPI/Models/…                          (modified or new entity)
ArchAPI/Data/AppDbContext.cs              (if DbSet or config changed)
ArchAPI/Migrations/<timestamp>_<Name>.cs
ArchAPI/Migrations/<timestamp>_<Name>.Designer.cs
ArchAPI/Migrations/AppDbContextModelSnapshot.cs
```

Never edit applied migrations that other developers have already run — create a new migration instead.

---

#### Dev vs prod: when migrations run

| Environment | When to run | Database |
|---|---|---|
| **Development** | Every time you change entities | **archdev** |
| **Development2** | Personal isolated testing | Your own RDS |
| **Production** | Only during a planned release, after dev testing | **arch** |

**Applying to production** (on the VPS at `~/arch`, after `./scripts/deploy.sh`, coordinate with team):

```bash
cd ~/arch/ArchAPI
ASPNETCORE_ENVIRONMENT=Production dotnet ef database update --context AppDbContext
```

Or run the equivalent inside the running `arch-api` container if the SDK is not on the host. Optionally generate SQL first for review:

```powershell
dotnet ef migrations script --context AppDbContext --idempotent -o migration.sql
```

---

#### Rules & troubleshooting

| Situation | What to do |
|---|---|
| Migration not yet applied anywhere | `dotnet ef migrations remove` to undo the last one |
| Migration already applied to **archdev** | Do **not** remove — add a new migration to fix forward |
| `dotnet ef` not found | Run `dotnet tool install --global dotnet-ef` |
| Wrong database targeted | Check `$env:ASPNETCORE_ENVIRONMENT` before every command |
| Empty migration generated | EF detected no model changes — verify you saved entity files and registered `DbSet` |
| Merge conflict in snapshot | Resolve carefully or regenerate after syncing with main |

**Golden rule:** create and test on **archdev** first. Never run `database update` against **arch (prod)** unless it is a coordinated release.

Background seed services (locations, subjects) run automatically on API startup and are separate from EF migrations.

> **Docker locally or on VPS:** see [Hostinger VPS — ports, Docker & Nginx](#hostinger-vps--ports-docker--nginx) above for the real `docker compose` commands and port map.

### Pointing the mobile app at your local backend

| Client | `EXPO_PUBLIC_API_BASE_URL` |
|---|---|
| iOS Simulator / web | `http://localhost:5011` |
| Android emulator | `http://10.0.2.2:5011` |
| Physical device | `http://<your-lan-ip>:5011` |

Ensure Windows Firewall allows inbound connections on port 5011 if testing from a physical device.

---

## Admin Dashboard (`Dashboard-Arch`)

The admin panel is a **Vue 3 + TypeScript + Vite** SPA located at `WEBs/Dashboard-Arch/arch-web/`. It is served as static files from the Hostinger VPS at **`https://arch-api.co.uk`**.

### Stack

| Technology | Role |
|---|---|
| **Vue 3** + **TypeScript** | UI framework |
| **Vite 7** | Dev server and production bundler |
| **Pinia** | Auth state (JWT in `localStorage`) |
| **Vue Router** | Routes with role-based guards |
| **Naive UI** + **Tailwind CSS** | Components and styling |
| **fetch** (`src/services/Api.ts`) | HTTP client to the backend API |

### Key screens

| Route | Purpose | Roles |
|---|---|---|
| `/login` | Admin/staff login | Public |
| `/admin/events` | Event CRUD + calendar | Admin, moderator |
| `/admin/users` | User management | Admin |
| `/admin/alumni/verification` | Alumni document review | Admin |
| `/admin/staff/verification` | Staff registration approval | Admin |
| `/admin/reports` | User/message reports | Admin |
| `/admin/organizations` | Organisation management | Admin, org members |
| `/admin/jobs` | Job listings | Admin, org members |
| `/admin/staff/events` | Staff event management | Verified staff |

### Running locally

```powershell
cd WEBs\Dashboard-Arch\arch-web
npm install
npm run dev        # http://localhost:5173
```

**Environment:** create `.env.local` to override the API URL:

```env
# Point at local backend
VITE_API_BASE_URL=http://localhost:5011

# Or use the shared dev API (default in .env.development):
# VITE_API_BASE_URL=https://api.arch-api.co.uk/api-dev
```

Vite proxies `/api-dev` to the remote API in development to avoid CORS issues (`vite.config.js`).

### Building & deploying to the VPS

```powershell
cd WEBs\Dashboard-Arch\arch-web
npm run build      # outputs to dist/
```

Production env (`.env.production`):

```env
VITE_API_BASE_URL=https://api.arch-api.co.uk
```

Deploy: copy the contents of `dist/` to the web root for **`arch-api.co.uk`** on the VPS. The exact path and Nginx/Apache vhost for that domain are configured on the server — not stored in this repo. The repo includes `public/.htaccess` for SPA routing if Apache is used.

See also `arch-web/PRODUCCION.md`.

---

## End-to-End Local Dev Checklist

Quick start for a new developer on Windows:

```powershell
# 1. Backend
cd Arch-Oxford-backend\ArchAPI
$env:ASPNETCORE_ENVIRONMENT = "Development"
dotnet run
# ✓ API at http://localhost:5011

# 2. Mobile app (new terminal)
cd Arch-Oxford-fronted\Arch
# Edit .env.development → EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5011  (Android)
npm run start:devclient
# ✓ Press "a" for Android emulator or scan QR on physical device

# 3. Admin dashboard (optional, new terminal)
cd WEBs\Dashboard-Arch\arch-web
npm run dev
# ✓ Panel at http://localhost:5173
```

---

## Further Reading

| Document | Repository | Purpose |
|---|---|---|
| `nginx/arch.conf` | Backend | Nginx reverse proxy config (VPS: `/etc/nginx/conf.d/arch.conf`) |
| `scripts/deploy.sh` | Backend | Full VPS deploy script |
| `scripts/dev.sh` | Backend | Deploy dev container only |
| `ENTORNOS.md` | Backend | Environment setup (note: some port info may differ from VPS Docker setup) |
| `README.md` | Mobile + Backend | Feature overview, install steps |
| `README.md` | `Dashboard-Arch/` | Admin panel setup and features |
| `PRODUCCION.md` | `Dashboard-Arch/arch-web/` | Admin panel production build |
| `LIVEKIT.md` | Backend | Audio/video call setup |
| `WATERMELONDB_IMPLEMENTATION_PLAN.md` | Mobile (`Arch/docs/`) | Chat offline cache plan |
| `SECURITY_AUDIT.md` | Mobile (`Arch/docs/`) | Security review notes |
| `CORRECCIONES_SENTRY.md` | Backend | Sentry-related performance fixes |

---

*Last updated: August 2026*
