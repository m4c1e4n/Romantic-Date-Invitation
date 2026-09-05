import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  ChefHat, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  Check, 
  RotateCcw,
  Edit3
} from 'lucide-react';
import { DateDetails } from '../types';
import { FOOD_ITEMS, VIBE_OPTIONS, SWEET_ADDONS } from '../data/foodItems';

interface TicketSummaryPageProps {
  details: DateDetails;
  onEditStep: (step: 'question-day' | 'question-food' | 'question-vibe') => void;
  onReset: () => void;
}

export const TicketSummaryPage: React.FC<TicketSummaryPageProps> = ({
  details,
  onEditStep,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const timeDisplay = details.customTime || details.timeSlot || '7:00 PM';

  const selectedFoodObjects = FOOD_ITEMS.filter((item) =>
    details.selectedFoods.includes(item.id)
  );

  const selectedFoodNames = selectedFoodObjects
    .map((f) => `${f.emoji} ${f.name}`)
    .join(', ');

  const selectedVibeObj = VIBE_OPTIONS.find((v) => v.id === details.vibe);

  const selectedAddonNames = details.sweetAddOns
    .map((id) => SWEET_ADDONS.find((a) => a.id === id)?.title)
    .filter(Boolean)
    .join(', ');

  const summaryText = `🌹 Official Date Confirmation! 🌹
Hey handsome, I said YES to our date! Here is what I picked:
📅 Date: ${details.date}
⏰ Time: ${timeDisplay}
🍲 Food Menu: ${selectedFoodNames || 'Surprise me!'} ${details.customFoodNote ? `(Craving notes: ${details.customFoodNote})` : ''}
✨ Vibe: ${selectedVibeObj?.emoji || '🌹'} ${selectedVibeObj?.title || 'Romantic'}
🎁 Special Touches: ${selectedAddonNames || 'Just your sweet self'}
${details.noteForHim ? `💌 Note for you: "${details.noteForHim}"` : ''}

I can't wait! See you soon 😘❤️`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Cute Boarding Pass / Ticket */}
        <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[48px] bg-gradient-to-br from-rose-50 via-white to-amber-50/40 border-2 border-rose-200 shadow-[0_20px_50px_rgba(251,113,133,0.18)] overflow-hidden p-4 sm:p-7 md:p-10">
          {/* Decorative ticket side cutouts */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFF5F5] border-r-2 border-rose-200" />
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFF5F5] border-l-2 border-rose-200" />

          {/* Ticket Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-rose-200 pb-4 sm:pb-5 mb-5 sm:mb-6">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-2xl sm:text-3xl shrink-0">🎟️</span>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-rose-500 block">
                  VIP DATE NIGHT PASS
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-800">
                  Admit Two: You &amp; Me ❤️
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>STATUS: CONFIRMED</span>
            </div>
          </div>

          {/* Grid of Key Ticket Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
            <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-rose-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Date
                </span>
                <div className="text-sm sm:text-base font-extrabold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{details.date}</span>
                </div>
              </div>
              <button
                onClick={() => onEditStep('question-day')}
                className="mt-2 text-[11px] text-rose-500 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer self-start min-h-[36px] py-1 active:scale-95 touch-manipulation"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change date</span>
              </button>
            </div>

            <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-rose-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Time &amp; Hour
                </span>
                <div className="text-sm sm:text-base font-extrabold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{timeDisplay}</span>
                </div>
              </div>
              <button
                onClick={() => onEditStep('question-day')}
                className="mt-2 text-[11px] text-rose-500 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer self-start min-h-[36px] py-1 active:scale-95 touch-manipulation"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change time</span>
              </button>
            </div>

            <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-rose-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Vibe &amp; Mood
                </span>
                <div className="text-sm sm:text-base font-extrabold text-slate-800 mt-1 flex items-center gap-1.5">
                  <span className="shrink-0">{selectedVibeObj?.emoji || '🌹'}</span>
                  <span className="truncate">{selectedVibeObj?.title || 'Cozy & Romantic'}</span>
                </div>
              </div>
              <button
                onClick={() => onEditStep('question-vibe')}
                className="mt-2 text-[11px] text-rose-500 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer self-start min-h-[36px] py-1 active:scale-95 touch-manipulation"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change vibe</span>
              </button>
            </div>
          </div>

          {/* Selected Food Highlights */}
          <div className="bg-white/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-rose-100 mb-4 sm:mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Curated Menu Picks ({selectedFoodObjects.length})</span>
              </span>
              <button
                onClick={() => onEditStep('question-food')}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer min-h-[36px] py-1 active:scale-95 touch-manipulation"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit food</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {selectedFoodObjects.length > 0 ? (
                selectedFoodObjects.map((food) => (
                  <span
                    key={food.id}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-slate-800"
                  >
                    <span>{food.emoji}</span>
                    <span>{food.name}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">
                  Surprise me! (Anything yummy)
                </span>
              )}
            </div>

            {details.customFoodNote && (
              <p className="text-xs text-slate-600 mt-2.5 pt-2 border-t border-rose-100">
                <strong className="text-slate-800">Special craving notes:</strong> {details.customFoodNote}
              </p>
            )}
          </div>

          {/* Sweet Addons & Notes */}
          {(details.sweetAddOns.length > 0 || details.noteForHim) && (
            <div className="text-xs text-slate-600 space-y-2 bg-rose-50/70 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-rose-100 mb-4 sm:mb-5">
              {details.sweetAddOns.length > 0 && (
                <p>
                  <strong className="text-slate-800">Sweet Extras:</strong> {selectedAddonNames}
                </p>
              )}
              {details.noteForHim && (
                <p className="italic text-rose-700">
                  <strong className="text-slate-800 not-italic">Note for him:</strong> &ldquo;{details.noteForHim}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Ticket Perforation Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 sm:pt-4 border-t border-dashed border-rose-200">
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono text-center sm:text-left">
              TICKET REF: #LOVE-VIP • NON-REFUNDABLE HAPPINESS
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <span>Verified With Love</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsAppSend}
            className="w-full sm:flex-1 cursor-pointer px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] rounded-[24px] font-bold text-white text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>Send Details to Him on WhatsApp 💬</span>
          </motion.button>

          <button
            onClick={handleCopySummary}
            className="w-full sm:w-auto cursor-pointer px-5 sm:px-6 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] rounded-[24px] font-semibold text-slate-700 bg-white hover:bg-rose-50/50 border border-rose-200 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Start Over Button */}
        <div className="text-center pt-1 sm:pt-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer min-h-[44px] py-2 px-3 rounded-xl active:scale-95 touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over / Change Everything</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
