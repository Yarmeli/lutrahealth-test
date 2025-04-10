import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const helloRouter = {
	greeting: publicProcedure.query(async () => {
		return "Hello 👋 This is the API calling 👽";
	}),
} satisfies TRPCRouterRecord;
