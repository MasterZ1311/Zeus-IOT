

// ─── Timeline connector reveal ───
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const connectors = document.querySelectorAll('.timeline-connector');
      connectors.forEach((c, i) => { setTimeout(() => c.classList.add('visible'), i * 400 + 300); });
      const dots = document.querySelectorAll('.timeline-dot');
      dots.forEach((d, i) => { setTimeout(() => { d.style.borderColor = i === 0 ? '#ffc640' : '#10B981'; d.style.boxShadow = `0 0 20px rgba(${i === 0 ? '255,198,64' : '47,217,244'},0.3)`; }, i * 400); });
    }
  });
}, { threshold: 0.3 });
const timelineEl = document.getElementById('timeline-desktop');
if (timelineEl) timelineObserver.observe(timelineEl);

// ─── Animated Stats Counter ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stagger-children').forEach(el => {
  if (el.querySelector('.stat-number')) statObserver.observe(el);
});

// ─── Navbar Scroll Effect ───
const nav = document.getElementById('desktop-nav');
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = (scrolled / total) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
  if (nav) {
    if (scrolled > 60) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');
  }
});

// ─── FAQ Accordion ───
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = btn.dataset.faq;
    const answer = document.getElementById('faq-' + idx);
    const icon = btn.querySelector('.faq-icon');
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));
    if (!isOpen) { answer.classList.add('open'); icon.classList.add('open'); }
  });
});

// ─── WhatsApp Float Delayed Reveal ───
setTimeout(() => {
  const wa = document.getElementById('whatsapp-float');
  if (wa) { wa.style.transition = 'opacity 0.5s ease'; wa.style.opacity = '1'; }
}, 3000);

// ─── Text Scramble Effect ───
const scrambleEl = document.getElementById('scramble-text');
if (scrambleEl) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
  const original = 'CUSTOM IOT & SOFTWARE';
  let frame = 0;
  const totalFrames = 30;
  function scramble() {
    const progress = frame / totalFrames;
    let result = '';
    for (let i = 0; i < original.length; i++) {
      if (original[i] === ' ' || original[i] === '&') { result += original[i]; continue; }
      if (i < original.length * progress) { result += original[i]; }
      else { result += chars[Math.floor(Math.random() * chars.length)]; }
    }
    scrambleEl.textContent = result;
    frame++;
    if (frame <= totalFrames) requestAnimationFrame(scramble);
    else scrambleEl.textContent = original;
  }
  setTimeout(scramble, 600);
}

// ─── 3D Tilt on Preview Cards ───
document.querySelectorAll('.preview-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── Live Telemetry Simulation ───
setInterval(() => {
  const val = (99.5 + Math.random() * 0.49).toFixed(2);
  const latency = Math.floor(8 + Math.random() * 15);
  const telEl = document.getElementById('telemetry-value');
  const latEl = document.getElementById('latency-value');
  if (telEl) telEl.textContent = val + '%';
  if (latEl) latEl.textContent = latency + 'ms';
}}, 4000);

// ─── Preloader ───
window.addEventListener('load', () => {
  const preloader = document.getElementById('page-preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 1000);
  }
});

// ─── Mobile Menu ───
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
if (mobileMenuBtn && mobileMenuOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenuOverlay.classList.toggle('open');
    mobileMenuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── Scroll Reveal ───
const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      scrollRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.scroll-reveal').forEach(el => scrollRevealObserver.observe(el));

