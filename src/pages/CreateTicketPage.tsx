import { useState } from "react";
import {
    useForm,
    type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
    ticketSchema,
    type TicketFormData,
} from "../schemas/ticketSchema";

import { createTicket } from "../services/ticketService";

const CreateTicketPage = () => {
    const navigate = useNavigate();

    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            priority: "Medium",
            category: "Software",
        },
    });

    const onSubmit: SubmitHandler<TicketFormData> = async (
        data,
    ) => {
        try {
            setSubmitError("");
            setSuccessMessage("");

            const response = await createTicket(data);

            setSuccessMessage(
                `Ticket ${response.ticket.ticketNumber} created successfully.`,
            );

            setTimeout(() => {
                navigate(`/tickets/${response.ticket._id}`);
            }, 700);
        } catch (error) {
            console.error(error);

            setSubmitError(
                "Unable to create ticket. Please check your information and try again.",
            );
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back */}
            <Link
                to="/tickets"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                ← Back to Tickets
            </Link>

            {/* Header */}
            <div className="mt-6">
                <p className="text-sm font-medium text-blue-600">
                    Support Request
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Create Ticket
                </h1>

                <p className="mt-2 text-slate-500">
                    Submit an IT support request.
                </p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
                {/* Title */}
                <FormField
                    label="Title"
                    error={errors.title?.message}
                >
                    <input
                        {...register("title")}
                        placeholder="Example: Laptop cannot connect to Wi-Fi"
                        className="input"
                    />
                </FormField>

                {/* Description */}
                <FormField
                    label="Description"
                    error={errors.description?.message}
                >
                    <textarea
                        {...register("description")}
                        rows={5}
                        placeholder="Describe the issue in detail..."
                        className="input resize-none"
                    />
                </FormField>

                {/* Category and Priority */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                        label="Category"
                        error={errors.category?.message}
                    >
                        <select
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
                    </FormField>

                    <FormField
                        label="Priority"
                        error={errors.priority?.message}
                    >
                        <select
                            {...register("priority")}
                            className="input"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </FormField>
                </div>

                {/* SLA Information */}
                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                    <p className="font-semibold">
                        SLA is calculated automatically.
                    </p>

                    <p className="mt-1">
                        Critical: 4h · High: 8h · Medium: 24h · Low: 72h
                    </p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Creating Ticket..."
                        : "Create Ticket"}
                </button>
            </form>
        </div>
    );
};

interface FormFieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

const FormField = ({
    label,
    error,
    children,
}: FormFieldProps) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CreateTicketPage;