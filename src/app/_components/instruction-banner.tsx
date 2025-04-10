"use client";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

const steps = [
	{
		id: 1,
		title: "Get it running",
		description: "Since you're reading this, well done 🎉",
	},
	{
		id: 2,
		title: "Create and seed the database 🌱",
		description:
			"The repository contains nearly(!) everything you'll need to get one up and running. Try to only seed the patients table 🙂",
	},
	{
		id: 4,
		title: "🚨 List patients and view details",
		description:
			"List out your patients on the home page, when selected, we should see their details.",
	},
	{
		id: 5,
		title: "🚨 Add appointments to patients",
		description:
			"For each patient, we need to be able to create a new appointment, bonus points for displaying them all on the same page.",
	},
];

export default function Steps() {
	return (
		<ul className="grow space-y-6">
			{steps.map((step, stepIdx) => (
				<li key={step.id} className="relative flex gap-x-3">
					<div
						className={classNames(
							stepIdx === steps.length - 1 ? "h-6" : "-bottom-6",
							"absolute top-0 left-0 flex w-6 justify-center",
						)}
					>
						<span className="w-px bg-gray-200" aria-hidden={true} />
					</div>
					<div className="flex items-start space-x-2.5">
						<div className="relative flex size-6 flex-none items-center justify-center bg-white text-gray-500">
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								className="size-3"
								viewBox="0 0 512 512"
								height="200px"
								width="200px"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Circle</title>
								<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
							</svg>
						</div>
						<div>
							<p className="font-medium text-gray-700">{step.title}</p>
							<p className="mt-0.5 text-gray-600">{step.description}</p>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}

function InstructionBanner() {
	return (
		<>
			<div className="relative rounded-lg border border-gray-200 bg-white p-4">
				<div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
					<div className="flex max-w-lg flex-col gap-2">
						<h3 className="font-semibold">Lutra Health Technical Assessment</h3>
						<p className="mt-2">
							This assessment is primarily designed to assess your ability to
							problem solve. You've been provided a boilerplate but it isn't the
							full implementation. We've listed the steps you'll need to follow
							to complete the assessment.
						</p>
						<p className="mt-2">
							The instructions are intentionally vague to allow you to use your
							best judgement. As much as this is a small assessment, please
							assume that we're looking for scaleable, performant and
							maintainable code.
						</p>
						<p className="mt-2">
							We respect your time and wouldn't expect you to spend any more
							than 3 hours on this assessment. Part of the assessment is
							overcoming obstancles, but if you find yourself stuck, we'd much
							prefer you to reach out for help. The team are available at{" "}
							<a
								className="text-blue-500"
								href="mailto:engineering@lutrahealth.com"
							>
								engineering@lutrahealth.com
							</a>{" "}
							and would be more than happy to help you out.
						</p>
					</div>
					<Steps />
				</div>
			</div>
		</>
	);
}

export { InstructionBanner };
