import { useState, useEffect } from 'react';
import { History, TrendingUp, ArrowRight, DollarSign, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const activities = [
  {
    event: 'Payment Received',
    client: 'Bank Mandiri HQ',
    amount: 'Rp 192,2 jt',
    time: '2 hours ago',
    color: '#10b981',
  },
  {
    event: 'Invoice Generated',
    client: 'Pertamina Corp',
    amount: 'Rp 131,75 jt',
    time: 'Submited today',
    color: '#3b82f6',
  },
  {
    event: 'Overdue Alert',
    client: 'Telkomsel Office',
    amount: 'Rp 65,1 jt',
    time: '3 days ago',
    color: '#ef4444',
  },
  {
    event: 'Invoice Generated',
    client: 'Pertamina Corp',
    amount: 'Rp 131,75 jt',
    time: 'Submited today',
    color: '#3b82f6',
  },
  {
    event: 'Overdue Alert',
    client: 'Telkomsel Office',
    amount: 'Rp 65,1 jt',
    time: '3 days ago',
    color: '#ef4444',
  },
];

const MAX_VISIBLE = 4;
const MODAL_PAGE_SIZE = 5;

export function InvoiceActivity({ className }: { className?: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const visibleActivities = activities.slice(0, MAX_VISIBLE);
  const hasMore = activities.length > MAX_VISIBLE;

  const filteredActivities = activities.filter(
    (act) =>
      act.event.toLowerCase().includes(search.toLowerCase()) ||
      act.client.toLowerCase().includes(search.toLowerCase()) ||
      act.amount.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / MODAL_PAGE_SIZE));
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * MODAL_PAGE_SIZE,
    currentPage * MODAL_PAGE_SIZE
  );

  useEffect(() => {
    if (modalOpen) {
      setSearch('');
      setCurrentPage(1);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  return (
    <>
    <Card
      className={cn(
        'shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow flex flex-col h-full min-h-0',
        className,
      )}
    >
      <div className='flex justify-between items-center mb-3 px-1 shrink-0'>
        <span className='text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider'>
          <History className='h-4 w-4' /> Billing Activity
        </span>
        <Button
          variant='ghost'
          size='sm'
          className='h-7 text-[10px] text-slate-500 hover:text-slate-900 transition-colors'
        >
          View Log
        </Button>
      </div>

      <CardContent className='p-4 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col flex-1 min-h-0'>
        <div className='flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar'>
          <div className='flex flex-col gap-4'>
            {visibleActivities.map((act, idx) => (
          <div
            key={idx}
            className='flex items-start gap-3 relative pb-4 last:pb-0 border-b last:border-0 border-slate-50 dark:border-white/5'
          >
            <div
              className='mt-1 h-3 w-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]'
              style={{ backgroundColor: act.color }}
            />
            <div className='flex flex-col gap-1 flex-1 min-w-0'>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-xs font-bold text-slate-900 dark:text-foreground'>
                  {act.event}
                </span>
                <span className='text-[10px] font-medium text-slate-400 whitespace-nowrap'>
                  {act.time}
                </span>
              </div>
              <div className='flex items-center gap-2 text-[10px] text-slate-500'>
                <div className='flex items-center gap-1'>
                  <span className='truncate'>{act.client}</span>
                </div>
                <span>•</span>
                <span className='font-bold text-slate-900 dark:text-foreground'>
                  {act.amount}
                </span>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors hidden group-hover/row:flex'
            >
              <ArrowRight className='h-3 w-3' />
            </Button>
          </div>
        ))}
          </div>

          {hasMore && (
            <Button
              variant='outline'
              size='sm'
              className='w-full mt-3 h-8 text-[10px] font-medium bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
              onClick={() => setModalOpen(true)}
            >
              <ChevronDown className='h-3.5 w-3.5 mr-1.5' /> Show more ({activities.length - MAX_VISIBLE} more)
            </Button>
          )}
        </div>

        <div className='mt-auto grid grid-cols-2 gap-2 pt-2 shrink-0'>
          <div className='flex flex-col gap-1 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10'>
            <div className='flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400'>
              <TrendingUp className='h-3 w-3' /> Collected
            </div>
            <div className='text-lg font-bold text-slate-900 dark:text-foreground leading-none'>
              Rp 384.4 jt
            </div>
          </div>
          <div className='flex flex-col gap-1 p-2 rounded-lg bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10'>
            <div className='flex items-center gap-1.5 text-[10px] font-bold text-red-600 dark:text-red-400'>
              <DollarSign className='h-3 w-3' /> Outstanding
            </div>
            <div className='text-lg font-bold text-slate-900 dark:text-foreground leading-none'>
              Rp 65,1 jt
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className='sm:max-w-xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <History className='h-4 w-4' /> Billing Activity
          </DialogTitle>
        </DialogHeader>

        <div className='relative mt-2'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400' />
          <input
            placeholder='Search event, client, amount...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className='w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none text-foreground'
          />
        </div>

        <Card className='flex-1 min-h-0 overflow-hidden border border-slate-100 dark:border-white/5'>
          <CardContent className='p-0'>
            <div className='divide-y divide-slate-100 dark:divide-white/5 max-h-[320px] overflow-y-auto custom-scrollbar'>
              {paginatedActivities.length === 0 ? (
                <div className='py-8 text-center text-sm text-slate-500'>
                  No activities found
                </div>
              ) : (
                paginatedActivities.map((act, idx) => (
                  <div
                    key={idx}
                    className='flex items-start gap-3 p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors'
                  >
                    <div
                      className='mt-1 h-3 w-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]'
                      style={{ backgroundColor: act.color }}
                    />
                    <div className='flex flex-col gap-1 flex-1 min-w-0'>
                      <div className='flex justify-between items-center gap-2'>
                        <span className='text-sm font-bold text-slate-900 dark:text-foreground'>
                          {act.event}
                        </span>
                        <span className='text-xs text-slate-400 whitespace-nowrap'>
                          {act.time}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-xs text-slate-500'>
                        <span className='truncate'>{act.client}</span>
                        <span>•</span>
                        <span className='font-bold text-slate-900 dark:text-foreground'>
                          {act.amount}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7 shrink-0'
                    >
                      <ArrowRight className='h-3.5 w-3.5 text-slate-400' />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className='flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5'>
                <span className='text-xs text-slate-500'>
                  Page {currentPage} of {totalPages} ({filteredActivities.length} total)
                </span>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-7 px-2 text-xs'
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className='h-3.5 w-3.5' /> Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-7 px-2 text-xs'
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next <ChevronRight className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
    </>
  );
}
