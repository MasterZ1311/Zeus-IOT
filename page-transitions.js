/**
 * Zeus IOT - Seamless Page Transitions (SPA Feel)
 * Intercepts internal link clicks, fetches the new page, and fades it in.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Prevent multiple rapid clicks
  let isTransitioning = false;

  document.body.addEventListener('click', async (e) => {
    // Find closest anchor tag
    const link = e.target.closest('a');
    
    // Ignore if not a link, has target blank, or is external/hash
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;

    // It's an internal link. Prevent default.
    e.preventDefault();
    if (isTransitioning) return;

    // Check if it's the exact same page
    if (href === window.location.pathname.split('/').pop() || (href === 'index.html' && window.location.pathname === '/')) {
      return;
    }

    isTransitioning = true;
    
    // Trigger exit animation on main container
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('page-transition-out');
    }

    try {
      // Fetch the new page
      const response = await fetch(href);
      const htmlString = await response.text();
      
      // Parse the new HTML
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlString, 'text/html');
      
      // Extract the new main content and title
      const newMain = newDoc.querySelector('main');
      const newTitle = newDoc.querySelector('title')?.innerText || 'Zeus IOT';
      
      if (newMain && mainContent) {
        // Prepare the new main (start it hidden)
        newMain.classList.add('page-transition-in');
        
        // Wait for exit animation to finish (300ms matches CSS)
        setTimeout(() => {
          // Replace content
          mainContent.innerHTML = newMain.innerHTML;
          mainContent.className = newMain.className; // copy classes
          
          // Update URL and Title
          document.title = newTitle;
          window.history.pushState({}, newTitle, href);
          
          // Scroll to top instantly
          window.scrollTo(0, 0);
          
          // Trigger enter animation
          requestAnimationFrame(() => {
            mainContent.classList.remove('page-transition-out', 'page-transition-in');
            
            // Re-trigger entrance observers and animations
            if (window.initMobileEnhancements) window.initMobileEnhancements();
            if (window.initAnimations) window.initAnimations();
            
            // Update active state on nav links
            updateNavActiveState(href);
            
            isTransitioning = false;
          });
        }, 300);
      } else {
        // Fallback if structure is unexpected
        window.location.href = href;
      }
    } catch (err) {
      // Fallback on error
      console.error('Transition failed:', err);
      window.location.href = href;
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    window.location.reload();
  });

  function updateNavActiveState(currentHref) {
    document.querySelectorAll('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentHref) {
        // Desktop active state
        if (link.classList.contains('border-b-2')) return; // Already handles it differently maybe
        link.classList.add('text-secondary');
        link.classList.remove('text-on-surface-variant');
      } else {
        link.classList.remove('text-secondary');
        // keep variant class if it exists
      }
    });
  }
});
