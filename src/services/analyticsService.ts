import api from "./api";

export interface TicketStatsSummary {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    cancelled: number;
    overdue: number;
}

export interface CategoryStat {
    _id: string;
    count: number;
}

export interface PriorityStat {
    _id: string;
    count: number;
}

export interface DepartmentStat {
    department: string;
    code: string;
    count: number;
}

export interface TicketStatsResponse {
    success: boolean;
    summary: TicketStatsSummary;
    byCategory: CategoryStat[];
    byPriority: PriorityStat[];
    byDepartment: DepartmentStat[];
}

export interface ResolutionData {
    ticketNumber: string;
    priority: string;
    category: string;
    resolutionHours: number;
    slaMet: boolean;
}

export interface FastestSlowestResolution {
    ticketNumber: string;
    hours: number;
}

export interface TicketAnalytics {
    resolvedTickets: number;
    averageResolutionHours: number;
    fastestResolution: FastestSlowestResolution | null;
    slowestResolution: FastestSlowestResolution | null;
    withinSla: number;
    breachedSla: number;
    slaComplianceRate: number;
}

export interface TicketAnalyticsResponse {
    success: boolean;
    analytics: TicketAnalytics;
    resolutionData: ResolutionData[];
}

export const getTicketStats =
    async (): Promise<TicketStatsResponse> => {
        const response =
            await api.get<TicketStatsResponse>(
                "/tickets/stats",
            );

        return response.data;
    };

export const getTicketAnalytics =
    async (): Promise<TicketAnalyticsResponse> => {
        const response =
            await api.get<TicketAnalyticsResponse>(
                "/tickets/analytics",
            );

        return response.data;
    };