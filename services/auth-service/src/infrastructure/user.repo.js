import { User } from "../domain/user.js";

export class UserRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async findByEmail(email) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (!result.rows[0]) {
        return null;
      }

      const user = result.rows[0];
      return new User(user.id, user.email, user.password, user.created_at);
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database error");
    }
  }

  async create(email, password) {
    try {
      const result = await this.pool.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, password]
      );

      const user = result.rows[0];
      return new User(user.id, user.email, user.password, user.created_at);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === '23505') { // Unique violation
        throw new Error("User already exists");
      }
      throw new Error("Database error");
    }
  }

  async findAll() {
    try {
      const result = await this.pool.query(
        "SELECT id, email, created_at FROM users ORDER BY created_at DESC"
      );

      return result.rows.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }));
    } catch (error) {
      console.error("Error finding all users:", error);
      throw new Error("Database error");
    }
  }
}
