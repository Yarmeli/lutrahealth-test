"use client";

import { Button } from "@lutra/components/ui/button";
import { cn } from "@lutra/lib/utils";
import type { AppRouter } from "@lutra/server/api/root";
import { usePatientStore } from "@lutra/store/patient-store";
import type { inferProcedureOutput } from "@trpc/server";
import { Calendar } from "lucide-react";

function PatientDetail({
	label,
	value,
	isBlurred = false,
}: { label: string; value?: string | null; isBlurred?: boolean }) {
	return (
		<div className="border-b p-4">
			<h3 className="font-medium text-lg">{label}</h3>
			<p
				className={cn({
					"blur-sm transition-all duration-300 hover:blur-none": isBlurred,
				})}
			>
				{value || "-"}
			</p>
		</div>
	);
}

export function PatientDetailsSection({
	selectedPatient,
}: {
	selectedPatient: inferProcedureOutput<AppRouter["patients"]["getById"]>;
}) {
	const { setDialogStage } = usePatientStore();

	if (!selectedPatient) {
		return <div>Patient not found</div>;
	}

	return (
		<>
			<PatientDetail
				label="Name"
				value={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
			/>
			<PatientDetail
				label="Email"
				value={selectedPatient.email}
				isBlurred={true}
			/>
			<PatientDetail
				label="Status"
				value={selectedPatient.isActive ? "Active" : "Inactive"}
			/>
			<PatientDetail
				label="Date of Birth"
				value={selectedPatient.dateOfBirth}
				isBlurred={true}
			/>
			<PatientDetail
				label="Created At"
				value={selectedPatient.createdAt.toLocaleString()}
			/>
			<PatientDetail
				label="Updated At"
				value={selectedPatient.updatedAt?.toLocaleString()}
			/>
			<div className="flex justify-end pt-4">
				<Button
					onClick={() => setDialogStage("booking")}
					className="flex items-center gap-2"
				>
					<Calendar className="size-4" />
					Manage Appointments
				</Button>
			</div>
		</>
	);
}
