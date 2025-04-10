import { PatientDetailsDialog } from "./_components/dialog";
import { InstructionBanner } from "./_components/instruction-banner";
import PatientData from "./_components/patient";

export default async function Home() {
	return (
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
					<PatientDetailsDialog />
				</div>
			</main>
		</div>
	);
}
