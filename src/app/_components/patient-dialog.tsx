"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@lutra/components/ui/button";
import { Calendar as CalendarComponent } from "@lutra/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@lutra/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@lutra/components/ui/form";
import { Input } from "@lutra/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@lutra/components/ui/popover";
import { ScrollArea, ScrollBar } from "@lutra/components/ui/scroll-area";
import { Textarea } from "@lutra/components/ui/textarea";
import { cn } from "@lutra/lib/utils";
import type { AppRouter } from "@lutra/server/api/root";
import { usePatientStore } from "@lutra/store/patient-store";
import { api } from "@lutra/trpc/react";
import type { inferProcedureOutput } from "@trpc/server";
import { format } from "date-fns";
import { ArrowLeft, Calendar, CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const appointmentFormSchema = z.object({
	scheduledFor: z.date({
		required_error: "A date and time is required.",
	}),
	reason: z.string().min(1, "Reason is required"),
	notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

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

function AppointmentList({
	appointments,
}: {
	appointments: inferProcedureOutput<
		AppRouter["appointments"]["getByPatientId"]
	>;
}) {
	return (
		<div className="space-y-2">
			{appointments.map((appointment) => (
				<div key={appointment.id} className="rounded-lg border p-4">
					<div className="flex items-start justify-between">
						<div>
							<p className="font-medium">{appointment.reason}</p>
							<p className="text-gray-500 text-sm">
								{format(new Date(appointment.scheduledFor), "PPP p")}
							</p>
							{appointment.notes && (
								<p className="mt-2 text-sm">{appointment.notes}</p>
							)}
						</div>
						<span
							className={cn("rounded-full px-2 py-1 text-xs", {
								"bg-yellow-100 text-yellow-800":
									appointment.status === "SCHEDULED",
								"bg-blue-100 text-blue-800": appointment.status === "CONFIRMED",
								"bg-green-100 text-green-800":
									appointment.status === "COMPLETED",
								"bg-red-100 text-red-800": appointment.status === "CANCELLED",
							})}
						>
							{appointment.status}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}

function AppointmentForm({
	onSubmit,
}: { onSubmit: (data: AppointmentFormValues) => void }) {
	const form = useForm<AppointmentFormValues>({
		resolver: zodResolver(appointmentFormSchema),
		defaultValues: {
			scheduledFor: undefined,
			reason: "",
			notes: "",
		},
	});

	function handleDateSelect(date: Date | undefined) {
		if (date) {
			form.setValue("scheduledFor", date);
		}
	}

	function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
		const currentDate = form.getValues("scheduledFor") || new Date();
		const newDate = new Date(currentDate);

		if (type === "hour") {
			const hour = Number.parseInt(value, 10);
			newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
		} else if (type === "minute") {
			newDate.setMinutes(Number.parseInt(value, 10));
		} else if (type === "ampm") {
			const hours = newDate.getHours();
			if (value === "AM" && hours >= 12) {
				newDate.setHours(hours - 12);
			} else if (value === "PM" && hours < 12) {
				newDate.setHours(hours + 12);
			}
		}

		form.setValue("scheduledFor", newDate);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="scheduledFor"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Date and Time</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-full pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "dd/MM/yyyy hh:mm aa")
											) : (
												<span>DD/MM/YYYY hh:mm aa</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<div className="sm:flex">
										<CalendarComponent
											mode="single"
											selected={field.value}
											onSelect={handleDateSelect}
											initialFocus
											fromDate={new Date()}
										/>
										<div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
											<ScrollArea className="w-64 sm:w-auto">
												<div className="flex p-2 sm:flex-col">
													{Array.from({ length: 12 }, (_, i) => i + 1)
														.reverse()
														.map((hour) => (
															<Button
																key={hour}
																size="icon"
																variant={
																	field.value &&
																	field.value.getHours() % 12 === hour % 12
																		? "default"
																		: "ghost"
																}
																className="aspect-square shrink-0 sm:w-full"
																onClick={() =>
																	handleTimeChange("hour", hour.toString())
																}
															>
																{hour}
															</Button>
														))}
												</div>
												<ScrollBar
													orientation="horizontal"
													className="sm:hidden"
												/>
											</ScrollArea>
											<ScrollArea className="w-64 sm:w-auto">
												<div className="flex p-2 sm:flex-col">
													{Array.from({ length: 12 }, (_, i) => i * 5).map(
														(minute) => (
															<Button
																key={minute}
																size="icon"
																variant={
																	field.value &&
																	field.value.getMinutes() === minute
																		? "default"
																		: "ghost"
																}
																className="aspect-square shrink-0 sm:w-full"
																onClick={() =>
																	handleTimeChange("minute", minute.toString())
																}
															>
																{minute.toString().padStart(2, "0")}
															</Button>
														),
													)}
												</div>
												<ScrollBar
													orientation="horizontal"
													className="sm:hidden"
												/>
											</ScrollArea>
											<ScrollArea className="">
												<div className="flex p-2 sm:flex-col">
													{["AM", "PM"].map((ampm) => (
														<Button
															key={ampm}
															size="icon"
															variant={
																field.value &&
																((ampm === "AM" &&
																	field.value.getHours() < 12) ||
																	(ampm === "PM" &&
																		field.value.getHours() >= 12))
																	? "default"
																	: "ghost"
															}
															className="aspect-square shrink-0 sm:w-full"
															onClick={() => handleTimeChange("ampm", ampm)}
														>
															{ampm}
														</Button>
													))}
												</div>
											</ScrollArea>
										</div>
									</div>
								</PopoverContent>
							</Popover>
							<FormDescription>
								Please select your preferred date and time.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="reason"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Reason</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes (Optional)</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					Schedule Appointment
				</Button>
			</form>
		</Form>
	);
}

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
				{isLoading ? (
					<div className="flex h-full items-center justify-center">
						<Loader2 className="size-4 animate-spin" />
					</div>
				) : null}
				{selectedPatient && (
					<div className="space-y-4">
						{dialogStage === "view" ? (
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
						) : (
							<>
								<div className="flex items-center gap-2 pb-4">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setDialogStage("view")}
										className="gap-2"
									>
										<ArrowLeft className="size-4" />
										Back to Patient Details
									</Button>
								</div>
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
