import api from "./api";
import type {
    Ticket,
    TicketPriority,
    TicketStatus,
    TicketCategory,
} from "../types";

interface TicketListResponse {
    success: boolean;
    count: number;
    tickets: Ticket[];
}

interface TicketResponse {
    success: boolean;
    ticket: Ticket;
}

export interface CreateTicketData {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
}

export const getTickets = async (): Promise<TicketListResponse> => {
    const response = await api.get<TicketListResponse>("/tickets");
    return response.data;
};

export const getTicket = async (
    id: string,
): Promise<TicketResponse> => {
    const response = await api.get<TicketResponse>(`/tickets/${id}`);
    return response.data;
};

export const createTicket = async (
    data: CreateTicketData,
): Promise<TicketResponse> => {
    const response = await api.post<TicketResponse>("/tickets", data);
    return response.data;
};

export const updateTicket = async (
    id: string,
    data: Partial<CreateTicketData>,
): Promise<TicketResponse> => {
    const response = await api.put<TicketResponse>(
        `/tickets/${id}`,
        data,
    );

    return response.data;
};

export const deleteTicket = async (
    id: string,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
};

export const updateTicketStatus = async (
    id: string,
    status: TicketStatus,
): Promise<TicketResponse> => {
    const response = await api.patch<TicketResponse>(
        `/tickets/${id}/status`,
        { status },
    );

    return response.data;
};