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
  const buttonPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  buttonPosRef.current = buttonPos;
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
  const arenaRectRef = useRef<DOMRect | null>(null);

  // Compute or retrieve natural unshifted center of button relative to arena
  const getNaturalPos = () => {
    if (naturalPosRef.current) return naturalPosRef.current;
    const arena = arenaRef.current;
    const btn = buttonRef.current;
    if (!arena || !btn) return null;

    const arenaRect = arena.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    arenaRectRef.current = arenaRect;

    // Subtract current buttonPos in case it's called after initial movement
    const centerX = btnRect.left + btnRect.width / 2 - arenaRect.left - buttonPosRef.current.x;
    const centerY = btnRect.top + btnRect.height / 2 - arenaRect.top - buttonPosRef.current.y;

    const natural = {
      centerX,
      centerY,
      width: btnRect.width,
      height: btnRect.height,
    };
    naturalPosRef.current = natural;
    return natural;
  };

  const updateArenaRect = () => {
    naturalPosRef.current = null;
    if (arenaRef.current) {
      arenaRectRef.current = arenaRef.current.getBoundingClientRect();
    }
  };

  // Reset natural position cache on window resize and scroll
  useEffect(() => {
    window.addEventListener('resize', updateArenaRect, { passive: true });
    window.addEventListener('scroll', updateArenaRect, { passive: true });
    return () => {
      window.removeEventListener('resize', updateArenaRect);
      window.removeEventListener('scroll', updateArenaRect);
    };
  }, []);

  // Trigger runaway movement away from cursor/tap, guaranteed to move away and stay 100% inside card
  const handleDodge = (cursorX?: number, cursorY?: number, isDirectAttempt = false) => {
    const now = performance.now();
    // Allow direct clicks/taps to always trigger evasion without debounce
    if (!isDirectAttempt && now - lastDodgeTime.current < 90) return;
    lastDodgeTime.current = now;

    playDodgeSound();
    setDodgeCount((prev) => prev + 1);

    const nextPhrase = DODGE_PHRASES[dodgeCount % DODGE_PHRASES.length];
    setCurrentPhrase(nextPhrase);

    const natural = getNaturalPos();
    const arena = arenaRef.current;
    const arenaRect = arenaRectRef.current || arena?.getBoundingClientRect();

    if (arena && arenaRect && natural) {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const pad = isMobile ? 14 : 22;

      // Button half-dimensions with safety margin (including top badge)
      const btnHalfW = natural.width / 2 + 6;
      const btnTopH = natural.height / 2 + 20; // extra room for "Can't catch me!" badge
      const btnBottomH = natural.height / 2 + 6;

      // Card bounding bounds
      const minX = pad + btnHalfW;
      const maxX = arenaRect.width - pad - btnHalfW;
      const minY = pad + btnTopH;
      const maxY = arenaRect.height - pad - btnBottomH;

      // Current center coordinates inside the card
      const currentCenterX = natural.centerX + buttonPosRef.current.x;
      const currentCenterY = natural.centerY + buttonPosRef.current.y;
      const currentVpX = arenaRect.left + currentCenterX;
      const currentVpY = arenaRect.top + currentCenterY;

      // Target tap/cursor coordinates to flee from
      const fleeFromX = cursorX ?? currentVpX;
      const fleeFromY = cursorY ?? currentVpY;

      // Collect only real text elements and interactive obstacles
      const obstacles: { left: number; right: number; top: number; bottom: number }[] = [];
      const textElements = arena.querySelectorAll('[data-text-zone="true"]');
      textElements.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          obstacles.push({
            left: r.left - arenaRect.left - 6,
            right: r.right - arenaRect.left + 6,
            top: r.top - arenaRect.top - 6,
            bottom: r.bottom - arenaRect.top + 6,
          });
        }
      });

      // Overlap calculation: returns true if candidate overlaps any text
      const overlapsAnyText = (cx: number, cy: number): boolean => {
        const bL = cx - btnHalfW;
        const bR = cx + btnHalfW;
        const bT = cy - btnTopH;
        const bB = cy + btnBottomH;

        for (const obs of obstacles) {
          if (!(bR < obs.left || bL > obs.right || bB < obs.top || bT > obs.bottom)) {
            return true;
          }
        }
        return false;
      };

      // Strict guarantee: MUST move at least minJumpDistance away from current position!
      const minJumpDistance = isMobile ? 85 : (isTablet ? 110 : 140);

      interface Candidate {
        cx: number;
        cy: number;
        distToTap: number;
        distToCurrent: number;
        overlapsText: boolean;
      }
      const allCandidates: Candidate[] = [];

      // Evasion vector away from tap/cursor
      let dirX = currentVpX - fleeFromX;
      let dirY = currentVpY - fleeFromY;
      let distToTap = Math.hypot(dirX, dirY);
      if (distToTap < 1) {
        dirX = (Math.random() - 0.5) * 2;
        dirY = (Math.random() - 0.5) * 2;
        distToTap = Math.hypot(dirX, dirY) || 1;
      }
      const baseAngle = Math.atan2(dirY, dirX);

      // 1. Radial evasion rays away from tap
      const angles = [0, 0.4, -0.4, 0.8, -0.8, 1.2, -1.2, 1.57, -1.57, 2.2, -2.2, Math.PI];
      const distances = isMobile
        ? [95, 125, 160, 200, 75]
        : [140, 185, 230, 280, 110];

      for (const d of distances) {
        for (const a of angles) {
          const testX = Math.max(minX, Math.min(maxX, currentCenterX + Math.cos(baseAngle + a) * d));
          const testY = Math.max(minY, Math.min(maxY, currentCenterY + Math.sin(baseAngle + a) * d));
          const dCurrent = Math.hypot(testX - currentCenterX, testY - currentCenterY);
          if (dCurrent >= minJumpDistance) {
            const vpX = arenaRect.left + testX;
            const vpY = arenaRect.top + testY;
            const dTap = Math.hypot(vpX - fleeFromX, vpY - fleeFromY);
            allCandidates.push({
              cx: testX,
              cy: testY,
              distToTap: dTap,
              distToCurrent: dCurrent,
              overlapsText: overlapsAnyText(testX, testY),
            });
          }
        }
      }

      // 2. Open pocket anchor points across the card (corners, flanks, bottom, top)
      const anchorSpots = [
        { cx: minX + 6, cy: minY + 6 }, // Top-Left
        { cx: maxX - 6, cy: minY + 6 }, // Top-Right
        { cx: minX + 6, cy: maxY - 6 }, // Bottom-Left
        { cx: maxX - 6, cy: maxY - 6 }, // Bottom-Right
        { cx: minX + 6, cy: arenaRect.height * 0.72 }, // Lower-Left flank
        { cx: maxX - 6, cy: arenaRect.height * 0.72 }, // Lower-Right flank
        { cx: arenaRect.width * 0.2, cy: maxY - 6 }, // Bottom-Center-Left
        { cx: arenaRect.width * 0.8, cy: maxY - 6 }, // Bottom-Center-Right
        { cx: minX + 6, cy: arenaRect.height * 0.42 }, // Mid-Left flank
        { cx: maxX - 6, cy: arenaRect.height * 0.42 }, // Mid-Right flank
      ];

      for (const spot of anchorSpots) {
        const dCurrent = Math.hypot(spot.cx - currentCenterX, spot.cy - currentCenterY);
        if (dCurrent >= minJumpDistance) {
          const vpX = arenaRect.left + spot.cx;
          const vpY = arenaRect.top + spot.cy;
          const dTap = Math.hypot(vpX - fleeFromX, vpY - fleeFromY);
          allCandidates.push({
            cx: spot.cx,
            cy: spot.cy,
            distToTap: dTap,
            distToCurrent: dCurrent,
            overlapsText: overlapsAnyText(spot.cx, spot.cy),
          });
        }
      }

      // Filter candidates that have ZERO text overlap AND are at least minJumpDistance away
      const cleanCandidates = allCandidates.filter((c) => !c.overlapsText);

      let chosen: { cx: number; cy: number };

      if (cleanCandidates.length > 0) {
        // Sort descending by distance from tap point
        cleanCandidates.sort((a, b) => b.distToTap - a.distToTap);
        const pool = cleanCandidates.slice(0, Math.min(3, cleanCandidates.length));
        const picked = pool[Math.floor(Math.random() * pool.length)];
        chosen = { cx: picked.cx, cy: picked.cy };
      } else if (allCandidates.length > 0) {
        // Fallback: pick the candidate farthest from tap that satisfies minJumpDistance
        allCandidates.sort((a, b) => b.distToTap - a.distToTap);
        chosen = { cx: allCandidates[0].cx, cy: allCandidates[0].cy };
      } else {
        // Forceful leap to opposite quadrant of card
        const oppX = currentCenterX < arenaRect.width / 2 ? maxX - 8 : minX + 8;
        const oppY = currentCenterY < arenaRect.height / 2 ? maxY - 8 : minY + 8;
        chosen = { cx: oppX, cy: oppY };
      }

      // Hard mathematical guarantee: displacement must be at least minJumpDistance
      const actualDist = Math.hypot(chosen.cx - currentCenterX, chosen.cy - currentCenterY);
      if (actualDist < minJumpDistance) {
        chosen.cx = currentCenterX < arenaRect.width / 2 ? maxX - 8 : minX + 8;
        chosen.cy = currentCenterY < arenaRect.height / 2 ? maxY - 8 : minY + 8;
      }

      const targetX = chosen.cx - natural.centerX;
      const targetY = chosen.cy - natural.centerY;

      buttonPosRef.current = { x: targetX, y: targetY };
      setButtonPos({ x: targetX, y: targetY });
      setHasMoved(true);
    } else {
      const fallbackX = (Math.random() > 0.5 ? 1 : -1) * (window.innerWidth < 640 ? 90 : 140);
      const fallbackY = (Math.random() > 0.5 ? 1 : -1) * (window.innerWidth < 640 ? 70 : 100);
      buttonPosRef.current = { x: fallbackX, y: fallbackY };
      setButtonPos({ x: fallbackX, y: fallbackY });
      setHasMoved(true);
    }
  };

  // Active cursor proximity sensor: stable listeners with no thrashing or re-registration
  useEffect(() => {
    let rafId: number | null = null;
    let lastEvent: { clientX: number; clientY: number } | null = null;

    const evaluateProximity = () => {
      if (!lastEvent) {
        rafId = null;
        return;
      }

      const natural = getNaturalPos();
      const arenaRect = arenaRectRef.current || arenaRef.current?.getBoundingClientRect();
      if (!arenaRect || !natural) {
        rafId = null;
        return;
      }

      const currentCenterX = arenaRect.left + natural.centerX + buttonPosRef.current.x;
      const currentCenterY = arenaRect.top + natural.centerY + buttonPosRef.current.y;

      const dist = Math.hypot(
        lastEvent.clientX - currentCenterX,
        lastEvent.clientY - currentCenterY
      );

      // Distance bubble: 85px on desktop, 65px on mobile
      const threshold = window.innerWidth < 640 ? 65 : 85;

      if (dist < threshold) {
        handleDodge(lastEvent.clientX, lastEvent.clientY);
      }

      lastEvent = null;
      rafId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      lastEvent = { clientX: e.clientX, clientY: e.clientY };
      if (rafId === null) {
        rafId = requestAnimationFrame(evaluateProximity);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        lastEvent = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        if (rafId === null) {
          rafId = requestAnimationFrame(evaluateProximity);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleYesClick = () => {
    playCelebrationSound();

    // Instant, lightweight celebratory confetti bursts
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x: 0.35, y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185'],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x: 0.65, y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185'],
      disableForReducedMotion: true,
    });

    onAccept();
  };

  // Yes button scale grows slightly with each dodge (max 1.35x for balance)
  const yesScale = Math.min(1.35, 1 + dodgeCount * 0.05);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-6 md:py-8 z-10">
      <div
        ref={arenaRef}
        id="hero-proposal-card"
        className="bg-white/95 sm:bg-white/90 backdrop-blur-sm sm:backdrop-blur-md rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-5 sm:p-8 md:p-10 border border-rose-100 shadow-[0_20px_50px_rgba(251,113,133,0.15)] text-center relative flex flex-col items-center gap-5 sm:gap-7 overflow-hidden"
      >
        {/* Cute puppy avatar matching viral video */}
        <div className="relative">
          <div data-text-zone="true" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-3 border-rose-200 shadow-md bg-rose-100 flex items-center justify-center text-4xl sm:text-5xl select-none">
            🐶
          </div>
          <span className="absolute -bottom-1 -right-1 text-xl sm:text-2xl filter drop-shadow-sm">🌸</span>
        </div>

        {/* Header section matching Natural Tones typography */}
        <div className="text-center space-y-1.5 sm:space-y-2 max-w-2xl lg:max-w-3xl w-full px-2">
          <h1 data-text-zone="true" className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.6rem] font-serif text-[#6B2836] font-bold tracking-tight leading-tight sm:whitespace-nowrap">
            🌸 Will you go on a date with me? 🌸
          </h1>
          <p data-text-zone="true" className="text-slate-500 text-xs sm:text-sm md:text-base pt-0.5 leading-relaxed">
            I promise it will be filled with good food, sweet laughs, and you being spoiled. 💕
          </p>
        </div>

        {/* Fun Teasing Message Banner when dodge happens */}
        <div className="min-h-[36px] sm:min-h-[40px] flex items-center justify-center px-2">
          <AnimatePresence mode="wait">
            {currentPhrase ? (
              <motion.div
                data-text-zone="true"
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
              <span data-text-zone="true" className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                <span>P.S. There is really only one correct answer!</span>
                <span>🌹</span>
              </span>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Button Arena */}
        <div
          className="relative min-h-[185px] sm:min-h-[210px] md:min-h-[230px] w-full flex items-center justify-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-rose-50/40 border border-rose-100/60"
        >
          {/* YES Button */}
          <button
            id="btn-say-yes"
            data-text-zone="true"
            onClick={handleYesClick}
            style={{
              transform: `scale(${yesScale})`,
              transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
              willChange: 'transform',
            }}
            className="relative z-20 cursor-pointer bg-[#F06292] hover:bg-[#E91E63] text-white font-bold px-7 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-5 min-h-[48px] sm:min-h-[54px] rounded-[22px] sm:rounded-[24px] shadow-lg shadow-rose-200 text-lg sm:text-xl md:text-2xl flex items-center justify-center gap-2 active:scale-95 touch-manipulation transform-gpu"
          >
            <span>YES ♥</span>
          </button>

          {/* NO Button (Evasive Runaway: Outruns Cursor Instantly across the bigger card!) */}
          <div
            id="btn-say-no-container"
            className="relative z-30 touch-manipulation transform-gpu"
            style={{
              transform: `translate3d(${buttonPos.x}px, ${buttonPos.y}px, 0)`,
              transition: hasMoved ? 'transform 0.22s cubic-bezier(0.18, 0.89, 0.32, 1.15)' : 'none',
              willChange: 'transform',
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
                  const t = e.touches[0];
                  if (t) {
                    handleDodge(t.clientX, t.clientY, true);
                  } else {
                    handleDodge(undefined, undefined, true);
                  }
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDodge(e.clientX, e.clientY, true);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDodge(e.clientX, e.clientY, true);
                }}
                onFocus={(e) => {
                  e.preventDefault();
                  handleDodge(undefined, undefined, true);
                  document.getElementById('btn-say-yes')?.focus();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDodge(undefined, undefined, true);
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
          </div>
        </div>

        {/* Counter of escape attempts if she tried to click No */}
        {dodgeCount > 0 && (
          <motion.p
            data-text-zone="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-rose-500 font-medium flex items-center justify-center gap-1.5 -mt-2"
          >
            <span>Attempts to click &apos;No&apos;: {dodgeCount}</span>
            <span>•</span>
            <span className="font-semibold text-slate-600">Success rate: 0.0% 😉</span>
          </motion.p>
        )}
      </div>
    </div>
  );
};
