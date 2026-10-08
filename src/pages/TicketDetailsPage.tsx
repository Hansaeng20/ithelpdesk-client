import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    deleteTicket,
    getTicket,
    updateTicketStatus,
} from "../services/ticketService";

import { useAuth } from "../context/AuthContext";

import type { Ticket, TicketStatus } from "../types";

const TicketDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [ticket, setTicket] = useState<Ticket | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [deleting, setDeleting] = useState(false);

    const [status, setStatus] = useState<TicketStatus>("Open");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const isITSupport = user?.role === "IT Support";

    useEffect(() => {
        const fetchTicket = async () => {
            if (!id) {
                setError("Invalid ticket ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await getTicket(id);

                setTicket(response.ticket);
                setStatus(response.ticket.status);
            } catch (err) {
                console.error(err);
                setError("Unable to load this ticket.");
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);


    const handleStatusChange = async () => {
        if (!id) return;

        try {
            setUpdatingStatus(true);
            setError("");
            setSuccess("");

            const response = await updateTicketStatus(
                id,
                status,
            );

            setTicket(response.ticket);
            setStatus(response.ticket.status);

            setSuccess("Ticket status updated successfully.");
        } catch (err) {
            console.error(err);

            setError(
                "Unable to update ticket status. Please check the allowed status transition.",
            );

            if (ticket) {
                setStatus(ticket.status);
            }
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this ticket? This action cannot be undone.",
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await deleteTicket(id);

            setSuccess("Ticket deleted successfully.");

            setTimeout(() => {
                navigate("/tickets");
            }, 800);
        } catch (err) {
            console.error(err);
            setError("Unable to delete this ticket.");
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-sm text-slate-500">
                        Loading ticket...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !ticket) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>

                    <Link
                        to="/tickets"
                        className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Tickets
                    </Link>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return null;
    }

    const isOverdue =
        new Date(ticket.dueAt).getTime() < Date.now() &&
        !["Resolved", "Closed", "Cancelled"].includes(
            ticket.status,
        );

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Back */}
            <div className="mb-6">
                <Link
                    to="/tickets"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Tickets
                </Link>
            </div>

            {/* Feedback */}
            {success && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        {ticket.ticketNumber}
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        {ticket.title}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Created {formatDate(ticket.createdAt)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">

                    <Link
                        to={`/tickets/${ticket._id}/edit`}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Edit
                    </Link>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>

                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Main content */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Description */}
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Ticket Description
                        </h2>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                            {ticket.description}
                        </p>

                    </section>

                    {/* Requester */}
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Requester Information
                        </h2>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                            <InfoItem
                                label="Name"
                                value={ticket.requesterName}
                            />

                            <InfoItem
                                label="Email"
                                value={ticket.requesterEmail}
                            />

                            <InfoItem
                                label="Department"
                                value={
                                    ticket.department?.name || "N/A"
                                }
                            />

                            <InfoItem
                                label="Department Code"
                                value={
                                    ticket.department?.code || "N/A"
                                }
                            />

                        </div>

                    </section>

                    {/* IT SUPPORT CONTROLS */}
                    {isITSupport && (
                        <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">

                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    IT Support
                                </p>

                                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                    Ticket Management
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage assignment and ticket status.
                                </p>
                            </div>

                            <div className="space-y-6">


                                {/* Status */}
                                <div className="border-t border-blue-200 pt-6">

                                    <label
                                        htmlFor="status"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Ticket Status
                                    </label>

                                    <div className="flex flex-col gap-3 sm:flex-row">

                                        <select
                                            id="status"
                                            value={status}
                                            onChange={(event) =>
                                                setStatus(event.target.value as TicketStatus)
                                            }
                                            className="input"
                                            disabled={
                                                updatingStatus ||
                                                status === "Resolved" ||
                                                status === "Cancelled"
                                            }
                                        >
                                            {ticket.status === "Open" && (
                                                <>
                                                    <option value="Open">
                                                        Open
                                                    </option>

                                                    <option value="In Progress">
                                                        In Progress
                                                    </option>
                                                </>
                                            )}

                                            {ticket.status === "In Progress" && (
                                                <>
                                                    <option value="In Progress">
                                                        In Progress
                                                    </option>

                                                    <option value="Resolved">
                                                        Resolved (Closed)
                                                    </option>
                                                </>
                                            )}

                                            {ticket.status === "Resolved" && (
                                                <option value="Resolved">
                                                    Resolved (Closed)
                                                </option>
                                            )}

                                            {ticket.status === "Cancelled" && (
                                                <option value="Cancelled">
                                                    Cancelled
                                                </option>
                                            )}
                                        </select>

                                        <button
                                            type="button"
                                            onClick={handleStatusChange}
                                            disabled={
                                                updatingStatus ||
                                                status === ticket.status
                                            }
                                            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {updatingStatus
                                                ? "Updating..."
                                                : "Update Status"}
                                        </button>

                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        The system will reject invalid status
                                        transitions.
                                    </p>

                                </div>

                            </div>

                        </section>
                    )}

                </div>

                {/* Sidebar */}
                <aside className="space-y-6">

                    {/* Status */}
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Ticket Status
                        </h2>

                        <div className="mt-5 space-y-5">

                            <InfoItem
                                label="Status"
                                value={
                                    ticket.status === "Resolved"
                                        ? "Resolved (Closed)"
                                        : ticket.status
                                }
                            />

                            <InfoItem
                                label="Priority"
                                value={ticket.priority}
                            />

                            <InfoItem
                                label="Category"
                                value={ticket.category}
                            />


                        </div>

                    </section>

                    {/* SLA */}
                    <section
                        className={`rounded-xl border p-6 shadow-sm ${isOverdue
                            ? "border-red-200 bg-red-50"
                            : "border-slate-200 bg-white"
                            }`}
                    >

                        <h2 className="text-lg font-semibold text-slate-900">
                            SLA Information
                        </h2>

                        <div className="mt-5 space-y-5">

                            <InfoItem
                                label="SLA"
                                value={`${ticket.slaHours} hours`}
                            />

                            <InfoItem
                                label="Due At"
                                value={formatDate(ticket.dueAt)}
                            />

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    SLA Status
                                </p>

                                <p
                                    className={`mt-1 text-sm font-semibold ${isOverdue
                                        ? "text-red-700"
                                        : "text-green-700"
                                        }`}
                                >
                                    {isOverdue
                                        ? "Overdue"
                                        : "Within SLA"}
                                </p>
                            </div>

                            {ticket.resolvedAt && (
                                <InfoItem
                                    label="Resolved At"
                                    value={formatDate(ticket.resolvedAt)}
                                />
                            )}

                        </div>

                    </section>

                </aside>

            </div>
        </div>
    );
};

interface InfoItemProps {
    label: string;
    value: string;
}

const InfoItem = ({
    label,
    value,
}: InfoItemProps) => {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
                {value}
            </p>
        </div>
    );
};

export default TicketDetailsPage;