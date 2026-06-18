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
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20173451.png" alt="CloudVault Dashboard UI" width="800"/>
  <p><i>The main dashboard featuring a premium glassmorphism UI.</i></p>
</div>

<div align="center" style="display: flex; justify-content: center; gap: 20px;">
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20173141.png" alt="Login Screen" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20221142.png" alt="File Picker API" width="390"/>
   <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20173847.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20173753.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20173618.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20174120.png" alt="File Picker API" width="390"/>
  <img src="https://github.com/yogeshsshekhawat/Storage-App/blob/master/images/Screenshot%202026-06-17%20180116.png" alt="File Picker API" width="390"/>
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

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/CloudVault.git](https://github.com/your-username/CloudVault.git)
   cd CloudVault
