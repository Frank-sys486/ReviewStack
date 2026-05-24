import React, { useState } from "react";
import { QuizItem } from "../types";
import { CheckCircle, XCircle, Award, RefreshCw, Star, Info } from "lucide-react";

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
      <div class="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p class="text-slate-500">No practice questions available for this reviewer.</p>
      </div>
    );
  }

  const handleSelectOption = (questionIndex: number, option: string) => {
    if (submitted[questionIndex]) return; // locked once answered
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleVerifyAnswer = (questionIndex: number) => {
    const selected = selectedAnswers[questionIndex];
    if (!selected) return;

    setSubmitted((prev) => ({ ...prev, [questionIndex]: true }));
    
    // Check if correct
    const isCorrect = selected === quiz[questionIndex].answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleFinishQuiz = () => {
    setQuizFinished(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted({});
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div id="practice-quiz-panel" class="max-w-xl mx-auto py-4 space-y-8">
      {/* Quiz Title Banner */}
      <div class="bg-indigo-600 text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h4 class="text-lg font-bold font-display">Exam Simulator Challenge</h4>
          <p class="text-xs text-indigo-100 mt-1">Let's check how ready you are for the real exam!</p>
        </div>
        <div class="p-3 bg-white/10 rounded-xl text-yellow-300">
          <Star class="w-6 h-6 fill-yellow-300 animate-spin-slow" />
        </div>
      </div>

      {!quizFinished ? (
        <div class="space-y-6">
          {quiz.map((item, qIdx) => {
            const hasSubmitted = submitted[qIdx];
            const isSelected = selectedAnswers[qIdx] !== undefined;
            const chosen = selectedAnswers[qIdx];
            const isAnswerCorrect = chosen === item.answer;

            return (
              <div 
                key={qIdx} 
                className={`p-5 sm:p-6 bg-white rounded-2xl border-2 transition-all duration-200 ${
                  hasSubmitted 
                    ? isAnswerCorrect 
                      ? "border-emerald-200 bg-emerald-50/10" 
                      : "border-rose-200 bg-rose-50/10"
                    : "border-slate-100"
                }`}
              >
                <div class="flex gap-2 items-start">
                  <span class="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h5 class="font-semibold text-slate-800 text-sm sm:text-base">
                    {item.question}
                  </h5>
                </div>

                {/* Multiple choice selections */}
                <div class="mt-4 grid grid-cols-1 gap-2.5">
                  {item.options.map((opt, oIdx) => {
                    const isOptionChosen = chosen === opt;
                    const isOptionCorrect = opt === item.answer;
                    
                    let buttonStyle = "border-slate-100 hover:bg-slate-50 text-slate-700";
                    if (isOptionChosen) {
                      buttonStyle = "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium";
                    }
                    if (hasSubmitted) {
                      if (isOptionCorrect) {
                        buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium";
                      } else if (isOptionChosen) {
                        buttonStyle = "border-rose-500 bg-rose-50 text-rose-900";
                      } else {
                        buttonStyle = "border-slate-100 text-slate-400 opacity-60 pointer-events-none";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={hasSubmitted}
                        onClick={() => handleSelectOption(qIdx, opt)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 text-xs sm:text-sm transition-all focus:outline-none flex justify-between items-center ${buttonStyle}`}
                      >
                        <span>{opt}</span>
                        {hasSubmitted && isOptionCorrect && <CheckCircle class="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                        {hasSubmitted && isOptionChosen && !isOptionCorrect && <XCircle class="w-4 h-4 text-rose-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Check action item */}
                <div class="mt-4 flex items-center justify-between">
                  <div>
                    {!hasSubmitted && isSelected && (
                      <button
                        onClick={() => handleVerifyAnswer(qIdx)}
                        class="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                      >
                        Check Answer
                      </button>
                    )}
                  </div>

                  {hasSubmitted && (
                    <div className={`text-xs flex items-center gap-1.5 font-semibold ${isAnswerCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                      {isAnswerCorrect ? "Correct!" : "Oops! Incorrect"}
                    </div>
                  )}
                </div>

                {/* Accessible explanation display */}
                {hasSubmitted && (
                  <div class="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
                    <Info class="w-4.5 h-4.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-[10px] font-mono text-slate-400 font-bold block uppercase mb-0.5">Lesson Analogy</span>
                      <p class="text-xs text-slate-600 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Action to complete */}
          <div class="pt-2 text-center">
            <button
              onClick={handleFinishQuiz}
              class="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow shadow-indigo-100 transition"
            >
              Finish & See Total Grade
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div id="quiz-completion-scoreboard" class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
          <div class="w-20 h-20 bg-indigo-50 mx-auto rounded-full flex items-center justify-center text-indigo-600">
            <Award class="w-10 h-10 animate-bounce" />
          </div>

          <div class="space-y-2">
            <h5 class="text-2xl font-bold font-display text-slate-900">Quiz Completed!</h5>
            <p class="text-sm text-slate-500">Awesome job studying! Here is how you did:</p>
          </div>

          {/* Large Scoring Block */}
          <div class="inline-block px-8 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <div class="text-4xl sm:text-5xl font-black font-display text-indigo-700">
              {score} <span class="text-2xl font-normal text-indigo-400">/ {quiz.length}</span>
            </div>
            <div class="text-xs font-mono text-indigo-600 mt-1 uppercase font-bold tracking-wider">
              Score Grade
            </div>
          </div>

          <p class="text-sm text-slate-600 italic px-4 leading-relaxed">
            {score === quiz.length 
              ? "Flawless victory! You are fully prepared to secure top scores in this exam!" 
              : score >= Math.ceil(quiz.length * 0.7) 
                ? "Great work! You fully grasp the core definitions. Let's do a quick reread on missed concepts and you are safe!"
                : "Good effort! Keep practicing using the double-sided flashcards and you will scale through with flying colors!"}
          </p>

          <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleResetQuiz}
              class="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw class="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
