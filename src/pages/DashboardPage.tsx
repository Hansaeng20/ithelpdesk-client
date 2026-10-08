import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";

const DashboardPage = () => {
    const { user } = useAuth();
    const { tickets, loading, error } = useTickets();

    const isITSupport = user?.role === "IT Support";

    const openCount = tickets.filter(
        (ticket) => ticket.status === "Open",
    ).length;

    const inProgressCount = tickets.filter(
        (ticket) => ticket.status === "In Progress",
    ).length;

    const resolvedCount = tickets.filter(
        (ticket) => ticket.status === "Resolved",
    ).length;

    const overdueCount = tickets.filter(
        (ticket) =>
            new Date(ticket.dueAt) < new Date() &&
            !["Resolved", "Cancelled"].includes(ticket.status),
    ).length;

    const recentTickets = tickets.slice(0, 5);

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
                <p className="text-sm font-medium text-blue-600">
                    {isITSupport ? "Overview" : "My Requests"}
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {isITSupport
                        ? "Helpdesk Dashboard"
                        : "My IT Requests"}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    {isITSupport
                        ? "Monitor ticket activity and service performance."
                        : "Track your support requests and their current status."}
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading dashboard...
                    </p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* Dashboard */}
            {!loading && !error && (
                <>
                    {/* Statistics */}
                    <div
                        className={`grid gap-5 ${isITSupport
                                ? "sm:grid-cols-2 lg:grid-cols-4"
                                : "sm:grid-cols-3"
                            }`}
                    >
                        <StatCard
                            label={
                                isITSupport
                                    ? "Open"
                                    : "Open Requests"
                            }
                            value={openCount}
                            description={
                                isITSupport
                                    ? "Waiting for IT Support"
                                    : "Waiting for support"
                            }
                        />

                        <StatCard
                            label={
                                isITSupport
                                    ? "In Progress"
                                    : "Being Worked On"
                            }
                            value={inProgressCount}
                            description="Currently being handled"
                        />

                        <StatCard
                            label={
                                isITSupport
                                    ? "Resolved"
                                    : "Resolved Requests"
                            }
                            value={resolvedCount}
                            description={
                                isITSupport
                                    ? "Successfully resolved"
                                    : "Successfully completed"
                            }
                        />

                        {isITSupport && (
                            <StatCard
                                label="Overdue"
                                value={overdueCount}
                                description="Past SLA deadline"
                            />
                        )}
                    </div>

                    {/* Recent Tickets */}
                    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {isITSupport
                                        ? "Recent Tickets"
                                        : "My Recent Requests"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {isITSupport
                                        ? "Latest support requests."
                                        : "Your latest IT support requests."}
                                </p>
                            </div>

                            <Link
                                to="/tickets"
                                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                            >
                                View all
                            </Link>
                        </div>

                        {/* Empty State */}
                        {recentTickets.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                    <span className="text-lg text-slate-400">
                                        ✓
                                    </span>
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                    {isITSupport
                                        ? "No tickets available"
                                        : "No requests yet"}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {isITSupport
                                        ? "There are currently no support tickets to display."
                                        : "You have not submitted any IT support requests yet."}
                                </p>

                                {!isITSupport && (
                                    <Link
                                        to="/tickets/new"
                                        className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Create Ticket
                                    </Link>
                                )}
                            </div>
                        ) : (
                            /* Ticket List */
                            <div className="divide-y divide-slate-100">
                                {recentTickets.map((ticket) => (
                                    <Link
                                        key={ticket._id}
                                        to={`/tickets/${ticket._id}`}
                                        className="flex flex-col gap-3 px-6 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-blue-600">
                                                {ticket.ticketNumber}
                                            </p>

                                            <p className="mt-1 truncate font-semibold text-slate-900">
                                                {ticket.title}
                                            </p>

                                            {isITSupport && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {ticket.requesterName}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 sm:shrink-0">
                                            <StatusBadge
                                                status={ticket.status}
                                            />

                                            <span className="text-xs text-slate-400">
                                                {new Date(
                                                    ticket.createdAt,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: number;
    description: string;
}

const StatCard = ({
    label,
    value,
    description,
}: StatCardProps) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {value}
            </p>

            <p className="mt-2 text-xs text-slate-400">
                {description}
            </p>
        </div>
    );
};

interface StatusBadgeProps {
    status: string;
}

const StatusBadge = ({
    status,
}: StatusBadgeProps) => {
    const styles: Record<string, string> = {
        Open: "bg-blue-50 text-blue-700",
        "In Progress": "bg-amber-50 text-amber-700",
        Resolved: "bg-green-50 text-green-700",
        Cancelled: "bg-red-50 text-red-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ??
                "bg-slate-100 text-slate-600"
                }`}
        >
            {status === "Resolved"
                ? "Resolved (Closed)"
                : status}
        </span>
    );
};

export default DashboardPage;