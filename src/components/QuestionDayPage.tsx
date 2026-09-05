import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuestionDayPageProps {
  date: string;
  timeSlot: string;
  customTime: string;
  onChangeDate: (date: string) => void;
  onChangeTimeSlot: (slot: string) => void;
  onChangeCustomTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function to24Hour(timeStr: string): string {
  if (!timeStr) return '19:00';
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2].padStart(2, '0');
    const p = (match[3] || 'PM').toUpperCase();
    if (p === 'PM' && h < 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
  }
  return '19:00';
}

function to12Hour(time24: string): string {
  if (!time24) return '7:00 PM';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  let h = parseInt(parts[0], 10);
  const m = parts[1].padStart(2, '0');
  if (isNaN(h)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
}

export const QuestionDayPage: React.FC<QuestionDayPageProps> = ({
  date,
  customTime,
  onChangeDate,
  onChangeTimeSlot,
  onChangeCustomTime,
  onNext,
  onBack,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const formatFriendlyDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      const [y, m, d] = dateString.split('-').map(Number);
      if (!y || !m || !d) return '';
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const friendlyDate = formatFriendlyDate(date);
  const time24Value = to24Hour(customTime || '7:00 PM');
  const displayTime = customTime || to12Hour(time24Value);

  return (
    <div className="relative w-full max-w-xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[44px] p-5 sm:p-8 md:p-9 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] text-center relative flex flex-col items-center gap-5 sm:gap-6"
      >
        {/* Top Header Icon */}
        <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl select-none">
          <span className="p-2.5 sm:p-3 rounded-2xl bg-rose-50 border border-rose-100 shadow-xs">📅</span>
          <span className="p-2.5 sm:p-3 rounded-2xl bg-rose-50 border border-rose-100 shadow-xs">⏰</span>
          <span className="text-lg sm:text-xl text-rose-400">🐾</span>
        </div>

        {/* Heading */}
        <div className="space-y-1 px-1">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-serif text-slate-800 font-bold tracking-tight">
            So... when are you free?
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Pick your preferred date and time for our date 💕
          </p>
        </div>

        {/* Section 1: Date Selection */}
        <div className="w-full text-left space-y-3 bg-rose-50/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-rose-100">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Choose Date 📅</span>
            </label>
            {friendlyDate && (
              <span className="text-xs font-bold text-rose-600 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                {friendlyDate}
              </span>
            )}
          </div>

          <input
            type="date"
            value={date}
            min={todayStr}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full px-4 py-3.5 min-h-[48px] rounded-2xl border border-rose-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white shadow-xs text-sm sm:text-base cursor-pointer touch-manipulation"
          />
        </div>

        {/* Section 2: Simple Time Picker (matches date picker) */}
        <div className="w-full text-left space-y-3 bg-rose-50/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-rose-100">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Choose Time ⏰</span>
            </label>
            {displayTime && (
              <span className="text-xs font-bold text-rose-600 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                {displayTime}
              </span>
            )}
          </div>

          <input
            type="time"
            value={time24Value}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const formatted = to12Hour(val);
                onChangeTimeSlot('custom');
                onChangeCustomTime(formatted);
              }
            }}
            className="w-full px-4 py-3.5 min-h-[48px] rounded-2xl border border-rose-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white shadow-xs text-sm sm:text-base cursor-pointer touch-manipulation"
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 sm:pt-2">
          <button
            onClick={onBack}
            className="w-full sm:w-auto cursor-pointer px-5 py-3 min-h-[44px] rounded-[24px] text-xs sm:text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 order-2 sm:order-1 active:scale-95 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full sm:flex-1 cursor-pointer px-7 py-3.5 min-h-[48px] rounded-[24px] font-bold text-white text-sm sm:text-base bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95 order-1 sm:order-2 touch-manipulation"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
