# AssetVerse  
### Corporate Asset Management System (B2B HR & Asset Tracking Platform)

🔗 **Live Site:** https://assetverse-119d3.web.app

---

## 📌 Purpose

**AssetVerse** is a B2B web-based Corporate Asset Management System designed to help companies efficiently manage physical assets (laptops, chairs, keyboards, etc.) and track asset assignments across employees.  
It streamlines HR operations, prevents asset loss, and provides clear visibility into asset usage across multiple companies.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- Email & Password authentication (Firebase)
- Google Social Login (optional)
- JWT-based authentication
- Role-based authorization (HR & Employee)
- Protected private routes with reload persistence

---

### 👨‍💼 HR Manager (Admin) Features
- Company registration with default subscription (5 employees)
- Add, edit, and delete company assets
- View all asset requests (pending / approved / rejected)
- Approve or reject employee asset requests
- Auto-affiliate employees upon first approved request
- Direct asset assignment to affiliated employees
- Track current employees vs package limit
- Upgrade subscription packages via **Stripe**
- View payment history
- Analytics dashboard using **Recharts**
  - Returnable vs Non-returnable assets
  - Top requested assets
- Remove employees (auto asset return)
- Profile & company info management

---

### 👨‍💻 Employee Features
- Register independently without company affiliation
- Request assets from multiple companies
- View assigned assets from all companies
- Return returnable assets (optional feature)
- Filter & search assets
- Print / PDF asset report
- View team members per company
- Upcoming birthdays section
- Profile management

---

## 🏗️ System Highlights

- Multi-company support for employees
- Auto-affiliation logic on first request approval
- Package limit enforcement
- Server-side pagination
- Real-time stock management
- Responsive dashboard UI
- Professional corporate design using **DaisyUI**

---

## 🧩 Tech Stack

### Frontend
- React.js
- React Router DOM
- Firebase Authentication
- Axios
- Tailwind CSS
- DaisyUI
- Framer Motion
- Recharts
- React Hook Form
- React-to-Print / jsPDF (PDF feature)

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)
- Stripe Payment Gateway
- CORS
- dotenv

---

## 🗂️ Database Collections

- users
- assets
- requests
- assignedAssets
- employeeAffiliations
- packages
- payments

---

## 🔑 Environment Variables

### Client (`.env`)
```env
VITE_API_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_IMAGE_HOST_KEY=your_imgbb_key
