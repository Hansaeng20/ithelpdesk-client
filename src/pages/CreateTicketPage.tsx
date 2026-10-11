import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TicketForm } from "../components/TicketForm";
import { ErrorState, Icon, PageHeader } from "../components/ui";
import { createTicket } from "../services/ticketService";
import type { TicketFormData } from "../schemas/ticketSchema";

const CreateTicketPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const submit = async (data: TicketFormData) => {
        try {
            setError("");
            const response = await createTicket(data);
            navigate(`/tickets/${response.ticket._id}`, { replace: true, state: { notice: `Request ${response.ticket.ticketNumber} was created.` } });
        } catch (err) {
            console.error(err);
            setError("We could not submit your request. Check your connection and try again.");
        }
    };

    return <div className="page max-w-4xl"><Link to="/tickets" className="text-link mb-5"><Icon name="arrowLeft" size={15} />Back to tickets</Link><PageHeader eyebrow="New support request" title="How can we help?" description="Describe the issue clearly. Your department is added from your account, and you can track progress after submitting." />{error && <div className="mb-5"><ErrorState message={error} /></div>}<TicketForm cancelTo="/tickets" onSubmit={submit} /></div>;
};

export default CreateTicketPage;
