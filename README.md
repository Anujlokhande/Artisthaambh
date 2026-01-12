# Artisthambh

**Artisthambh** is a full-stack MERN application that connects artists and users through a centralized platform. It provides authentication for both artists and users, listings for artwork/services making it a structured space for artistic collaboration.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://artisthaambh.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/Anujlokhande/Artisthaambh)

---

## ✨ Features

- 🔐 **JWT-based authentication and authorization**
- 👥 **Role-based access** (Artist/User)
- 📝 **Artwork listings** (create, edit, delete, view)
- 🖼️ **Secure media uploads** using Cloudinary
- 🔄 **RESTful API architecture** with Express.js
- 🧩 **Modular MVC backend design**
- 🛡️ **Middleware-based route protection**
- 🗄️ **MongoDB data modeling** with relationships

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Context API / State Management
- Tailwind CSS / CSS
- Fetch / Axios

### Backend
- Node.js
- Express.js
- JWT Authentication & Authorization
- Multer (file uploads)
- Cloudinary (media storage)
- MongoDB + Mongoose

---

## 📊 Database Models

Artisthambh uses **MongoDB** with **Mongoose**. Core schemas include:

- **User** - User accounts
- **Artist** - Artist profile data
- **Listing** - Artwork/service listings
- **Chat** - Conversation metadata
- **Message** - Chat messages

Models reference each other using MongoDB ObjectIds to maintain relationships.

---

## 🔗 API Routes

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/verify` | Verify token |

### Artists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/artists` | Get all artists |
| GET | `/api/artists/:id` | Get artist by ID |
| PUT | `/api/artists/:id` | Update artist info |

### Listings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/listings` | Create listing |
| GET | `/api/listings` | Get all listings |
| GET | `/api/listings/:id` | Get listing by ID |
| PUT | `/api/listings/:id` | Update listing |
| DELETE | `/api/listings/:id` | Delete listing |

---

## 🔒 Security & Middleware

- JWT token verification
- Protected routes
- Role-based access validation
- Cloudinary image validation
- Multer middleware for file processing
- Error handling middleware

---

## ☁️ Cloudinary Integration

Artisthambh uses **Cloudinary** for media storage:

- Files are uploaded via **Multer**
- Transformed and stored in **Cloudinary**
- URL stored in **MongoDB**

---

## 📁 Folder Structure (Backend)

```
/backend
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 ├── config/
 └── server.js
```

---

## 🚀 Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Backend**: Deployed on [Render](https://render.com) (or similar)
- **Database**: MongoDB hosted via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Media Storage**: [Cloudinary](https://cloudinary.com)

---

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 📦 Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Anujlokhande/Artisthaambh
cd Artisthaambh
```

### Backend Setup

```bash
cd backend
npm install
npm run start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🚧 Future Improvements

- [ ] Real-time messaging with WebSockets
- [ ] Artist booking or hiring system
- [ ] Notifications for chat/messages
- [ ] Reviews & ratings for listings
- [ ] Payment integration
- [ ] Advanced artist directory filters

---

## 👨‍💻 Author

**Anuj Namdev Lokhande**  
Full Stack Developer

- GitHub: [@Anujlokhande](https://github.com/Anujlokhande)
- Live Demo: [artisthaambh.vercel.app](https://artisthaambh.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---


## ⭐ Show your support

Give a ⭐️ if you like this project!
