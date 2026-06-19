/**
 * ZEUS IOT - Custom Animations & Interactions
 * Provides WOW-Factor background canvas effects, magnetic buttons, and 3D tilt.
 */

function initAllAnimations() {
  const fns = [
    initBootSequence,
    init3DHardware,
    initIoTSandbox,
    // initParticlesBackground,
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
   1. CANVAS IOT NODE NETWORK (PARTICLES)
   ═══════════════════════════════════════════════════════════════ */
function initParticlesBackground() {
  const canvas = document.getElementById('particles-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  
  // Theme colors
  const primaryColor = 'rgba(16, 185, 129, '; // Cyan
  const secondaryColor = 'rgba(255, 198, 64, '; // Gold

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  class Particle {
    constructor(x, y, dx, dy, size, isGold) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size;
      this.isGold = isGold;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.isGold ? `${secondaryColor} 0.6)` : `${primaryColor} 0.6)`;
      ctx.fill();
      
      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.isGold ? '#ffc640' : '#10B981';
    }
    
    update() {
      if (this.x > width || this.x < 0) this.dx = -this.dx;
      if (this.y > height || this.y < 0) this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;

      // Mouse interaction (slight repel)
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 2;
          this.y -= forceDirectionY * force * 2;
        }
      }

      this.draw();
    }
  }

  function initParticles() {
    particles = [];
    const numParticles = Math.floor((width * height) / 15000); // Density
    for (let i = 0; i < numParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (width - size * 2) + size * 2;
      let y = Math.random() * (height - size * 2) + size * 2;
      let dx = (Math.random() - 0.5) * 0.5; // Slow movement
      let dy = (Math.random() - 0.5) * 0.5;
      let isGold = Math.random() > 0.8; // 20% are gold
      particles.push(new Particle(x, y, dx, dy, size, isGold));
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();
  }

  // Draw lines between nearby particles and mouse
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          opacityValue = 1 - (distance / 120);
          ctx.strokeStyle = particles[a].isGold 
            ? `${secondaryColor}${opacityValue * 0.2})` 
            : `${primaryColor}${opacityValue * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (mouse.x != null && mouse.y != null) {
        let dxMouse = particles[a].x - mouse.x;
        let dyMouse = particles[a].y - mouse.y;
        let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distanceMouse < mouse.radius) {
          opacityValue = 1 - (distanceMouse / mouse.radius);
          ctx.strokeStyle = particles[a].isGold 
            ? `${secondaryColor}${opacityValue * 0.5})` 
            : `${primaryColor}${opacityValue * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  resize();
  initParticles();
  animate();
}


/* ═══════════════════════════════════════════════════════════════
   2. 3D HARDWARE SHOWCASE (THREE.JS)
   ═══════════════════════════════════════════════════════════════ */
function init3DHardware() {
  const container = document.getElementById('three-hardware-container');
  if (!container || typeof THREE === 'undefined') return;
  if (window.innerWidth < 768) return; // Optimize for mobile: skip 3D rendering

  container.innerHTML = ''; // Clear the fallback SVG before initializing Three.js
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // The Sharp Lightning Bolt Geometry
  const shape = new THREE.Shape();
  shape.moveTo(0.3, 1.2);
  shape.lineTo(-0.4, 0.1);
  shape.lineTo(0.1, 0.1);
  shape.lineTo(-0.3, -1.2);
  shape.lineTo(0.5, -0.1);
  shape.lineTo(-0.1, -0.1);
  shape.lineTo(0.3, 1.2);

  const extrudeSettings = { 
    depth: 0.2, 
    bevelEnabled: true, 
    bevelSegments: 2, 
    steps: 2, 
    bevelSize: 0.02, 
    bevelThickness: 0.02 
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  const material = new THREE.MeshBasicMaterial({ color: 0xffc640, wireframe: true, transparent: true, opacity: 0.9 });
  const core = new THREE.Mesh(geometry, material);
  
  // Add a subtle glow/inner fill
  const solidMat = new THREE.MeshBasicMaterial({ color: 0xffc640, transparent: true, opacity: 0.1 });
  const solidCore = new THREE.Mesh(geometry, solidMat);
  core.add(solidCore);

  scene.add(core);

  // Optional: keep a faint ring orbiting it
  const ringGeo = new THREE.TorusGeometry(1.5, 0.01, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x2fd9f4, transparent: true, opacity: 0.3 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - windowHalfX) * 0.001;
    targetY = (e.clientY - windowHalfY) * 0.001;
  });

  function animate() {
    requestAnimationFrame(animate);
    core.rotation.y += 0.005;
    core.rotation.x += 0.002;
    ring.rotation.z -= 0.01;

    core.rotation.y += 0.05 * (targetX - core.rotation.y);
    core.rotation.x += 0.05 * (targetY - core.rotation.x);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
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

