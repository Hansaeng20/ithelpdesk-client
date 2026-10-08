import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseNavItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/tickets", label: "My Tickets" },
    { to: "/profile", label: "Profile" },
];

const supportNavItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/tickets", label: "All Tickets" },
    { to: "/overdue", label: "Overdue" },
    { to: "/analytics", label: "Analytics" },
    { to: "/departments", label: "Departments" },
    { to: "/profile", label: "Profile" },
];

const MainLayout = () => {
    const { user } = useAuth();

    const isITSupport = user?.role === "IT Support";

    const navItems = isITSupport
        ? supportNavItems
        : baseNavItems;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                            IT
                        </div>

                        <div>
                            <p className="font-bold text-slate-900">
                                IT Helpdesk
                            </p>

                            <p className="text-xs text-slate-500">
                                Support & Analytics
                            </p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;