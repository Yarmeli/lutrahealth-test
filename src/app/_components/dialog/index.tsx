"use client";

import { Button } from "@lutra/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@lutra/components/ui/dialog";
import { type PatientStore, usePatientStore } from "@lutra/store/patient-store";
import { api } from "@lutra/trpc/react";
import { ArrowLeft } from "lucide-react";
import { Loading } from "../loading";
import {
	AppointmentForm,
	type AppointmentFormValues,
	AppointmentList,
} from "./appointment";
import { PatientDetailsSection } from "./patient";

export function PatientDetailsDialog() {
	const {
		selectedPatientId,
		setSelectedPatientId,
		dialogStage,
		setDialogStage,
	} = usePatientStore();

	const { data: selectedPatient, isLoading } = api.patients.getById.useQuery(
		{ id: selectedPatientId ?? 1 },
		{ enabled: !!selectedPatientId },
	);

	const { data: appointments, refetch: refetchAppointments } =
		api.appointments.getByPatientId.useQuery(
			{ patientId: selectedPatientId ?? 1 },
			{ enabled: !!selectedPatientId },
		);

	const createAppointment = api.appointments.create.useMutation({
		onSuccess: () => {
			refetchAppointments();
		},
	});

	const handleCreateAppointment = (data: AppointmentFormValues) => {
		if (!selectedPatientId) return;

		createAppointment.mutate({
			patientId: selectedPatientId,
			scheduledFor: data.scheduledFor,
			reason: data.reason,
			notes: data.notes,
		});
	};

	return (
		<Dialog
			open={!!selectedPatientId}
			onOpenChange={() => {
				setSelectedPatientId(null);
				setDialogStage("view");
			}}
		>
			<DialogContent className="max-w-2xl rounded-lg shadow-lg">
				<DialogHeader>
					<DialogTitle className="font-bold text-2xl">
						{dialogStage === "view" ? "Patient Details" : "Manage Appointments"}
					</DialogTitle>
				</DialogHeader>
				{isLoading ? <Loading /> : null}
				{selectedPatient && (
					<div className="space-y-4">
						{dialogStage === "view" ? (
							<PatientDetailsSection selectedPatient={selectedPatient} />
						) : (
							<>
								<BackButton dialogStage="view" />
								<div className="space-y-6">
									<div>
										<h3 className="mb-4 font-medium text-lg">
											Existing Appointments
										</h3>
										{appointments && appointments.length > 0 ? (
											<AppointmentList appointments={appointments} />
										) : (
											<p className="text-gray-500">No appointments scheduled</p>
										)}
									</div>
									<div>
										<h3 className="mb-4 font-medium text-lg">
											Schedule New Appointment
										</h3>
										<AppointmentForm onSubmit={handleCreateAppointment} />
									</div>
								</div>
							</>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

function BackButton({
	dialogStage,
}: { dialogStage: PatientStore["dialogStage"] }) {
	const { setDialogStage } = usePatientStore();

	return (
		<div className="flex items-center gap-2 pb-4">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setDialogStage(dialogStage)}
				className="gap-2"
			>
				<ArrowLeft className="size-4" />
				Back to Patient Details
			</Button>
		</div>
	);
}
