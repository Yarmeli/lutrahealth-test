import { sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Create tables with project prefix to avoid conflicts
 */
export const createTable = pgTableCreator((name) => `lutra-tech-test_${name}`);

export const appointmentStatusEnum = pgEnum("appointment_status", [
	"SCHEDULED",
	"CONFIRMED",
	"COMPLETED",
	"CANCELLED",
]);

// Patients table
export const patients = createTable(
	"patient",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		firstName: d.varchar({ length: 100 }).notNull(),
		lastName: d.varchar({ length: 100 }).notNull(),
		dateOfBirth: d.date().notNull(),
		email: d.varchar({ length: 256 }),
		isActive: d.boolean().default(true).notNull(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("patient_name_idx").on(t.lastName, t.firstName),
		index("patient_dob_idx").on(t.dateOfBirth),
	],
);

// Appointments table
export const appointments = createTable(
	"appointment",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		patientId: d
			.integer()
			.references(() => patients.id, { onDelete: "cascade" })
			.notNull(),
		scheduledFor: d.timestamp({ withTimezone: true }).notNull(),
		status: appointmentStatusEnum("SCHEDULED").notNull(),
		reason: d.varchar({ length: 256 }).notNull(),
		notes: d.text(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("appointment_patient_idx").on(t.patientId),
		index("appointment_status_idx").on(t.status),
		index("appointment_date_idx").on(t.scheduledFor),
	],
);
