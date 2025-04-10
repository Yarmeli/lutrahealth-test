import { env } from "@lutra/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
	conn: postgres.Sql | undefined;
};

const conn =
	globalForDb.conn ??
	postgres(env.DATABASE_URL, {
		max: 1,
		ssl: env.NODE_ENV === "production",
	});

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

// Helper function to check database connection
export async function checkDatabaseConnection() {
	try {
		await conn`SELECT 1`;
		return true;
	} catch (error) {
		console.error("Database connection failed:", error);
		return false;
	}
}
