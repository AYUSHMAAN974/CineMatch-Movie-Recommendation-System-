# 🎬 CineMatch - Movie Discovery Platform

<div align="center">
  <p>A modern movie discovery platform with personalized ratings and recommendations.</p>
  <img src="https://img.shields.io/badge/Python-3.9+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/React-18+-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-0.104+-009688.svg" alt="FastAPI">
  <img src="https://img.shields.io/badge/TMDB-API-01D277.svg" alt="TMDB">
  <img src="https://img.shields.io/badge/Status-Completed-success.svg" alt="Status">
</div>

## 🎯 Overview

CineMatch is a full-stack movie discovery platform that leverages The Movie Database (TMDB) API to provide real-time movie information, user authentication, and personalized rating system. Built with FastAPI backend and React frontend.

## ✨ Features

- 🎬 **Real-time movie data** from TMDB API
- 🔍 **Advanced search** and filtering
- ⭐ **Personal rating system** 
- 👤 **User authentication** with JWT
- 📱 **Responsive design**
- 🗂️ **Multiple categories** (Popular, Trending, Now Playing, etc.)

## 🛠️ Tech Stack

**Backend:**
- FastAPI, PostgreSQL, Redis
- SQLAlchemy ORM, JWT Authentication
- Docker & Docker Compose

**Frontend:**
- React 18+, Tailwind CSS
- Axios, React Router
- Context API for state management

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CineMatch.git
   cd CineMatch
   ```

2. **Backend Setup**
   ```bash
   cd backend
   # Create .env file
   echo "TMDB_API_KEY=your_api_key_here" > .env
   echo "DATABASE_URL=postgresql://cinematch_user:cinematch_password_123@localhost:5432/cinematch_db" >> .env
   echo "SECRET_KEY=your-secret-key" >> .env
   
   # Start services
   docker-compose up -d postgres redis
   python init_database.py
   python run_server.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs

## 📁 Project Structure

```
CineMatch/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── core/            # Configuration
│   │   ├── models/          # Database models
│   │   ├── services/        # TMDB integration
│   │   └── main.py
│   ├── docker-compose.yml
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

Create `backend/.env`:
```env
TMDB_API_KEY=your_tmdb_api_key
DATABASE_URL=postgresql://cinematch_user:cinematch_password_123@localhost:5432/cinematch_db
SECRET_KEY=your-secret-key
DEBUG=True
BACKEND_CORS_ORIGINS=http://localhost:3000
```

## 📚 API Endpoints

- `GET /api/v1/movies/` - Get movies by category
- `GET /api/v1/movies/search` - Search movies
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/ratings/` - Rate a movie

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by Ayushmaan Gupta</p>
</div>