import React, { useState } from "react";
import { QuizItem } from "../types";
import { Award, CheckCircle, Info, RefreshCw, XCircle } from "lucide-react";

interface PracticeQuizProps {
  quiz: QuizItem[];
}

export default function PracticeQuiz({ quiz }: PracticeQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center p-6 bg-[#F8FAFC] rounded-lg border border-dashed border-slate-200">
        <p className="text-slate-500 text-sm">No practice questions available for this reviewer.</p>
      </div>
    );
  }

  const handleSelectOption = (questionIndex: number, option: string) => {
    if (submitted[questionIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleVerifyAnswer = (questionIndex: number) => {
    const selected = selectedAnswers[questionIndex];
    if (!selected) return;

    setSubmitted((prev) => ({ ...prev, [questionIndex]: true }));
    if (selected === quiz[questionIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted({});
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div id="practice-quiz-panel" className="max-w-3xl mx-auto py-3 space-y-6">
      <div className="bg-[#1F2933] text-white rounded-lg p-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-black tracking-normal">Practice Quiz</h4>
          <p className="text-xs text-teal-100 mt-1">Answer each item, check feedback, then finish for a score.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-black">
          {score} / {quiz.length}
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-4">
          {quiz.map((item, qIdx) => {
            const hasSubmitted = submitted[qIdx];
            const isSelected = selectedAnswers[qIdx] !== undefined;
            const chosen = selectedAnswers[qIdx];
            const isAnswerCorrect = chosen === item.answer;

            return (
              <div
                key={qIdx}
                className={`p-4 sm:p-5 rounded-lg border transition-colors duration-200 ${
                  hasSubmitted
                    ? isAnswerCorrect
                      ? "border-emerald-200 bg-emerald-50/70"
                      : "border-rose-200 bg-rose-50/70"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-[#EEF4EF] text-[#2F5D50] text-xs font-black mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h5 className="font-bold text-[#1F2933] text-sm sm:text-base leading-6">
                    {item.question}
                  </h5>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  {item.options.map((opt, oIdx) => {
                    const isOptionChosen = chosen === opt;
                    const isOptionCorrect = opt === item.answer;

                    let buttonStyle = "border-slate-200 hover:border-[#2F5D50]/50 hover:bg-[#F8FAFC] text-slate-700";
                    if (isOptionChosen) {
                      buttonStyle = "border-[#2F5D50] bg-[#EEF4EF] text-[#1F2933] font-bold";
                    }
                    if (hasSubmitted) {
                      if (isOptionCorrect) {
                        buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                      } else if (isOptionChosen) {
                        buttonStyle = "border-rose-500 bg-rose-50 text-rose-950";
                      } else {
                        buttonStyle = "border-slate-200 text-slate-400 opacity-60 pointer-events-none";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={hasSubmitted}
                        onClick={() => handleSelectOption(qIdx, opt)}
                        className={`w-full cursor-pointer text-left p-3 rounded-lg border text-xs sm:text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2F5D50] flex justify-between gap-3 items-center disabled:cursor-default ${buttonStyle}`}
                      >
                        <span>{opt}</span>
                        {hasSubmitted && isOptionCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        {hasSubmitted && isOptionChosen && !isOptionCorrect && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    {!hasSubmitted && isSelected && (
                      <button
                        type="button"
                        onClick={() => handleVerifyAnswer(qIdx)}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#2F5D50] hover:bg-[#254A40] rounded-lg transition-colors duration-200 cursor-pointer"
                      >
                        Check Answer
                      </button>
                    )}
                  </div>

                  {hasSubmitted && (
                    <div className={`text-xs flex items-center gap-1.5 font-black ${isAnswerCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                      {isAnswerCorrect ? "Correct" : "Incorrect"}
                    </div>
                  )}
                </div>

                {hasSubmitted && (
                  <div className="mt-4 p-4 bg-white/70 rounded-lg border border-slate-200 flex gap-2">
                    <Info className="w-4 h-4 text-[#2F5D50] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase mb-0.5">Explanation</span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setQuizFinished(true)}
              className="w-full sm:w-auto px-8 py-3 bg-[#B45309] hover:bg-[#92400E] text-white font-bold rounded-lg shadow-sm transition-colors duration-200 cursor-pointer"
            >
              Finish & See Score
            </button>
          </div>
        </div>
      ) : (
        <div id="quiz-completion-scoreboard" className="bg-white p-8 rounded-lg border border-teal-900/10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-[#EEF4EF] mx-auto rounded-lg flex items-center justify-center text-[#2F5D50]">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h5 className="text-2xl font-black text-[#1F2933]">Quiz Complete</h5>
            <p className="text-sm text-slate-500">Your recall score for this reviewer:</p>
          </div>

          <div className="inline-block px-8 py-4 bg-[#F7F3EA] border border-teal-900/10 rounded-lg">
            <div className="text-4xl sm:text-5xl font-black text-[#2F5D50]">
              {score} <span className="text-2xl font-normal text-slate-400">/ {quiz.length}</span>
            </div>
            <div className="text-xs font-mono text-[#2F5D50] mt-1 uppercase font-bold tracking-wider">
              Score
            </div>
          </div>

          <p className="text-sm text-slate-600 px-4 leading-relaxed">
            {score === quiz.length
              ? "Strong recall. Keep the flashcards active so this stays fresh."
              : score >= Math.ceil(quiz.length * 0.7)
                ? "Good command of the core ideas. Revisit the missed explanations once."
                : "Keep practicing with the dictionary and flashcards before trying again."}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleResetQuiz}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
