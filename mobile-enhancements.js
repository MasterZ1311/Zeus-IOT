/**
 * ZEUS IOT - MOBILE ENHANCEMENTS
 * Implements Haptic Feedback, Smart Bottom Navigation, Swipe Gestures, and PWA registration.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

  // 2. Haptic Feedback (Vibration API)
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
  function triggerHaptic(type = 'light') {
    if (navigator.vibrate) {
      // Android: physical vibration
      try {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'medium') navigator.vibrate(30);
        else if (type === 'heavy') navigator.vibrate(50);
        else if (type === 'success') navigator.vibrate([30, 50, 30]);
        else if (type === 'error') navigator.vibrate([100, 50, 100]);
      } catch(e) {}
    } else {
      // iOS/no vibrate: CSS visual feedback pulse
      document.body.style.transition = 'opacity 0.08s ease';
      document.body.style.opacity = type === 'error' ? '0.92' : '0.97';
      setTimeout(() => { document.body.style.opacity = '1'; }, 100);
    }
  }

  // Attach haptics to all major buttons and nav links
  if (isMobile) {
    document.querySelectorAll('a, button, .btn-thunderbolt, .btn-ghost').forEach(el => {
      el.addEventListener('click', (e) => {
        if(el.classList.contains('btn-thunderbolt')) triggerHaptic('medium');
        else triggerHaptic('light');
      }, { passive: true });
    });
    
    // Attach success & error haptic to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
          triggerHaptic('heavy');
          setTimeout(() => triggerHaptic('heavy'), 200); // Double heavy for error
        } else {
          triggerHaptic('success');
        }
      });
      // Trigger heavy haptic on invalid input focus loss
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      inputs.forEach(input => {
        input.addEventListener('invalid', () => triggerHaptic('heavy'), {passive: true});
      });
    });
  }

  // 3. Smart Bottom Navigation
  const bottomNav = document.querySelector('nav.md\\:hidden.fixed.bottom-0');
  if (bottomNav) {
    const currentPath = window.location.pathname;
    const navLinks = bottomNav.querySelectorAll('a');
    
    navLinks.forEach(link => {
      // Clean up existing classes
      link.className = 'flex flex-col items-center justify-center text-on-surface-variant/70 hover:bg-surface-variant/50 rounded-xl px-3 py-1 active:scale-90 transition-transform duration-150';
      const icon = link.querySelector('.material-symbols-outlined');
      if(icon) icon.style.fontVariationSettings = "'FILL' 0";

      // Check if active
      if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
        link.className = 'flex flex-col items-center justify-center text-secondary bg-on-secondary-container/20 border border-secondary/30 shadow-[0_0_12px_rgba(229,169,60,0.15)] rounded-xl px-3 py-1 active:scale-90 transition-all duration-300 transform -translate-y-1';
        if(icon) icon.style.fontVariationSettings = "'FILL' 1";
      }
    });
    
    // If it's the root path (index.html is not in URL)
    if (currentPath === '/' || currentPath.endsWith('/')) {
      const homeLink = bottomNav.querySelector('a[href="index.html"]');
      if (homeLink) {
        homeLink.className = 'flex flex-col items-center justify-center text-secondary bg-on-secondary-container/20 border border-secondary/30 shadow-[0_0_12px_rgba(229,169,60,0.15)] rounded-xl px-3 py-1 active:scale-90 transition-all duration-300 transform -translate-y-1';
        const icon = homeLink.querySelector('.material-symbols-outlined');
        if(icon) icon.style.fontVariationSettings = "'FILL' 1";
      }
    }
  }

  // 4. Swipe Gestures
  let touchstartX = 0;
  let touchendX = 0;
  
  function handleSwipe() {
    const swipeDist = touchendX - touchstartX;
    
    // Swipe Right (Go back or open menu)
    if (swipeDist > 100) {
      const mobileMenuBtn = document.getElementById('admin-mobile-menu-btn') || document.getElementById('mobile-menu-btn');
      if(mobileMenuBtn && !mobileMenuBtn.classList.contains('open')) {
         // Maybe open menu if swiped from far left edge
         if (touchstartX < 30) {
           mobileMenuBtn.click();
         }
      }
    }
    // Swipe Left (Close menu)
    if (swipeDist < -100) {
      const mobileMenuOverlay = document.getElementById('mobile-menu-overlay') || document.getElementById('sidebar-overlay');
      if (mobileMenuOverlay && !mobileMenuOverlay.classList.contains('hidden')) {
        const closeBtn = document.getElementById('admin-mobile-menu-btn') || document.getElementById('mobile-menu-btn');
        if(closeBtn) closeBtn.click();
      }
    }
  }

  document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
  }, {passive: true});

  document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});

  // 5. Virtual Keyboard Collision Fix
  // Hide the fixed bottom navigation when an input is focused on mobile
  // so it doesn't float above the virtual keyboard.
  if (isMobile && bottomNav) {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        bottomNav.style.display = 'none';
      });
      input.addEventListener('blur', () => {
        setTimeout(() => {
          bottomNav.style.display = '';
        }, 100);
      });
    });
  }
  
  // 6. Lazy Loading Injection
  // Automatically add loading="lazy" to images if not present
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  // 7. Global WhatsApp Float Fallback
  // Injects the legacy whatsapp-float icon if the page forgot to include it
  if (!document.getElementById('whatsapp-float')) {
    const waUrl = `https://wa.me/919080809088?text=${encodeURIComponent("Hi Zeus IOT, I'm reaching out from your website.")}`;
    const fabHTML = `
      <a href="${waUrl}" target="_blank" class="whatsapp-float" id="whatsapp-float" style="opacity:1;" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
        </svg>
      </a>
    `;
    document.body.insertAdjacentHTML('beforeend', fabHTML);
  }

  // 8. Mobile Form Auto-Save (Lead Preservation)
  // Saves form data to localStorage as the user types
  const pathKey = window.location.pathname.replace(/[^a-zA-Z0-9]/g, '');
  const formInputs = document.querySelectorAll('form input:not([type="password"]):not([type="file"]), form textarea');
  
  if (formInputs.length > 0) {
    // Restore saved data
    const savedData = JSON.parse(localStorage.getItem('zeusFormSave_' + pathKey) || '{}');
    formInputs.forEach(input => {
      const key = input.name || input.id || input.placeholder;
      if (key && savedData[key] && !input.value) {
        input.value = savedData[key];
      }
      
      // Listen to input changes to save
      input.addEventListener('input', () => {
        const currentData = JSON.parse(localStorage.getItem('zeusFormSave_' + pathKey) || '{}');
        if (key) {
          currentData[key] = input.value;
          localStorage.setItem('zeusFormSave_' + pathKey, JSON.stringify(currentData));
        }
      });
    });

    // Clear auto-save data on successful submit
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', () => {
        localStorage.removeItem('zeusFormSave_' + pathKey);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. SCROLL-LINKED NAVBAR TRANSPARENCY (Mobile WOW)
  // ═══════════════════════════════════════════════════════════════
  if (isMobile) {
    const mobileHeader = document.querySelector('header.fixed.top-0:not(#desktop-nav)');
    if (mobileHeader) {
      // Start transparent on index page hero
      const isHomePage = window.location.pathname === '/' || 
                         window.location.pathname.endsWith('/') || 
                         window.location.pathname.endsWith('index.html');
      
      if (isHomePage) {
        mobileHeader.classList.add('nav-transparent');
        
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
          const scrollY = window.scrollY;
          if (scrollY > 80) {
            mobileHeader.classList.remove('nav-transparent');
          } else {
            mobileHeader.classList.add('nav-transparent');
          }
          lastScrollY = scrollY;
        }, { passive: true });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 10. MOBILE ENTRANCE ANIMATIONS (IntersectionObserver)
  // ═══════════════════════════════════════════════════════════════
  if (isMobile) {
    // Add mobile-fade-up class to all section children for staggered entrance
    const mobileSections = document.querySelectorAll('section.reveal, section.mt-32, section.mt-16');
    mobileSections.forEach(section => {
      const directChildren = section.querySelectorAll(':scope > div, :scope > h2, :scope > p');
      directChildren.forEach(child => {
        child.classList.add('mobile-fade-up');
      });
    });

    // Observe all mobile-fade-up elements
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          mobileObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.mobile-fade-up').forEach(el => mobileObserver.observe(el));

    // Fallback: immediately reveal elements already in viewport on load
    setTimeout(() => {
      document.querySelectorAll('.mobile-fade-up:not(.visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 200);
  }

  // ═══════════════════════════════════════════════════════════════
  // 11. CAROUSEL HAPTIC SNAP FEEDBACK
  // ═══════════════════════════════════════════════════════════════
  if (isMobile) {
    const carousels = document.querySelectorAll('.mobile-carousel, .animate-marquee, .snap-x, .omnidirectional-scroll');
    carousels.forEach(carousel => {
      let lastScrollLeft = carousel.scrollLeft;
      carousel.addEventListener('scrollend', () => {
        if (Math.abs(carousel.scrollLeft - lastScrollLeft) > 10) {
          triggerHaptic('light');
          lastScrollLeft = carousel.scrollLeft;
        }
      }, { passive: true });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 12. SWIPE-TO-NAVIGATE
  // ═══════════════════════════════════════════════════════════════
  if (isMobile) {
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    // Define page order for swiping
    const pages = ['index.html', 'projects.html', 'contact.html', 'pay.html'];
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentIndex = pages.indexOf(currentPath === '' ? 'index.html' : currentPath);

    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isSwiping = true;
    }, { passive: true });

    document.addEventListener('touchend', e => {
      isSwiping = false;

      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);

      // Horizontal swipe threshold: 100px. Must be mostly horizontal.
      if (Math.abs(diffX) > 100 && diffY < 60 && currentIndex !== -1) {
        // Prevent global swipe if swiping inside a scrollable carousel
        if (e.target.closest('.omnidirectional-scroll, .snap-x, .hide-scrollbar')) return;

        if (diffX > 0 && currentIndex < pages.length - 1) {
          // Swipe Left -> Next Page
          window.location.href = pages[currentIndex + 1];
        } else if (diffX < 0 && currentIndex > 0) {
          // Swipe Right -> Prev Page
          window.location.href = pages[currentIndex - 1];
        }
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════════════
  // 13. WEB SHARE API & FORM HAPTICS
  // ═══════════════════════════════════════════════════════════════
  
  // Bind Share Buttons
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-share-title') || document.title;
      const text = btn.getAttribute('data-share-text') || 'Check out this project on Zeus IOT';
      const url = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (err) {
          console.log('Share canceled or failed', err);
        }
      } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(url);
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied';
        setTimeout(() => btn.innerHTML = originalText, 2000);
      }
    });
  });

  // Heavy Haptics on Form Submit
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      // simulate physical button press success
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]); 
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // FIX-ACC1+ACC2: Mobile Menu ARIA — aria-expanded toggling
  // Applied globally for all pages
  // ═══════════════════════════════════════════════════════════════
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  if (mobileMenuBtn && mobileMenuOverlay) {
    // Ensure correct ARIA attributes are set
    mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu-overlay');
    if (!mobileMenuBtn.getAttribute('aria-label')) {
      mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
    }
    // Override click to toggle aria-expanded
    const originalClickHandler = mobileMenuBtn.onclick;
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuOverlay.classList.contains('open');
      mobileMenuBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      mobileMenuBtn.setAttribute('aria-label', !isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // FIX-ACC4: aria-hidden on decorative Material Symbols icons
  // ═══════════════════════════════════════════════════════════════
  document.querySelectorAll('.material-symbols-outlined').forEach(icon => {
    // Only hide icons that don't already have an aria-label
    if (!icon.getAttribute('aria-label') && !icon.closest('[aria-label]')) {
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
    }
  });

});
