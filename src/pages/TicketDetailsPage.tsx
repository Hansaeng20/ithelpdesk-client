import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { createTicketComment, getTicketComments } from "../services/commentService";
import { deleteTicket, getTicket, updateTicketStatus } from "../services/ticketService";
import { ErrorState, Icon, LoadingState, PageHeader, PriorityBadge, StatusBadge } from "../components/ui";
import { formatDate, getSlaState, slaLabel } from "../utils/tickets";
import type { Ticket, TicketComment, TicketStatus } from "../types";

const TicketDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const isSupport = user?.role === "IT Support";
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [loading, setLoading] = useState(Boolean(id));
    const [error, setError] = useState("");
    const [commentError, setCommentError] = useState("");
    const [notice, setNotice] = useState((location.state as { notice?: string } | null)?.notice ?? "");
    const [statusBusy, setStatusBusy] = useState(false);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!id) return;
        let active = true;
        getTicket(id).then(response => { if (active) setTicket(response.ticket); }).catch(err => { console.error(err); if (active) setError("Unable to load this ticket."); }).finally(() => { if (active) setLoading(false); });
        getTicketComments(id).then(data => { if (active) setComments(data); }).catch(err => { console.error(err); if (active) setCommentError("Conversation is unavailable right now."); });
        return () => { active = false; };
    }, [id]);

    const nextStatus: TicketStatus | null = ticket?.status === "Open" ? "In Progress" : ticket?.status === "In Progress" ? "Resolved" : null;
    const changeStatus = async () => {
        if (!id || !nextStatus) return;
        try { setStatusBusy(true); setError(""); const response = await updateTicketStatus(id, nextStatus); setTicket(response.ticket); setNotice(`Status changed to ${nextStatus}.`); }
        catch (err) { console.error(err); setError("Could not update the status. Please try again."); }
        finally { setStatusBusy(false); }
    };
    const removeTicket = async () => {
        if (!id) return;
        try { setDeleteBusy(true); setError(""); await deleteTicket(id); navigate("/tickets", { replace: true }); }
        catch (err) { console.error(err); setError("Could not delete this ticket."); setConfirmDelete(false); }
        finally { setDeleteBusy(false); }
    };
    const sendComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id || !message.trim()) return;
        try { setSending(true); setCommentError(""); const newComment = await createTicketComment(id, message.trim()); setComments(current => [...current, newComment]); setMessage(""); }
        catch (err) { console.error(err); setCommentError("Message was not sent. Please try again."); }
        finally { setSending(false); }
    };

    if (loading) return <div className="page"><div className="panel"><LoadingState label="Loading ticket..." /></div></div>;
    if (!ticket) return <div className="page"><Link to="/tickets" className="text-link mb-5"><Icon name="arrowLeft" size={15} />Back to tickets</Link><ErrorState message={error || (id ? "Ticket not found." : "Invalid ticket ID.")} /></div>;
    const slaState = getSlaState(ticket.dueAt, ticket.status);

    return <div className="page">
        <Link to="/tickets" className="text-link mb-5"><Icon name="arrowLeft" size={15} />Back to tickets</Link>
        <PageHeader eyebrow={ticket.ticketNumber} title={ticket.title} description={`Submitted ${formatDate(ticket.createdAt, true)} · ${ticket.category}`} action={<><Link to={`/tickets/${ticket._id}/edit`} className="btn btn-outline"><Icon name="edit" size={16} />Edit</Link><button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}><Icon name="trash" size={16} />Delete</button></>} />
        {notice && <div className="success-state mb-5" role="status"><Icon name="check" size={17} />{notice}<button type="button" className="ml-auto" aria-label="Dismiss notification" onClick={() => setNotice("")}><Icon name="close" size={15} /></button></div>}
        {error && <div className="mb-5"><ErrorState message={error} /></div>}
        <div className="detail-grid">
            <div className="section-stack">
                <section className="panel"><div className="panel-head"><div><h2>Request details</h2><p>The issue as described by the requester</p></div><span className="text-indigo-500"><Icon name="tickets" size={20} /></span></div><div className="panel-body"><p className="text-[13px] leading-7 whitespace-pre-wrap text-slate-600">{ticket.description}</p><div className="info-grid mt-7 pt-6 border-t border-slate-100"><Info label="Requester" value={ticket.requesterName} /><Info label="Email" value={ticket.requesterEmail} /><Info label="Department" value={ticket.department?.name ?? "—"} /><Info label="Category" value={ticket.category} /></div></div></section>
                {isSupport && <section className="panel"><div className="panel-head"><div><h2>Ticket workflow</h2><p>Move the request through its supported status steps</p></div><Icon name="shield" size={20} className="text-teal-600" /></div><div className="panel-body flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"><div><StatusBadge status={ticket.status} /><p className="mt-2 text-xs text-slate-500">{nextStatus ? `Next step: ${nextStatus}` : "This ticket is complete."}</p></div>{nextStatus && <button type="button" onClick={changeStatus} disabled={statusBusy} className="btn btn-primary"><Icon name="arrowRight" size={16} />{statusBusy ? "Updating..." : `Move to ${nextStatus}`}</button>}</div></section>}
                <section className="panel"><div className="panel-head"><div><h2>Conversation</h2><p>Keep updates and context with the ticket</p></div><Icon name="message" size={20} className="text-indigo-500" /></div><div className="panel-body"><div className="space-y-5">{comments.length === 0 ? <p className="text-xs text-slate-500">No updates yet. Start the conversation below.</p> : comments.map(comment => <div key={comment._id} className="flex gap-3"><span className="avatar w-8! h-8! rounded-full! text-[11px]!">{comment.authorName.charAt(0).toUpperCase()}</span><div className="min-w-0 flex-1 rounded-xl bg-slate-50 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-xs text-slate-700">{comment.authorName} <span className="font-medium text-slate-400">· {comment.authorType}</span></strong><span className="text-[10px] text-slate-400">{formatDate(comment.createdAt, true)}</span></div><p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-slate-600">{comment.message}</p></div></div>)}</div>{commentError && <div className="mt-4"><ErrorState message={commentError} /></div>}<form onSubmit={sendComment} className="mt-6 pt-5 border-t border-slate-100"><label htmlFor="comment" className="field-label">Add an update</label><textarea id="comment" className="input" rows={3} maxLength={1000} placeholder="Write a helpful update..." value={message} onChange={event => setMessage(event.target.value)} required /><div className="flex justify-between items-center gap-3 mt-3"><span className="text-[11px] text-slate-400">{message.length}/1000 characters</span><button type="submit" className="btn btn-primary btn-small" disabled={sending || !message.trim()}>{sending ? "Sending..." : "Post update"}<Icon name="arrowRight" size={14} /></button></div></form></div></section>
            </div>
            <aside className="section-stack content-start">
                <section className="panel"><div className="panel-head"><h2>At a glance</h2></div><div className="panel-body space-y-5"><div className="flex items-center justify-between gap-3"><span className="info-label">Status</span><StatusBadge status={ticket.status} /></div><div className="flex items-center justify-between gap-3"><span className="info-label">Priority</span><PriorityBadge priority={ticket.priority} /></div><Info label="Ticket ID" value={ticket.ticketNumber} /><Info label="Last updated" value={formatDate(ticket.updatedAt, true)} /></div></section>
                <section className="panel"><div className="panel-head"><h2>SLA timeline</h2><Icon name="clock" size={19} className="text-indigo-500" /></div><div className="panel-body"><span className={`sla-pill ${slaState}`}>{slaLabel(ticket.dueAt, ticket.status)}</span><div className="info-grid mt-5"><Info label="Target" value={`${ticket.slaHours} hours`} /><Info label="Due date" value={formatDate(ticket.dueAt, true)} /></div>{ticket.resolvedAt && <div className="mt-5"><Info label="Resolved" value={formatDate(ticket.resolvedAt, true)} /></div>}</div></section>
            </aside>
        </div>
        {confirmDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmDelete(false); }}><div className="panel w-full max-w-md p-6" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-rose-50 text-rose-600"><Icon name="alert" size={22} /></span><h2 id="delete-title" className="mt-4 text-lg font-extrabold">Delete this ticket?</h2><p id="delete-description" className="mt-2 text-sm leading-6 text-slate-500">This permanently removes {ticket.ticketNumber}. You cannot undo this action.</p><div className="flex justify-end gap-2 mt-6"><button type="button" className="btn btn-outline" onClick={() => setConfirmDelete(false)}>Keep ticket</button><button type="button" className="btn btn-danger" onClick={removeTicket} disabled={deleteBusy}>{deleteBusy ? "Deleting..." : "Delete ticket"}</button></div></div></div>}
    </div>;
};

function Info({ label, value }: { label: string; value: string }) { return <div><span className="info-label">{label}</span><span className="info-value">{value}</span></div>; }

export default TicketDetailsPage;
