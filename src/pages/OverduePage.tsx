import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { EmptyState, ErrorState, Icon, LoadingState, PageHeader, PriorityBadge, StatusBadge } from "../components/ui";
import { formatDate } from "../utils/tickets";
import type { Ticket } from "../types";

const OverduePage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const load = useCallback(async () => { try { setLoading(true); setError(""); const response = await api.get<{ tickets: Ticket[] }>("/tickets/overdue"); setTickets(response.data.tickets); } catch (err) { console.error(err); setError("Unable to load overdue tickets."); } finally { setLoading(false); } }, []);
    useEffect(() => {
        let active = true;
        api.get<{ tickets: Ticket[] }>("/tickets/overdue").then(response => {
            if (active) setTickets(response.data.tickets);
        }).catch(err => {
            console.error(err);
            if (active) setError("Unable to load overdue tickets.");
        }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    return <div className="page"><PageHeader eyebrow="SLA monitoring" title="Overdue tickets" description="Unresolved requests that have passed their service deadline, sorted by due date." action={<button type="button" className="btn btn-outline" onClick={load}><Icon name="refresh" size={16} />Refresh</button>} />{loading ? <div className="panel"><LoadingState label="Loading overdue tickets..." /></div> : error ? <ErrorState message={error} retry={load} /> : <section className="panel overflow-hidden"><div className="panel-head"><div><h2>Needs attention</h2><p>{tickets.length} {tickets.length === 1 ? "request" : "requests"} past the deadline</p></div><span className="inline-grid place-items-center w-9 h-9 rounded-xl bg-rose-50 text-rose-600"><Icon name="alert" size={18} /></span></div>{tickets.length === 0 ? <EmptyState icon="check" title="All caught up" description="No active tickets are past their SLA deadline." /> : <><div className="table-wrap hidden md:block"><table className="data-table"><thead><tr><th>Ticket</th><th>Request</th><th>Priority</th><th>Status</th><th>Due date</th><th aria-label="View" /></tr></thead><tbody>{tickets.map(ticket => <tr key={ticket._id}><td><Link className="text-link" to={`/tickets/${ticket._id}`}>{ticket.ticketNumber}</Link></td><td><span className="cell-title">{ticket.title}</span><span className="cell-sub">{ticket.department?.name ?? "No department"}</span></td><td><PriorityBadge priority={ticket.priority} /></td><td><StatusBadge status={ticket.status} /></td><td className="text-rose-600! font-bold">{formatDate(ticket.dueAt, true)}</td><td><Link to={`/tickets/${ticket._id}`} className="text-link" aria-label={`View ${ticket.ticketNumber}`}><Icon name="chevronRight" size={16} /></Link></td></tr>)}</tbody></table></div><div className="md:hidden divide-y divide-slate-100">{tickets.map(ticket => <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block p-5 hover:bg-slate-50"><span className="text-[10px] font-bold text-indigo-500">{ticket.ticketNumber}</span><strong className="block mt-1 text-sm text-slate-800">{ticket.title}</strong><span className="block mt-2 text-xs font-bold text-rose-600">Due {formatDate(ticket.dueAt, true)}</span><span className="flex gap-2 mt-3"><PriorityBadge priority={ticket.priority} /><StatusBadge status={ticket.status} /></span></Link>)}</div></>}</section>}</div>;
};

export default OverduePage;
