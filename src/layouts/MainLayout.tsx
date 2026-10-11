import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Icon } from "../components/ui";
import { SignOutButton } from "../components/SignOutButton";

const employeeNav = [
    { to: "/dashboard", label: "Overview", icon: "dashboard" },
    { to: "/tickets", label: "My tickets", icon: "tickets" },
    { to: "/tickets/new", label: "New request", icon: "plus" },
];

const supportNav = [
    { to: "/dashboard", label: "Overview", icon: "dashboard" },
    { to: "/tickets", label: "All tickets", icon: "tickets" },
    { to: "/overdue", label: "Overdue", icon: "clock" },
    { to: "/analytics", label: "Analytics", icon: "analytics" },
    { to: "/departments", label: "Departments", icon: "building" },
];

const MainLayout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const isSupport = user?.role === "IT Support";
    const nav = isSupport ? supportNav : employeeNav;

    useEffect(() => {
        if (!menuOpen) return;
        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onEscape);
        return () => window.removeEventListener("keydown", onEscape);
    }, [menuOpen]);

    const activeTitle = location.pathname.startsWith("/tickets/")
        ? location.pathname === "/tickets/new" ? "New request" : "Ticket details"
        : [...nav, { to: "/profile", label: "Profile", icon: "user" }].find(item => item.to === location.pathname)?.label ?? "IT Helpdesk";

    return <div className="app-shell">
        <button className={`mobile-overlay ${menuOpen ? "open" : ""}`} type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />
        <aside className={`sidebar ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
            <Link to="/dashboard" className="brand" onClick={() => setMenuOpen(false)}>
                <span className="brand-mark"><Icon name="bolt" size={23} /></span>
                <span><span className="brand-name">IT Helpdesk</span><span className="brand-subtitle">Service workspace</span></span>
            </Link>

            <p className="sidebar-label">Workspace</p>
            <nav className="side-nav" aria-label="Workspace">
                {nav.map(item => <NavLink key={item.to} to={item.to} end={item.to === "/tickets"} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><Icon name={item.icon} size={18} />{item.label}</NavLink>)}
            </nav>

            <p className="sidebar-label">Account</p>
            <nav className="side-nav" aria-label="Account">
                <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><Icon name="user" size={18} />My profile</NavLink>
                <SignOutButton className="nav-link w-full text-left" />
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-help"><span className="sidebar-help-icon"><Icon name="shield" size={19} /></span><strong>Support you can follow</strong><p>Clear updates, deadlines, and progress in one place.</p></div>
                <div className="sidebar-profile"><span className="avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</span><span className="sidebar-profile-text"><strong>{user?.name}</strong><span>{user?.role}</span></span><Link to="/profile" aria-label="Open profile"><Icon name="chevronRight" size={17} /></Link></div>
            </div>
        </aside>

        <div className="app-main">
            <header className="topbar"><div className="topbar-title"><button className="mobile-menu-btn" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}><Icon name={menuOpen ? "close" : "menu"} size={21} /></button><Icon name="sparkles" size={17} /><span>{activeTitle}</span></div><div className="topbar-right"><span>{new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric" }).format(new Date())}</span><span className="topbar-pill">Workspace active</span></div></header>
            <main><Outlet /></main>
        </div>
    </div>;
};

export default MainLayout;
