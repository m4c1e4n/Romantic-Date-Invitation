import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { playCelebrationSound } from '../utils/audio';

interface CelebrationPageProps {
  onStartQuestions: () => void;
  onBackToProposal: () => void;
}

export const CelebrationPage: React.FC<CelebrationPageProps> = ({
  onStartQuestions,
  onBackToProposal,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185', '#10b981'],
      });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleConfettiBlast = () => {
    playCelebrationSound();
    confetti({
      particleCount: 100,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185', '#e11d48'],
    });
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[44px] p-6 sm:p-10 md:p-12 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] text-center relative flex flex-col items-center gap-6 sm:gap-7 overflow-hidden"
      >
        {/* Top Avatar / Icon matching TikTok screenshot */}
        <div
          onClick={handleConfettiBlast}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-rose-500 to-red-500 flex items-center justify-center text-3xl sm:text-4xl shadow-md shadow-rose-200 cursor-pointer select-none active:scale-95 transition-transform"
          title="Click me!"
        >
          🧽
        </div>

        {/* Heading text matching screenshot */}
        <div className="space-y-2 sm:space-y-3 max-w-md px-1">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-serif text-[#6B2836] font-bold tracking-tight leading-snug">
            WAIT YOU ACTUALLY SAID YES?? 😭
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium">
            I was so ready for you to say no 😅
          </p>
        </div>

        {/* Action Button matching screenshot */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onBackToProposal}
            className="w-full sm:w-auto cursor-pointer px-5 py-3.5 min-h-[44px] rounded-[24px] text-xs sm:text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 order-2 sm:order-1 active:scale-95 touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              handleConfettiBlast();
              onStartQuestions();
            }}
            className="w-full sm:flex-1 cursor-pointer bg-[#F06292] hover:bg-[#E91E63] text-white font-bold px-7 py-3.5 sm:px-8 sm:py-4 min-h-[48px] rounded-[24px] shadow-lg shadow-rose-200 text-sm sm:text-base transition-all flex items-center justify-center gap-2 active:scale-95 order-1 sm:order-2 touch-manipulation"
          >
            <span>okay okay! →</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
