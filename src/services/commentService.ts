import api from "./api";
import type { TicketComment } from "../types";

export async function getTicketComments(ticketId: string): Promise<TicketComment[]> {
    const response = await api.get<{ success: boolean; comments: TicketComment[] }>(`/comments/ticket/${ticketId}`);
    return response.data.comments;
}

export async function createTicketComment(ticketId: string, message: string): Promise<TicketComment> {
    const response = await api.post<{ success: boolean; comment: TicketComment }>("/comments", { ticket: ticketId, message });
    return response.data.comment;
}
