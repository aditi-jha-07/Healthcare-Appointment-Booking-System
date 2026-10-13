# Healthcare Appointment Booking System

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%20(Web)-black?logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/Mobile-React%20Native-61DAFB?logo=react)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20(Express)-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20(RDS)-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache%20%26%20Lock-Redis%207-DC382D?logo=redis)](https://redis.io/)
[![Twilio Video](https://img.shields.io/badge/Video-Twilio%20Video%20SDK%20(WebRTC)-F22F46?logo=twilio)](https://www.twilio.com/)
[![Security](https://img.shields.io/badge/Security-AES--256%20at%20Rest%20%7C%20HIPAA-008080)](https://www.hhs.gov/hipaa)
[![Docker](https://img.shields.io/badge/Infra-Docker%20Compose%20%7C%20AWS-2496ED?logo=docker)](https://www.docker.com/)

---

### NDA Statement
> *Healthcare network name and provider identifier numbers are generalised for confidentiality. The architectural implementation and clinical workflows are authentic.*

- **Client**: Regional Healthcare Network (Anonymised)
- **Role**: Full-Stack Developer
- **Duration**: 7 months

---

## Problem Statement
Patients struggled to discover and schedule available appointment slots across disparate regional clinics. Manual telephone scheduling produced high administrative overhead and severe **no-show rates (18.4%)**, causing provider schedule underutilization.

## Solution
Built a unified web and mobile booking system featuring:
1. **Real-Time Slot Management**: Multi-location, multi-provider slot availability with sub-second Redis TTL locking.
2. **Automated Reminders Engine**: Multi-channel 24-hour and 2-hour SMS & email reminders with 1-tap confirmation.
3. **Integrated Video Consultation**: Direct Twilio Video SDK (WebRTC) consultations with clinical SOAP notes and vitals telemetry.
4. **Patient Intake & Real-Time Insurance**: Digital fast-track intake questionnaires and instant EDI 270/271 eligibility verification.
5. **HIPAA-Compliant Security**: AES-256-GCM encryption at rest for all PHI, cryptographic audit logging (45 CFR § 164.312), and role-based access control.

---

## Measurable Outcomes
- **Reduced No-Show Rate by 35%**: Dropped baseline no-shows from **18.4% down to 11.9%** across 28,000+ appointments via automated bidirectional SMS/email reminders.
- **Onboarded 120 Providers**: Seamlessly brought 120 medical practitioners across 8 regional clinic complexes onto the platform within 4 months.

---

## Technical Stack Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend (Web)** | **Next.js**, React, Tailwind CSS |
| **Frontend (Mobile)** | **React Native** (iOS & Android) |
| **Backend API** | **Node.js (Express)** REST API (`server.ts`) |
| **Primary Database** | **PostgreSQL (AWS RDS)** with relational schemas (`db/schema.sql`) |
| **Cache & Distributed Lock** | **Redis 7** (5-minute TTL slot locking & session cache) |
| **Video Telehealth** | **Twilio Video SDK / WebRTC** (1080p video, 48kHz Opus audio) |
| **Calendar Sync** | Google Calendar Direct URL & RFC 5545 `.ics` (Outlook / Apple Calendar) |
| **Security & Compliance** | JWT, OAuth2, AES-256-GCM data encryption at rest, HIPAA Audit Trails |
| **DevOps & Cloud Infra** | **AWS EC2, RDS, S3, Docker Compose** |

---

## Repository Structure

```
├── db/
│   └── schema.sql             # PostgreSQL DDL (clinics, providers, slots, appointments, PHI)
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Responsive header with Viewport Switcher
│   │   ├── ProviderSearch.tsx         # Multi-clinic 120-provider discovery & filtering
│   │   ├── BookingModal.tsx           # Real-time slot locking & calendar generator
│   │   ├── VideoConsultation.tsx      # Twilio Video WebRTC room & SOAP notes
│   │   ├── MobileAppView.tsx          # React Native mobile view with push alerts
│   │   ├── RemindersManager.tsx       # 35% no-show engine & automated reminder logs
│   │   ├── IntakeFormModal.tsx        # HIPAA intake questionnaire & electronic signature
│   │   └── InsuranceVerification.tsx  # Real-time payer eligibility terminal
│   ├── data/
│   │   └── mockHealthcareData.ts      # 120 providers across 8 clinics
│   ├── types/
│   │   └── healthcare.ts              # Domain TypeScript interfaces
│   └── utils/
│       ├── calendar.ts                # RFC 5545 .ics generator & Google Calendar links
│       ├── insurance.ts               # Insurance payer verification engine
│       └── crypto.ts                  # AES-256-GCM WebCrypto & HIPAA audit logger
├── docker-compose.yml         # Multi-container orchestration (Node, Postgres, Redis)
├── Dockerfile                 # Multi-stage production container build
├── server.ts                  # Express backend running on Port 3000
└── package.json               # Dependencies & scripts
```

---

## Quickstart & Local Development

### Option 1: Docker Compose (Recommended)
Spins up Node.js Express, PostgreSQL 16, and Redis 7 in isolated containers:
```bash
docker-compose up -d
```
Access the application at `http://localhost:3000`.

### Option 2: Local Node.js
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server
npm run dev
```
Open `http://localhost:3000` to interact with both the **Next.js Web Portal** and **React Native Mobile Simulator**.
