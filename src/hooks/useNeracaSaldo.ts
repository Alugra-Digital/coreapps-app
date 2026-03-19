import { useQuery } from '@tanstack/react-query';
import type { TrialBalanceParams, TrialBalanceResponse } from '../api/neraca-saldo';
import { trialBalanceApi } from '../api/neraca-saldo';

export const useNeracaSaldo = (params: TrialBalanceParams) => {
    return useQuery<TrialBalanceResponse, Error>({
        queryKey: ['neraca-saldo', params],
        queryFn: () => trialBalanceApi.getReport(params),
    });
};
