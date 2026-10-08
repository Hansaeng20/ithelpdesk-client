export interface Department {
    _id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type TicketPriority =
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

export type TicketStatus =
    | "Open"
    | "In Progress"
    | "Resolved"
    | "Cancelled";

export type TicketCategory =
    | "Hardware"
    | "Software"
    | "Network"
    | "Account Access"
    | "Printer"
    | "Email"
    | "Other";

export interface Ticket {
    _id: string;
    ticketNumber: string;
    title: string;
    description: string;
    requesterName: string;
    requesterEmail: string;
    department: Department;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    slaHours: number;
    dueAt: string;
    resolvedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export type AuthorType = "Requester" | "Support";

export interface TicketComment {
    _id: string;
    ticket: {
        _id: string;
        ticketNumber: string;
        title: string;
    };
    authorName: string;
    message: string;
    authorType: AuthorType;
    createdAt: string;
    updatedAt: string;
}