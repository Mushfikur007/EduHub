# 📚 EduHub – Learning Management System

**EduHub** is a modern, full-featured Learning Management System (LMS) designed to simplify and enhance online education. Built with a robust tech stack, EduHub supports dynamic course delivery, secure user management, real-time interaction, and intelligent administration tools. It provides an intuitive platform for students, instructors, and administrators alike.

---

## 🚀 Features

### 👥 User Management
- Secure registration and login
- Google OAuth-based social login
- JWT-based authentication with refresh token support
- Email verification and password reset
- Profile management with avatar upload

### 📚 Course Management
- Rich text editor for course creation
- Course preview, purchase, and progress tracking
- Student enrollment and access control
- Ratings, reviews, and interactive Q&A section

### 💡 Learning Experience
- Personalized dashboards for learners and instructors
- Real-time notifications
- Discussion threads for each course
- Invoice generation after course purchase

### 👨‍💼 Admin Features
- Role-based user and course management
- Team/staff management
- Real-time analytics: activity tracking, order reports, engagement metrics
- FAQ and policy page management

### 🛠️ Technical Highlights
- **Frontend:** Next.js, Redux Toolkit, TailwindCSS
- **Backend:** Node.js, Express.js, MongoDB
- **Real-Time:** Socket.io for notifications
- **Caching:** Redis for performance
- **Storage:** Cloudinary for media uploads
- **Authentication:** JWT & OAuth
- **Others:** TypeScript, ESLint, Prettier, Git

---

## 🧰 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- Redis
- Cloudinary account
- Google OAuth credentials

### Clone the Repository

```bash
git clone https://github.com/mushfikur007/eduhub.git
cd eduhub
```

### Environment Setup

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIS_URL=your_redis_url
```

### Install Dependencies

```bash
npm install
```

### Run the Project

```bash
npm run dev
```


