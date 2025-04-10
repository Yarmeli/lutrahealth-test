import { HydrateClient, api } from "@lutra/trpc/server";

import { InstructionBanner } from "./_components/instruction-banner";

export default async function Home() {
	const greeting = await api.hello.greeting();

	return (
		<HydrateClient>
			<div className="space-y-4 p-4 sm:p-6 lg:p-8">
				<InstructionBanner />
				<header>
					<h1>{greeting}</h1>
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-lg">Patients</h3>
					</div>
				</header>
				<main>
					<div className="mt-6">
						<div className="grid grid-cols-1 gap-4 pb-1 sm:grid-cols-2 lg:grid-cols-3">
							{[0].map((item) => (
								<div
									key={item}
									className="group relative rounded border border-gray-200 bg-white p-2"
								>
									<div className="h-20">
										<div className="relative h-full overflow-hidden rounded bg-gray-50">
											<svg
												className="absolute inset-0 h-full w-full stroke-blue-100"
												fill="none"
											>
												<title>Placeholder</title>
												<defs>
													<pattern
														id="pattern-1"
														x="0"
														y="0"
														width="10"
														height="10"
														patternUnits="userSpaceOnUse"
													>
														<path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
													</pattern>
												</defs>
												<rect
													stroke="none"
													fill="url(#pattern-1)"
													width="100%"
													height="100%"
												/>
											</svg>
										</div>
									</div>
									<h3 className="mt-2 font-semibold">
										<a
											href="/#"
											className="focus:outline-none group-hover:text-blue-600"
										>
											<span className="absolute inset-0" aria-hidden={true} />
											Placeholder Text
										</a>
									</h3>
									<p className="text-gray-600">Placeholder description</p>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</HydrateClient>
	);
}
