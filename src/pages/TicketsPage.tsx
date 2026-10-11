import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import { useAuth } from "../context/useAuth";
import { EmptyState, ErrorState, Icon, LoadingState, PageHeader, PriorityBadge, StatusBadge } from "../components/ui";
import { formatDate, getSlaState, slaLabel } from "../utils/tickets";
import type { Ticket } from "../types";

const TicketsPage = () => {
    const { tickets, loading, error, refetch } = useTickets();
    const { user } = useAuth();
    const isSupport = user?.role === "IT Support";
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All statuses");
    const [priority, setPriority] = useState("All priorities");

    const filtered = useMemo(() => tickets.filter(ticket => {
        const term = query.trim().toLowerCase();
        const matchesSearch = !term || [ticket.ticketNumber, ticket.title, ticket.description, ticket.requesterName, ticket.department?.name].some(value => value?.toLowerCase().includes(term));
        return matchesSearch && (status === "All statuses" || ticket.status === status) && (priority === "All priorities" || ticket.priority === priority);
    }), [tickets, query, status, priority]);

    const resetFilters = () => { setQuery(""); setStatus("All statuses"); setPriority("All priorities"); };
    const filteredOut = tickets.length > 0 && filtered.length === 0;

    return <div className="page">
        <PageHeader eyebrow="Ticket workspace" title={isSupport ? "All tickets" : "My tickets"} description={isSupport ? "Search, prioritize, and keep support work moving." : "See every request and where it stands."} action={!isSupport && <Link to="/tickets/new" className="btn btn-primary"><Icon name="plus" size={17} />New request</Link>} />
        <section className="panel overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div className="relative flex-1 max-w-md"><Icon name="search" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input pl-10!" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title, ticket ID, requester..." aria-label="Search tickets" /></div><div className="flex flex-wrap gap-2"><select className="input w-auto min-w-[140px]" aria-label="Filter by status" value={status} onChange={event => setStatus(event.target.value)}>{["All statuses", "Open", "In Progress", "Resolved", "Cancelled"].map(value => <option key={value}>{value}</option>)}</select><select className="input w-auto min-w-[140px]" aria-label="Filter by priority" value={priority} onChange={event => setPriority(event.target.value)}>{["All priorities", "Critical", "High", "Medium", "Low"].map(value => <option key={value}>{value}</option>)}</select></div></div>
            <div className="px-5 py-3 flex items-center justify-between gap-3 text-[11px] text-slate-500"><span><strong className="text-slate-800">{filtered.length}</strong> {filtered.length === 1 ? "ticket" : "tickets"} shown</span>{(query || status !== "All statuses" || priority !== "All priorities") && <button type="button" className="text-link" onClick={resetFilters}>Clear filters</button>}</div>
            {loading ? <LoadingState label="Loading tickets..." /> : error ? <div className="p-5"><ErrorState message={error} retry={refetch} /></div> : filteredOut ? <EmptyState icon="search" title="No matching tickets" description="Try another keyword or clear the selected filters." action={<button type="button" className="btn btn-outline btn-small" onClick={resetFilters}>Clear filters</button>} /> : tickets.length === 0 ? <EmptyState title="No tickets yet" description={isSupport ? "Submitted requests will appear here." : "Tell us what you need help with and we will take it from there."} action={!isSupport && <Link to="/tickets/new" className="btn btn-primary btn-small">Create your first request</Link>} /> : <>
                <div className="table-wrap hidden md:block"><table className="data-table"><thead><tr><th>Ticket</th><th>Request</th><th>Priority</th><th>Status</th><th>SLA</th><th aria-label="View" /></tr></thead><tbody>{filtered.map(ticket => <TicketTableRow key={ticket._id} ticket={ticket} isSupport={isSupport} />)}</tbody></table></div>
                <div className="md:hidden divide-y divide-slate-100">{filtered.map(ticket => <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="block p-5 hover:bg-slate-50"><span className="text-[10px] font-extrabold text-indigo-500">{ticket.ticketNumber}</span><strong className="block mt-1 text-sm text-slate-800">{ticket.title}</strong><span className="block mt-1 text-xs text-slate-500">{isSupport ? `${ticket.requesterName} · ` : ""}{formatDate(ticket.createdAt)}</span><span className="flex gap-2 flex-wrap mt-3"><PriorityBadge priority={ticket.priority} /><StatusBadge status={ticket.status} /></span></Link>)}</div>
            </>}
        </section>
    </div>;
};

function TicketTableRow({ ticket, isSupport }: { ticket: Ticket; isSupport: boolean }) {
    const state = getSlaState(ticket.dueAt, ticket.status);
    return <tr><td><Link to={`/tickets/${ticket._id}`} className="text-link">{ticket.ticketNumber}</Link><span className="cell-sub">{formatDate(ticket.createdAt)}</span></td><td className="max-w-[360px]"><Link to={`/tickets/${ticket._id}`} className="cell-title hover:text-indigo-600">{ticket.title}</Link><span className="cell-sub">{isSupport ? `${ticket.requesterName} · ` : ""}{ticket.department?.name ?? "No department"}</span></td><td><PriorityBadge priority={ticket.priority} /></td><td><StatusBadge status={ticket.status} /></td><td><span className={`sla-pill ${state}`}>{slaLabel(ticket.dueAt, ticket.status)}</span><span className="cell-sub">{formatDate(ticket.dueAt, true)}</span></td><td><Link to={`/tickets/${ticket._id}`} className="text-link" aria-label={`View ${ticket.ticketNumber}`}><Icon name="chevronRight" size={17} /></Link></td></tr>;
}

export default TicketsPage;
