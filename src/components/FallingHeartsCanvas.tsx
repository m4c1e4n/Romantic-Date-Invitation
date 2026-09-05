import React, { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  swayAmount: number;
  symbol: string;
}

const HEART_SYMBOLS = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌸', '💘'];
const COLORS = ['#f43f5e', '#ec4899', '#f97316', '#fb7185', '#fda4af', '#f59e0b'];

export const FallingHeartsCanvas: React.FC = () => {
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  useEffect(() => {
    // Generate initial falling hearts batch
    const count = 32;
    const generated: HeartParticle[] = [];

    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100, // percentage of viewport width
        size: Math.random() * 16 + 14, // 14px to 30px
        duration: Math.random() * 8 + 7, // 7s to 15s
        delay: Math.random() * 10, // staggered delay
        opacity: Math.random() * 0.5 + 0.35, // 0.35 to 0.85
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        swayAmount: Math.random() * 30 + 10,
        symbol: HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)],
      });
    }

    setParticles(generated);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {particles.map((heart) => (
        <span
          key={heart.id}
          className="absolute animate-falling-heart select-none"
          style={{
            left: `${heart.x}vw`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `-${heart.delay}s`,
            opacity: heart.opacity,
            filter: 'drop-shadow(0 2px 4px rgba(244, 63, 94, 0.2))',
          }}
        >
          {heart.symbol}
        </span>
      ))}
    </div>
  );
};
