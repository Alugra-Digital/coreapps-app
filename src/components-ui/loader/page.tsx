import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

type LoaderSample = {
  id: string;
  title: string;
  description: string;
  render: () => ReactNode;
};

const samples: LoaderSample[] = [
  {
    id: "spinner-ring",
    title: "Spinner Ring",
    description: "Classic circular spinner for loading blocks and buttons.",
    render: () => (
      <div className="h-16 w-16 rounded-full border-[3px] border-slate-200 border-t-slate-700 dark:border-white/20 dark:border-t-slate-200 animate-spin" />
    ),
  },
  {
    id: "double-ring",
    title: "Double Ring",
    description: "Nested spinning rings with opposite direction motion.",
    render: () => (
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-slate-700 dark:border-white/20 dark:border-t-slate-200 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-slate-200 border-b-slate-600 dark:border-white/20 dark:border-b-slate-300 animate-[spin_1.2s_linear_infinite_reverse]" />
      </div>
    ),
  },
  {
    id: "three-dots",
    title: "Three Dots",
    description: "Bouncing dots suitable for chat and async status indicators.",
    render: () => (
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-slate-700 dark:bg-slate-200 loader-dot-bounce [animation-delay:-0.2s]" />
        <span className="h-3 w-3 rounded-full bg-slate-700 dark:bg-slate-200 loader-dot-bounce [animation-delay:-0.1s]" />
        <span className="h-3 w-3 rounded-full bg-slate-700 dark:bg-slate-200 loader-dot-bounce" />
      </div>
    ),
  },
  {
    id: "pulse-dot",
    title: "Pulse Dot",
    description: "Single pulse indicator for lightweight loading states.",
    render: () => (
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute h-14 w-14 rounded-full bg-slate-300/60 dark:bg-slate-300/15 loader-ping" />
        <span className="h-4 w-4 rounded-full bg-slate-700 dark:bg-slate-200" />
      </div>
    ),
  },
  {
    id: "equalizer",
    title: "Equalizer",
    description: "Audio-bar style loading animation with staggered timing.",
    render: () => (
      <div className="flex items-end gap-1.5 h-10">
        <span className="w-1.5 bg-slate-700 dark:bg-slate-200 rounded-full loader-bar [animation-delay:-0.35s]" />
        <span className="w-1.5 bg-slate-700 dark:bg-slate-200 rounded-full loader-bar [animation-delay:-0.25s]" />
        <span className="w-1.5 bg-slate-700 dark:bg-slate-200 rounded-full loader-bar [animation-delay:-0.15s]" />
        <span className="w-1.5 bg-slate-700 dark:bg-slate-200 rounded-full loader-bar [animation-delay:-0.05s]" />
      </div>
    ),
  },
  {
    id: "orbit",
    title: "Orbit Dots",
    description: "Two dots orbiting around a center point.",
    render: () => (
      <div className="relative h-16 w-16 loader-rotate">
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-700 dark:bg-slate-200" />
        <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-400 dark:bg-slate-400" />
      </div>
    ),
  },
  {
    id: "skeleton-lines",
    title: "Skeleton Lines",
    description: "Content placeholder style for cards and list data.",
    render: () => (
      <div className="w-full max-w-[220px] space-y-2">
        <div className="h-3 rounded-sm bg-slate-200 dark:bg-white/10 loader-shimmer" />
        <div className="h-3 rounded-sm bg-slate-200 dark:bg-white/10 loader-shimmer [animation-delay:120ms]" />
        <div className="h-3 w-2/3 rounded-sm bg-slate-200 dark:bg-white/10 loader-shimmer [animation-delay:240ms]" />
      </div>
    ),
  },
  {
    id: "progress-indeterminate",
    title: "Progress Sweep",
    description: "Indeterminate progress bar with smooth horizontal sweep.",
    render: () => (
      <div className="relative h-2 w-full max-w-[240px] overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <span className="absolute left-0 top-0 h-full w-24 rounded-full bg-slate-700 dark:bg-slate-200 loader-sweep" />
      </div>
    ),
  },
  {
    id: "spinner-dots-ring",
    title: "Dot Ring",
    description: "Circular dot ring with fading emphasis around the track.",
    render: () => (
      <div className="relative h-14 w-14 loader-rotate">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700 dark:bg-slate-200"
            style={{
              transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-22px)`,
              opacity: 0.2 + index * 0.1,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    id: "cube-spin",
    title: "Cube Spin",
    description: "Rotating cube for technical or backend loading contexts.",
    render: () => (
      <div className="h-14 w-14 rounded-sm border border-slate-300 dark:border-white/15 p-2 flex items-center justify-center">
        <span className="h-6 w-6 rounded-xs bg-slate-700 dark:bg-slate-200 loader-cube" />
      </div>
    ),
  },
  {
    id: "typing-loader",
    title: "Typing Loader",
    description: "Message typing indicator with low visual noise.",
    render: () => (
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-3 py-2 bg-white dark:bg-card">
        <span className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-300 loader-dot-bounce [animation-delay:-0.2s]" />
        <span className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-300 loader-dot-bounce [animation-delay:-0.1s]" />
        <span className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-300 loader-dot-bounce" />
      </div>
    ),
  },
  {
    id: "wave-dots",
    title: "Wave Dots",
    description: "Horizontal wave movement for compact loading zones.",
    render: () => (
      <div className="relative h-6 w-28 overflow-hidden">
        <div className="absolute inset-y-0 left-0 flex items-center gap-2 loader-wave-track">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="h-2.5 w-2.5 rounded-full bg-slate-700 dark:bg-slate-200"
              style={{ opacity: 0.45 + index * 0.1 }}
            />
          ))}
        </div>
      </div>
    ),
  },
];

export default function LoaderSamplesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
          Loader Showcase
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Sample loading animations with consistent project spacing and typography.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {samples.map((loader) => (
          <Card
            key={loader.id}
            className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{loader.title}</CardTitle>
              <CardDescription className="text-xs">{loader.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="min-h-[132px] rounded-sm border border-slate-200/80 dark:border-white/10 bg-white dark:bg-background p-4 flex items-center justify-center">
                {loader.render()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style>{`
        @keyframes loader-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes loader-bar {
          0%, 100% { height: 8px; opacity: 0.5; }
          50% { height: 32px; opacity: 1; }
        }
        @keyframes loader-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loader-ping {
          0% { transform: scale(0.7); opacity: 0.8; }
          80%, 100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes loader-shimmer {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.95; }
        }
        @keyframes loader-sweep {
          0% { transform: translateX(-110%); }
          50% { transform: translateX(90%); }
          100% { transform: translateX(220%); }
        }
        @keyframes loader-cube {
          0% { transform: rotate(0deg) scale(1); border-radius: 4px; }
          50% { transform: rotate(180deg) scale(0.85); border-radius: 8px; }
          100% { transform: rotate(360deg) scale(1); border-radius: 4px; }
        }
        @keyframes loader-wave-track {
          0% { transform: translateX(0); }
          100% { transform: translateX(-36px); }
        }
        .loader-dot-bounce { animation: loader-dot-bounce 1s infinite ease-in-out; }
        .loader-bar { animation: loader-bar 0.95s infinite ease-in-out; }
        .loader-rotate { animation: loader-rotate 1.2s linear infinite; }
        .loader-ping { animation: loader-ping 1.2s infinite ease-out; }
        .loader-shimmer { animation: loader-shimmer 1.3s infinite ease-in-out; }
        .loader-sweep { animation: loader-sweep 1.6s infinite ease-in-out; }
        .loader-cube { animation: loader-cube 1.25s infinite ease-in-out; }
        .loader-wave-track { animation: loader-wave-track 1.15s infinite linear; }
      `}</style>
    </div>
  );
}
