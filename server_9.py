"""Theme 9 server (Port 5509)."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path in ("/", "/index.html"): self.path = "/index_9.html"
        super().do_GET()

if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 5509), lambda *a, **k: Handler(*a, directory=str(Path(__file__).parent), **k))
    server.serve_forever()
