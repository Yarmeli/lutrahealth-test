import { db } from "@lutra/server/db";
import { appointmentStatus, appointments } from "@lutra/server/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../trpc";

export const appointmentsRouter = {
	create: publicProcedure
		.input(
			z.object({
				patientId: z.number(),
				scheduledFor: z.date(),
				reason: z.string(),
				notes: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			return db.insert(appointments).values({
				patientId: input.patientId,
				scheduledFor: input.scheduledFor,
				reason: input.reason,
				notes: input.notes,
				status: "SCHEDULED",
			});
		}),

	getByPatientId: publicProcedure
		.input(z.object({ patientId: z.number() }))
		.query(async ({ input }) => {
			return db.query.appointments.findMany({
				where: eq(appointments.patientId, input.patientId),
			});
		}),

	getByStatus: publicProcedure
		.input(z.object({ status: z.enum(appointmentStatus) }))
		.query(async ({ input }) => {
			return db.query.appointments.findMany({
				where: eq(appointments.status, input.status),
			});
		}),
} satisfies TRPCRouterRecord;
