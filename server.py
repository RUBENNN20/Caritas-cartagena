from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import secrets
import time
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
ACCOUNT_FILE = DATA_DIR / "admin.json"
CONTENT_FILE = DATA_DIR / "content.json"
USERNAME_PATTERN = re.compile(r"^[A-Za-z0-9_.-]{3,64}$")
SESSION_SECONDS = 8 * 60 * 60
MAX_CONTENT_BYTES = 4_200_000
SESSIONS: dict[str, dict] = {}
LOGIN_ATTEMPTS: dict[str, dict] = {}


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def write_json(path: Path, value: object):
    DATA_DIR.mkdir(mode=0o700, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    temporary.replace(path)


def password_hash(password: str, salt: bytes) -> bytes:
    return hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1, dklen=64)


def account_exists() -> bool:
    account = load_json(ACCOUNT_FILE)
    return bool(account and isinstance(account.get("username"), str) and account.get("hash"))


def client_ip(handler: SimpleHTTPRequestHandler) -> str:
    return handler.client_address[0]


class App(SimpleHTTPRequestHandler):
    server_version = "CaritasLocalAdmin/1.0"

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        # El editor incorpora una vista previa del sitio, pero solo en el mismo origen.
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        super().end_headers()

    def send_json(self, status: HTTPStatus, value: object):
        body = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return None
        if length <= 0 or length > MAX_CONTENT_BYTES:
            return None
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            return None

    def session(self):
        cookie = SimpleCookie(self.headers.get("Cookie"))
        token = cookie.get("caritas_session")
        if not token:
            return None
        value = SESSIONS.get(token.value)
        if not value or value["expires"] < time.time():
            SESSIONS.pop(token.value, None)
            return None
        return token.value, value

    def authenticated(self):
        return self.session() is not None

    def csrf_valid(self):
        session = self.session()
        return bool(session and hmac.compare_digest(self.headers.get("X-CSRF-Token", ""), session[1]["csrf"]))

    def create_session(self):
        session_id = secrets.token_urlsafe(32)
        csrf = secrets.token_urlsafe(24)
        SESSIONS[session_id] = {"csrf": csrf, "expires": time.time() + SESSION_SECONDS}
        return session_id, csrf

    def set_session_cookie(self, session_id: str, expires: bool = False):
        cookie = f"caritas_session={session_id}; HttpOnly; SameSite=Strict; Path=/"
        if expires:
            cookie += "; Max-Age=0"
        else:
            cookie += f"; Max-Age={SESSION_SECONDS}"
        self.send_header("Set-Cookie", cookie)

    def do_GET(self):
        if self.path == "/api/auth/status":
            session = self.session()
            return self.send_json(HTTPStatus.OK, {
                "setupRequired": not account_exists(),
                "authenticated": bool(session),
                "csrf": session[1]["csrf"] if session else None,
            })
        if self.path == "/api/content":
            content = load_json(CONTENT_FILE)
            if content is None:
                return self.send_json(HTTPStatus.NOT_FOUND, {"error": "No hay contenido guardado."})
            return self.send_json(HTTPStatus.OK, content)
        if self.path == "/admin.html" and not self.authenticated():
            self.send_response(HTTPStatus.SEE_OTHER)
            self.send_header("Location", "/login.html")
            self.end_headers()
            return
        if self.path.startswith("/data/") or self.path in {"/server.py", "/.git"}:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        return super().do_GET()

    def list_directory(self, path):
        self.send_error(HTTPStatus.FORBIDDEN)
        return None

    def do_POST(self):
        if self.path == "/api/auth/setup":
            return self.setup_account()
        if self.path == "/api/auth/login":
            return self.login()
        if self.path == "/api/auth/logout":
            return self.logout()
        if self.path == "/api/content":
            return self.save_content()
        self.send_error(HTTPStatus.NOT_FOUND)

    def setup_account(self):
        if account_exists():
            return self.send_json(HTTPStatus.CONFLICT, {"error": "La cuenta administradora ya existe."})
        data = self.read_body() or {}
        username, password = data.get("username", ""), data.get("password", "")
        if not isinstance(username, str) or not USERNAME_PATTERN.fullmatch(username):
            return self.send_json(HTTPStatus.BAD_REQUEST, {"error": "El usuario debe tener 3 a 64 caracteres: letras, números, punto, guion o guion bajo."})
        if not isinstance(password, str) or len(password) < 12 or len(password) > 256:
            return self.send_json(HTTPStatus.BAD_REQUEST, {"error": "La contraseña debe tener entre 12 y 256 caracteres."})
        salt = secrets.token_bytes(16)
        write_json(ACCOUNT_FILE, {
            "username": username,
            "salt": base64.b64encode(salt).decode("ascii"),
            "hash": base64.b64encode(password_hash(password, salt)).decode("ascii"),
        })
        session_id, csrf = self.create_session()
        self.send_response(HTTPStatus.CREATED)
        self.set_session_cookie(session_id)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        body = json.dumps({"csrf": csrf}).encode("utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def login(self):
        ip = client_ip(self)
        attempt = LOGIN_ATTEMPTS.get(ip, {"count": 0, "locked_until": 0})
        if attempt["locked_until"] > time.time():
            return self.send_json(HTTPStatus.TOO_MANY_REQUESTS, {"error": "Demasiados intentos. Espera 15 minutos."})
        data = self.read_body() or {}
        account = load_json(ACCOUNT_FILE) or {}
        username, password = data.get("username", ""), data.get("password", "")
        valid = False
        try:
            salt = base64.b64decode(account["salt"])
            expected = base64.b64decode(account["hash"])
            valid = hmac.compare_digest(account.get("username", ""), username) and hmac.compare_digest(expected, password_hash(password, salt))
        except (KeyError, TypeError, ValueError):
            password_hash("placeholder-password", secrets.token_bytes(16))
        if not valid:
            attempt["count"] += 1
            if attempt["count"] >= 5:
                attempt = {"count": 0, "locked_until": time.time() + 15 * 60}
            LOGIN_ATTEMPTS[ip] = attempt
            return self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Usuario o contraseña incorrectos."})
        LOGIN_ATTEMPTS.pop(ip, None)
        session_id, csrf = self.create_session()
        self.send_response(HTTPStatus.OK)
        self.set_session_cookie(session_id)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        body = json.dumps({"csrf": csrf}).encode("utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def logout(self):
        session = self.session()
        if session:
            SESSIONS.pop(session[0], None)
        self.send_response(HTTPStatus.NO_CONTENT)
        self.set_session_cookie("", expires=True)
        self.end_headers()

    def save_content(self):
        if not self.csrf_valid():
            return self.send_json(HTTPStatus.FORBIDDEN, {"error": "La sesión no es válida. Inicia sesión otra vez."})
        content = self.read_body()
        if not isinstance(content, dict) or content.get("version") != 1 or not isinstance(content.get("site"), dict) or not isinstance(content.get("programs"), list) or not isinstance(content.get("news"), list):
            return self.send_json(HTTPStatus.BAD_REQUEST, {"error": "El contenido no tiene el formato esperado."})
        if len(content["programs"]) > 50 or len(content["news"]) > 50:
            return self.send_json(HTTPStatus.BAD_REQUEST, {"error": "El contenido supera el máximo de fichas permitido."})
        write_json(CONTENT_FILE, content)
        return self.send_json(HTTPStatus.NO_CONTENT, {})

    def do_DELETE(self):
        if self.path != "/api/content" or not self.csrf_valid():
            return self.send_json(HTTPStatus.FORBIDDEN, {"error": "No autorizado."})
        try:
            CONTENT_FILE.unlink()
        except FileNotFoundError:
            pass
        return self.send_json(HTTPStatus.NO_CONTENT, {})


if __name__ == "__main__":
    print("Sitio publico: http://127.0.0.1:8000/")
    print("Administrador: http://127.0.0.1:8000/login.html")
    ThreadingHTTPServer(("127.0.0.1", 8000), App).serve_forever()
