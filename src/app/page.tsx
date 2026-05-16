'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

function CoffeeBean({ delay, x, y, size = 24, rotation = 0 }: { delay: number; x: number; y: number; size?: number; rotation?: number }) {
  return (
    <motion.svg
      width={size} height={size * 1.3} viewBox="0 0 24 32"
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0, rotate: rotation - 30 }}
      animate={{ opacity: [0, 0.7, 0.5], scale: [0, 1.1, 1], rotate: rotation }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    >
      <ellipse cx="12" cy="16" rx="10" ry="14" fill="#5C3317" stroke="#3D1F0E" strokeWidth="1" />
      <path d="M12 4 C10 10, 10 22, 12 28" stroke="#3D1F0E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="12" cy="16" rx="10" ry="14" fill="url(#beanGrad)" opacity="0.3" />
      <defs>
        <radialGradient id="beanGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#C8956D" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

export default function IntroPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem('cafein_intro_seen');
    if (seen) { router.replace('/menu'); return; }
    const timer = setTimeout(() => {
      sessionStorage.setItem('cafein_intro_seen', '1');
      setShow(false);
      setTimeout(() => router.replace('/menu'), 600);
    }, 3200);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSkip = () => {
    sessionStorage.setItem('cafein_intro_seen', '1');
    setShow(false);
    setTimeout(() => router.replace('/menu'), 400);
  };

  const beans = [
    { x: 15, y: 18, delay: 0.2, size: 18, rotation: -25 },
    { x: 75, y: 12, delay: 0.35, size: 22, rotation: 40 },
    { x: 25, y: 65, delay: 0.5, size: 16, rotation: -60 },
    { x: 70, y: 60, delay: 0.45, size: 20, rotation: 15 },
    { x: 45, y: 8, delay: 0.3, size: 14, rotation: 70 },
    { x: 85, y: 40, delay: 0.55, size: 17, rotation: -40 },
    { x: 10, y: 42, delay: 0.6, size: 15, rotation: 50 },
    { x: 55, y: 75, delay: 0.4, size: 19, rotation: -10 },
    { x: 35, y: 82, delay: 0.65, size: 13, rotation: 30 },
    { x: 90, y: 78, delay: 0.7, size: 16, rotation: -55 },
    { x: 5, y: 85, delay: 0.75, size: 14, rotation: 65 },
    { x: 60, y: 35, delay: 0.5, size: 12, rotation: -20 },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1A0F08 0%, #2C1A0E 40%, #3D1F0E 100%)' }}
        >
          {/* Scattered coffee beans */}
          {beans.map((b, i) => (
            <CoffeeBean key={i} {...b} />
          ))}

          {/* Central coffee bean cluster */}
          <motion.div
            className="relative mb-10"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <svg width="80" height="104" viewBox="0 0 24 32" className="drop-shadow-2xl">
              <ellipse cx="12" cy="16" rx="10" ry="14" fill="#6B3A1F" stroke="#4A2510" strokeWidth="1" />
              <path d="M12 4 C10 10, 10 22, 12 28" stroke="#4A2510" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <ellipse cx="12" cy="16" rx="10" ry="14" fill="url(#mainBeanGrad)" opacity="0.4" />
              <defs>
                <radialGradient id="mainBeanGrad" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#C8956D" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>

            {/* Aroma lines */}
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute -top-6 w-0.5 rounded-full"
                style={{ left: `${30 + i * 18}%`, height: 14, background: 'rgba(200,149,109,0.25)' }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.5, 0], y: -20, scaleX: [1, 1.8, 0.5] }}
                transition={{ delay: 1.0 + i * 0.25, duration: 1.6, repeat: Infinity, repeatDelay: 0.6 }}
              />
            ))}
          </motion.div>

          {/* Logo */}
          <motion.h1
            className="font-heading text-4xl md:text-5xl text-white mb-3 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Café<span className="text-brand-accent">in</span>
          </motion.h1>

          {/* Motto */}
          <motion.p
            className="text-brand-accent/60 text-xs md:text-sm tracking-[0.25em] uppercase font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Where Every Sip Inspires
          </motion.p>

          {/* Loading bar */}
          <motion.div className="mt-12 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #5C3317, #C8956D)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.8, ease: 'linear' }}
            />
          </motion.div>

          <motion.p
            className="mt-4 text-white/30 text-[11px] tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Preparing your experience
          </motion.p>

          {/* Skip */}
          <motion.button
            onClick={handleSkip}
            className="mt-8 text-white/20 text-[10px] hover:text-white/50 transition-colors uppercase tracking-[0.2em] border border-white/10 px-4 py-1.5 rounded-full hover:border-white/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
