import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import type { Ticket } from "../types";

interface TicketListResponse {
    success: boolean;
    count: number;
    tickets: Ticket[];
}

const OverduePage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOverdueTickets = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get<TicketListResponse>("/tickets/overdue");

                setTickets(response.data.tickets);
            } catch (err) {
                console.error(err);
                setError("Unable to load overdue tickets.");
            } finally {
                setLoading(false);
            }
        };

        fetchOverdueTickets();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-medium text-red-600">
                    SLA Monitoring
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Overdue Tickets
                </h1>

                <p className="mt-2 text-slate-500">
                    Tickets that have passed their SLA deadline and are still unresolved.
                </p>
            </div>

            {loading && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-sm text-slate-500">
                        Loading overdue tickets...
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {!loading && !error && tickets.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                        ✓
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        No overdue tickets
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        All active tickets are currently within their SLA deadlines.
                    </p>
                </div>
            )}

            {!loading && !error && tickets.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Ticket
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Title
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Priority
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Due
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {tickets.map((ticket) => (
                                    <tr
                                        key={ticket._id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-blue-600">
                                            {ticket.ticketNumber}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="max-w-xs truncate text-sm font-medium text-slate-900">
                                                {ticket.title}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {ticket.department?.name || "No department"}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <PriorityBadge priority={ticket.priority} />
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge status={ticket.status} />
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <p className="text-sm font-medium text-red-600">
                                                {formatDate(ticket.dueAt)}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                SLA: {ticket.slaHours} hours
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/tickets/${ticket._id}`}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

interface PriorityBadgeProps {
    priority: Ticket["priority"];
}

const PriorityBadge = ({
    priority,
}: PriorityBadgeProps) => {
    const styles = {
        Low: "bg-slate-100 text-slate-700",
        Medium: "bg-blue-100 text-blue-700",
        High: "bg-orange-100 text-orange-700",
        Critical: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}
        >
            {priority}
        </span>
    );
};

interface StatusBadgeProps {
    status: Ticket["status"];
}

const StatusBadge = ({
    status,
}: StatusBadgeProps) => {
    return (
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            {status}
        </span>
    );
};

export default OverduePage;