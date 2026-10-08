import { useEffect, useState } from "react";
import {
    getTicketAnalytics,
    getTicketStats,
    type TicketAnalytics,
    type TicketStatsResponse,
} from "../services/analyticsService";

const AnalyticsPage = () => {
    const [stats, setStats] =
        useState<TicketStatsResponse | null>(null);

    const [analytics, setAnalytics] =
        useState<TicketAnalytics | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const [statsResponse, analyticsResponse] =
                    await Promise.all([
                        getTicketStats(),
                        getTicketAnalytics(),
                    ]);

                setStats(statsResponse);
                setAnalytics(analyticsResponse.analytics);
            } catch (err) {
                console.error(err);
                setError(
                    "Unable to load analytics. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading analytics...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !stats || !analytics) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm text-red-700">
                        {error || "Unable to load analytics."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-medium text-blue-600">
                    Support Management
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Analytics
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Monitor ticket volume, resolution performance,
                    and SLA compliance.
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    label="Total Tickets"
                    value={stats.summary.total}
                    description="All support requests"
                />

                <MetricCard
                    label="Open"
                    value={stats.summary.open}
                    description="Waiting for support"
                />

                <MetricCard
                    label="In Progress"
                    value={stats.summary.inProgress}
                    description="Currently being handled"
                />

                <MetricCard
                    label="Resolved"
                    value={stats.summary.resolved}
                    description="Successfully resolved"
                />
            </div>

            {/* SLA / Resolution */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    label="Overdue"
                    value={stats.summary.overdue}
                    description="Past SLA deadline"
                />

                <MetricCard
                    label="Avg. Resolution"
                    value={`${analytics.averageResolutionHours}h`}
                    description="Average time to resolve"
                />

                <MetricCard
                    label="SLA Compliance"
                    value={`${analytics.slaComplianceRate}%`}
                    description="Resolved within SLA"
                />

                <MetricCard
                    label="Cancelled"
                    value={stats.summary.cancelled}
                    description="Cancelled requests"
                />
            </div>

            {/* Breakdown */}
            <div className="mt-7 grid gap-6 lg:grid-cols-3">
                {/* Priority */}
                <BreakdownCard
                    title="Tickets by Priority"
                    items={stats.byPriority.map((item) => ({
                        label: item._id,
                        value: item.count,
                    }))}
                />

                {/* Category */}
                <BreakdownCard
                    title="Tickets by Category"
                    items={stats.byCategory.map((item) => ({
                        label: item._id,
                        value: item.count,
                    }))}
                />

                {/* Department */}
                <BreakdownCard
                    title="Tickets by Department"
                    items={stats.byDepartment.map((item) => ({
                        label: item.department,
                        value: item.count,
                    }))}
                />
            </div>

            {/* Resolution Performance */}
            <section className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Resolution Performance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Resolution time and SLA performance for completed
                        tickets.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <PerformanceCard
                        label="Fastest Resolution"
                        ticketNumber={
                            analytics.fastestResolution?.ticketNumber
                        }
                        hours={analytics.fastestResolution?.hours}
                    />

                    <PerformanceCard
                        label="Slowest Resolution"
                        ticketNumber={
                            analytics.slowestResolution?.ticketNumber
                        }
                        hours={analytics.slowestResolution?.hours}
                    />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-green-50 p-5">
                        <p className="text-sm font-medium text-green-700">
                            Resolved Within SLA
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-800">
                            {analytics.withinSla}
                        </p>

                        <p className="mt-1 text-xs text-green-600">
                            Tickets completed on time
                        </p>
                    </div>

                    <div className="rounded-lg bg-red-50 p-5">
                        <p className="text-sm font-medium text-red-700">
                            SLA Breached
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-800">
                            {analytics.breachedSla}
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                            Tickets resolved after their SLA deadline
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

interface MetricCardProps {
    label: string;
    value: string | number;
    description: string;
}

const MetricCard = ({
    label,
    value,
    description,
}: MetricCardProps) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
                {description}
            </p>
        </div>
    );
};

interface BreakdownItem {
    label: string;
    value: number;
}

interface BreakdownCardProps {
    title: string;
    items: BreakdownItem[];
}

const BreakdownCard = ({
    title,
    items,
}: BreakdownCardProps) => {
    const total = items.reduce(
        (sum, item) => sum + item.value,
        0,
    );

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
                {title}
            </h2>

            {items.length === 0 ? (
                <div className="mt-5 rounded-lg bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">
                        No data available.
                    </p>
                </div>
            ) : (
                <div className="mt-5 space-y-4">
                    {items.map((item) => {
                        const percentage =
                            total > 0
                                ? (item.value / total) * 100
                                : 0;

                        return (
                            <div key={item.label}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">
                                        {item.label}
                                    </span>

                                    <span className="text-sm font-semibold text-slate-900">
                                        {item.value}
                                    </span>
                                </div>

                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>

                                <p className="mt-1 text-right text-xs text-slate-400">
                                    {percentage.toFixed(1)}%
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

interface PerformanceCardProps {
    label: string;
    ticketNumber?: string;
    hours?: number;
}

const PerformanceCard = ({
    label,
    ticketNumber,
    hours,
}: PerformanceCardProps) => {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            {ticketNumber && hours !== undefined ? (
                <>
                    <p className="mt-2 text-xl font-bold text-slate-900">
                        {ticketNumber}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Resolved in {hours} hours
                    </p>
                </>
            ) : (
                <p className="mt-3 text-sm text-slate-500">
                    No resolved tickets yet.
                </p>
            )}
        </div>
    );
};

export default AnalyticsPage;