import knex, { Knex } from "knex";
import config from "../../knexfile";

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment] || config.development;

export const db: Knex = knex(dbConfig);

export async function testDbConnection(): Promise<boolean> {
  try {
    await db.raw("SELECT 1+1 AS result");
    console.log("[Database] Connected successfully to MySQL 8 via Knex & mysql2.");
    return true;
  } catch (error) {
    console.error("[Database] Failed to connect to MySQL database:", error);
    return false;
  }
}

export default db;
