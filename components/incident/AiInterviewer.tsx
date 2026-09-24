// components/incident/AiInterviewer.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, CheckCircle2 } from 'lucide-react';
import { StructuredIncidentData, StructuredReportView } from './StructuredReportView';
import { submitCitizenIncident } from '@/lib/dataService';
import { CitizenReport } from '@/types';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

const INTERVIEW_QUESTIONS = [
  'What happened? Briefly describe the event you are reporting.',
  'Did you personally see or hear this directly, or was part of it told to you by someone else?',
  'What did you directly observe with your own eyes/ears? Please specify only what you witnessed yourself.',
  'Approximately what time did this occur, and what is the general location? (e.g. Near Gachibowli flyover)',
  'Do you have any supporting material, such as photos, documents, or official receipts?',
  'Is there anything you are uncertain about or do not know for sure?',
];

export function AiInterviewer() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hello. I am the CivicLens Fact-Finder. I will help structure what you witnessed without jumping to conclusions. To begin: What happened? Briefly describe the event.",
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [pseudonym, setPseudonym] = useState('Observer_Hyd_04');
  const [isSynthesized, setIsSynthesized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const updatedAnswers = [...answers, inputVal];
    setAnswers(updatedAnswers);

    const userMessage: Message = { role: 'user', text: inputVal };
    const nextStep = currentStep + 1;

    if (nextStep < INTERVIEW_QUESTIONS.length) {
      const nextAiMessage: Message = {
        role: 'ai',
        text: INTERVIEW_QUESTIONS[nextStep],
      };
      setMessages((prev) => [...prev, userMessage, nextAiMessage]);
      setCurrentStep(nextStep);
      setInputVal('');
    } else {
      const completionMessage: Message = {
        role: 'ai',
        text: 'Thank you. I have parsed and categorized your testimony into distinct firsthand observations, unconfirmed reports, and documented uncertainties.',
      };
      setMessages((prev) => [...prev, userMessage, completionMessage]);
      setCurrentStep(nextStep);
      setInputVal('');
      setIsSynthesized(true);
    }
  };

  const structuredData: StructuredIncidentData = {
    title: answers[0] ? answers[0].slice(0, 75) : 'Citizen Observation Report',
    category: 'Public Safety',
    generalLocation: answers[3] || 'Western Corridor, Hyderabad',
    timestamp: 'Reported Just Now',
    authorIdentity: pseudonym,
    firsthandObservations: answers[2]
      ? [answers[2]]
      : [answers[0] || 'Reported situation on-site.'],
    hearsayOrThirdParty: answers[1] && answers[1].toLowerCase().includes('told')
      ? [answers[1]]
      : ['No external secondhand claims were asserted.'],
    uncertainties: answers[5]
      ? [answers[5]]
      : ['Author stated no additional uncertainties.'],
    evidenceNotes: answers[4] || 'No physical/digital media attached.',
    openQuestions: [
      'Are there additional corroborating eyewitness reports from nearby establishments?',
      'Has municipal maintenance or emergency services filed an official dispatch ticket?',
    ],
  };

  const handlePublishReport = async () => {
    setIsSubmitting(true);
    const newReport: CitizenReport = {
      id: `rep-${Date.now()}`,
      title: structuredData.title,
      generalLocation: structuredData.generalLocation,
      timestamp: 'Just now',
      category: 'Public Safety',
      isFirsthandObservation: true,
      witnessSummary: structuredData.firsthandObservations.join(' '),
      uncertainties: structuredData.uncertainties.join(' '),
      evidenceProvided: Boolean(answers[4] && answers[4].length > 5),
      authorPseudonym: pseudonym,
      witnesses: [
        {
          id: `w-${Date.now()}`,
          witnessPseudonym: pseudonym,
          timestamp: 'Just now',
          distanceFromEvent: 'Direct observer vantage',
          directlyObserved: structuredData.firsthandObservations[0] || 'Witnessed incident on-site',
          unconfirmedOrHearsay: structuredData.hearsayOrThirdParty[0] || '',
          statedUncertainty: structuredData.uncertainties[0] || '',
        }
      ],
      witnessSynthesis: {
        commonDetails: structuredData.firsthandObservations,
        differentDetails: ['First reported incident deposition for this location.'],
        conflictingAccounts: [],
        unknownDetails: structuredData.uncertainties,
      }
    };

    await submitCitizenIncident(newReport);
    setIsSubmitting(false);
    router.push('/');
  };

  if (isSynthesized) {
    return (
      <div className="space-y-4">
        <StructuredReportView
          report={structuredData}
          onReset={() => {
            setMessages([
              {
                role: 'ai',
                text: "Let's start over. What happened? Briefly describe the event.",
              },
            ]);
            setAnswers([]);
            setCurrentStep(0);
            setIsSynthesized(false);
          }}
          onSubmitToCommunity={handlePublishReport}
        />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-200">Incident Room AI Interviewer</span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 font-mono px-2 py-0.5 rounded">
            Step {Math.min(currentStep + 1, 6)} of 6
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label className="text-zinc-500 font-mono text-[11px]">Publishing as:</label>
          <input
            type="text"
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-indigo-300 font-mono"
          />
        </div>
      </div>

      <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'ai' ? 'bg-indigo-950 border border-indigo-700 text-indigo-300' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {m.role === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                m.role === 'ai'
                  ? 'bg-zinc-950 border border-zinc-800 text-zinc-300'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            currentStep === 0
              ? 'e.g. Water main burst near the stadium entrance...'
              : 'Type your observation accurately...'
          }
          className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
