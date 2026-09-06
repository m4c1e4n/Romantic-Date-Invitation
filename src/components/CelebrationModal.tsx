import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, UtensilsCrossed, Calendar, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CelebrationModalProps {
  onContinue: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ onContinue }) => {
  const triggerExtraConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[40px] p-6 sm:p-9 text-center shadow-[0_20px_50px_rgba(251,113,133,0.2)] border border-rose-100 my-8 overflow-hidden"
      >
        {/* Glow ambient background highlights */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-200/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />

        {/* Animated Celebration Icon */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-200 text-white text-3xl"
          >
            💖
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-2 -right-2 text-amber-400"
          >
            <Sparkles className="w-6 h-6 fill-amber-300" />
          </motion.div>
        </div>

        {/* Heading */}
        <div className="space-y-1.5 mb-4">
          <span className="text-rose-500 font-bold tracking-[0.2em] text-xs uppercase block">
            YAAAAY! She Said Yes! 🎉
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-800 font-bold tracking-tight">
            I&apos;m the luckiest guy in the world! 🥰
          </h2>
        </div>

        {/* Fun playful message card */}
        <div className="bg-rose-50/80 border border-rose-100 rounded-3xl p-5 text-left text-slate-600 text-sm leading-relaxed space-y-3 mb-6">
          <p className="flex items-start gap-2">
            <span className="text-rose-500 shrink-0 mt-0.5">✨</span>
            <span>
              <strong className="text-slate-800">Officially locked in!</strong> I knew you couldn&apos;t resist my charm (and that the runaway &apos;No&apos; button would do its job 😉).
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-rose-500 shrink-0 mt-0.5">🇬🇭</span>
            <span>
              Now comes the best part: <strong className="text-slate-800">You are the queen today</strong>. Pick our date &amp; time, your favorite foods (authentic Ghanaian dishes like Fufu, Ghana Jollof, Yam &amp; Garden Egg, Check-Check, or fancy continental classics), and the place you want to go!
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-rose-500 shrink-0 mt-0.5">🌹</span>
            <span>
              Your wish is my command. Let&apos;s build our perfect itinerary together!
            </span>
          </p>
        </div>

        {/* Interactive Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            id="btn-start-planning"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerExtraConfetti();
              onContinue();
            }}
            className="w-full cursor-pointer px-8 py-4 rounded-[24px] font-bold text-white text-base shadow-lg shadow-rose-200 bg-rose-500 hover:bg-rose-600 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Let&apos;s Plan Our Date</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Footer micro touch */}
        <p className="text-xs text-slate-400 mt-4">
          Press to personalize our food, time &amp; romantic details ✨
        </p>
      </motion.div>
    </div>
  );
};
