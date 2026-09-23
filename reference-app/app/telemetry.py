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

    Traceloop.init(
        app_name="reference-llm-app",
        exporter=OTLPSpanExporter(endpoint=traces_url),
        disable_batch=True,  # send each trace immediately (nice for local dev)
    )
