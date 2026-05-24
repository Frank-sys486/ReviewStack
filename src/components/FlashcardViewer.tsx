import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReviewerConcept } from "../types";
import { ChevronLeft, ChevronRight, HelpCircle, Layers, RefreshCw } from "lucide-react";

interface FlashcardViewerProps {
  concepts: ReviewerConcept[];
}

const getConceptSourceMeaning = (concept: ReviewerConcept) =>
  concept.sourceMeaning?.trim() || concept.elementaryExplanation;

export default function FlashcardViewer({ concepts }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const [scrollFade, setScrollFade] = useState(0);

  const updateScrollFade = useCallback(() => {
    const scrollArea = scrollContentRef.current;

    if (!scrollArea) {
      setScrollFade(0);
      return;
    }

    const remainingScroll = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight;
    const nextFade = Math.max(0, Math.min(1, remainingScroll / 72));
    setScrollFade(nextFade);
  }, []);

  useEffect(() => {
    const scrollArea = scrollContentRef.current;

    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }

    const frame = window.requestAnimationFrame(updateScrollFade);
    return () => window.cancelAnimationFrame(frame);
  }, [currentIndex, updateScrollFade]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateScrollFade);
    window.addEventListener("resize", updateScrollFade);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateScrollFade);
    };
  }, [currentIndex, isFlipped, updateScrollFade]);

  if (!concepts || concepts.length === 0) {
    return (
      <div className="text-center p-6 bg-[#F8FAFC] rounded-lg border border-dashed border-slate-200">
        <p className="text-slate-500 text-sm">No definitions found to show as flashcards.</p>
      </div>
    );
  }

  const current = concepts[currentIndex];

  const handleNext = () => {
    setScrollFade(0);
    setIsFlipped(false);
    setSlideDirection("next");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % concepts.length);
    }, 120);
    setTimeout(() => setSlideDirection(null), 360);
  };

  const handlePrev = () => {
    setScrollFade(0);
    setIsFlipped(false);
    setSlideDirection("prev");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
    }, 120);
    setTimeout(() => setSlideDirection(null), 360);
  };

  const currentProgress = ((currentIndex + 1) / concepts.length) * 100;
  const glassFade = isFlipped && slideDirection === null ? scrollFade : 0;

  return (
    <div id="flashcard-card-section" className="max-w-2xl mx-auto py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-mono">
          <Layers className="w-4 h-4 text-[#2F5D50]" />
          <span>Card {currentIndex + 1} of {concepts.length}</span>
        </div>
        <span className="text-xs font-black px-2.5 py-1 bg-[#EEF4EF] text-[#2F5D50] rounded-full">
          {Math.round(currentProgress)}% complete
        </span>
      </div>

      <div
        id="flipping-card"
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        className="relative h-80 w-full cursor-pointer perspective-1000 select-none group rounded-lg outline-none focus:outline-none"
      >
        <div
          className={`absolute inset-0 w-full h-full duration-500 transform-style-3d transition-[transform,opacity,filter] ease-out ${
            isFlipped ? "rotate-y-180" : ""
          } ${slideDirection === "next" ? "flashcard-next" : ""} ${slideDirection === "prev" ? "flashcard-prev" : ""}`}
        >
          <div className="absolute inset-0 backface-hidden w-full h-full bg-white rounded-lg border border-teal-900/10 p-6 sm:p-8 flex flex-col justify-between shadow-sm group-hover:border-[#2F5D50]/50 transition-colors duration-200">
            <div className="flex justify-between items-start">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Exam Keyword</span>
                <p className="mt-1 truncate text-sm font-black text-[#1F2933]">{current.exactWord}</p>
              </div>
              <span className="p-1.5 bg-[#EEF4EF] rounded-md text-[#2F5D50] group-hover:text-[#B45309] transition-colors duration-200">
                <RefreshCw className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
              <h3 id="front-word-title" className="text-3xl font-black text-[#1F2933] tracking-normal">
                {current.exactWord}
              </h3>
              <p className="mt-4 text-xs text-slate-600 flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-md">
                <HelpCircle className="w-3.5 h-3.5 text-[#2F5D50]" /> Press or click to reveal the memory trick
              </p>
            </div>

            <div className="text-center text-xs font-mono text-slate-400">
              Front side
            </div>
          </div>

          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-[#1F2933] text-white rounded-lg p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start gap-3 border-b border-white/10 pb-3">
              <div className="min-w-0">
                <span className="text-[10px] font-mono tracking-wider text-teal-100 uppercase font-bold">Term</span>
                <p className="mt-1 truncate text-sm font-black text-white">{current.exactWord}</p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-white/10 text-orange-100 rounded font-bold">
                Accessible
              </span>
            </div>

            <div className="relative my-4 min-h-0 flex-1 overflow-hidden">
              <div
                ref={scrollContentRef}
                onScroll={updateScrollFade}
                className="flashcard-scroll h-full overflow-y-auto space-y-4 pr-1 pb-10"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-200 font-bold block mb-1">
                    Mnemonic
                  </span>
                  <p id="back-mnemonic" className="text-orange-100 font-semibold text-sm sm:text-base leading-relaxed bg-white/10 p-3 rounded-lg border border-white/10">
                    "{current.mnemonic}"
                  </p>
                </div>

                <div>
                  
                  <p id="back-explanation" className="text-teal-50 text-xs leading-relaxed">
                    <span className="mb-1 block font-semibold text-teal-100">
                      From PDF: 
                    </span>
                    <span className="mb-1 block font-semibold text-teal-100">
                      {getConceptSourceMeaning(current)}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold block mb-1">
                      Easy Analogy:
                    </span>
                    {current.elementaryExplanation}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-200 font-bold block mb-1">
                    Real-life Example
                  </span>
                  <p id="back-example" className="text-emerald-50 text-xs leading-relaxed italic border-l-2 border-emerald-300/50 pl-2">
                    {current.example}
                  </p>
                </div>
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 rounded-b-lg bg-linear-to-t from-[#1F2933]/95 via-[#1F2933]/70 to-transparent backdrop-blur-[1px] transition-opacity duration-300"
                style={{ opacity: glassFade }}
              >
                <div className="absolute bottom-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/35 shadow-[0_0_18px_rgba(255,255,255,0.25)]" />
              </div>
            </div>

            <div className="text-center text-[10px] text-teal-100 pt-2 border-t border-white/10">
              Click to return to the term
            </div>
          </div>
        </div>
      </div>

      <div id="flashcard-controls" className="flex items-center justify-between mt-5">
        <button
          onClick={handlePrev}
          className="group flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 bg-white hover:bg-[#F8FAFC] border border-slate-200 rounded-lg transition-all duration-200 hover:-translate-x-0.5 hover:shadow-sm active:translate-x-0"
        >
          <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" /> Prev
        </button>

        <span className="text-xs text-slate-500 font-mono">
          {currentIndex + 1} / {concepts.length}
        </span>

        <button
          onClick={handleNext}
          className="group flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#2F5D50] hover:bg-[#254A40] border border-[#2F5D50] rounded-lg transition-all duration-200 hover:translate-x-0.5 hover:shadow-sm active:translate-x-0"
        >
          Next <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

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
        .flashcard-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .flashcard-scroll::-webkit-scrollbar {
          display: none;
        }
        .flashcard-next {
          animation: flashcard-next 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .flashcard-prev {
          animation: flashcard-prev 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes flashcard-next {
          0% {
            opacity: 0.58;
            filter: blur(1px);
            transform: translateX(18px) scale(0.985);
          }
          55% {
            opacity: 0.92;
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateX(0) scale(1);
          }
        }
        @keyframes flashcard-prev {
          0% {
            opacity: 0.58;
            filter: blur(1px);
            transform: translateX(-18px) scale(0.985);
          }
          55% {
            opacity: 0.92;
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
