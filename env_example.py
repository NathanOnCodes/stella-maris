# Copie este arquivo para .env antes do deploy:
# cp env_example.py .env

COMPOSE_PROJECT_NAME=vox-regina-caeli
NEXT_PUBLIC_SITE_URL=https://example.invalid
HTTP_PORT=80
HTTPS_PORT=443
TLS_CERTS_PATH=./certs

SECRET_KEY=replace-with-random-secret
DEBUG=false
ALLOWED_HOSTS=example.invalid,localhost
CORS_ALLOWED_ORIGINS=https://example.invalid
CSRF_TRUSTED_ORIGINS=https://example.invalid
USE_PROXY_SSL_HEADER=true
DB_ENGINE=postgres
DB_CONN_MAX_AGE=60

POSTGRES_DB=vox_regina_caeli
POSTGRES_USER=vox_user
POSTGRES_PASSWORD=replace-with-strong-password
POSTGRES_HOST=db
POSTGRES_PORT=5432

GUNICORN_WORKERS=3
GUNICORN_TIMEOUT=120
