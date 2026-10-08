import { z } from "zod";

export const ticketSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters.")
        .max(120, "Title must not exceed 120 characters."),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters.")
        .max(2000, "Description must not exceed 2000 characters."),

    category: z.enum([
        "Hardware",
        "Software",
        "Network",
        "Account Access",
        "Printer",
        "Email",
        "Other",
    ]),

    priority: z.enum([
        "Low",
        "Medium",
        "High",
        "Critical",
    ]),
});

export type TicketFormData = z.infer<
    typeof ticketSchema
>;