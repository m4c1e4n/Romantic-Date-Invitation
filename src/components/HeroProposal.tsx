import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import { playCelebrationSound, playDodgeSound } from '../utils/audio';

interface HeroProposalProps {
  onAccept: () => void;
}

const DODGE_PHRASES = [
  "Nice try, my love! 😉",
  "Error 404: 'No' button not working! 🏃‍♀️💨",
  "Please say YES, but you're free to say no! 🥺💖",
  "Oops, too slow! The button ran away! 🙈",
  "Look at that shiny YES button instead! 👉👈",
  "Are you sure? I will buy you jollof & kelewele! 🍛",
  "Button says: 'I only accept love today!' ✨",
  "Don't break my heart baby, click YES! 🥺💖",
  "You're stuck with me forever anyway! 🥰",
];

export const HeroProposal: React.FC<HeroProposalProps> = ({ onAccept }) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPhrase, setCurrentPhrase] = useState<string>('');
  const [hasMoved, setHasMoved] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastDodgeTime = useRef<number>(0);
  const naturalPosRef = useRef<{
    centerX: number;
    centerY: number;
    width: number;
    height: number;
  } | null>(null);

  // Compute or retrieve natural unshifted center of button relative to arena
  const getNaturalPos = () => {
    if (naturalPosRef.current) return naturalPosRef.current;
    const arena = arenaRef.current;
    const btn = buttonRef.current;
    if (!arena || !btn) return null;

    const arenaRect = arena.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Subtract current buttonPos in case it's called after initial movement
    const centerX = btnRect.left + btnRect.width / 2 - arenaRect.left - buttonPos.x;
    const centerY = btnRect.top + btnRect.height / 2 - arenaRect.top - buttonPos.y;

    const natural = {
      centerX,
      centerY,
      width: btnRect.width,
      height: btnRect.height,
    };
    naturalPosRef.current = natural;
    return natural;
  };

  // Reset natural position cache on window resize
  useEffect(() => {
    const handleResize = () => {
      naturalPosRef.current = null;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trigger runaway movement away from cursor, guaranteed to stay 100% inside arena
  const handleDodge = (cursorX?: number, cursorY?: number) => {
    const now = Date.now();
    // 70ms cooldown ensures quick, repeated dodges when being actively chased
    if (now - lastDodgeTime.current < 70) return;
    lastDodgeTime.current = now;

    playDodgeSound();
    setDodgeCount((prev) => prev + 1);

    const nextPhrase = DODGE_PHRASES[dodgeCount % DODGE_PHRASES.length];
    setCurrentPhrase(nextPhrase);

    const arena = arenaRef.current;
    const natural = getNaturalPos();

    if (arena && natural) {
      const arenaRect = arena.getBoundingClientRect();

      // Strict boundaries inside arena so the button is NEVER clipped or outside
      const pad = 14;
      const minCenterInArenaX = natural.width / 2 + pad;
      const maxCenterInArenaX = arenaRect.width - natural.width / 2 - pad;
      const minCenterInArenaY = natural.height / 2 + pad;
      const maxCenterInArenaY = arenaRect.height - natural.height / 2 - pad;

      // Current center coordinates
      const currentCenterXInArena = natural.centerX + buttonPos.x;
      const currentCenterYInArena = natural.centerY + buttonPos.y;
      const currentViewportCenterX = arenaRect.left + currentCenterXInArena;
      const currentViewportCenterY = arenaRect.top + currentCenterYInArena;

      // Target cursor position to flee from
      const targetCursorX = cursorX ?? currentViewportCenterX;
      const targetCursorY = cursorY ?? currentViewportCenterY;

      // Avoid landing right on top of YES button
      const yesBtn = document.getElementById('btn-say-yes');
      const yesRect = yesBtn?.getBoundingClientRect();

      // Divide arena into a 6x4 candidate grid
      interface Candidate {
        candXInArena: number;
        candYInArena: number;
        score: number;
      }
      const candidates: Candidate[] = [];

      for (let col = 0; col < 6; col++) {
        for (let row = 0; row < 4; row++) {
          const candCenterInArenaX =
            minCenterInArenaX + (col / 5) * (maxCenterInArenaX - minCenterInArenaX);
          const candCenterInArenaY =
            minCenterInArenaY + (row / 3) * (maxCenterInArenaY - minCenterInArenaY);

          const candViewportX = arenaRect.left + candCenterInArenaX;
          const candViewportY = arenaRect.top + candCenterInArenaY;

          const distToCursor = Math.hypot(
            candViewportX - targetCursorX,
            candViewportY - targetCursorY
          );
          const distFromCurrent = Math.hypot(
            candCenterInArenaX - currentCenterXInArena,
            candCenterInArenaY - currentCenterYInArena
          );

          let overlapPenalty = 0;
          if (yesRect) {
            const yesCenterX = yesRect.left + yesRect.width / 2;
            const yesCenterY = yesRect.top + yesRect.height / 2;
            const distToYes = Math.hypot(candViewportX - yesCenterX, candViewportY - yesCenterY);
            if (distToYes < (yesRect.width + natural.width) / 2 + 10) {
              overlapPenalty = 400;
            }
          }

          // Prioritize points furthest from the incoming cursor
          const score = distToCursor * 2.5 + Math.min(distFromCurrent, 180) - overlapPenalty;
          candidates.push({
            candXInArena: candCenterInArenaX,
            candYInArena: candCenterInArenaY,
            score,
          });
        }
      }

      // Sort by score descending
      candidates.sort((a, b) => b.score - a.score);

      // Pick among top 3 best points for organic playful variety
      const topCandidates = candidates.slice(0, 3);
      const chosen =
        topCandidates[Math.floor(Math.random() * topCandidates.length)] || candidates[0];

      // Calculate bounded relative offsets (x, y)
      const targetX = chosen.candXInArena - natural.centerX;
      const targetY = chosen.candYInArena - natural.centerY;

      const minX = minCenterInArenaX - natural.centerX;
      const maxX = maxCenterInArenaX - natural.centerX;
      const minY = minCenterInArenaY - natural.centerY;
      const maxY = maxCenterInArenaY - natural.centerY;

      const clampedX = Math.max(minX, Math.min(maxX, targetX));
      const clampedY = Math.max(minY, Math.min(maxY, targetY));

      setButtonPos({ x: clampedX, y: clampedY });
      setHasMoved(true);
    } else {
      setButtonPos({
        x: (Math.random() * 2 - 1) * 60,
        y: (Math.random() * 2 - 1) * 35,
      });
      setHasMoved(true);
    }
  };

  // Active cursor proximity sensor: proactively flees whenever the cursor approaches
  useEffect(() => {
    const checkProximity = (clientX: number, clientY: number) => {
      const arena = arenaRef.current;
      const natural = getNaturalPos();
      if (!arena || !natural) return;

      const arenaRect = arena.getBoundingClientRect();

      // Compute target position in viewport
      const btnTargetViewportX = arenaRect.left + natural.centerX + buttonPos.x;
      const btnTargetViewportY = arenaRect.top + natural.centerY + buttonPos.y;

      // Also check current DOM render position
      const btn = buttonRef.current;
      let btnCurrentViewportX = btnTargetViewportX;
      let btnCurrentViewportY = btnTargetViewportY;

      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        btnCurrentViewportX = btnRect.left + btnRect.width / 2;
        btnCurrentViewportY = btnRect.top + btnRect.height / 2;
      }

      const distToCurrent = Math.hypot(
        clientX - btnCurrentViewportX,
        clientY - btnCurrentViewportY
      );
      const distToTarget = Math.hypot(
        clientX - btnTargetViewportX,
        clientY - btnTargetViewportY
      );
      const minDistance = Math.min(distToCurrent, distToTarget);

      // Distance bubble: 95px on desktop/tablet, 75px on mobile
      const threshold = window.innerWidth < 640 ? 75 : 95;

      if (minDistance < threshold) {
        handleDodge(clientX, clientY);
      }
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      checkProximity(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        checkProximity(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [buttonPos, dodgeCount]);

  const handleYesClick = () => {
    // 1. Play sound
    playCelebrationSound();

    // 2. Multi-stage confetti & heart explosion
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185', '#e11d48'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Center burst
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    });

    // 3. Trigger callback
    onAccept();
  };

  // Yes button scale grows slightly with each dodge (max 1.35x for balance)
  const yesScale = Math.min(1.35, 1 + dodgeCount * 0.05);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/90 backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-5 sm:p-8 md:p-10 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] text-center relative flex flex-col items-center gap-5 sm:gap-7 overflow-hidden"
      >
        {/* Cute puppy avatar matching viral video */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-3 border-rose-200 shadow-md bg-rose-100 flex items-center justify-center text-4xl sm:text-5xl select-none">
            🐶
          </div>
          <span className="absolute -bottom-1 -right-1 text-xl sm:text-2xl filter drop-shadow-sm">🌸</span>
        </div>

        {/* Header section matching Natural Tones typography */}
        <div className="text-center space-y-1.5 sm:space-y-2 max-w-xl px-2">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#6B2836] font-bold tracking-tight leading-tight">
            🌸 Will you go on a date with me? 🌸
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base pt-0.5 leading-relaxed">
            I promise it will be filled with good food, sweet laughs, and you being spoiled. 💕
          </p>
        </div>

        {/* Fun Teasing Message Banner when dodge happens */}
        <div className="min-h-[36px] sm:min-h-[40px] flex items-center justify-center px-2">
          <AnimatePresence mode="wait">
            {currentPhrase ? (
              <motion.div
                key={dodgeCount}
                initial={{ opacity: 0, y: -6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-800 text-white font-medium text-[11px] sm:text-xs shadow-sm max-w-[90vw] text-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                <span>{currentPhrase}</span>
              </motion.div>
            ) : (
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                <span>P.S. There is really only one correct answer!</span>
                <span>🌹</span>
              </span>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Button Arena */}
        <div
          ref={arenaRef}
          className="relative min-h-[185px] sm:min-h-[210px] md:min-h-[230px] w-full flex items-center justify-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-rose-50/40 border border-rose-100/60"
        >
          {/* YES Button */}
          <motion.button
            id="btn-say-yes"
            onClick={handleYesClick}
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative z-20 cursor-pointer bg-[#F06292] hover:bg-[#E91E63] text-white font-bold px-7 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-5 min-h-[48px] sm:min-h-[54px] rounded-[22px] sm:rounded-[24px] shadow-lg shadow-rose-200 text-lg sm:text-xl md:text-2xl transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
          >
            <span>YES ♥</span>
          </motion.button>

          {/* NO Button (Evasive Runaway: Outruns Cursor Instantly!) */}
          <motion.div
            id="btn-say-no-container"
            className="relative z-10 touch-manipulation"
            animate={{
              x: buttonPos.x,
              y: buttonPos.y,
            }}
            transition={{
              type: "spring",
              stiffness: 750,
              damping: 24,
              mass: 0.45,
            }}
          >
            <div className="relative">
              <button
                ref={buttonRef}
                id="btn-say-no"
                type="button"
                onMouseEnter={(e) => handleDodge(e.clientX, e.clientY)}
                onPointerEnter={(e) => handleDodge(e.clientX, e.clientY)}
                onPointerOver={(e) => handleDodge(e.clientX, e.clientY)}
                onMouseMove={(e) => handleDodge(e.clientX, e.clientY)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDodge();
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDodge(e.clientX, e.clientY);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDodge();
                }}
                onFocus={(e) => {
                  e.preventDefault();
                  handleDodge();
                  document.getElementById('btn-say-yes')?.focus();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDodge();
                }}
                className="cursor-pointer bg-[#E2E8F0] text-slate-500 font-bold px-5 py-2.5 sm:px-7 sm:py-3.5 min-h-[44px] rounded-2xl text-xs sm:text-sm border-2 border-dashed border-slate-300 hover:bg-slate-300 transition-colors whitespace-nowrap active:scale-95 select-none flex items-center justify-center gap-1.5 touch-manipulation"
              >
                <span>{hasMoved ? "no 🐾 🏃‍♀️" : "no 🐾"}</span>
              </button>

              {hasMoved && (
                <span className="absolute -top-6 -right-2 sm:-right-4 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs pointer-events-none">
                  Can&apos;t catch me! 🏃‍♂️
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Counter of escape attempts if she tried to click No */}
        {dodgeCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-rose-500 font-medium flex items-center justify-center gap-1.5 -mt-2"
          >
            <span>Attempts to click &apos;No&apos;: {dodgeCount}</span>
            <span>•</span>
            <span className="font-semibold text-slate-600">Success rate: 0.0% 😉</span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
