import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

export class RegisterUseCase {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password
    const user = await this.userRepo.create(email, hashedPassword);

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return { 
      id: user.id, 
      email: user.email,
      token,
      message: "User registered successfully"
    };
  }
}
