import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, MapPin, Sparkles, Heart, Check, Building, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLACE_SUGGESTIONS } from '../data/foodItems';
import { playCelebrationSound } from '../utils/audio';

interface QuestionPlacePageProps {
  place: string;
  placeNote?: string;
  onChangePlace: (place: string) => void;
  onChangePlaceNote: (note: string) => void;
  onConfirmAndProceed: () => void;
  onBack: () => void;
}

export const QuestionPlacePage: React.FC<QuestionPlacePageProps> = ({
  place,
  placeNote = '',
  onChangePlace,
  onChangePlaceNote,
  onConfirmAndProceed,
  onBack,
}) => {
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);

  const handleSelectSuggestion = (suggestion: typeof PLACE_SUGGESTIONS[0]) => {
    setSelectedSuggestionId(suggestion.id);
    onChangePlace(suggestion.name);
  };

  const handleProceed = () => {
    playCelebrationSound();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981'],
    });
    onConfirmAndProceed();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <div className="bg-white/95 backdrop-blur-sm sm:backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-5 sm:p-8 md:p-10 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] space-y-5 sm:space-y-7">
        {/* Header Question */}
        <div className="border-b border-rose-100/80 pb-4 sm:pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl sm:text-2xl">📍</span>
            <span className="text-xs sm:text-sm font-semibold text-rose-500 uppercase tracking-wider">
              Step 3 of 4
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-serif text-slate-800 font-bold tracking-tight">
            Pick a Place 📍
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
            Where in the world would you like us to go? Type your dream spot or pick an idea below — anywhere you want, I will take you there! 🌸
          </p>
        </div>

        {/* Primary Input Section: Type Where She Wants to Go */}
        <div className="space-y-2 sm:space-y-3 bg-rose-50/50 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-rose-100">
          <label className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Type the place you want to go 💕</span>
            </span>
            <span className="text-[11px] font-normal text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full">
              Your Choice!
            </span>
          </label>

          <div className="relative">
            <input
              type="text"
              id="input-date-place"
              value={place}
              onChange={(e) => {
                onChangePlace(e.target.value);
                setSelectedSuggestionId(null);
              }}
              placeholder="e.g. Skybar 25, Santoku, Laboma Beach, a cozy rooftop, or surprise me..."
              className="w-full text-sm sm:text-base font-medium px-4 py-3.5 sm:py-4 pl-11 rounded-2xl bg-white border-2 border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 focus:outline-none text-slate-800 placeholder:text-slate-400 transition-all shadow-xs"
            />
            <Compass className="w-5 h-5 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>You can type any restaurant, cafe, beach, lounge, rooftop, or special location!</span>
          </p>
        </div>

        {/* Quick Inspiration Suggestions */}
        <div className="space-y-2.5 sm:space-y-3">
          <label className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Or click an inspiration to auto-fill ✨</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {PLACE_SUGGESTIONS.map((item) => {
              const isSelected =
                selectedSuggestionId === item.id ||
                place.toLowerCase().trim() === item.name.toLowerCase().trim();

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectSuggestion(item)}
                  className={`cursor-pointer p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-start justify-between gap-2.5 touch-manipulation active:scale-[0.99] ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300/40 shadow-xs'
                      : 'bg-white border-rose-100 hover:border-rose-200 hover:bg-rose-50/30'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg sm:text-xl shrink-0">{item.emoji}</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {item.name}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Notes or Details about the place */}
        <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border border-rose-100 shadow-xs space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
            <span>Any special requests or details about our spot? 💌</span>
          </label>
          <textarea
            rows={2}
            value={placeNote}
            onChange={(e) => onChangePlaceNote(e.target.value)}
            placeholder="e.g. Table with ocean view, quiet corner, outdoor seating, or surprise me with whatever you think is best! 😊"
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProceed}
            className="w-full sm:w-auto cursor-pointer bg-[#F06292] hover:bg-[#E91E63] text-white font-bold px-7 sm:px-9 py-3.5 sm:py-4 min-h-[48px] rounded-[24px] shadow-lg shadow-rose-200 text-xs sm:text-sm transition-all flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-95 touch-manipulation"
          >
            <span>Lock In Our Spot &amp; Continue</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
