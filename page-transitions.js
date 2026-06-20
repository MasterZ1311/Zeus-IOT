/**
 * Zeus IOT - Safe Page Transitions
 * Triggers an exit animation but uses standard browser navigation to preserve JS.
 */

document.addEventListener('DOMContentLoaded', () => {
  let isTransitioning = false;

  document.body.addEventListener('click', (e) => {
    // Find closest anchor tag
    const link = e.target.closest('a');
    
    // Ignore if not a link, has target blank, or is external/hash
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;

    // Check if it's the exact same page
    if (href === window.location.pathname.split('/').pop() || (href === 'index.html' && window.location.pathname === '/')) {
      return;
    }

    // It's an internal link. Prevent default.
    e.preventDefault();
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Trigger exit animation on main container
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('page-transition-out');
    }

    // Wait for animation (300ms) then navigate normally
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});
