import os
import sys
import json
import time
import socket
import mimetypes
import threading
import webbrowser
import urllib.parse
import urllib.request
from email.utils import formatdate

import save_server
import export_zaloga_json  # Ensure PyInstaller bundles export_zaloga_json + openpyxl

PORT = save_server.PORT  # 8095
MAIN_HTML = "PETRIČ.KALKULACIJE2.html"


def get_app_dir():
    """Find the folder containing PETRIČ.KALKULACIJE2.html."""
    if getattr(sys, "frozen", False):
        exe_dir = os.path.dirname(os.path.abspath(sys.executable))
    else:
        exe_dir = os.path.dirname(os.path.abspath(__file__))

    candidates = [
        exe_dir,
        r"S:\DARKO\KalkulacijaPetric",
        r"\\server-2012\Srecko\DARKO\KalkulacijaPetric",
        r"C:\DARKO\KalkulacijaPetric",
    ]
    for path in candidates:
        try:
            if path and os.path.isfile(os.path.join(path, MAIN_HTML)):
                return os.path.abspath(path)
        except Exception:
            pass
    return exe_dir


APP_DIR = get_app_dir()

# Ensure common web MIME types are registered properly on Windows
mimetypes.add_type("text/html; charset=utf-8", ".html")
mimetypes.add_type("application/javascript; charset=utf-8", ".js")
mimetypes.add_type("text/css; charset=utf-8", ".css")
mimetypes.add_type("application/json; charset=utf-8", ".json")
mimetypes.add_type("image/svg+xml", ".svg")


class LauncherHandler(save_server.SaveHandler):
    def _serve_static_file(self, rel_path):
        clean_rel = rel_path.lstrip("/\\")
        if not clean_rel:
            return False

        try:
            full_path = os.path.abspath(os.path.join(APP_DIR, clean_rel))
            if os.path.commonpath([APP_DIR, full_path]) != APP_DIR:
                return False
            if not os.path.isfile(full_path):
                return False

            ctype, _ = mimetypes.guess_type(full_path)
            if not ctype:
                ctype = "application/octet-stream"
            elif ctype.startswith(("text/", "application/javascript", "application/json")) and "charset=" not in ctype:
                ctype += "; charset=utf-8"

            st = os.stat(full_path)
            with open(full_path, "rb") as f:
                data = f.read()

            self.send_response(200)
            self.send_cors_headers()
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Last-Modified", formatdate(st.st_mtime, usegmt=True))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.end_headers()
            self.wfile.write(data)
            return True
        except (ConnectionAbortedError, BrokenPipeError, ConnectionResetError):
            return True
        except Exception:
            return False

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        route = urllib.parse.unquote(parsed.path).strip()
        route_lower = route.rstrip("/").lower()

        # 1. Health check on root '/'
        if route in ("", "/"):
            try:
                payload = json.dumps({
                    "status": "active",
                    "static_files": True,
                    "app_dir": APP_DIR,
                    "calc_dir": save_server.get_calc_dir(),
                    "word_dir": save_server.get_word_dir(),
                }, ensure_ascii=False).encode("utf-8")
                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
                return
            except Exception:
                pass

        # 2. Explicit API endpoints -> delegate to SaveHandler
        if route_lower in ("/list", "/api/list", "/read", "/api/read", "/zaloga", "/api/zaloga"):
            return super().do_GET()

        # 3. Try serving a static file from APP_DIR (HTML, JS, CSS, PNG, JSON, PDF...)
        if self._serve_static_file(route):
            return

        # 4. Fallback to original SaveHandler behavior
        return super().do_GET()


def check_existing_server():
    """Returns ('launcher', info), ('legacy', info), or (None, None)."""
    try:
        req = urllib.request.Request(f"http://127.0.0.1:{PORT}/")
        with urllib.request.urlopen(req, timeout=0.6) as resp:
            if resp.status == 200:
                body = resp.read().decode("utf-8", errors="ignore")
                try:
                    info = json.loads(body)
                except Exception:
                    info = {}
                if info.get("static_files"):
                    return "launcher", info
                return "legacy", info
    except Exception:
        pass
    return None, None


def open_app_in_browser(use_http=True):
    if use_http:
        url = f"http://127.0.0.1:{PORT}/{urllib.parse.quote(MAIN_HTML)}"
    else:
        html_path = os.path.join(APP_DIR, MAIN_HTML)
        url = "file:///" + urllib.parse.quote(html_path.replace("\\", "/"), safe=":/")
    webbrowser.open(url)


def run_launcher():
    mode, _ = check_existing_server()
    if mode == "launcher":
        open_app_in_browser(use_http=True)
        return
    elif mode == "legacy":
        open_app_in_browser(use_http=False)
        return

    # Bind to 127.0.0.1 so Windows Firewall never prompts on client PCs
    try:
        server = save_server.ThreadingHTTPServer(("127.0.0.1", PORT), LauncherHandler)
    except OSError:
        # Port became busy between check and bind
        open_app_in_browser(use_http=True)
        return

    # Warm up cache in background so startup + browser open is instant
    def warmup_and_poll():
        try:
            save_server.get_projects_list(force_scan=True)
        except Exception:
            pass
        save_server.background_cache_updater()

    t = threading.Thread(target=warmup_and_poll, daemon=True)
    t.start()

    # Open browser slightly after server starts listening
    threading.Timer(0.25, open_app_in_browser, kwargs={"use_http": True}).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    run_launcher()
