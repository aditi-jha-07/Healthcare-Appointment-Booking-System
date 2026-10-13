#!/usr/bin/env bash
# ==============================================================================
# AWS EC2 / Docker Compose Deployment Script
# Healthcare Appointment Booking System
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " Starting Healthcare System Deployment on AWS EC2..."
echo "=========================================================="

# Check Docker and Docker Compose
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Aborting." >&2; exit 1; }

# Environment validation
if [ ! -f .env ]; then
    echo "Warning: .env file not found, creating from .env.example..."
    cp .env.example .env
fi

echo "Pulling base containers for PostgreSQL 16 & Redis 7..."
docker-compose pull postgres redis

echo "Building Node.js Express API & Next.js Web containers..."
docker-compose build --no-cache api

echo "Starting isolated containers in background..."
docker-compose up -d

echo "Running PostgreSQL database schema migration..."
docker-compose exec -T postgres psql -U postgres -d healthcare_booking_db -f /docker-entrypoint-initdb.d/01_schema.sql

echo "Checking health endpoints..."
curl -s http://localhost:3000/api/health | grep "ONLINE" && echo " Backend API is healthy!"

echo "=========================================================="
echo " Deployment Complete! App running on http://localhost:3000"
echo "=========================================================="
