export function PageLoader() {
    return (
        <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="h-14 w-14 rounded-sm border border-slate-300 dark:border-white/15 p-2 flex items-center justify-center">
                    <span className="h-6 w-6 rounded-xs bg-slate-700 dark:bg-slate-200 loader-cube" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}
