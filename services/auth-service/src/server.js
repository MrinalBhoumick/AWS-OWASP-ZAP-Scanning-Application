import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import { pool } from "./infrastructure/db.js";
import { UserRepo } from "./infrastructure/user.repo.js";
import { LoginUseCase } from "./application/login.usecase.js";
import { RegisterUseCase } from "./application/register.usecase.js";
import routes from "./interfaces/http.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy - Required when behind ALB/ELB
app.set('trust proxy', 1);

// Security middleware - Helmet sets various HTTP headers for security
app.use(helmet());

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all requests
app.use(apiLimiter);

// CORS middleware - More restrictive in production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize repositories and use cases
const repo = new UserRepo(pool);
const login = new LoginUseCase(repo);
const register = new RegisterUseCase(repo);

// Setup routes
routes(app, login, register, repo);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
  console.log(`🔒 Security features enabled: JWT, bcrypt, rate-limiting, helmet`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  pool.end(() => {
    console.log("Database pool closed");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  pool.end(() => {
    console.log("Database pool closed");
    process.exit(0);
  });
});
