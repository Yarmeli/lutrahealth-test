"use client";
import { Input } from "@lutra/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@lutra/components/ui/table";
import { usePatientStore } from "@lutra/store/patient-store";
import { api } from "@lutra/trpc/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default function PatientData() {
	const { setSelectedPatientId } = usePatientStore();
	const [searchName, setSearchName] = useState("");
	const debouncedSearchName = useDebounce(searchName, 300);

	const {
		data: patients,
		status,
		error,
	} = api.patients.getAll.useQuery({
		searchName: debouncedSearchName,
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-2">
				<Input
					placeholder="Search by name..."
					value={searchName}
					onChange={(e) => setSearchName(e.target.value)}
					className="max-w-sm"
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{patients?.map((patient) => (
						<TableRow
							key={patient.id}
							className="hover:cursor-pointer"
							onClick={() => setSelectedPatientId(patient.id)}
						>
							<TableCell>
								{patient.firstName} {patient.lastName}
							</TableCell>
							<TableCell>
								<span className="blur-sm transition-all duration-300 hover:blur-none">
									{patient.email || "-"}
								</span>
							</TableCell>
							<TableCell>
								<span
									className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
										patient.isActive
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{patient.isActive ? (
										<>
											<svg
												className="mr-1 h-3 w-3"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
												aria-label="Active"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
												<title>Active</title>
											</svg>
											Active
										</>
									) : (
										<>
											<svg
												className="mr-1 h-3 w-3"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fillRule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
												<title>Inactive</title>
											</svg>
											Inactive
										</>
									)}
								</span>
							</TableCell>
						</TableRow>
					))}
					{patients?.length === 0 && status === "success" ? (
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex h-full items-center justify-center">
									No patients found
								</div>
							</TableCell>
						</TableRow>
					) : null}
					{status === "pending" ? (
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex h-full items-center justify-center">
									<Loader2 className="size-4 animate-spin" />
								</div>
							</TableCell>
						</TableRow>
					) : null}

					{status === "error" ? (
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex h-full items-center justify-center">
									Error loading patients: ${error?.message}
								</div>
							</TableCell>
						</TableRow>
					) : null}
				</TableBody>
			</Table>
		</div>
	);
}
