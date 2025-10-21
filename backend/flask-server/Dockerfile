# ============================================================
# Stage 1: Build Frontend
# ============================================================
FROM node:20 AS frontend-builder

# Set working directory inside container
WORKDIR /app/frontend

# Copy frontend source code from repo
COPY ../../frontend ./

# Install dependencies and build production bundle
RUN npm install && npm run build


# ============================================================
# Stage 2: Backend (Flask + Gunicorn + Nginx)
# ============================================================
FROM python:3.11-slim AS backend

# Set working directory
WORKDIR /app

# Install system dependencies (Nginx + build tools)
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy Flask backend
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend from Stage 1 into Nginx’s html directory
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY ../../nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Make sure upload folder exists
RUN mkdir -p /app/app/static/uploads

# Environment variable for Flask
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Expose HTTP port
EXPOSE 80

# Start both Nginx and Flask via Gunicorn
CMD service nginx start && gunicorn --bind 0.0.0.0:8000 run:app
