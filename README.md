<div align="center">
  
  # ☁️ CloudVault
  
  **A high-fidelity, full-stack cloud storage management platform.**
  
  [![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](#)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](#)
  [![OAuth 2.0](https://img.shields.io/badge/OAuth_2.0-F9322C?style=flat-square&logo=google&logoColor=white)](#)

</div>

---

## 📖 Introduction

CloudVault is a modern, full-stack cloud storage application designed for secure, seamless file management. Built entirely on the MERN stack, it combines robust backend infrastructure with a highly polished, SaaS 2.0 interface. 

The platform is designed to handle complex file structures and secure access via OAuth 2.0, while delivering a premium user experience featuring glassmorphism elements, dynamic mesh gradients, and smooth interactions. External file integration is made effortless with native Google Picker API support.

---

## 📑 Table of Contents

- [Introduction](#-introduction)
- [Screenshots](#-screenshots)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)


---

## 📸 Screenshots



<div align="center">
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/cloudvault.png" alt="CloudVault landing page" width="800"/>
  
</div>

<div align="center" style="display: flex; justify-content: center; gap: 20px;">
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135841.png" alt="Login Screen" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135047.png" alt="File Picker API" width="390"/>
   <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135253.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135720.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135410.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135331.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135613.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-08-15%20135532.png" alt="File Picker API" width="390"/>
  
</div>

---

## ✨ Key Features

* **Secure Authentication:** Robust OAuth 2.0 login flows backed by JSON Web Tokens (JWT) for secure session management.
* **Modern UI/UX:** A visually striking SaaS 2.0 interface leveraging custom mesh gradients, glassmorphic overlays, and responsive design principles.
* **External Integrations:** Seamlessly import, organize, and manage files directly from Google Drive using the integrated Google Picker API.
* **Advanced File Management:** Full CRUD capabilities for files and folders, optimizing how users interact with their cloud storage.
* **Scalable Backend:** An optimized RESTful API built with Express and Node.js, storing complex document relationships in MongoDB.

---

## 💻 Tech Stack

### Frontend
<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </p>

### Backend & Database
<p>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" />
</p>

### Third-Party APIs
* Google OAuth 2.0
* Google Picker API

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
* A Google Cloud Console account (for OAuth credentials)

* AWS Account & S3 Bucket (for file storage)
* Razorpay Account (optional, for subscription plans)

### Installation & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/CloudVault.git
cd CloudVault
```

#### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3000
   DB_URL=mongodb://localhost:27017/storageApp
   GOOGLE_CLIENT_ID=your-google-client-id
   NODE_MAILER_USER=your-email@gmail.com
   NODE_MAILER_PASSWORD=your-email-app-password
   ORIGIN=http://localhost:5174
   COOKIE_PARSER_SECRET=your-cookie-secret

   # Razorpay Configuration (Optional)
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
   RAZORPAY_PLAN_ID_PRO=your-pro-plan-id
   RAZORPAY_PLAN_ID_ENTERPRISE=your-enterprise-plan-id

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_REGION=your-aws-region
   AWS_BUCKET_NAME=your-s3-bucket-name

   # AWS CloudFront CDN Configuration (Optional)
   CLOUDFRONT_URL=your-cloudfront-distribution-url
   CLOUDFRONT_KEY_PAIR_ID=your-cloudfront-key-pair-id
   CLOUDFRONT_PRIVATE_KEY="your-cloudfront-private-key"

   # Redis Configuration (Optional, for caching/session)
   REDIS_URL=redis://localhost:6379
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:3000` (or the port defined in your `.env`).*

#### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_FRONTNED_CLIENT_ID=your-google-client-id
   VITE_API_URL=http://localhost:3000
   VITE_GOOGLE_API_KEY=your-google-api-key
   VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
   VITE_RAZORPAY_PLAN_ID_PRO=your-pro-plan-id
   VITE_RAZORPAY_PLAN_ID_ENTERPRISE=your-enterprise-plan-id
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5174` (or the port Vite outputs).*

---

## 🛠️ Usage & Running in Production

To build and preview the frontend for production, run:
```bash
npm run build
npm run preview
```

To run the backend server in production, use:
```bash
npm start
```
