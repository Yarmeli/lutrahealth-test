"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@lutra/components/ui/table";
import { api } from "@lutra/trpc/react";

export default function PatientData() {
	const { data: patients, isLoading, error } = api.patients.getAll.useQuery();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	if (!patients) return <div>No patients found</div>;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{patients.map((patient) => (
					<TableRow key={patient.id} className="hover:cursor-pointer">
						<TableCell>
							{patient.firstName} {patient.lastName}
						</TableCell>
						<TableCell>{patient.email || "-"}</TableCell>
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
			</TableBody>
		</Table>
	);
}
