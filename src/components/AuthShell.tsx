import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./ui";

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return <div className="auth-screen">
        <aside className="auth-art">
            <Link to="/" className="brand p-0!">
                <span className="brand-mark"><Icon name="bolt" size={23} /></span>
                <span><span className="brand-name">IT Helpdesk</span><span className="brand-subtitle">Service workspace</span></span>
            </Link>
            <div className="auth-network" aria-hidden="true"><span /><span /><span /></div>
            <div className="auth-art-content">
                <p className="eyebrow text-teal-300! mb-5!">Clarity for every request</p>
                <h1>Better support,<br /><span>less waiting.</span></h1>
                <p>A connected workspace for employees and IT teams to resolve what matters, with every update in view.</p>
                <div className="auth-minicards"><MiniCard icon="tickets" label="Track" /><MiniCard icon="clock" label="Prioritize" /><MiniCard icon="check" label="Resolve" /></div>
            </div>
            <span className="auth-art-foot">IT Helpdesk · Simple, visible, dependable support</span>
        </aside>
        <main className="auth-form-wrap">
            <Link to="/" className="auth-back"><Icon name="arrowLeft" size={15} />Back to home</Link>
            <h2>{title}</h2><p>{description}</p>{children}
        </main>
    </div>;
}

function MiniCard({ icon, label }: { icon: string; label: string }) {
    return <div className="auth-mini-card"><Icon name={icon} size={20} />{label}</div>;
}
