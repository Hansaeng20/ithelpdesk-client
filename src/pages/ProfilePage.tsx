import { ErrorState, Icon, PageHeader } from "../components/ui";
import { useAuth } from "../context/useAuth";
import { SignOutButton } from "../components/SignOutButton";

const ProfilePage = () => {
    const { user } = useAuth();
    if (!user) return <div className="page"><ErrorState message="Your profile is unavailable." /></div>;
    return <div className="page max-w-5xl"><PageHeader eyebrow="Account" title="My profile" description="The account information connected to your helpdesk workspace." /><div className="panel overflow-hidden"><div className="profile-banner flex items-center gap-4 p-7 border-b border-slate-100"><span className="avatar w-14! h-14! text-xl! rounded-2xl!">{user.name.charAt(0).toUpperCase()}</span><div><h2 className="text-lg font-extrabold text-slate-800">{user.name}</h2><p className="text-xs text-slate-500 mt-1">{user.role}</p></div></div><div className="panel-body"><h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6">Account details</h3><div className="info-grid"><Info icon="user" label="Full name" value={user.name} /><Info icon="mail" label="Email address" value={user.email} /><Info icon="shield" label="Role" value={user.role} /><Info icon="building" label="Department" value={user.department?.name || (user.role === "IT Support" ? "IT Support" : "Not assigned")} /></div></div><div className="profile-footer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-slate-100"><div><h3 className="text-sm font-bold text-slate-800">End your session</h3><p className="text-xs text-slate-500 mt-1">Sign out securely on this device.</p></div><SignOutButton className="btn btn-outline" iconSize={16} /></div></div></div>;
};

function Info({ icon, label, value }: { icon: string; label: string; value: string }) { return <div className="flex items-start gap-3"><span className="inline-grid place-items-center w-9 h-9 rounded-xl bg-slate-50 text-indigo-500"><Icon name={icon} size={17} /></span><div><span className="info-label">{label}</span><span className="info-value">{value}</span></div></div>; }

export default ProfilePage;
