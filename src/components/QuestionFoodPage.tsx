import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Check, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { FOOD_ITEMS } from '../data/foodItems';

interface QuestionFoodPageProps {
  selectedFoods: string[];
  customFoodNote: string;
  onToggleFood: (id: string) => void;
  onChangeCustomFoodNote: (note: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const QuestionFoodPage: React.FC<QuestionFoodPageProps> = ({
  selectedFoods,
  customFoodNote,
  onToggleFood,
  onChangeCustomFoodNote,
  onNext,
  onBack,
}) => {
  const [foodFilter, setFoodFilter] = useState<'all' | 'ghanaian' | 'continental'>('all');

  const filteredFoods = FOOD_ITEMS.filter((item) => {
    if (foodFilter === 'ghanaian') return item.category === 'ghanaian';
    if (foodFilter === 'continental') return item.category === 'continental';
    return true;
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -25 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-4 sm:p-7 md:p-10 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] space-y-4 sm:space-y-6"
      >
        {/* Header Question */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100/80 pb-4 sm:pb-5">
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-serif text-[#6B2836] font-bold tracking-tight">
              What are we feeling? 🍽️✨
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
              pick your cravings (choose as many as your heart desires!)
            </p>
          </div>

          {/* Filter Pills - scrollable/flexible on small phones */}
          <div className="w-full sm:w-auto flex items-center p-1 bg-rose-50 border border-rose-100 rounded-2xl sm:rounded-full text-xs font-medium overflow-x-auto shrink-0 gap-1">
            <button
              onClick={() => setFoodFilter('all')}
              className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-xl sm:rounded-full transition-all cursor-pointer whitespace-nowrap text-center touch-manipulation ${
                foodFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Flavors
            </button>
            <button
              onClick={() => setFoodFilter('ghanaian')}
              className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-xl sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap touch-manipulation ${
                foodFilter === 'ghanaian'
                  ? 'bg-white text-rose-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Ghanaian 🇬🇭</span>
            </button>
            <button
              onClick={() => setFoodFilter('continental')}
              className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-xl sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap touch-manipulation ${
                foodFilter === 'continental'
                  ? 'bg-white text-rose-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Continental 🍷</span>
            </button>
          </div>
        </div>

        {/* Food Grid - 1 col on mobile, 2 cols on tablet & desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[360px] sm:max-h-[440px] md:max-h-[500px] overflow-y-auto pr-1">
          {filteredFoods.map((dish) => {
            const isSelected = selectedFoods.includes(dish.id);
            return (
              <motion.div
                key={dish.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onToggleFood(dish.id)}
                className={`cursor-pointer rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 transition-all text-left relative flex items-start gap-3 sm:gap-4 touch-manipulation ${
                  isSelected
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-300/40 shadow-sm'
                    : 'bg-white border-rose-100/80 hover:border-rose-200 hover:bg-rose-50/30'
                }`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-100/90 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 border border-orange-200/50 shadow-xs">
                  {dish.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-slate-800 text-sm sm:text-base">
                      {dish.name}
                    </p>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] font-semibold text-rose-500 italic mt-0.5">
                    {dish.tag}
                  </p>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {dish.description}
                  </p>

                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200/50 flex items-center gap-1 text-xs text-rose-600 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Added to our menu!</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Food / Drink Note */}
        <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-rose-50/70 border border-rose-100">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Craving anything else specifically? (Drinks like Sobolo, fresh fruit smoothie, extra kelewele...)
          </label>
          <input
            type="text"
            value={customFoodNote}
            onChange={(e) => onChangeCustomFoodNote(e.target.value)}
            placeholder="e.g., Ice cold Sobolo with mint, extra spicy shito, or a specific restaurant you want!"
            className="w-full text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 min-h-[44px] rounded-xl sm:rounded-2xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 placeholder:text-slate-400 touch-manipulation"
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

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
            <span className="text-xs text-slate-500 text-center sm:text-right">
              Selected: <strong className="text-rose-600 font-bold">{selectedFoods.length} dishes</strong>
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="w-full sm:w-auto cursor-pointer px-7 py-3.5 min-h-[48px] rounded-[24px] font-bold text-white text-sm sm:text-base bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
