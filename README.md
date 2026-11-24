# LLM Observability Platform

See what your LLM application is really doing: every request's steps, latency, token usage, cost, errors and answer quality, all in one dashboard.

**Live demo:** https://llm-obs-frontend.onrender.com

It runs on Render's free plan, so the first visit after a quiet period can take about a minute while the services wake up.

<!--
## Screenshots
Add images to docs/screenshots/ and uncomment:
![Dashboard](docs/screenshots/dashboard.png)
![Trace waterfall](docs/screenshots/trace-detail.png)
![Evaluations](docs/screenshots/evaluations.png)
-->

## Why

When an app calls an LLM, you usually only see the final answer. You don't see how long each step took, how many tokens it used, what it cost, why it failed, or whether the answer was any good. This platform collects that information from any OpenTelemetry-instrumented LLM app and shows it in a dashboard.

## How it works

1. Register your application on the platform and get an **API key**.
2. Your LLM app, instrumented with **OpenLLMetry** (OpenTelemetry), sends **traces** to the backend in the standard OTLP format. A trace is one full request, and each **span** inside it is one step, such as retrieval or an LLM call.
3. The **backend** checks the API key, decodes the traces, works out token usage and **cost**, and saves everything to **MongoDB**.
4. The backend puts the trace on a **Redis queue** without waiting for it, so ingestion stays fast.
5. The **evaluation service** picks up the trace and uses **LLM-as-a-judge** (a second LLM grades the answer) to give it a **quality score from 1 to 5**, with a short reason.
6. The **dashboard** shows traces, timelines, cost, latency, models and quality trends.

```
 LLM app (OpenLLMetry)
        │  OTLP protobuf + x-api-key
        ▼
 Backend (Node.js / Express) ───────► MongoDB ◄────────┐
        │  push trace ID                 ▲             │ score + rationale
        ▼                                │ REST API    │
   Redis queue ──► Evaluation service ───┼─────────────┘
                   (FastAPI, LLM judge)  │
                                         │
                    Dashboard (React) ───┘  via backend, JWT auth
```

More detail: [docs/architecture.md](docs/architecture.md)

## Features

**Tracing and cost**
- Accepts standard **OTLP / OpenTelemetry** traces, so it isn't tied to one LLM provider or SDK
- Groups spans into traces and records total duration, status and errors (one failed span marks the whole trace as failed)
- Pulls out the model, the question, the answer and token counts
- Estimates **cost in USD** from a per-model price table. Free models cost $0, and a model with an unknown price shows as *unknown* instead of a misleading $0.

**Quality evaluation**
- Runs in the background through a Redis queue, so it never slows down ingestion
- LLM-as-a-judge gives each answer a 1–5 score with a short rationale

**Dashboard**
- **Dashboard:** total traces, average latency, total tokens, estimated cost, per-model usage, and a cost and quality trend chart
- **Traces:** paginated list with search and filters by status and model, plus **CSV export**
- **Trace detail:** **waterfall timeline** of every span (for example, retrieval 300 ms then the LLM call 1.2 s), with the input, output, tokens, cost and score
- **Evaluations:** score distribution and recently scored answers
- **Applications:** create applications and generate API keys
- **Admin:** platform-wide stats and user role management (admins only)

**Security**
- JWT login, with passwords hashed using bcrypt
- **Role-based access control** with two roles, `developer` and `admin`
- **API keys** for each application. Only a SHA-256 hash is stored, and the raw key is shown once.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Chart.js, React Router |
| Backend | Node.js, Express, Mongoose, protobufjs, JWT, bcrypt |
| Evaluation service | Python, FastAPI, OpenRouter (LLM judge) |
| Reference app | Python, FastAPI, ChromaDB (vector DB), OpenRouter |
| Database | MongoDB (MongoDB Atlas when deployed) |
| Queue | Redis |
| Telemetry | OpenTelemetry / OpenLLMetry (OTLP over HTTP) |
| Deployment | Docker Compose, Render |

## Project structure

```
backend/             Express API: auth, applications, trace ingestion, analytics
evaluation-service/  FastAPI worker that scores answers with an LLM judge
frontend/            React dashboard
reference-app/       Demo RAG app that sends real traces to the platform
docs/                Architecture notes
docker-compose.yml   Runs everything locally
render.yaml          Render deployment blueprint
```

## Services

| Service | Tech | Port |
| --- | --- | --- |
| frontend | React + Vite + Tailwind | 5173 |
| backend | Node.js + Express | 8000 |
| evaluation-service | Python + FastAPI | 8001 |
| mongo | MongoDB | internal only |
| redis | Redis (evaluation job queue) | internal only |

## Run with Docker Compose

1. Create the env files from the examples and fill in the values:

   ```bash
   cp backend/.env.example backend/.env
   cp evaluation-service/.env.example evaluation-service/.env
   ```

   - `backend/.env`: set `JWT_SECRET` to any long random string.
   - `evaluation-service/.env`: set `OPENROUTER_API_KEY`.
   - You can leave `MONGODB_URI` and `REDIS_URL` as they are, because Docker Compose replaces them with the container addresses.

2. Start everything:

   ```bash
   docker compose up --build
   ```

3. Open http://localhost:5173 and create an account.

4. (Optional) Make yourself an admin so you can see the Admin page, then log out and log back in:

   ```bash
   docker compose exec backend npm run make-admin -- you@example.com
   ```

