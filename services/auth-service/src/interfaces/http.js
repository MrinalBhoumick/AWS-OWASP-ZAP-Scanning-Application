import { authLimiter } from '../middleware/rateLimiter.js';
import { authMiddleware } from '../utils/jwt.js';
import { 
  loginValidation, 
  registerValidation, 
  handleValidationErrors 
} from '../utils/validators.js';

export default (app, loginUseCase, registerUseCase, userRepo) => {
  // Login endpoint with rate limiting and validation
  app.post(
    "/login",
    authLimiter,
    loginValidation,
    handleValidationErrors,
    async (req, res) => {
      try {
        const result = await loginUseCase.execute(
          req.body.email,
          req.body.password
        );
        res.json(result);
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
    }
  );

  // Register endpoint with rate limiting and validation
  app.post(
    "/register",
    authLimiter,
    registerValidation,
    handleValidationErrors,
    async (req, res) => {
      try {
        const result = await registerUseCase.execute(
          req.body.email,
          req.body.password
        );
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Get all users endpoint (protected with JWT)
  app.get("/users", authMiddleware, async (req, res) => {
    try {
      const users = await userRepo.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Health check endpoint (public)
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      service: "auth-service",
      version: "2.0.0"
    });
  });

  // Root endpoint (public)
  app.get("/", (req, res) => {
    res.json({ 
      service: "auth-service", 
      version: "2.0.0",
      status: "running",
      security: "JWT + bcrypt + rate-limiting enabled",
      endpoints: [
        "POST /login - Rate limited (5 attempts/15min)",
        "POST /register - Rate limited (5 attempts/15min)",
        "GET /users - Protected (JWT required)",
        "GET /health - Public"
      ]
    });
  });
};
