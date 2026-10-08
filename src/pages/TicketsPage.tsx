import { Link } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import { useAuth } from "../context/AuthContext";

const TicketsPage = () => {
    const { tickets, loading, error, refetch } = useTickets();
    const { user } = useAuth();

    const isITSupport = user?.role === "IT Support";

    if (loading) {
        return (
            <PageContainer>
                <LoadingState />
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    <p>{error}</p>

                    <button
                        onClick={refetch}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-blue-600">
                        Support Management
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Tickets
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage and monitor IT support requests.
                    </p>
                </div>
            </div>

            {tickets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        No tickets yet
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {isITSupport
                            ? "No support tickets are available yet."
                            : "Create your first support ticket to get started."}
                    </p>

                    {!isITSupport && (
                        <Link
                            to="/tickets/new"
                            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Create Ticket
                        </Link>
                    )}
                </div>
            ) : (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Ticket
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Request
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Department
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Priority
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        SLA
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {tickets.map((ticket) => {
                                    const isOverdue =
                                        new Date(ticket.dueAt) < new Date() &&
                                        ![
                                            "Resolved",
                                            "Closed",
                                        ].includes(ticket.status);

                                    return (
                                        <tr
                                            key={ticket._id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <Link
                                                    to={`/tickets/${ticket._id}`}
                                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                                >
                                                    {ticket.ticketNumber}
                                                </Link>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {new Date(
                                                        ticket.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-900">
                                                    {ticket.title}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {ticket.requesterName}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {ticket.department.name}
                                            </td>

                                            <td className="px-5 py-4">
                                                <PriorityBadge
                                                    priority={ticket.priority}
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={ticket.status} />
                                            </td>

                                            <td className="px-5 py-4">
                                                {isOverdue ? (
                                                    <span className="font-semibold text-red-600">
                                                        Overdue
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-slate-500">
                                                        {ticket.slaHours}h SLA
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

const PageContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
        </div>
    );
};

const LoadingState = () => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading tickets...
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {status}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    return (
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {priority}
        </span>
    );
};

export default TicketsPage;