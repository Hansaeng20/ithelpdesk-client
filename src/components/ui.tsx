import type { ReactNode, SVGProps } from "react";
import type { TicketPriority, TicketStatus } from "../types";

type IconProps = SVGProps<SVGSVGElement> & { name: string; size?: number };

export function Icon({ name, size = 20, ...props }: IconProps) {
    const paths: Record<string, ReactNode> = {
        dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
        tickets: <><path d="M5 4h14a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 1 2-2Z" /><path d="M13 4v2m0 3v2m0 3v2m0 3v1" /></>,
        clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
        analytics: <><path d="M4 20V11m5 9V4m5 16v-7m5 7V8" /><path d="M2 20h20" /></>,
        building: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 21v-5h6v5M8 8h2m4 0h2M8 12h2m4 0h2" /></>,
        user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
        plus: <path d="M12 5v14M5 12h14" />,
        arrowRight: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
        arrowLeft: <><path d="M20 12H4m6 6-6-6 6-6" /></>,
        chevronRight: <path d="m9 18 6-6-6-6" />,
        chevronDown: <path d="m6 9 6 6 6-6" />,
        menu: <path d="M4 7h16M4 12h16M4 17h16" />,
        close: <path d="M5 5l14 14M19 5 5 19" />,
        search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
        filter: <><path d="M4 6h16M7 12h10m-7 6h4" /><circle cx="8" cy="6" r="1" fill="currentColor" stroke="none" /></>,
        calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></>,
        logout: <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" /><path d="M13 8l4 4-4 4m-7-4h11" /></>,
        check: <path d="m5 12 4 4L19 6" />,
        alert: <><path d="M10.3 3.5a2 2 0 0 1 3.4 0l8 14A2 2 0 0 1 20 20H4a2 2 0 0 1-1.7-2.5Z" /><path d="M12 9v4m0 3h.01" /></>,
        bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
        monitor: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8m-4-3v3" /></>,
        refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.7 9a7 7 0 0 1 12.1-2L20 12M4 12l2.2 5a7 7 0 0 0 12.1-2" /></>,
        trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v6m4-6v6" /></>,
        edit: <><path d="M4 20h4l11-11a2 2 0 0 0-4-4L4 16v4Z" /><path d="m13 7 4 4" /></>,
        mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
        shield: <><path d="M12 2 4 5v6c0 5 3 8 8 11 5-3 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
        message: <><path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 20l.9-4.5A8.5 8.5 0 1 1 20 11.5Z" /><path d="M8 11h8m-8 4h5" /></>,
        sparkles: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.6 1.4L21 19l-1.4.6L19 21l-.6-1.4L17 19l1.4-.6L19 17Z" /></>,
        eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
        info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
    };

    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.sparkles}</svg>;
}

export function StatusBadge({ status }: { status: TicketStatus }) {
    const className = status.toLowerCase().replace(" ", "-");
    return <span className={`badge badge-status-${className}`}><span className="badge-dot" />{status}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
    return <span className={`badge badge-priority-${priority.toLowerCase()}`}>{priority}</span>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
    return <div className="page-header"><div><p className="eyebrow">{eyebrow ?? "IT Helpdesk"}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}

export function EmptyState({ icon = "tickets", title, description, action }: { icon?: string; title: string; description: string; action?: ReactNode }) {
    return <div className="empty-state"><div className="empty-icon"><Icon name={icon} size={25} /></div><h3>{title}</h3><p>{description}</p>{action && <div className="empty-action">{action}</div>}</div>;
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
    return <div className="loading-state" role="status"><span className="loader" /><span>{label}</span></div>;
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
    return <div className="error-state" role="alert"><Icon name="alert" /><span>{message}</span>{retry && <button type="button" className="btn btn-outline btn-small" onClick={retry}>Try again</button>}</div>;
}

