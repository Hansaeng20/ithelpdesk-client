import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TicketForm } from "../components/TicketForm";
import { ErrorState, Icon, LoadingState, PageHeader } from "../components/ui";
import { useAuth } from "../context/useAuth";
import { getTicket, updateTicket } from "../services/ticketService";
import type { Ticket } from "../types";
import type { TicketFormData } from "../schemas/ticketSchema";

const EditTicketPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(Boolean(id));
    const [error, setError] = useState("");
    const canEditPriority = user?.role === "IT Support";

    useEffect(() => {
        if (!id) return;
        let active = true;
        getTicket(id).then(response => { if (active) setTicket(response.ticket); }).catch(err => { console.error(err); if (active) setError("Unable to load this ticket."); }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    const submit = async (data: TicketFormData) => {
        if (!id) return;
        try {
            setError("");
            const payload = canEditPriority ? data : { title: data.title, description: data.description, category: data.category };
            await updateTicket(id, payload);
            navigate(`/tickets/${id}`, { replace: true, state: { notice: "Ticket updated successfully." } });
        } catch (err) {
            console.error(err);
            setError("We could not save your changes. Please try again.");
        }
    };

    return <div className="page max-w-4xl"><Link to={id ? `/tickets/${id}` : "/tickets"} className="text-link mb-5"><Icon name="arrowLeft" size={15} />Back to ticket</Link><PageHeader eyebrow="Ticket update" title="Edit request" description="Keep the details accurate so support can resolve the issue faster." />{loading ? <div className="panel"><LoadingState label="Loading ticket..." /></div> : !ticket ? <ErrorState message={error || "Invalid ticket ID."} /> : <>{error && <div className="mb-5"><ErrorState message={error} /></div>}<TicketForm key={ticket._id} isEdit initial={{ title: ticket.title, description: ticket.description, category: ticket.category, priority: ticket.priority }} allowPriority={canEditPriority} cancelTo={`/tickets/${ticket._id}`} onSubmit={submit} /></>}</div>;
};

export default EditTicketPage;
