import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    getTicket,
    updateTicket,
} from "../services/ticketService";

import {
    ticketSchema,
    type TicketFormData,
} from "../schemas/ticketSchema";

const EditTicketPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
    });

    useEffect(() => {
        const loadTicket = async () => {
            if (!id) {
                setError("Invalid ticket ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await getTicket(id);
                const ticket = response.ticket;

                reset({
                    title: ticket.title,
                    description: ticket.description,
                    category: ticket.category,
                    priority: ticket.priority,
                });
            } catch (err) {
                console.error(err);
                setError("Unable to load ticket information.");
            } finally {
                setLoading(false);
            }
        };

        loadTicket();
    }, [id, reset]);

    const onSubmit: SubmitHandler<TicketFormData> = async (
        data,
    ) => {
        if (!id) {
            setError("Invalid ticket ID.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateTicket(id, data);

            setSuccess("Ticket updated successfully.");

            setTimeout(() => {
                navigate(`/tickets/${id}`);
            }, 800);
        } catch (err) {
            console.error(err);

            setError(
                "Unable to update ticket. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading ticket...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    to={`/tickets/${id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Ticket
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                    Edit Ticket
                </h1>

                <p className="mt-2 text-slate-500">
                    Update the ticket information below.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
                {/* Title */}
                <div>
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Ticket Title
                    </label>

                    <input
                        id="title"
                        {...register("title")}
                        className="input"
                    />

                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        rows={6}
                        {...register("description")}
                        className="input resize-none"
                    />

                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Category
                    </label>

                    <select
                        id="category"
                        {...register("category")}
                        className="input"
                    >
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Network">Network</option>
                        <option value="Account Access">
                            Account Access
                        </option>
                        <option value="Printer">Printer</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                    </select>

                    {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.category.message}
                        </p>
                    )}
                </div>

                {/* Priority */}
                <div>
                    <label
                        htmlFor="priority"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Priority
                    </label>

                    <select
                        id="priority"
                        {...register("priority")}
                        className="input"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>

                    {errors.priority && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.priority.message}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                        Changing priority may recalculate the ticket SLA
                        deadline.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                    <Link
                        to={`/tickets/${id}`}
                        className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTicketPage;