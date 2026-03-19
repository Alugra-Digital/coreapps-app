import { api } from '@/lib/api/client';

export interface TrialBalanceParams {
    asOfDate?: string;
    startDate?: string;
    endDate?: string;
    periodId?: number;
}

export interface TrialBalanceAccount {
    id: number;
    code: string;
    name: string;
    type: string;
    isGroup: boolean;
    parentAccountId: number | null;
    openingBalance: number;
    debit: number;
    credit: number;
    closingBalance: number;
}

export interface TrialBalanceResponse {
    reportName: string;
    asOfDate: string;
    startDate?: string;
    endDate?: string;
    accounts: TrialBalanceAccount[];
    totals: {
        openingBalance: number;
        debit: number;
        credit: number;
        closingBalance: number;
        balanced: boolean;
    };
}

export const trialBalanceApi = {
    getReport: async (params: TrialBalanceParams = {}): Promise<TrialBalanceResponse> => {
        const searchParams = new URLSearchParams();
        if (params.asOfDate) searchParams.set('asOfDate', params.asOfDate);
        if (params.startDate) searchParams.set('startDate', params.startDate);
        if (params.endDate) searchParams.set('endDate', params.endDate);
        if (params.periodId) searchParams.set('periodId', String(params.periodId));
        return api.get<TrialBalanceResponse>(`/api/accounting/reports/trial-balance?${searchParams.toString()}`);
    },
};
