import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

export class LoginUseCase {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await this.userRepo.findByEmail(email);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return { 
      id: user.id, 
      email: user.email,
      token,
      message: "Login successful"
    };
  }
}
