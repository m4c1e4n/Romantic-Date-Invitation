import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  isSparkle: boolean;
}

const COLORS = [
  '#f43f5e',
  '#fb7185',
  '#fda4af',
  '#f472b6',
  '#ec4899',
  '#fbcfe8',
];

export const FallingHeartsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Keep particle count lean: 12 on mobile, 18 on desktop
    const count = window.innerWidth < 640 ? 12 : 18;
    const particles: Particle[] = [];

    const createParticle = (initialRandomY = true): Particle => ({
      x: Math.random() * width,
      y: initialRandomY ? Math.random() * height : -25,
      size: Math.random() * 8 + 12, // 12px to 20px
      speedY: Math.random() * 0.7 + 0.5, // Gentle drift down
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.35 + 0.2, // Soft aesthetic opacity
      opacitySpeed: (Math.random() * 0.005 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: (Math.random() - 0.5) * 0.6,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      isSparkle: Math.random() > 0.8,
    });

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const drawHeart = (
      pX: number,
      pY: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(pX, pY);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const top = -size * 0.4;
      ctx.moveTo(0, top + size * 0.35);
      ctx.bezierCurveTo(-size * 0.5, top, -size * 0.65, top + size * 0.5, 0, top + size);
      ctx.bezierCurveTo(size * 0.65, top + size * 0.5, size * 0.5, top, 0, top + size * 0.35);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (
      pX: number,
      pY: number,
      size: number,
      color: string,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(pX, pY);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const r = size * 0.35;
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.fill();
      ctx.restore();
    };

    const render = (currentTime: number) => {
      if (isVisible) {
        const delta = Math.min((currentTime - lastTime) / 16.67, 2);
        lastTime = currentTime;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speedY * delta;
          p.x += p.speedX * delta;
          p.rotation += p.rotationSpeed * delta;
          p.opacity += p.opacitySpeed * delta;

          if (p.opacity > 0.55) {
            p.opacity = 0.55;
            p.opacitySpeed = -Math.abs(p.opacitySpeed);
          } else if (p.opacity < 0.15) {
            p.opacity = 0.15;
            p.opacitySpeed = Math.abs(p.opacitySpeed);
          }

          if (p.y > height + 30 || p.x < -30 || p.x > width + 30) {
            particles[i] = createParticle(false);
            continue;
          }

          if (p.isSparkle) {
            drawSparkle(p.x, p.y, p.size, p.color, p.opacity);
          } else {
            drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
          }
        }
      } else {
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 select-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};


