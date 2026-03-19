import { useQuery } from '@tanstack/react-query';
import type { GeneralLedgerParams, GeneralLedgerResponse } from '../api/buku-besar';
import { generalLedgerApi } from '../api/buku-besar';

export const useBukuBesar = (params: GeneralLedgerParams) => {
    return useQuery<GeneralLedgerResponse, Error>({
        queryKey: ['buku-besar', params],
        queryFn: () => generalLedgerApi.getReport(params),
    });
};
