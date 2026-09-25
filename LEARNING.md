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

## Reference LLM App (traffic generator)

- Built a small standalone app whose only job is to make real LLM calls so there are traces to observe. It is not the product — just a source of realistic traffic.
- Stack: Python + FastAPI backend with a single `POST /ask` endpoint, plus a simple static HTML chat page served by the same backend.
- Files: `reference-app/app/main.py` (the `/ask` endpoint + serves the page), `reference-app/app/llm.py` (the OpenRouter call), `reference-app/app/telemetry.py` (turns on tracing), `reference-app/app/static/index.html` (the chat box).
- Calls the LLM through **OpenRouter** using the OpenAI client, just pointed at OpenRouter's URL — same code, different base_url. This gives access to many models (including free ones) with one key.
- Why the API key lives in `.env` on the server: so it is never sent to the browser and never committed to git (`.env` is git-ignored; `.env.example` documents the settings without the secret).
- Why the app returns the answer even if tracing fails: tracing runs in the background, so the user is never kept waiting on it. Seen live as `Connection refused` on port 8000 when the trace has nowhere to land — the chat still answers.
- A mock `user_id` dropdown gives traces variety to filter by later, without building real auth.
- Gotcha: free OpenRouter models get rate-limited (429) or retired often; `openrouter/free` auto-routes to whatever free model is available, which is more reliable for a demo.
- Gotcha: `httpx` had to be added to `requirements.txt` explicitly — it wasn't pulled in automatically.

## OpenTelemetry / OpenLLMetry / Tracing

- A **trace** = the record of one LLM call: the prompt, the response, the model, token counts, and how long it took. It's how you "observe" what the AI did.
- **OpenLLMetry** (the `traceloop-sdk` package) is built on **OpenTelemetry** but specialized for LLM calls.
- Key idea: call `Traceloop.init()` **once** at server startup and it hooks into the OpenAI/OpenRouter client automatically — after that, every LLM call produces a trace with no extra code in the request handler. The "make the call" code and the "watch the call" code stay separate.
- Traces are exported using **OTLP** (the standard telemetry format) over HTTP to `OBSERVABILITY_TRACES_URL` (default `http://localhost:8000/v1/traces`). This one setting is where the traces are sent.
- `disable_batch=True` sends each trace immediately instead of buffering — handy for local dev so traces appear right away.
- `Traceloop.set_association_properties({"user_id": ...})` tags a trace with the user, so traces can be filtered by user later.
- Order matters in `main.py`: load `.env` → `init_telemetry()` → then start the app, because tracing must be switched on before the first LLM call or that call won't be traced.

## Infra & Deployment

## General
