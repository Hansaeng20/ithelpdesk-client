import { useCallback, useEffect, useState } from "react";
import type { Ticket } from "../types";
import { getTickets } from "../services/ticketService";

export const useTickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getTickets();

            setTickets(response.tickets);
        } catch (err) {
            console.error(err);
            setError("Unable to load tickets.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return {
        tickets,
        loading,
        error,
        refetch: fetchTickets,
    };
};