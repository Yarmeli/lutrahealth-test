import type { Config } from "drizzle-kit";

import { env } from "@lutra/env";

export default {
	schema: "./src/server/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	tablesFilter: ["lutra-tech-test_*"],
} satisfies Config;
