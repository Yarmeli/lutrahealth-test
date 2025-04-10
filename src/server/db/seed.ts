import { reset, seed } from "drizzle-seed";
import { checkDatabaseConnection, db } from ".";
import { patients } from "./schema";

async function main() {
	console.log("Checking database connection...");
	const result = await checkDatabaseConnection();
	if (!result) {
		console.error(
			"Database connection failed. Please check your database credentials and try again.",
		);
		process.exit(1);
	}
	console.log("Database connection successful");
	console.log("Seeding database...");
	try {
		await reset(db, { patients });
		await seed(db, { patients });
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
	console.log("Done");
	process.exit(0);
}

main();
