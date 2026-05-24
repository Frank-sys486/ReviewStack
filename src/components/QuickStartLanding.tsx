import React from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CreditCard,
  FileText,
  PlayCircle,
  UserCheck,
} from "lucide-react";

interface QuickStartLandingProps {
  onStart: () => void;
  onViewDemo: () => void;
}

export default function QuickStartLanding({ onStart, onViewDemo }: QuickStartLandingProps) {
  return (
    <div id="landing-container" className="relative left-1/2 w-screen -translate-x-1/2 -mt-4 sm:-mt-6 lg:-mt-8">
      <section id="hero-header" className="border-b border-slate-200 bg-[#FBFAF6] px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
          <div className="space-y-5">
            <h1 className="font-display text-5xl font-semibold tracking-normal text-[#1F2933] sm:text-7xl">
              ReviewStack
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Turn course material into a focused study desk with generated summaries, terms, flashcards, quizzes, and saved review sessions.
            </p>
          </div>

          <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <button
              id="btn-get-started"
              onClick={onStart}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2F5D50] px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#254A40] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="btn-view-demo"
              onClick={onViewDemo}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#1F2933] transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <PlayCircle className="h-4 w-4 text-[#B45309]" />
              Try Demo Guide
            </button>
          </div>
        </div>
      </section>

      <section id="features-grid" className="bg-[#F7F3EA] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          {[
            {
              icon: FileText,
              title: "Source-first workspace",
              body: "Upload PDF notes or paste material before generating a reviewer.",
            },
            {
              icon: BrainCircuit,
              title: "Memory aids",
              body: "Build analogies, mnemonics, and examples from course terms.",
            },
            {
              icon: BookOpen,
              title: "Study modes",
              body: "Use overview, dictionary, flashcards, quiz, and original source tabs.",
            },
            {
              icon: UserCheck,
              title: "Demo profile",
              body: "Open a seeded account and sample guides when you want to inspect the workflow.",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#EEF4EF] text-[#2F5D50]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2933]">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{feature.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#EEF4EF] text-[#2F5D50]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F2933]">Study coins and generated guides are stored locally.</p>
              <p className="text-sm text-slate-600">Use the demo to inspect reviewer, flashcard, quiz, and history states.</p>
            </div>
          </div>
          <button
            onClick={onViewDemo}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#B45309] px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#92400E] focus:outline-none focus:ring-2 focus:ring-[#B45309]/30"
          >
            Open Demo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
