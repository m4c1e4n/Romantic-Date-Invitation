import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Check, Sparkles, Heart } from 'lucide-react';
import { playCelebrationSound } from '../utils/audio';

interface PaywallJokePageProps {
  onConfirm: () => void;
  onBack: () => void;
}

export const PaywallJokePage: React.FC<PaywallJokePageProps> = ({
  onConfirm,
  onBack,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const handlePayClick = () => {
    setIsProcessing(true);
    playCelebrationSound();

    setTimeout(() => {
      setIsProcessing(false);
      setShowDiscountModal(true);

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981'],
      });
    }, 900);
  };

  const handleFinish = () => {
    setShowDiscountModal(false);
    onConfirm();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <div className="bg-white/95 backdrop-blur-sm sm:backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[44px] p-6 sm:p-9 md:p-10 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] text-center relative flex flex-col items-center gap-5 sm:gap-6">
        {/* Credit Card Icon */}
        <div className="w-14 h-11 sm:w-16 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-200 via-amber-100 to-yellow-200 border border-amber-300 shadow-sm flex items-center justify-center text-xl sm:text-2xl select-none">
          💳
        </div>

        {/* Heading */}
        <div className="space-y-1.5 sm:space-y-2 px-1">
          <h1 className="text-xl sm:text-3xl font-serif text-[#6B2836] font-bold tracking-tight">
            one small fee
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            to confirm your acceptance of this date, please complete the following transaction. totally normal. everyone does this.
          </p>
        </div>

        {/* The Fee Card */}
        <div className="w-full bg-[#FAF5F2] border border-[#EDE2DB] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-slate-800 text-sm sm:text-base md:text-lg">
              Date Agreement™
            </span>
            <span className="font-serif font-bold text-[#6B2836] text-lg sm:text-xl md:text-2xl">
              $499
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 italic">
            one-time fee • non-refundable • absolutely worth it
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full space-y-3 pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isProcessing}
            onClick={handlePayClick}
            className="w-full cursor-pointer bg-[#F06292] hover:bg-[#E91E63] text-white font-bold py-3.5 sm:py-4 px-6 min-h-[48px] rounded-[24px] shadow-lg shadow-rose-200 text-sm sm:text-base transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 touch-manipulation"
          >
            {isProcessing ? (
              <span>Authorizing Love Card... 💳</span>
            ) : (
              <span>pay $499 &amp; confirm 💖</span>
            )}
          </motion.button>

          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer min-h-[44px] py-2 px-4 rounded-xl flex items-center justify-center mx-auto active:scale-95 touch-manipulation"
          >
            go back
          </button>
        </div>
      </div>

      {/* Discount / Joke Popup Modal */}
      <AnimatePresence>
        {showDiscountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-rose-100"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl sm:text-3xl mx-auto">
                🎉
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">
                  100% OFF APPLIED!
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800">
                  Fee Waived Because You&apos;re Too Cute! 🥰
                </h3>
                <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                  Promo code <span className="font-mono font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">QUEEN_TREATMENT</span> applied.
                  <br />
                  New Total: <strong className="text-slate-800">$0.00</strong>
                  <br />
                  <span className="text-slate-400 italic text-[11px]">(Payment accepted in sweet smiles &amp; good vibes!)</span>
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleFinish}
                className="w-full cursor-pointer bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 min-h-[46px] rounded-2xl shadow-md text-sm transition-all touch-manipulation active:scale-95"
              >
                View Official Date Pass! 🎟️
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
