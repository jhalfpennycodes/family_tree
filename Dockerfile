# Multi-stage build
FROM node:18 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS backend-build
WORKDIR /app
COPY backend/flask-server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt gunicorn

FROM nginx:alpine
WORKDIR /app

# Install Python and supervisor to run multiple processes
RUN apk add --no-cache python3 py3-pip supervisor

# Copy backend
COPY --from=backend-build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-build /usr/local/bin/gunicorn /usr/local/bin/gunicorn
COPY backend/flask-server/ /app/backend/

# Copy frontend build
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy nginx config (we'll modify the upstream)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Create supervisor config
RUN mkdir -p /var/log/supervisor
COPY <<EOF /etc/supervisord.conf
[supervisord]
nodaemon=true
user=root

[program:flask]
command=/usr/local/bin/gunicorn -w 4 -b 127.0.0.1:8000 run:app
directory=/app/backend
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=/usr/sbin/nginx -g 'daemon off;'
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]