// app/demo/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SystemDiagnostics } from '@/components/demo/SystemDiagnostics';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Compass,
  ArrowRight,
  Eye,
  FileText,
  Split,
  GitBranch,
  Users,
  Cpu,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    phase: 'Discovery',
    title: "1. 'What's happening around you?'",
    description: 'The homepage answers the core civic question immediately with local pulse cards, verified reports, and community questions.',
    route: '/',
    actionText: 'Open Live Feed',
  },
  {
    step: 2,
    phase: 'Hierarchy',
    title: '2. Geographic Hierarchy Navigation',
    description: 'Browse news filtered by geographic scope: Area → District → State → Country → World.',
    route: '/explore',
    actionText: 'Open Explore & Switch Hierarchy',
  },
  {
    step: 3,
    phase: 'Article',
    title: '3. Standard News Article Body',
    description: 'Read the reported story regarding the West Hyderabad Lake Restoration project.',
    route: '/article/art-001',
    actionText: 'Open Article art-001',
  },
  {
    step: 4,
    phase: 'Claim Lens',
    title: '4. Examine with CivicLens (Claim Lens)',
    description: 'Deconstruct the article text into atomic falsifiable claims rather than taking the whole narrative at face value.',
    route: '/article/art-001',
    actionText: 'Inspect Claims in Claim Lens',
  },
  {
    step: 5,
    phase: 'Evidence Lab',
    title: '5. Primary Sources & Evidence Lab',
    description: 'Inspect linked government tenders, hydrological datasets, and civil gazettes with verified provenance notes.',
    route: '/article/art-001',
    actionText: 'Review Evidence Lab Tab',
  },
  {
    step: 6,
    phase: 'Assessment',
    title: '6. Evidence Assessment Spectrum',
    description: "Inspect 6-tier evidence statuses ('Needs verification', 'Insufficient evidence', 'Supported with context') with zero binary TRUE/FALSE simplifications.",
    route: '/article/art-001',
    actionText: 'Review Status Badges',
  },
  {
    step: 7,
    phase: 'Questions',
    title: '7. Question Generator from Claims',
    description: 'Analytical questions derived from underlying assumptions and data gaps to promote scrutiny without bias scores.',
    route: '/article/art-001',
    actionText: 'Inspect Generated Questions',
  },
  {
    step: 8,
    phase: 'Discussions',
    title: '8. Claim-Specific Discussion Threading',
    description: 'Community members attach observations, evidence, and questions directly to Claim #1 with neutral AI discussion synthesis.',
    route: '/article/art-001',
    actionText: 'View Claim-Level Discussion',
  },
  {
    step: 9,
    phase: 'Timeline',
    title: '9. Developing Story Chronology',
    description: 'Track how claims evolved from initial tender announcement to researcher questions and revised approvals.',
    route: '/article/art-001',
    actionText: 'Open Developing Timeline',
  },
  {
    step: 10,
    phase: 'Comparison',
    title: '10. Same Story / Different Sources Matrix',
    description: 'Compare coverage across outlets and citizen accounts side-by-side without media rankings or political scores.',
    route: '/article/art-001',
    actionText: 'Open Source Comparison Matrix',
  },
  {
    step: 11,
    phase: 'Community',
    title: '11. Local Community Neighborhood Spaces',
    description: 'Dedicated discussion boards filtered by area (e.g. Gachibowli Community, Madhapur, Tarnaka).',
    route: '/local',
    actionText: 'Visit Local Community',
  },
  {
    step: 12,
    phase: 'Citizen Reporting',
    title: '12. Citizen Journalism & Eyewitness Action',
    description: "Launch the reporting hub with real name vs. pseudonym support and privacy guardrails against phone numbers or exact addresses.",
    route: '/publish',
    actionText: 'Open Publishing Hub',
  },
  {
    step: 13,
    phase: 'AI Interviewer',
    title: "13. 'I Witnessed Something' Incident Room",
    description: 'The Conversational AI Fact-Finder interviews the witness, isolating direct observations from hearsay.',
    route: '/publish',
    actionText: 'Launch AI Interviewer Session',
  },
  {
    step: 14,
    phase: 'Synthesis',
    title: '14. Structured Citizen Incident Report',
    description: 'Report rendered into distinct firsthand observations, unconfirmed hearsay, and preserved author uncertainties.',
    route: '/publish',
    actionText: 'Inspect Synthesized Report View',
  },
  {
    step: 15,
    phase: 'Corroboration',
    title: '15. Multiple Witnesses Corroboration Engine',
    description: 'Multi-witness analysis categorizing accounts into common details, unique details, conflicting points, and unknown gaps without accusatory labels.',
    route: '/incident/rep-101',
    actionText: 'Open Corroborated Incident rep-101',
  },
  {
    step: 16,
    phase: 'Corrections',
    title: '16. Editorial Transparency & Corrections History',
    description: 'Complete audit log showing prior text struck through, revised text, timestamps, and editorial reasons.',
    route: '/article/art-001',
    actionText: 'View Corrections Modal',
  },
  {
    step: 17,
    phase: 'Qualcomm AI Hub',
    title: '17. Qualcomm AI Engine Integration',
    description: 'Live FastAPI microservice communicating with Qualcomm AI Hub SDK for Snapdragon model compilation and profiling.',
    route: '/article/art-001',
    actionText: 'Trigger Live Qualcomm Extraction',
  },
  {
    step: 18,
    phase: 'Integrity Audit',
    title: '18. Hardware & Information Integrity Verification',
    description: 'Strict transparent reporting of runtime targets: never falsifying NPU execution on non-Snapdragon host machines.',
    route: '/demo',
    actionText: 'Inspect System Diagnostics Above',
  },
];

export default function DemoMasterPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = DEMO_STEPS[activeStepIndex];

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            CivicLens Production Prototype Master Walkthrough
          </h1>
          <Badge variant="accent">Master Demo Engine</Badge>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Complete implementation of the 18-step verification loop specified in Section 34 of the CivicLens blueprint.
        </p>
      </div>

      {/* Real-time Diagnostics Suite */}
      <SystemDiagnostics />

      {/* Current Step Spotlight Card */}
      <div className="p-5 bg-gradient-to-r from-zinc-900 to-indigo-950/40 border border-indigo-800/80 rounded-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <Badge variant="warning">
            Step {activeStep.step} of 18 · {activeStep.phase}
          </Badge>
          <span className="text-[11px] font-mono text-zinc-400">Target Route: {activeStep.route}</span>
        </div>

        <div>
          <h2 className="text-base font-bold text-zinc-100">{activeStep.title}</h2>
          <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{activeStep.description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          <Link
            href={activeStep.route}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {activeStep.actionText} <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
              disabled={activeStepIndex === 0}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-mono text-zinc-300"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStepIndex(Math.min(DEMO_STEPS.length - 1, activeStepIndex + 1))}
              disabled={activeStepIndex === DEMO_STEPS.length - 1}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-mono text-zinc-300"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>

      {/* 18-Step Full Index Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-400">
          18-Step Specification Demonstration Plan
        </h3>

        <div className="space-y-1.5">
          {DEMO_STEPS.map((s, idx) => {
            const isSelected = idx === activeStepIndex;
            return (
              <div
                key={s.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-indigo-500 text-zinc-100'
                    : 'bg-zinc-950 border-zinc-800/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-indigo-400 w-6">#{s.step}</span>
                  <span className="font-medium text-zinc-200">{s.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    {s.phase}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
