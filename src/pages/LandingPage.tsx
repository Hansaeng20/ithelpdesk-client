import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                            IT
                        </div>

                        <span className="font-bold">
                            IT Helpdesk
                        </span>
                    </div>

                    <Link
                        to="/login"
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            <main>
                <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
                            IT Support Management System
                        </p>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                            Resolve IT issues faster with
                            <span className="text-blue-400">
                                {" "}data-driven support.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                            Manage support tickets, track service-level
                            deadlines, monitor overdue requests, and
                            understand resolution performance from one
                            centralized system.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/login"
                                    className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    to="/tickets/new"
                                    className="rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
                                >
                                    Create a Ticket
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-t border-white/10 bg-slate-900">
                    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
                        <Feature
                            title="SLA Tracking"
                            description="Automatically calculate deadlines based on ticket priority."
                        />

                        <Feature
                            title="Resolution Analytics"
                            description="Measure resolution time and SLA compliance."
                        />

                        <Feature
                            title="Ticket Management"
                            description="Search, filter, update, and monitor support requests."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

interface FeatureProps {
    title: string;
    description: string;
}

const Feature = ({ title, description }: FeatureProps) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold text-white">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
            </p>
        </div>
    );
};

export default LandingPage;