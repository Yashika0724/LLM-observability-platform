# LLM Observability Platform

Full-stack LLM Observability Platform for tracing, evaluation, cost and performance monitoring.

**Live demo:** https://llm-obs-frontend.onrender.com

It runs on Render's free plan, so the first visit after a quiet period can take about a minute while the services wake up.

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

## Sending traces

Create an application on the Applications page to get an API key. Then send OTLP traces to `<backend URL>/v1/traces` (`http://localhost:8000/v1/traces` when running locally) with the header `x-api-key: <your key>`.
