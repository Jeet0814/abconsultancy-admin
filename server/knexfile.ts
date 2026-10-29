import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "ab_consultancy_db",
      charset: "utf8mb4",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(__dirname, "src", "db", "migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
      extension: "ts",
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8mb4",
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },
};

export default config;
