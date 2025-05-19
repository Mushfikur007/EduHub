# 📚 EduHub – Learning Management System

**EduHub** is a modern, full-featured Learning Management System (LMS) designed to simplify and enhance online education. Built with a robust tech stack, EduHub supports dynamic course delivery, secure user management, real-time interaction, and intelligent administration tools. It provides an intuitive platform for students, instructors, and administrators alike.

---

## 🚀 Features

### 👥 User Management
- Secure registration and login
- Google OAuth-based social login
- Github OAuth-based social login
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
server:
```env
PORT = 8000
ORIGIN="http://localhost:3000"
NODE_ENV="development"
DB_URL=your_mongodb_url
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_api_key
CLOUD_SECRETE_KEY=your_api_secret
REDIS_URL=your_redis_url
ACTIVATION_SECRET=random_numbers_for_activation_secret
ACCESS_TOKEN=your_access_token
REFRESH_TOKEN=your_refresh_token
ACCESS_TOKEN_EXPIRE=expire_time
REFRESH_TOKEN_EXPIRE=expire_time
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=your_gmail_id
SMTP_PASS=your_smtp_password
STRIPE_PUBLISHABLE_KEY=your_stripe_publish_key
STRIPE_SECRET_KEY=your_strip_secret_key
```
client:
```env
NEXT_PUBLIC_SERVER_URI="http://localhost:8000/api/v1/"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=stripe_publish_key

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret_key
SECRET=make_random_secret_key
```

### Install Dependencies

```bash
npm install
```

### Run the Project

```bash
npm run dev
```


