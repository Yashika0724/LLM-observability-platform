# LLM Observability Platform

Full-stack LLM Observability Platform for tracing, evaluation, cost and performance monitoring.

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

Create an application on the Applications page to get an API key. Then send OTLP traces to `http://localhost:8000/v1/traces` with the header `x-api-key: <your key>`.
