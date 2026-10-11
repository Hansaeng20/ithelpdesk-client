import { Link } from "react-router-dom";
import { Icon } from "../components/ui";
import { TypingHeadline } from "../components/TypingHeadline";

const features = [
    { icon: "tickets", title: "Requests with context", text: "Keep the issue, owner, status, and updates together in a clear timeline." },
    { icon: "clock", title: "Visible deadlines", text: "See the SLA target and quickly spot work that needs attention." },
    { icon: "analytics", title: "Useful insights", text: "Understand volume, resolution speed, and service performance." },
];

const steps = [
    { number: "01", icon: "plus", title: "Share the issue", text: "Give your support team the details they need." },
    { number: "02", icon: "eye", title: "Follow each update", text: "See ownership, progress, and deadlines clearly." },
    { number: "03", icon: "check", title: "Get back to work", text: "Keep the resolution and conversation in one place." },
];

const LandingPage = () => (
    <div className="landing">
        <header className="landing-nav">
            <Link to="/" className="flex items-center gap-3 text-slate-800">
                <span className="brand-mark"><Icon name="bolt" size={22} /></span>
                <span className="font-extrabold text-[15px] tracking-tight">IT Helpdesk</span>
            </Link>
            <div className="flex items-center gap-3">
                <Link to="/login" className="text-link hidden sm:inline-flex">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-small">Get started <Icon name="arrowRight" size={15} /></Link>
            </div>
        </header>

        <main>
            <section className="landing-hero">
                <div className="landing-copy">
                    <p className="eyebrow">A smarter service workspace</p>
                    <TypingHeadline />
                    <p>Report issues, follow progress, and stay ahead of deadlines. A focused place for employees and IT teams to solve problems together.</p>
                    <div className="landing-actions">
                        <Link to="/register" className="btn btn-primary">Create an account <Icon name="arrowRight" size={16} /></Link>
                        <Link to="/login" className="btn btn-outline">Sign in</Link>
                    </div>
                    <div className="landing-proof">
                        <span><Icon name="check" size={15} />Clear ticket tracking</span>
                        <span><Icon name="check" size={15} />SLA visibility</span>
                        <span><Icon name="check" size={15} />Team insights</span>
                    </div>
                </div>

                <div className="landing-preview" aria-label="Illustration of the helpdesk dashboard">
                    <div className="preview-heading">
                        <div className="flex items-center gap-3">
                            <span className="brand-mark w-8! h-8! rounded-[10px]!"><Icon name="bolt" size={17} /></span>
                            <div><strong className="block text-xs">Service overview</strong><span className="text-[10px] text-slate-400">Everything in one place</span></div>
                        </div>
                        <span className="topbar-pill text-[9px]">Live workspace</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-5">
                        <PreviewMetric label="Open" value="08" icon="tickets" />
                        <PreviewMetric label="In progress" value="05" icon="refresh" />
                        <PreviewMetric label="Resolved" value="24" icon="check" />
                    </div>
                    <div className="preview-pulse">
                        <div className="preview-pulse-copy"><strong>Response pulse</strong><span>Steady progress, every day</span></div>
                        <div className="pulse-bars" aria-hidden="true">{Array.from({ length: 11 }, (_, index) => <span key={index} />)}</div>
                    </div>
                    <div className="preview-list mt-5 rounded-xl border overflow-hidden">
                        <div className="preview-list-head px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider">Recent requests</div>
                        <PreviewRow id="IT-000124" title="Laptop connection issue" status="In progress" color="bg-amber-100 text-amber-700" />
                        <PreviewRow id="IT-000123" title="Software access request" status="Open" color="bg-indigo-100 text-indigo-700" />
                        <PreviewRow id="IT-000122" title="Printer configuration" status="Resolved" color="bg-teal-100 text-teal-700" />
                    </div>
                    <div className="preview-float-note"><Icon name="shield" size={17} />SLA on track</div>
                </div>
            </section>

            <section className="landing-feature-wrap" aria-label="Helpdesk features">
                <div className="landing-features">
                    {features.map(feature => <div className="landing-feature" key={feature.title}>
                        <span className="feature-icon"><Icon name={feature.icon} size={21} /></span>
                        <h3>{feature.title}</h3><p>{feature.text}</p>
                    </div>)}
                </div>
            </section>
            <section className="landing-flow" aria-label="How it works">
                <div className="landing-flow-heading"><p className="eyebrow">A clear path to resolution</p><h2>From request to resolved.</h2></div>
                <div className="landing-flow-grid">{steps.map(step => <div className="landing-step" key={step.number}>
                    <span className="landing-step-number">{step.number}</span><span className="landing-step-icon"><Icon name={step.icon} size={20} /></span>
                    <h3>{step.title}</h3><p>{step.text}</p>
                </div>)}</div>
            </section>
        </main>
        <footer className="landing-footer">IT Helpdesk · Built for clearer support</footer>
    </div>
);

function PreviewMetric({ label, value, icon }: { label: string; value: string; icon: string }) {
    return <div className="preview-metric rounded-xl p-3"><Icon name={icon} size={15} className="text-indigo-500" /><span className="block mt-3 text-lg font-extrabold">{value}</span><span className="text-[9px] text-slate-500">{label}</span></div>;
}

function PreviewRow({ id, title, status, color }: { id: string; title: string; status: string; color: string }) {
    return <div className="preview-row flex items-center justify-between gap-2 px-4 py-3 border-t"><div className="min-w-0"><span className="block text-[9px] font-bold text-indigo-500">{id}</span><span className="block text-[10px] font-bold text-slate-700 truncate">{title}</span></div><span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${color}`}>{status}</span></div>;
}

export default LandingPage;
