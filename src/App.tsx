/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FallingHeartsCanvas } from './components/FallingHeartsCanvas';
import { HeroProposal } from './components/HeroProposal';
import { CelebrationPage } from './components/CelebrationPage';
import { QuestionDayPage } from './components/QuestionDayPage';
import { QuestionFoodPage } from './components/QuestionFoodPage';
import { QuestionPlacePage } from './components/QuestionPlacePage';
import { LetterPage } from './components/LetterPage';
import { PaywallJokePage } from './components/PaywallJokePage';
import { TicketSummaryPage } from './components/TicketSummaryPage';
import { StepProgressBar } from './components/StepProgressBar';
import { DatePageStep, DateDetails } from './types';
import { Heart, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'romantic_date_invitation_v5';

function getUpcomingWeekend() {
  const today = new Date();
  const day = today.getDay();
  // next Saturday
  const diff = (6 - day + 7) % 7 || 7;
  const nextSat = new Date(today);
  nextSat.setDate(today.getDate() + diff);
  return nextSat.toISOString().split('T')[0];
}

const DEFAULT_DETAILS: DateDetails = {
  date: getUpcomingWeekend(),
  timeSlot: 'dinner',
  customTime: '7:00 PM',
  selectedFoods: [],
  customFoodNote: '',
  place: 'Skybar 25 Rooftop',
  placeNote: '',
  noteForHim: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<DatePageStep>('proposal');
  const [details, setDetails] = useState<DateDetails>(DEFAULT_DETAILS);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) {
          const mappedStep =
            parsed.currentStep === 'question-time'
              ? 'question-day'
              : parsed.currentStep === 'question-vibe'
              ? 'question-place'
              : parsed.currentStep;
          setCurrentStep(mappedStep);
        }
        if (parsed.details) {
          setDetails((prev) => ({ ...prev, ...parsed.details }));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save changes to localStorage
  const saveState = (step: DatePageStep, updatedDetails: DateDetails) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentStep: step, details: updatedDetails })
      );
    } catch {
      // ignore
    }
  };

  const goToStep = (step: DatePageStep) => {
    setCurrentStep(step);
    saveState(step, details);
  };

  const handleProposalAccepted = () => {
    goToStep('celebration');
  };

  const handleToggleFood = (foodId: string) => {
    setDetails((prev) => {
      const updatedFoods = prev.selectedFoods.includes(foodId)
        ? prev.selectedFoods.filter((id) => id !== foodId)
        : [...prev.selectedFoods, foodId];
      const nextDetails = { ...prev, selectedFoods: updatedFoods };
      saveState(currentStep, nextDetails);
      return nextDetails;
    });
  };

  const handleChangeCustomFoodNote = (note: string) => {
    setDetails((prev) => {
      const next = { ...prev, customFoodNote: note };
      saveState(currentStep, next);
      return next;
    });
  };

  const handleChangeDate = (newDate: string) => {
    setDetails((prev) => {
      const next = { ...prev, date: newDate };
      saveState(currentStep, next);
      return next;
    });
  };

  const handleChangeTimeSlot = (slot: string) => {
    setDetails((prev) => {
      const next = { ...prev, timeSlot: slot };
      saveState(currentStep, next);
      return next;
    });
  };

  const handleChangeCustomTime = (time: string) => {
    setDetails((prev) => {
      const next = { ...prev, customTime: time };
      saveState(currentStep, next);
      return next;
    });
  };

  const handleChangePlace = (place: string) => {
    setDetails((prev) => {
      const next = { ...prev, place };
      saveState(currentStep, next);
      return next;
    });
  };

  const handleChangePlaceNote = (note: string) => {
    setDetails((prev) => {
      const next = { ...prev, placeNote: note };
      saveState(currentStep, next);
      return next;
    });
  };

  const handleChangeNoteForHim = (note: string) => {
    setDetails((prev) => {
      const next = { ...prev, noteForHim: note };
      saveState(currentStep, next);
      return next;
    });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setDetails(DEFAULT_DETAILS);
    setCurrentStep('proposal');
  };

  const timeDisplay = details.customTime || '7:00 PM';

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-rose-200 selection:text-rose-900 bg-[#FFF5F5]">
      {/* Dynamic Falling Hearts Backdrop */}
      <FallingHeartsCanvas />

      {/* Natural Tones Ambient Silhouette Watermarks */}
      <div className="fixed top-10 left-10 text-rose-300 opacity-40 transform -rotate-12 pointer-events-none z-0">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <div className="fixed bottom-10 right-10 text-rose-300 opacity-40 transform rotate-12 pointer-events-none z-0">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Floating Top Navigation Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 md:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm">
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 fill-rose-500" />
          </motion.div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wide">
            Special Date Request 💕
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentStep !== 'proposal' && (
            <button
              onClick={handleReset}
              title="Play again from start"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-3.5 py-1.5 min-h-[36px] rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-xs active:scale-95 touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Start over</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Multi-Page Question Flow */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 sm:py-4 w-full">
        {/* Step Progress indicator when on questions or ticket */}
        <StepProgressBar
          currentStep={currentStep}
          onStepClick={(targetStep) => goToStep(targetStep)}
        />

        <AnimatePresence mode="wait">
          {/* Page 0: The Proposal Question */}
          {currentStep === 'proposal' && (
            <motion.div
              key="proposal-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <HeroProposal onAccept={handleProposalAccepted} />
            </motion.div>
          )}

          {/* Page 1: The Acceptance Celebration */}
          {currentStep === 'celebration' && (
            <motion.div
              key="celebration-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <CelebrationPage
                onStartQuestions={() => goToStep('question-day')}
                onBackToProposal={() => goToStep('proposal')}
              />
            </motion.div>
          )}

          {/* Combined Page for Date & Time Selection */}
          {currentStep === 'question-day' && (
            <motion.div
              key="question-day-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <QuestionDayPage
                date={details.date}
                timeSlot={details.timeSlot}
                customTime={details.customTime}
                onChangeDate={handleChangeDate}
                onChangeTimeSlot={handleChangeTimeSlot}
                onChangeCustomTime={handleChangeCustomTime}
                onNext={() => goToStep('question-food')}
                onBack={() => goToStep('celebration')}
              />
            </motion.div>
          )}

          {/* Page for FOOD & CRAVINGS */}
          {currentStep === 'question-food' && (
            <motion.div
              key="question-food-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <QuestionFoodPage
                selectedFoods={details.selectedFoods}
                customFoodNote={details.customFoodNote}
                onToggleFood={handleToggleFood}
                onChangeCustomFoodNote={handleChangeCustomFoodNote}
                onNext={() => goToStep('question-place')}
                onBack={() => goToStep('question-day')}
              />
            </motion.div>
          )}

          {/* Page 5: Separate Page for PICK A PLACE */}
          {currentStep === 'question-place' && (
            <motion.div
              key="question-place-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <QuestionPlacePage
                place={details.place}
                placeNote={details.placeNote}
                onChangePlace={handleChangePlace}
                onChangePlaceNote={handleChangePlaceNote}
                onConfirmAndProceed={() => goToStep('letter')}
                onBack={() => goToStep('question-food')}
              />
            </motion.div>
          )}

          {/* Page 6: Separate Page for "Glad You Didn't Say No" Note */}
          {currentStep === 'letter' && (
            <motion.div
              key="letter-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <LetterPage
                timeDisplay={timeDisplay}
                onNext={() => goToStep('paywall')}
                onBack={() => goToStep('question-place')}
              />
            </motion.div>
          )}

          {/* Page 7: Separate Page for "GH₵ 499 Date Agreement" Joke Fee */}
          {currentStep === 'paywall' && (
            <motion.div
              key="paywall-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <PaywallJokePage
                onConfirm={() => goToStep('ticket')}
                onBack={() => goToStep('letter')}
              />
            </motion.div>
          )}

          {/* Page 8: The Confirmed Official VIP Date Ticket */}
          {currentStep === 'ticket' && (
            <motion.div
              key="ticket-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              <TicketSummaryPage
                details={details}
                onEditStep={(step) => goToStep(step)}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Romantic Footer */}
      <footer id="app-footer" className="relative z-20 w-full text-center py-5 px-4 flex flex-col items-center justify-center gap-1">
        <span className="text-slate-400 text-[11px] font-medium tracking-widest uppercase">
          Designed with love just for you
        </span>
        <span className="text-rose-500 font-medium text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5">
          ❤️ Stephanie Akowuah ❤️
        </span>
      </footer>
    </div>
  );
}
