import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Heart, Check, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VIBE_OPTIONS, SWEET_ADDONS } from '../data/foodItems';
import { playCelebrationSound } from '../utils/audio';

interface QuestionVibePageProps {
  vibe: string;
  sweetAddOns: string[];
  noteForHim: string;
  onChangeVibe: (vibe: string) => void;
  onToggleAddon: (id: string) => void;
  onChangeNoteForHim: (note: string) => void;
  onConfirmAndGenerateTicket: () => void;
  onBack: () => void;
}

export const QuestionVibePage: React.FC<QuestionVibePageProps> = ({
  vibe,
  sweetAddOns,
  noteForHim,
  onChangeVibe,
  onToggleAddon,
  onChangeNoteForHim,
  onConfirmAndGenerateTicket,
  onBack,
}) => {
  const handleProceed = () => {
    playCelebrationSound();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981'],
    });
    onConfirmAndGenerateTicket();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -25 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-5 sm:p-8 md:p-10 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] space-y-5 sm:space-y-7"
      >
        {/* Header Question */}
        <div className="border-b border-rose-100/80 pb-4 sm:pb-5">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-serif text-slate-800 font-bold tracking-tight">
            Atmosphere &amp; Romantic Touches ✨
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            How should we dress and what sweet extras will make this evening special for you?
          </p>
        </div>

        {/* Vibe Selection */}
        <div className="space-y-2.5 sm:space-y-3">
          <label className="block text-xs sm:text-sm font-bold text-slate-800">
            Choose Date Vibe 🌹
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {VIBE_OPTIONS.map((item) => {
              const isSelected = vibe === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onChangeVibe(item.id)}
                  className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-start justify-between gap-2 touch-manipulation active:scale-[0.99] ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300/40 shadow-xs'
                      : 'bg-white border-rose-100 hover:border-rose-200 hover:bg-rose-50/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg sm:text-xl">{item.emoji}</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-rose-500 text-white shadow-xs' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sweet Extras Multi-Select */}
        <div className="space-y-2.5 sm:space-y-3">
          <label className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Gift className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Sweet Extras for You 🎁 (Pick as many as you like!)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
            {SWEET_ADDONS.map((addon) => {
              const isSelected = sweetAddOns.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => onToggleAddon(addon.id)}
                  className={`cursor-pointer p-3 sm:p-3.5 min-h-[44px] rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.99] ${
                    isSelected
                      ? 'bg-rose-100/90 border-rose-300 text-rose-900 shadow-xs'
                      : 'bg-white border-rose-100 text-slate-600 hover:bg-rose-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{addon.emoji}</span>
                    <span className="truncate">{addon.title}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-rose-500 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Note Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border border-rose-100 shadow-xs space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
            <span>Any Special Request or Sweet Note for Him? 💌</span>
          </label>
          <textarea
            rows={3}
            value={noteForHim}
            onChange={(e) => onChangeNoteForHim(e.target.value)}
            placeholder="e.g., Don't forget my favorite flowers, wear that nice cologne, or be ready to take 50 cute photos of me! 😊"
            className="w-full text-xs sm:text-sm p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 placeholder:text-slate-400 touch-manipulation"
          />
        </div>

        {/* Navigation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-rose-100/80">
          <button
            onClick={onBack}
            className="w-full sm:w-auto cursor-pointer px-5 sm:px-6 py-3 min-h-[44px] rounded-[24px] text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 order-2 sm:order-1 active:scale-95 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleProceed}
            className="w-full sm:w-auto cursor-pointer px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] rounded-[24px] font-bold text-white text-sm sm:text-base bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95 order-1 sm:order-2 touch-manipulation"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
