# Copie este arquivo para .env.dev antes do desenvolvimento:
# cp env_dev_example.py .env.dev

COMPOSE_PROJECT_NAME=vox-regina-caeli-dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DEBUG=true
ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:8080
USE_PROXY_SSL_HEADER=false
DB_ENGINE=postgres

POSTGRES_DB=vox_regina_caeli_dev
POSTGRES_USER=vox_dev_user
POSTGRES_PASSWORD=replace-with-dev-password
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_PORT_HOST=5433

BACKEND_PORT=8000
FRONTEND_PORT=3000
NGINX_DEV_PORT=8080
