import { HydrateClient, api } from "@lutra/trpc/server";
import { InstructionBanner } from "./_components/instruction-banner";
import PatientData from "./_components/patient";

export default async function Home() {
	const patients = await api.patients.getAll();

	return (
		<HydrateClient>
			<div className="space-y-4 p-4 sm:p-6 lg:p-8">
				<InstructionBanner />
				<header>
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-lg">Patients</h3>
					</div>
				</header>
				<main>
					<div className="mt-6">
						<PatientData />
					</div>
				</main>
			</div>
		</HydrateClient>
	);
}
