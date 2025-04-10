"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@lutra/components/ui/dialog";
import { cn } from "@lutra/lib/utils";
import { usePatientStore } from "@lutra/store/patient-store";
import { api } from "@lutra/trpc/react";
import { Loader2 } from "lucide-react";

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

export function PatientDetailsDialog() {
	const { selectedPatientId, setSelectedPatientId } = usePatientStore();
	const { data: selectedPatient, isLoading } = api.patients.getById.useQuery(
		{ id: selectedPatientId ?? 1 },
		{ enabled: !!selectedPatientId },
	);

	return (
		<Dialog
			open={!!selectedPatientId}
			onOpenChange={() => setSelectedPatientId(null)}
		>
			<DialogContent className="rounded-lg shadow-lg">
				<DialogHeader>
					<DialogTitle className="font-bold text-2xl ">
						Patient Details
					</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<div className="flex h-full items-center justify-center">
						<Loader2 className="size-4 animate-spin " />
					</div>
				) : null}
				{selectedPatient && (
					<div className="space-y-4">
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
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
