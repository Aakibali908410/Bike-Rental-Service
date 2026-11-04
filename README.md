# Bikes Rental Service

> **Your Ride, Your Way.**

Official repository for **Bikes Rental Service** (Website Title: **Bike Rental Service**), a full-stack motorcycle rental platform featuring verified fleet management, real-time availability calculation, dynamic 18% GST and refundable deposit pricing, and the **Bikes Rental Assistant** AI chatbot.

---

## 🚀 Key Features

- **Fleet Catalog & Real-Time Availability:** Browse verified motorcycles across Cruiser, Commuter, Adventure, Sports, and Scooter categories with live date-conflict checks.
- **Bikes Rental Assistant (AI Chatbot):** Intelligent customer support assistant capable of answering fleet queries, pricing formulas, and policy details in English, Hindi, and Hinglish.
- **Accurate Pricing Engine:** Automated breakdown with rental duration, 18% GST (rounded to nearest rupee), and refundable segment-based security deposits.
- **Multi-Hub & Nationwide Delivery:** Physical walk-in pickup stations in 7 primary metropolitan hubs (Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata) and scheduled doorstep delivery across 116 regional cities.
- **Secure Authentication:** JWT-based user authentication, role-based protection (Admin/Rider), and customer data privacy isolation.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **AI Engine:** OpenAI API (`gpt-4o-mini`) with function tool-calling
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- MongoDB Atlas database connection string

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📜 License
ISC License © Bikes Rental Service. All rights reserved.
