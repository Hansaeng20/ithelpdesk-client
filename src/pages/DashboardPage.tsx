import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTickets } from "../hooks/useTickets";
import { EmptyState, ErrorState, Icon, LoadingState, PageHeader, PriorityBadge, StatusBadge } from "../components/ui";
import { formatDate, getSlaState, slaLabel } from "../utils/tickets";
import type { Ticket } from "../types";

function Metric({ label, value, note, icon, tone = "indigo" }: { label: string; value: number; note: string; icon: string; tone?: string }) {
    const tones: Record<string, string> = { indigo: "text-indigo-600 bg-indigo-50", teal: "text-teal-700 bg-teal-50", amber: "text-amber-700 bg-amber-50", rose: "text-rose-600 bg-rose-50" };
    return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tones[tone]}`}><Icon name={icon} size={18} /></span></div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></div>;
}

const DashboardPage = () => {
    const { user } = useAuth();
    const { tickets, loading, error, refetch } = useTickets();
    const isSupport = user?.role === "IT Support";
    const firstName = user?.name?.split(" ")[0] || "there";
    const open = tickets.filter(ticket => ticket.status === "Open").length;
    const progress = tickets.filter(ticket => ticket.status === "In Progress").length;
    const resolved = tickets.filter(ticket => ticket.status === "Resolved").length;
    const overdue = tickets.filter(ticket => getSlaState(ticket.dueAt, ticket.status) === "overdue").length;
    const recent = tickets.slice(0, 5);
    const urgent = tickets.filter(ticket => ["overdue", "due-soon"].includes(getSlaState(ticket.dueAt, ticket.status))).sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()).slice(0, 3);

    return <div className="page">
        <PageHeader eyebrow={isSupport ? "Support command center" : "Your workspace"} title={`Good day, ${firstName}.`} description={isSupport ? "A clear view of your queue and what needs attention next." : "Your requests, updates, and deadlines in one calm workspace."} action={!isSupport && <Link to="/tickets/new" className="btn btn-primary"><Icon name="plus" size={17} />New request</Link>} />

        {loading ? <div className="panel"><LoadingState label="Loading your dashboard..." /></div> : error ? <ErrorState message={error} retry={refetch} /> : <>
            <div className="metric-grid">
                <Metric label={isSupport ? "Open tickets" : "Open requests"} value={open} note="Waiting to be picked up" icon="tickets" />
                <Metric label="In progress" value={progress} note="Work is underway" icon="refresh" tone="amber" />
                <Metric label="Resolved" value={resolved} note="Successfully completed" icon="check" tone="teal" />
                <Metric label={isSupport ? "Overdue" : "All requests"} value={isSupport ? overdue : tickets.length} note={isSupport ? "Need prompt attention" : "Your submitted tickets"} icon={isSupport ? "alert" : "dashboard"} tone={isSupport ? "rose" : "indigo"} />
            </div>

            <div className="grid gap-5 mt-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,.8fr)]">
                <section className="panel overflow-hidden">
                    <div className="panel-head"><div><h2>{isSupport ? "Recent activity" : "Your latest requests"}</h2><p>{isSupport ? "Newest tickets across the organization" : "Follow the progress of your support requests"}</p></div><Link to="/tickets" className="text-link">View all <Icon name="arrowRight" size={15} /></Link></div>
                    {recent.length === 0 ? <EmptyState icon="tickets" title="Nothing here yet" description={isSupport ? "New requests will appear here as soon as they are submitted." : "Create your first request and track every update in one place."} action={!isSupport && <Link to="/tickets/new" className="btn btn-primary btn-small">Create a request</Link>} /> : <div className="divide-y divide-slate-100">{recent.map(ticket => <TicketRow key={ticket._id} ticket={ticket} showRequester={isSupport} />)}</div>}
                </section>

                <aside className="section-stack">
                    <div className="panel panel-body support-callout"><span className="inline-grid place-items-center w-10 h-10 rounded-xl bg-white text-indigo-600 shadow-sm"><Icon name={isSupport ? "bolt" : "message"} size={20} /></span><h2 className="mt-4 text-[17px] font-extrabold tracking-tight text-slate-800">{isSupport ? "Stay ahead of the queue" : "Need help with something?"}</h2><p className="mt-2 text-[12px] leading-6 text-slate-500">{isSupport ? "Review tickets closest to their SLA deadline and keep every request moving." : "Tell us what is happening. We will keep the details and progress together for you."}</p><Link to={isSupport ? "/overdue" : "/tickets/new"} className="text-link mt-5">{isSupport ? "Review overdue" : "Create a request"}<Icon name="arrowRight" size={15} /></Link></div>
                    <div className="panel overflow-hidden"><div className="panel-head"><div><h2>{isSupport ? "Needs attention" : "Coming up"}</h2><p>Closest active deadlines</p></div></div>{urgent.length === 0 ? <div className="p-6 text-center text-xs text-slate-500">All active tickets are on track.</div> : <div className="divide-y divide-slate-100">{urgent.map(ticket => <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block px-5 py-4 hover:bg-slate-50 transition"><span className="block text-[10px] font-bold text-indigo-500">{ticket.ticketNumber}</span><span className="block mt-1 text-xs font-bold text-slate-700 truncate">{ticket.title}</span><span className={`sla-pill mt-2 ${getSlaState(ticket.dueAt, ticket.status)}`}>{slaLabel(ticket.dueAt, ticket.status)} · {formatDate(ticket.dueAt, true)}</span></Link>)}</div>}</div>
                </aside>
            </div>
        </>}
    </div>;
};

function TicketRow({ ticket, showRequester }: { ticket: Ticket; showRequester: boolean }) {
    return <Link to={`/tickets/${ticket._id}`} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 transition"><div className="min-w-0"><span className="text-[10px] font-extrabold text-indigo-500">{ticket.ticketNumber}</span><strong className="block mt-1 text-xs text-slate-800 truncate">{ticket.title}</strong><span className="block mt-1 text-[11px] text-slate-400">{showRequester ? `${ticket.requesterName} · ` : ""}{formatDate(ticket.createdAt)}</span></div><div className="flex items-center gap-2"><PriorityBadge priority={ticket.priority} /><StatusBadge status={ticket.status} /><Icon name="chevronRight" size={15} className="text-slate-400" /></div></Link>;
}

export default DashboardPage;
