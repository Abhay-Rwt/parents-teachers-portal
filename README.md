# 🏫 Parent-Teacher Portal

A premium, full-stack educational management system designed to bridge the gap between parents and teachers. Built with **Laravel 11** and **React**, featuring a modern, glassmorphic UI and real-time communication.

---

## 🌟 Key Features

### 👤 Three Distinct Roles
-   **Admin**: Centralized user management (Teachers/Parents), classroom configuration, and live system-wide statistics.
-   **Teacher**: Student analytics, attendance tracking, bulk grade entry, assignment management, and meeting scheduling.
-   **Parent**: Per-child progress tracking, real-time message inbox, automated notifications for grades/assignments, and student selector for multi-child households.

### 💬 Communication Hub
-   **Real-time Messaging**: Direct chat between parents and teachers.
-   **Meeting System**: Bi-directional meeting requests with status tracking (Pending/Approved/Rejected).
-   **Notifications**: Instant alerts for new grades, assignments, messages, and meeting updates.

### 📊 Academic Tracking
-   **Live Metrics**: Attendance rates, grade trends, and pending assignment counts.
-   **Student Analytics**: Deep-dive modals for individual student performance and history.

---

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Lucide React (Icons), Vanilla CSS (Custom Design System).
-   **Backend**: Laravel 11, Sanctum (API Auth), Eloquent ORM.
-   **Database**: MySQL (Recommended) / SQLite.
-   **Styling**: Premium custom CSS with a focus on modern typography and smooth interactions.

---

## 🚀 Getting Started

### Prerequisites
-   PHP 8.2+ & Composer
-   Node.js 18+ & npm
-   MySQL or SQLite

### Backend Setup
1.  Navigate to `/backend`:
    ```bash
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve
    ```

### Frontend Setup
1.  Navigate to `/frontend`:
    ```bash
    npm install
    npm run dev
    ```

---

## 📦 Project Structure

```text
├── backend/            # Laravel API
│   ├── app/Controllers # Business logic
│   ├── app/Models      # Database architecture
│   └── routes/api.php  # API Endpoints
└── frontend/           # React Application
    ├── src/pages       # Dashboard shells & modules
    ├── src/components  # Reusable UI components
    └── src/context     # Global Auth & State
```

---

## 🔒 Security
-   Role-Based Access Control (RBAC) enforced at the middleware level.
-   Secure API authentication via Laravel Sanctum.
-   Data-level restriction (e.g., parents can only see their own children's data).

---

## 📄 License
This project is open-source under the MIT License.
