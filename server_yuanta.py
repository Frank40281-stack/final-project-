"""Alpha local development server (Yuanta Style Theme on Port 5504)."""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


HOST = "127.0.0.1"
PORT = 5504
UPSTREAM_ORIGIN = "http://35.229.146.232"
STOCK_PATH = re.compile(r"^/twstock-api/stocks/([0-9A-Za-z.-]+)/daily/?$")


class AlphaYuantaRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def do_GET(self) -> None:
        url_path = urlsplit(self.path).path
        if url_path in ("/", "/index.html"):
            self.path = "/index_yuanta.html"

        match = STOCK_PATH.fullmatch(url_path)
        if not match:
            super().do_GET()
            return

        symbol = match.group(1)
        upstream_url = f"{UPSTREAM_ORIGIN}/api/stocks/{symbol}/daily/"
        request = urllib.request.Request(
            upstream_url,
            headers={
                "Accept": "application/json",
                "User-Agent": "Alpha-Local-Proxy/1.0",
            },
            method="GET",
        )

        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = response.read()
                status = response.status
        except urllib.error.HTTPError as error:
            payload = error.read() or json.dumps(
                {"error": f"Taiwan stock API returned HTTP {error.code}"}
            ).encode("utf-8")
            status = error.code
        except (urllib.error.URLError, TimeoutError) as error:
            payload = json.dumps(
                {"error": "Taiwan stock API is temporarily unavailable", "detail": str(error)}
            ).encode("utf-8")
            status = 502

        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent
    handler = lambda *args, **kwargs: AlphaYuantaRequestHandler(
        *args, directory=str(project_root), **kwargs
    )
    server = ThreadingHTTPServer((HOST, PORT), handler)
    print(f"Alpha Yuanta local server: http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