To stop, run `docker compose down`. Your data stays in the `mongo-data` volume. Run `docker compose down -v` to delete it as well.

## Run without Docker

You need MongoDB and Redis running locally on their default ports.

```bash
# backend
cd backend && npm install && npm run dev

# evaluation-service
cd evaluation-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8001

# frontend
cd frontend && npm install && npm run dev
```

## Sending traces

1. Log in and create an application on the **Applications** page. Copy the API key; it is shown only once.
2. Send OTLP traces (HTTP, protobuf) to `<backend URL>/v1/traces` with the header `x-api-key: <your key>`. Locally, that's `http://localhost:8000/v1/traces`.

With OpenLLMetry in a Python app:

```python
from traceloop.sdk import Traceloop
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

Traceloop.init(
    app_name="my-llm-app",
    exporter=OTLPSpanExporter(
        endpoint="http://localhost:8000/v1/traces",
        headers={"x-api-key": "obs_..."},
    ),
)
```

After that, every LLM call your app makes is traced automatically.

## Reference app

`reference-app/` is a real LLM application built to show the platform working end to end. It is a **RAG (Retrieval-Augmented Generation)** question-answering app. Instead of answering from memory alone, the model first looks up relevant facts and answers using them.

How it answers a question:
1. **Knowledge base:** at startup, documents built from the WikiQA dataset (`data/knowledge_base.json`) are loaded into **ChromaDB**, an in-memory vector database that searches by meaning.
2. **Retrieve:** the 3 documents most relevant to the question are fetched. This step is traced as its own span, `retrieve_documents`.
3. **Generate:** the question and the retrieved documents go to an LLM through **OpenRouter**, which answers using that context.
4. **Trace:** **OpenLLMetry** records both steps automatically and sends them to the platform's `/v1/traces` endpoint with the app's API key. Trace export runs in the background, so a slow or offline backend never delays the user's answer.

It has a simple chat page (`app/static/index.html`) with a **View Dashboard** link to the live platform, and a script (`scripts/send_traffic.py`) that sends real WikiQA questions from a few mock users, so the dashboard fills with varied traces. The chat page keeps a per-user **history** saved on the server (`data/history.json`, via a `GET /history/{user_id}` endpoint), so it persists across restarts and browsers.

**Tech:** Python, FastAPI, ChromaDB, OpenRouter, OpenLLMetry (traceloop-sdk)

### Run it

```bash
cd reference-app
cp .env.example .env   # set OPENROUTER_API_KEY and INGEST_API_KEY (your platform API key)
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 9000

# in another terminal: send a batch of real questions
python scripts/send_traffic.py 20
```

## API overview

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/signup`, `/api/auth/login` | – | Create an account or log in |
| GET | `/api/auth/me` | JWT | Current user |
| GET, POST | `/api/applications` | JWT | List or create applications and API keys |
| POST | `/v1/traces` | API key | OTLP trace ingestion |
| GET | `/api/traces` | JWT | Trace list (pagination, search, filters) |
| GET | `/api/traces/:traceId` | JWT | One trace with all its spans |
| GET | `/api/traces/stats` | JWT | Usage per model |
| GET | `/api/traces/evaluations` | JWT | Quality score distribution |
| GET | `/api/traces/trends` | JWT | Daily cost and quality |
| GET | `/api/traces/export` | JWT | Download traces as CSV |
| GET | `/api/admin/stats`, `/api/admin/users` | JWT (admin) | Platform stats and users |
| PATCH | `/api/admin/users/:id/role` | JWT (admin) | Change a user's role |

## Deploy online (Render + MongoDB Atlas)

`render.yaml` describes the whole platform for Render: backend, evaluation-service, frontend and a Redis instance. Everything uses free plans.

1. **MongoDB Atlas:** create a free M0 cluster and a database user. Under Network Access, allow `0.0.0.0/0`, because Render's IP addresses change. Copy the connection string and add the database name before the `?`:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/llm-observability?retryWrites=true&w=majority`
2. **Render:** go to New → Blueprint, connect this GitHub repo and fill in the values it asks for:
   - `MONGODB_URI` (for both services): the Atlas string from step 1
   - `OPENROUTER_API_KEY` and `JUDGE_MODEL`: the same values as in `evaluation-service/.env`
   - `VITE_API_URL`: `https://llm-obs-backend.onrender.com`
3. When the deploy finishes, check the backend's real URL on its Render page. If it isn't the one you entered, update `VITE_API_URL` on the frontend service and redeploy the frontend.
4. Open the frontend's URL. That's the demo link.

Free Render services go to sleep after 15 minutes without traffic, and the first request then takes about a minute to wake them. Before a demo, open the backend and evaluation-service `/health` URLs once so both are awake.

## Design decisions

- **MongoDB:** different spans carry different attributes, so a flexible document schema fits better than fixed tables. Spans are stored inside their trace because they are always read together.
- **Redis queue for evaluation:** an LLM judge is slow, so scoring runs separately and ingestion never waits for it.
- **OTLP standard:** works with any OpenTelemetry-compatible app or LLM provider.
- **Hashed API keys:** if the database leaks, it holds no usable keys.
- **Unknown cost stays unknown:** honest numbers are better than a silent $0.

## Future work

Real-time trace updates, alerts on cost or latency thresholds, PDF reports, dark mode, organisations with multiple teams, more evaluation metrics (for example, faithfulness to retrieved context), and a dedicated analytics store for very high trace volumes.
