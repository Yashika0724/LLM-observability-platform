import os

from traceloop.sdk import Traceloop
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter


def init_telemetry():
    """
    Initialize OpenLLMetry ONCE when the server starts.

    After this runs, every call we make to the LLM is automatically
    wrapped in a "trace" (with a span holding the prompt, response,
    model name, token counts and latency) and shipped in the background
    to the observability backend. We never write that tracing code by
    hand -- OpenLLMetry does it silently.
    """
    traces_url = os.getenv(
        "OBSERVABILITY_TRACES_URL",
        "http://localhost:8000/v1/traces",
    )
    # API key that the observability backend requires to accept our traces.
    # Sent as the "x-api-key" header on every trace export.
    api_key = os.getenv("INGEST_API_KEY", "")

    exporter = OTLPSpanExporter(
        endpoint=traces_url,
        headers={"x-api-key": api_key},
    )

    Traceloop.init(
        app_name="reference-llm-app",
        exporter=exporter,
        # Batch mode: traces are sent in the background so a slow or offline
        # backend never blocks the user's request (important for bulk traffic).
        disable_batch=False,
    )
