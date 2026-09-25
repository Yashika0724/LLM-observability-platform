# Learnings

Notes on things learned while building the LLM Observability Platform — concepts, gotchas, decisions, and why.

## Backend

- **`app.js` vs `server.js` separation**: `app.js` builds the Express app (middleware + routes) and exports it; `server.js` connects to the DB and calls `.listen()`. Separates app configuration from app startup.
- **CORS**: `app.use(cors())` is required, otherwise the browser blocks the frontend from calling the API since it runs on a different origin/port.
- **`express.json()` middleware**: required to parse incoming JSON request bodies into `req.body`.
- **Connect-then-listen ordering**: `await mongoose.connect(...)` runs before `app.listen(...)` so the server can't accept a request before the DB connection is ready (avoids a race condition).
- **`.env` config**: environment-specific values (DB URI, port, secrets) are kept out of code and out of git; `.env.example` documents required variables without real values.
- **Mongoose schema constraints**: `unique: true` enforces uniqueness at the DB level; `enum` restricts a field to fixed values (used for `role: ["developer", "admin"]`, the basis for RBAC); `{ timestamps: true }` auto-adds `createdAt`/`updatedAt`.
- **Password hashing**: passwords are never stored as plain text. `bcrypt.hash(password, 10)` turns the password into a one-way hash before saving; the original can't be recovered from it. On login, the typed password is hashed the same way and compared to the stored hash with `bcrypt.compare()` — the plain password is never stored or compared directly.
- **JWT (JSON Web Token)**: after a successful signup/login, the server signs a token (`jwt.sign(payload, secret, { expiresIn })`) containing the user's id and role. The client stores this token and sends it on future requests instead of the password. The server verifies the token's signature using its secret to confirm the request is from an authenticated user, without needing a database lookup for a session.
- **JWT vs API key**: JWT authenticates a human user logging into the dashboard. An API key (separate, built later) authenticates an application sending telemetry — machine-to-machine, not a login.
- **Controller/route split**: route files (`authRoutes.js`) only map an HTTP method + path to a handler function; the actual logic lives in controller files (`authController.js`). Keeps routing and business logic separate.

## Frontend

## Evaluation Service

## OpenTelemetry / OpenLLMetry / Tracing

## Infra & Deployment

## General
