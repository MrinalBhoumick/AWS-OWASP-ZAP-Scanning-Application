import pkg from "pg";

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "authdb",
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('rds.amazonaws.com') 
    ? { rejectUnauthorized: false } 
    : false,
};

console.log("🔌 Connecting to database:", {
  host: poolConfig.host,
  user: poolConfig.user,
  database: poolConfig.database,
  port: poolConfig.port
});

export const pool = new pkg.Pool(poolConfig);

pool.on("connect", () => {
  console.log("✅ Database connected successfully");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
