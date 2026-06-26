/**
 * Product3DViewer
 * Drag-to-rotate 3D "device" rendered with CSS 3D transforms (no Three.js).
 * Rotation is animated via a ref + direct DOM style writes inside a single rAF
 * loop, so it runs at a steady 60fps with ZERO React re-renders during motion.
 * Desktop gets full drag; mobile auto-rotates. Respects reduced-motion.
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Zap, Activity } from 'lucide-react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export default function Product3DViewer() {
  const { isDesktop, shouldReduceAnimations } = useDeviceCapabilities();
  const cubeRef = useRef(null);
  const rot = useRef({ x: -15, y: 25 });
  const drag = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    const apply = () => {
      cube.style.transform = `rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
    };
    apply();

    if (shouldReduceAnimations) return; // static pose, no loop

    let frame;
    const speed = isDesktop ? 0.15 : 0.4;
    const tick = () => {
      if (!drag.current.active) {
        rot.current.y += speed;
        apply();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isDesktop, shouldReduceAnimations]);

  const onDown = (clientX, clientY) => {
    drag.current = { active: true, startX: clientX, startY: clientY, baseX: rot.current.x, baseY: rot.current.y };
  };
  const onMove = (clientX, clientY) => {
    if (!drag.current.active) return;
    const dx = clientX - drag.current.startX;
    const dy = clientY - drag.current.startY;
    rot.current = {
      x: Math.max(-60, Math.min(60, drag.current.baseX - dy * 0.4)),
      y: drag.current.baseY + dx * 0.4,
    };
    if (cubeRef.current) {
      cubeRef.current.style.transform = `rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
    }
  };
  const onUp = () => { drag.current.active = false; };

  const faceBase = {
    position: 'absolute', inset: 0, borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div
      className="relative select-none"
      style={{ perspective: 1400, width: '100%', maxWidth: 420, aspectRatio: '1', margin: '0 auto', cursor: isDesktop ? 'grab' : 'default', touchAction: 'pan-y' }}
      onMouseDown={(e) => isDesktop && onDown(e.clientX, e.clientY)}
      onMouseMove={(e) => isDesktop && onMove(e.clientX, e.clientY)}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={(e) => onDown(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => onMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={onUp}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(0,210,255,0.18) 0%, rgba(229,169,60,0.08) 45%, transparent 70%)', filter: 'blur(30px)' }} />

      {/* 3D cube */}
      <div
        ref={cubeRef}
        style={{ position: 'absolute', inset: '15%', transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Front — the "board" */}
        <div style={{ ...faceBase, transform: 'translateZ(70px)',
          background: 'linear-gradient(135deg, #0b2a2e 0%, #071c2e 100%)',
          border: '1px solid rgba(0,210,255,0.4)',
          boxShadow: 'inset 0 0 30px rgba(0,210,255,0.15), 0 0 20px rgba(0,210,255,0.2)' }}>
          <BoardFace />
        </div>
        {/* Back */}
        <div style={{ ...faceBase, transform: 'rotateY(180deg) translateZ(70px)',
          background: 'linear-gradient(135deg, #2a1e07 0%, #1c1207 100%)',
          border: '1px solid rgba(229,169,60,0.4)',
          boxShadow: 'inset 0 0 30px rgba(229,169,60,0.12)' }}>
          <div className="font-headline-xl text-secondary" style={{ fontSize: 28, opacity: 0.5, letterSpacing: '0.1em' }}>ZEUS</div>
        </div>
        {/* Sides */}
        {[
          'rotateY(90deg) translateZ(70px)',
          'rotateY(-90deg) translateZ(70px)',
          'rotateX(90deg) translateZ(70px)',
          'rotateX(-90deg) translateZ(70px)',
        ].map((t, i) => (
          <div key={i} style={{ ...faceBase, transform: t,
            background: 'linear-gradient(135deg, rgba(17,28,58,0.95), rgba(7,12,30,0.95))',
            border: '1px solid rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      {/* Hint */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-code-sm text-on-surface-variant flex items-center gap-1.5" style={{ fontSize: 10, opacity: 0.6 }}>
        <motion.span animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.8 }}>↔</motion.span>
        {isDesktop ? 'Drag to rotate' : 'Live preview'}
      </div>
    </div>
  );
}

// The visual "components" on the board face
function BoardFace() {
  return (
    <div className="relative w-full h-full p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex items-center justify-center"
        style={{ width: '38%', height: '38%', background: 'linear-gradient(135deg,#0a1420,#1e2d5a)', border: '1px solid rgba(0,210,255,0.5)', boxShadow: '0 0 16px rgba(0,210,255,0.3)' }}>
        <Cpu className="text-tertiary" style={{ width: '40%', height: '40%' }} />
      </div>
      <div className="absolute top-3 left-3 w-8 h-8 rounded flex items-center justify-center" style={{ background: 'rgba(229,169,60,0.12)', border: '1px solid rgba(229,169,60,0.4)' }}>
        <Wifi className="w-4 h-4 text-secondary" />
      </div>
      <div className="absolute top-3 right-3 w-8 h-8 rounded flex items-center justify-center" style={{ background: 'rgba(0,210,255,0.12)', border: '1px solid rgba(0,210,255,0.4)' }}>
        <Zap className="w-4 h-4 text-tertiary" />
      </div>
      <div className="absolute bottom-3 left-3 w-8 h-8 rounded flex items-center justify-center" style={{ background: 'rgba(217,70,239,0.12)', border: '1px solid rgba(217,70,239,0.4)' }}>
        <Activity className="w-4 h-4" style={{ color: '#d946ef' }} />
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
        <line x1="22%" y1="22%" x2="42%" y2="42%" stroke="#00d2ff" strokeWidth="1" />
        <line x1="78%" y1="22%" x2="58%" y2="42%" stroke="#e5a93c" strokeWidth="1" />
        <line x1="22%" y1="78%" x2="42%" y2="58%" stroke="#d946ef" strokeWidth="1" />
        <circle cx="22%" cy="22%" r="2" fill="#00d2ff" />
        <circle cx="78%" cy="22%" r="2" fill="#e5a93c" />
      </svg>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="w-1.5 h-0.5 rounded-full bg-tertiary" style={{ animation: `pulse 2s ${i * 0.2}s ease-in-out infinite` }} />
        ))}
      </div>
    </div>
  );
}
