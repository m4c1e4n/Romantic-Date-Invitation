import React from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowLeft, Car } from 'lucide-react';

interface LetterPageProps {
  timeDisplay: string;
  onNext: () => void;
  onBack: () => void;
}

export const LetterPage: React.FC<LetterPageProps> = ({
  timeDisplay,
  onNext,
  onBack,
}) => {
  return (
    <div className="relative w-full max-w-xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <div className="bg-white/95 backdrop-blur-sm sm:backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[44px] p-6 sm:p-10 md:p-12 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] text-center relative flex flex-col items-center gap-6 sm:gap-7">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
          🚗
        </div>

        <div className="space-y-2 sm:space-y-3 px-1">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-serif text-[#6B2836] font-bold tracking-tight leading-snug">
            glad you didn&apos;t say no. be ready by {timeDisplay.includes('(') ? timeDisplay.split('(')[1].replace(')', '') : timeDisplay || '6'}, I&apos;m coming to get you 🚗
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm italic font-serif pt-1 max-w-md mx-auto">
            P.S. normal people text. I made a website during lunch, just for you. no big deal.
          </p>

          <div className="flex items-center justify-center gap-2 text-rose-400 pt-1 sm:pt-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onBack}
            className="w-full sm:w-auto cursor-pointer px-5 py-3.5 min-h-[44px] rounded-[24px] text-xs sm:text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 order-2 sm:order-1 active:scale-95 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="w-full sm:flex-1 cursor-pointer bg-[#F06292] hover:bg-[#E91E63] text-white font-bold px-7 py-3.5 sm:px-8 sm:py-4 min-h-[48px] rounded-[24px] shadow-lg shadow-rose-200 text-sm sm:text-base transition-all flex items-center justify-center gap-2 active:scale-95 order-1 sm:order-2 touch-manipulation"
          >
            <span>ok I accept 💖</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
