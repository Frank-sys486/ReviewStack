import React from "react";
import { Sparkles, FileText, UserCheck, CreditCard, BrainCircuit } from "lucide-react";

interface QuickStartLandingProps {
  onStart: () => void;
  onViewDemo: () => void;
}

export default function QuickStartLanding({ onStart, onViewDemo }: QuickStartLandingProps) {
  return (
    <div id="landing-container" class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div id="hero-header" class="text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium">
          <Sparkles class="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>Study Smarter, Not Harder</span>
        </div>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-slate-900 leading-tight">
          ReviewStack <br />
          <span class="text-indigo-600 font-extrabold">Make Every Study Session Memorable</span>
        </h1>
        
        <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Turn your notes and PDFs into clear reviewers, mnemonics, and quizzes that help you remember more
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            id="btn-get-started"
            onClick={onStart}
            class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-100 transition-all duration-200 transform hover:-translate-y-0.5 text-base"
          >
            Get Started Now
          </button>
          <button
            id="btn-view-demo"
            onClick={onViewDemo}
            class="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-sm transition-all duration-200 text-base"
          >
            Try a Quick Demo
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div id="features-grid" class="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div id="feature-pdf" class="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="p-3 bg-rose-50 text-rose-600 rounded-xl h-fit">
            <FileText class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900 font-display">Client-Side PDF Parsing</h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">
              We extract study lesson content from your PDF files directly inside your browser session. Your materials are processed safely and instantly.
            </p>
          </div>
        </div>

        <div id="feature-mnemonics" class="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit">
            <BrainCircuit class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900 font-display">High-Memory Mnemonics & Analogies</h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">
              Generates exact technical terms from university plans, paired with creative memory triggers and fundamental analogies to keep mental stress minimal.
            </p>
          </div>
        </div>

        <div id="feature-profile" class="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
            <UserCheck class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900 font-display">Student Study Accounts</h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">
              Create a custom educational profile. Log in securely to manage your cumulative review files, check diagnostic metrics, and save guides.
            </p>
          </div>
        </div>

        <div id="feature-credits" class="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
            <CreditCard class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900 font-display">Simple Budget/Credit Management</h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">
              Top up study credits dynamically on your dashboard with our simple simulated payment interface. Keep mock payments safe and blank!
            </p>
          </div>
        </div>
      </div>

      {/* Trust Signoff - Minimalist human layout */}
      <div id="landing-footer" class="mt-16 text-center border-t border-slate-100 pt-8">
        <p class="text-xs text-slate-400 font-mono">
          Lesson Plan Study Guide Reviewer • 100% Client-Side Encryption
        </p>
      </div>
    </div>
  );
}
