import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    if (!user) {
        return null;
    }

    const isITSupport = user.role === "IT Support";

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <p className="text-sm font-medium text-blue-600">
                    Account
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    My Profile
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View your account information and manage your session.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Profile Header */}
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-7 sm:px-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {user.name}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="px-6 py-7 sm:px-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Account Information
                    </h3>

                    <div className="mt-5 divide-y divide-slate-100">
                        <ProfileItem
                            label="Full Name"
                            value={user.name}
                        />

                        <ProfileItem
                            label="Email"
                            value={user.email}
                        />

                        <ProfileItem
                            label="Role"
                            value={user.role}
                        />

                        {!isITSupport && (
                            <ProfileItem
                                label="Department"
                                value={user.department?.name ?? "Not specified"}
                            />
                        )}
                    </div>
                </div>

                {/* Sign Out */}
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8">
                    <h3 className="font-semibold text-slate-900">
                        Sign Out
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Sign out of your IT Helpdesk account on this device.
                    </p>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-4 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ProfileItemProps {
    label: string;
    value: string;
}

const ProfileItem = ({
    label,
    value,
}: ProfileItemProps) => {
    return (
        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-slate-500">
                {label}
            </span>

            <span className="text-sm font-semibold text-slate-900 sm:text-right">
                {value}
            </span>
        </div>
    );
};

export default ProfilePage;