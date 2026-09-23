// components/timeline/DevelopingStoryTimeline.tsx
import React from 'react';
import { TimelineMilestone } from '@/types';
import { Clock, ShieldAlert, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface DevelopingStoryTimelineProps {
  timeline?: TimelineMilestone[];
}

export function DevelopingStoryTimeline({ timeline }: DevelopingStoryTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xs text-zinc-400">
        No chronological milestone progression recorded for this story yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blueprint Principle Banner: Section 14 */}
      <div className="p-3.5 bg-zinc-900 border-l-2 border-indigo-500 rounded-r text-xs text-zinc-300 leading-relaxed">
        <strong className="text-zinc-100">Developing Story Principle:</strong> Early reports must not automatically be treated as final truth. CivicLens tracks official statements, independent verifications, and revisions as evidence solidifies over time.
      </div>

      {/* Stepper Timeline */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
        {timeline.map((event, idx) => (
          <div key={event.id} className="relative group">
            {/* Step Node Marker */}
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>

            {/* Event Card */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2 hover:border-zinc-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">{event.stage}</Badge>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {event.time}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Step {idx + 1} of {timeline.length}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-zinc-100">{event.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{event.summary}</p>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Source / Origin: <strong className="text-zinc-400">{event.sourceOrEntity}</strong></span>
                {event.wasClarifiedOrCorrected && (
                  <span className="text-amber-400 font-mono flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Clarified in later milestone
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
