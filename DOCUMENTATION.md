# Kalindi Tourist Packages - Technical Documentation

## Overview
Kalindi is a full-stack tourism management platform built with React, Node.js, and MySQL. It provides a seamless interface for travelers to browse packages and a secure dashboard for administrators to manage bookings, inquiries, and staff.

---

## 🏗 System Architecture

### Frontend (React + Vite)
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Key Components**:
  - `Hero.jsx`: Immersive entry point.
  - `AdminLogin.jsx`: Multi-stage secure admin environment.
  - `BookingModal.jsx`: Dynamic reservation interface.

### Backend (Node.js + Express)
- **Runtime**: Node.js (with ES Modules)
- **Database**: MySQL 8.0
- **Security**: JWT (Authentication), Bcrypt (Hashing), Helmet (Headers), Rate-Limit.
- **Mail**: Nodemailer integration for OTP and notifications.

---

## 🔐 Administrative Workflow

### 1. Multi-Level Access
- **Main Admin**: (`kalinditouristpackages@gmail.com`) The only account with full staff management authority (can delete other admins).
- **Staff Admins**: Approved users who can manage bookings and packages but cannot delete other staff.

### 2. Secure Login Process (2FA)
1. **Credentials**: Admin enters email and password.
2. **OTP**: Server generates a 6-digit code and sends it to the admin's email.
3. **Verification**: After entering the code, the server issues a JWT token valid for 24 hours.

### 3. Staff Approval Sysytem
- New staff must "Request Access".
- Requests are stored as "Pending" (`is_approved = 0`).
- Existing admins get a notification in their dashboard and must manually approve the request for it to become active.

---

## 📊 Database Schema (MySQL)

| Table | Description |
| :--- | :--- |
| `admins` | Staff accounts, phone numbers, and approval status. |
| `packages` | Tour inventory including pricing, duration, and features. |
| `bookings` | Customer reservations linked to packages. |
| `users` | Registered traveler accounts. |
| `enquiries` | Messages sent via the contact form. |
| `user_otps` | Temporary tokens for secure logins. |

---

## 🚀 Production Deployment

### Prerequisites
- MySQL Server installed and running.
- Node.js installed.

### Installation
1. Install root dependencies: `npm install`
2. Install server dependencies: `cd server && npm install`
3. Configure `.env`: Use `.env.example` as a template.

### Execution
Run the production build and start command:
```bash
npm run prod
```
This command:
1. Builds the React frontend into the `/dist` folder.
2. Starts the Express server which serves both the API and the static frontend assets.

---

## 🛠 Maintenance & CLI Commands

- **Check Server Health**: `GET /api/health`
- **Reset Database**: Use the `schema.sql` script provided in the `/server` folder.
- **Add Packages**: Use the Admin Dashboard interface for dynamic updates.

---
*Generated: January 29, 2026 | Kalindi Trails Technical Team*
