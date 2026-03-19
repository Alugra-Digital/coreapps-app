import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatPeriodName, getPeriodStatusBadge } from '@/hooks/useFinancePeriod';
import type { AccountingPeriod } from '@/hooks/useFinancePeriod';

export interface PeriodSelectorProps {
  periodId: number | null;
  period: AccountingPeriod | null;
  allPeriods: AccountingPeriod[];
  onPeriodChange: (periodId: number, period: AccountingPeriod) => void;
  disabled?: boolean;
  canCreateNextPeriod?: boolean;
  onCreateNextPeriod?: () => void;
}

export function PeriodSelector({
  periodId,
  period,
  allPeriods,
  onPeriodChange,
  disabled = false,
  canCreateNextPeriod = false,
  onCreateNextPeriod,
}: PeriodSelectorProps) {
  const status = period?.status || 'OPEN';
  const { icon, color, bgColor } = getPeriodStatusBadge(status);

  const currentIndex = allPeriods.findIndex(p => p.id === periodId);
  const canNavigatePrevious = currentIndex < allPeriods.length - 1;
  const canNavigateNext = currentIndex > 0;

  const handlePrevious = () => {
    if (canNavigatePrevious && !disabled && period) {
      const previousPeriod = allPeriods[currentIndex + 1];
      onPeriodChange(previousPeriod.id, previousPeriod);
    }
  };

  const handleNext = () => {
    if (canNavigateNext && !disabled && period) {
      const nextPeriod = allPeriods[currentIndex - 1];
      onPeriodChange(nextPeriod.id, nextPeriod);
    }
  };

  const periodName = period ? formatPeriodName(period) : 'Select Period';

  return (
    <div className="flex items-center gap-4 bg-background p-3 rounded-lg border">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon-xs"
        onClick={handlePrevious}
        disabled={!canNavigatePrevious || disabled}
        aria-label="Previous period"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {/* Current Period Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={disabled ? "outline" : "default"}
            className="w-full justify-between min-w-[250px]"
            disabled={disabled}
          >
            <span className="font-semibold">{periodName}</span>
            <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[300px] max-h-[400px]">
          {allPeriods.map((p) => {
            const pStatus = p.status || 'OPEN';
            const pBadge = getPeriodStatusBadge(pStatus);
            const isSelected = p.id === periodId;

            return (
              <DropdownMenuItem
                key={p.id}
                onClick={() => !disabled && onPeriodChange(p.id, p)}
                disabled={disabled}
                className="flex items-center gap-3 py-3"
              >
                <div className={`flex-1 ${isSelected ? 'font-semibold' : ''}`}>
                  {formatPeriodName(p)}
                </div>
                <Badge className={`${pBadge.bgColor} ${pBadge.color} border-0`}>
                  <span className="mr-1">{pBadge.icon}</span>
                  {pStatus}
                </Badge>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Badge */}
      <Badge className={`${bgColor} ${color} border-0`}>
        <span className="mr-1">{icon}</span>
        Status: {status}
      </Badge>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon-xs"
        onClick={handleNext}
        disabled={!canNavigateNext || disabled}
        aria-label="Next period"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>

      {/* Create Next Period Button */}
      {canCreateNextPeriod && !disabled && (
        <Button
          variant="default"
          size="sm"
          onClick={onCreateNextPeriod}
          className="ml-4"
        >
          + Buat Dokumen Bulan Berikutnya
        </Button>
      )}
    </div>
  );
}

export default PeriodSelector;
