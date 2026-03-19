'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

interface PeriodSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function PeriodSelector({
  year,
  month,
  onChange,
  minYear = 2020,
  maxYear = new Date().getFullYear() + 1,
}: PeriodSelectorProps) {
  const goPrev = () => {
    if (month === 1) {
      if (year > minYear) onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  };

  const goNext = () => {
    if (month === 12) {
      if (year < maxYear) onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  };

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-[#6B6B75]" />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-[#F0F0F0] hover:bg-[#1E1E22] hover:text-[#F0F0F0] rounded-xl"
        onClick={goPrev}
        disabled={year === minYear && month === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Select
        value={String(month)}
        onValueChange={(v) => onChange(year, Number(v))}
      >
        <SelectTrigger className="w-[130px] h-8 bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#111113] border-[#1E1E22]">
          {MONTHS.map((name, idx) => (
            <SelectItem key={idx + 1} value={String(idx + 1)} className="text-[#F0F0F0] focus:bg-[#1E1E22]">
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(year)}
        onValueChange={(v) => onChange(Number(v), month)}
      >
        <SelectTrigger className="w-[90px] h-8 bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#111113] border-[#1E1E22]">
          {years.map((y) => (
            <SelectItem key={y} value={String(y)} className="text-[#F0F0F0] focus:bg-[#1E1E22]">
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-[#F0F0F0] hover:bg-[#1E1E22] hover:text-[#F0F0F0] rounded-xl"
        onClick={goNext}
        disabled={year === maxYear && month === 12}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
