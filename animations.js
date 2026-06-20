/**
 * ZEUS IOT - Custom Animations & Interactions
 * Provides WOW-Factor background canvas effects, magnetic buttons, and 3D tilt.
 */

function initAllAnimations() {
  const fns = [
    initBootSequence,
    initIoTSandbox,
    initMagneticButtons,
    initTiltCards,
    initScrollReveal
  ];
  fns.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Animation error in ' + fn.name + ':', e);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
  initAllAnimations();
}

/* ═══════════════════════════════════════════════════════════════
   0. TERMINAL BOOT SEQUENCE
   ═══════════════════════════════════════════════════════════════ */
function initBootSequence() {
  const bootContainer = document.getElementById('boot-sequence');
  if (!bootContainer) return;

  if (sessionStorage.getItem('zeusBooted')) {
    bootContainer.style.display = 'none';
    return;
  }
  
  sessionStorage.setItem('zeusBooted', 'true');
  
  const lines = bootContainer.querySelectorAll('.boot-line');
  lines.forEach(line => {
    const delay = parseInt(line.getAttribute('data-delay') || '0');
    setTimeout(() => {
      line.classList.add('boot-visible');
    }, delay);
  });

  setTimeout(() => {
    bootContainer.classList.add('boot-complete');
  }, 1800);
}




/* ═══════════════════════════════════════════════════════════════
   2. 3D HARDWARE SHOWCASE (REMOVED FOR MOBILE OPTIMIZATION)
   ═══════════════════════════════════════════════════════════════ */
function init3DHardware() {
  // Pruned: 3D Three.js rendering removed to guarantee lightning-fast mobile loads.
}

/* ═══════════════════════════════════════════════════════════════
   3. IOT SANDBOX DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function initIoTSandbox() {
  const toggle = document.getElementById('sandbox-toggle');
  const tempEl = document.getElementById('sandbox-temp');
  const loadEl = document.getElementById('sandbox-load');
  const uptimeEl = document.getElementById('sandbox-uptime');
  
  const tempCard = document.getElementById('sandbox-temp-card');
  const loadCard = document.getElementById('sandbox-load-card');
  const relayCard = document.getElementById('sandbox-relay-card');

  if (!toggle) return;

  let uptimeSeconds = 0;
  setInterval(() => {
    uptimeSeconds++;
    const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(uptimeSeconds % 60).padStart(2, '0');
    if (uptimeEl) uptimeEl.textContent = `${h}:${m}:${s}`;
  }, 1000);

  let tempBase = 42.5;
  let loadBase = 12;

  setInterval(() => {
    // Add random jitter
    const tempVal = (tempBase + (Math.random() * 0.8 - 0.4)).toFixed(1);
    const loadVal = Math.floor(loadBase + (Math.random() * 4 - 2));
    
    if (tempEl) tempEl.textContent = `${tempVal}°C`;
    if (loadEl) loadEl.textContent = `${loadVal}%`;
  }, 2000);

  toggle.addEventListener('change', (e) => {
    const isActive = e.target.checked;
    if (isActive) {
      tempBase = 68.2;
      loadBase = 85;
      if (tempEl) tempEl.className = 'font-headline-md text-2xl text-secondary transition-all duration-300';
      if (loadEl) loadEl.className = 'font-headline-md text-2xl text-secondary transition-all duration-300';
      
      if (tempCard) tempCard.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      if (loadCard) loadCard.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      if (relayCard) relayCard.style.borderColor = 'rgba(16, 185, 129, 0.6)';
    } else {
      tempBase = 42.5;
      loadBase = 12;
      if (tempEl) tempEl.className = 'font-headline-md text-2xl text-on-surface transition-all duration-300';
      if (loadEl) loadEl.className = 'font-headline-md text-2xl text-on-surface transition-all duration-300';
      
      if (tempCard) tempCard.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      if (loadCard) loadCard.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      if (relayCard) relayCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  });
}



/* ═══════════════════════════════════════════════════════════════
   2. MAGNETIC BUTTONS
   ═══════════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return; // #12: Skip on touch devices
  const magnets = document.querySelectorAll('.magnetic-btn');

  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Intensity of magnet pull (lower divider = stronger pull)
      magnet.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
    });

    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0px, 0px) scale(1)';
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   3. 3D TILT EFFECT FOR CARDS
   ═══════════════════════════════════════════════════════════════ */
function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return; // #13: Skip on touch devices
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 10 degrees)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Optional: Add a glare effect if there's a `.glare` child
      const glare = card.querySelector('.glare');
      if (glare) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.1) 0%, transparent 50%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
      
      const glare = card.querySelector('.glare');
      if (glare) glare.style.background = 'transparent';
      
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   4. SCROLL REVEAL (INTERSECTION OBSERVER)
   ═══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });
  
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
  elements.forEach(el => observer.observe(el));
  
  // Fallback: manually reveal elements that are already in viewport on load
  setTimeout(() => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }, 150);
}

