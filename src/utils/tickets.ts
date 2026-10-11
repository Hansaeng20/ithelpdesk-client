import type { TicketStatus } from "../types";

export function formatDate(date: string | null | undefined, withTime = false) {
    if (!date) return "—";
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return "—";
    return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric", ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}) }).format(value);
}

export function getSlaState(dueAt: string, status: TicketStatus) {
    if (status === "Resolved" || status === "Cancelled") return "complete";
    const hours = (new Date(dueAt).getTime() - Date.now()) / 3600000;
    if (hours < 0) return "overdue";
    if (hours <= 4) return "due-soon";
    return "on-track";
}

export function slaLabel(dueAt: string, status: TicketStatus) {
    const state = getSlaState(dueAt, status);
    if (state === "complete") return "Completed";
    if (state === "overdue") return "Overdue";
    if (state === "due-soon") return "Due soon";
    return "On track";
}
