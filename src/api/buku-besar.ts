import { api } from '@/lib/api/client';

export interface GeneralLedgerParams {
    startDate?: string;
    endDate?: string;
    accountId?: number;
    periodId?: number;
    sourceModule?: string;
}

export interface GeneralLedgerEntry {
    entryId: number;
    date: string;
    description: string;
    reference: string;
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
    runningBalance: number;
    lineDescription: string;
}

export interface GeneralLedgerResponse {
    reportName: string;
    period: { startDate: string; endDate: string };
    accountId: number | 'All';
    entries: GeneralLedgerEntry[];
    totalEntries: number;
    openingBalances: Record<string, number>;
}

export const generalLedgerApi = {
    getReport: async (params: GeneralLedgerParams = {}): Promise<GeneralLedgerResponse> => {
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.set('startDate', params.startDate);
        if (params.endDate) searchParams.set('endDate', params.endDate);
        if (params.accountId) searchParams.set('accountId', String(params.accountId));
        if (params.periodId) searchParams.set('periodId', String(params.periodId));
        if (params.sourceModule) searchParams.set('sourceModule', params.sourceModule);
        return api.get<GeneralLedgerResponse>(`/api/accounting/reports/general-ledger?${searchParams.toString()}`);
    },
};
