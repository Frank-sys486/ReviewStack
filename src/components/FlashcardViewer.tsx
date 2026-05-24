import React, { useState } from "react";
import { ReviewerConcept } from "../types";
import { ChevronLeft, ChevronRight, HelpCircle, Lightbulb, RefreshCw, Layers } from "lucide-react";

interface FlashcardViewerProps {
  concepts: ReviewerConcept[];
}

export default function FlashcardViewer({ concepts }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!concepts || concepts.length === 0) {
    return (
      <div class="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p class="text-slate-500">No definitions found to show as flashcards.</p>
      </div>
    );
  }

  const current = concepts[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % concepts.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
    }, 150);
  };

  const currentProgress = ((currentIndex + 1) / concepts.length) * 100;

  return (
    <div id="flashcard-card-section" class="max-w-xl mx-auto py-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 text-sm text-slate-500 font-mono">
          <Layers class="w-4 h-4 text-indigo-500" />
          <span>Card {currentIndex + 1} of {concepts.length}</span>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
          {Math.round(currentProgress)}% Done
        </span>
      </div>

      {/* Interactive Flipping Card Container */}
      <div 
        id="flipping-card"
        onClick={() => setIsFlipped(!isFlipped)}
        class="relative h-80 w-full cursor-pointer perspective-1000 select-none group"
      >
        {/* Inner block that rotates */}
        <div 
          class={`absolute inset-0 w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT SIDE */}
          <div class="absolute inset-0 backface-hidden w-full h-full bg-white rounded-2xl border-2 border-slate-200 p-8 flex flex-col justify-between shadow-sm group-hover:border-indigo-300 transition-colors">
            <div class="flex justify-between items-start">
              <span class="text-xs font-mono tracking-widest text-slate-400 uppercase font-bold">Exam Keyword</span>
              <span class="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                <RefreshCw class="w-4 h-4 animate-spin-slow" />
              </span>
            </div>

            <div class="flex-1 flex flex-col justify-center items-center text-center px-4">
              <h3 id="front-word-title" class="text-3xl font-bold font-display text-slate-800 tracking-tight">
                {current.exactWord}
              </h3>
              <p class="mt-3 text-xs text-slate-500 italic flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                <HelpCircle class="w-3.5 h-3.5 text-indigo-500" /> Click this card to reveal the memory trick!
              </p>
            </div>

            <div class="text-center text-xs font-mono text-slate-400">
              Double-Sided Study Sheet
            </div>
          </div>

          {/* BACK SIDE */}
          <div class="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            {/* Top segment */}
            <div class="flex justify-between items-start border-b border-slate-800 pb-3">
              <span class="text-xs font-mono tracking-wider text-indigo-400 uppercase font-bold">Explanation & Memory Trick</span>
              <span class="text-xs font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-bold">
                Accessible Clarity
              </span>
            </div>

            {/* Main content scrollable if too long */}
            <div class="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  Memory Device Mnemonic
                </span>
                <p id="back-mnemonic" class="text-amber-300 font-display font-medium text-base leading-relaxed bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  "{current.mnemonic}"
                </p>
              </div>

              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                  Easy Explanation
                </span>
                <p id="back-explanation" class="text-slate-200 text-xs leading-relaxed font-sans">
                  {current.elementaryExplanation}
                </p>
              </div>

              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                  Real-life Example
                </span>
                <p id="back-example" class="text-emerald-100 text-xs leading-relaxed italic border-l-2 border-emerald-500/30 pl-2">
                  {current.example}
                </p>
              </div>
            </div>

            {/* Bottom segment */}
            <div class="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              Click to flip back to term
            </div>
          </div>
        </div>
      </div>

      {/* Progress Controls */}
      <div id="flashcard-controls" class="flex items-center justify-between mt-6">
        <button
          onClick={handlePrev}
          class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
        >
          <ChevronLeft class="w-4 h-4" /> Prev
        </button>

        <span class="text-xs text-slate-400 font-mono">
          {currentIndex + 1} / {concepts.length}
        </span>

        <button
          onClick={handleNext}
          class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-100 rounded-xl transition"
        >
          Next <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      {/* Helper Perspective CSS injected inline safely since CSS files are locked for styling */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
