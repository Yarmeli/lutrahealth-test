import { db } from "@lutra/server/db";
import { patients } from "@lutra/server/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../trpc";

export const patientsRouter = {
	getAll: publicProcedure
		.input(
			z.object({
				searchName: z.string().optional(),
				limit: z.number().default(10),
				offset: z.number().default(0),
			}),
		)
		.query(async ({ input }) => {
			return db.query.patients.findMany({
				where:
					input.searchName && input.searchName.length > 0
						? or(
								ilike(patients.firstName, `%${input.searchName}%`),
								ilike(patients.lastName, `%${input.searchName}%`),
							)
						: undefined,
				limit: input.limit,
				offset: input.offset,
				columns: {
					id: true,
					firstName: true,
					lastName: true,
					isActive: true,
					email: true,
				},
			});
		}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
			return db.query.patients.findFirst({
				where: eq(patients.id, input.id),
			});
		}),
} satisfies TRPCRouterRecord;
