import { db } from "@lutra/server/db";
import { patients } from "@lutra/server/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../trpc";

export const patientsRouter = {
	getAll: publicProcedure.query(async () => {
		return db.query.patients.findMany({
			columns: {
				id: true,
				firstName: true,
				lastName: true,
				isActive: true,
				email: true,
			},
		});
	}),
} satisfies TRPCRouterRecord;
