/**
 * ================================================================
 * LUXURY SPA GULSHAN — MASTER SCRIPT
 * ================================================================
 * Modules:
 *  1.  Page Loader
 *  2.  Navbar: Scroll State + Pill-Highlight Hover Effect
 *  3.  Mobile Menu Toggle
 *  4.  Scroll Reveal (IntersectionObserver)
 *  5.  Tabbed Filter / Accordion System
 *  6.  Ripple Effect on Buttons
 *  7.  Smooth Scroll for Anchor Links
 *  8.  Chat Widget (Let's Talk Toggle)
 *  9.  Back-to-Top Button
 *  10. Stat Counter Animation
 *  11. Active Nav Link on Scroll (Spy)
 * ================================================================
 */

'use strict';

/* ================================================================
   UTILITY: Wait for DOM to be fully loaded before running anything.
   All module initializations are called from here.
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbarScroll();
  initNavPillHighlight();
  initMobileMenu();
  initScrollReveal();
  initTabFilter();
  initRippleEffect();
  initSmoothScroll();
  initChatWidget();
  initBackToTop();
  initStatCounters();
  initNavSpy();
});


/* ================================================================
   1. PAGE LOADER
   Hides the full-screen loader after the page assets are ready.
   Uses a minimum display time so the animation feels intentional.
   ================================================================ */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Minimum 1.6s so the loader animation completes visually
  const minTime = 1600;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      loader.classList.add('hidden');

      // After transition ends, remove from DOM to free memory
      loader.addEventListener('transitionend', () => {
        loader.remove();
      }, { once: true });
    }, remaining);
  });
}


/* ================================================================
   2. NAVBAR SCROLL STATE
   Adds .scrolled class to navbar when user scrolls past 60px.
   This triggers the white background + shadow via CSS.
   ================================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60;

  const handleScroll = () => {
    // Toggle .scrolled based on scroll position
    navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  // Use passive listener for performance (no preventDefault needed)
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Run once on load in case page is already scrolled
  handleScroll();
}


/* ================================================================
   3. NAV PILL HIGHLIGHT — HOVER FOLLOW EFFECT
   A pill-shaped span (#nav-pill) follows the cursor across
   the navbar links, creating a smooth highlight that jumps
   between items. Only one item is ever highlighted at a time.
   Previous item resets instantly (handled via CSS transitions).
   ================================================================ */
function initNavPillHighlight() {
  const navLinks  = document.querySelectorAll('[data-nav]');
  const pill      = document.getElementById('nav-pill');
  const navLinksContainer = document.querySelector('.nav-links');

  if (!navLinks.length || !pill || !navLinksContainer) return;

  /**
   * Moves the pill to sit behind the given link element.
   * Uses getBoundingClientRect relative to the nav container.
   */
  const movePillTo = (linkEl) => {
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect      = linkEl.getBoundingClientRect();

    pill.style.opacity = '1';
    pill.style.left    = `${linkRect.left - containerRect.left}px`;
    pill.style.width   = `${linkRect.width}px`;
  };

  const hidePill = () => {
    pill.style.opacity = '0';
  };

  // Attach mouseenter/mouseleave to each nav link
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => movePillTo(link));
  });

  // Hide pill when cursor leaves the entire nav container
  navLinksContainer.addEventListener('mouseleave', hidePill);
}


/* ================================================================
   4. MOBILE MENU TOGGLE
   Hamburger button toggles .open class on both the button
   and the mobile-menu drawer. CSS handles the animation via
   max-height transition.
   ================================================================ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const toggle = () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  };

  hamburger.addEventListener('click', toggle);

  // Close menu when any mobile link is clicked
  mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });
}


/* ================================================================
   5. SCROLL REVEAL ANIMATION (IntersectionObserver)
   Elements with class .reveal-up or .reveal-right start
   invisible (CSS) and gain .visible when they enter the viewport.
   CSS transitions handle the actual animation.
   ================================================================ */
function initScrollReveal() {
  // All elements marked for reveal
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,     // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px', // Slightly early trigger for feel
    }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ================================================================
   6. TABBED FILTER / ACCORDION SYSTEM
   Clicking a tab button filters the accordion items based on
   their data-category attribute. Items not in the active category
   gain .hidden class (display:none via CSS).
   Animation uses staggered opacity to feel smooth.
   ================================================================ */
function initTabFilter() {
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const accItems   = document.querySelectorAll('.accordion-item');

  if (!tabBtns.length || !accItems.length) return;

  /**
   * Applies the filter for a given category string.
   * 'all' shows everything.
   * Any other value shows only items whose data-category contains it.
   */
  const applyFilter = (category) => {
    accItems.forEach((item, index) => {
      const cats = item.getAttribute('data-category') || '';

      if (category === 'all' || cats.includes(category)) {
        item.classList.remove('hidden');

        // Staggered entrance animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';

        // Small stagger delay per visible item
        const visibleItems = Array.from(accItems).filter(i => !i.classList.contains('hidden'));
        const staggerIndex = visibleItems.indexOf(item);

        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity    = '1';
          item.style.transform  = 'translateY(0)';
        }, staggerIndex * 50);

      } else {
        item.classList.add('hidden');
      }
    });
  };

  // Attach click handlers to each tab button
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all, set on clicked
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Get the filter key from data attribute
      const category = btn.getAttribute('data-tab');
      applyFilter(category);
    });
  });

  // Initial state: show all
  applyFilter('all');
}


/* ================================================================
   7. RIPPLE EFFECT
   When a .ripple-btn is clicked, a circular ripple expands
   from the click point, fades out, then removes itself.
   ================================================================ */
function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove any existing ripple (in case of fast clicks)
      const existing = btn.querySelector('.ripple');
      if (existing) existing.remove();

      // Create ripple span
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      // Size ripple to cover the button fully
      const diameter = Math.max(btn.offsetWidth, btn.offsetHeight);
      const radius   = diameter / 2;

      // Position at click point
      const rect = btn.getBoundingClientRect();
      ripple.style.width  = ripple.style.height = `${diameter}px`;
      ripple.style.left   = `${e.clientX - rect.left  - radius}px`;
      ripple.style.top    = `${e.clientY - rect.top - radius}px`;

      btn.appendChild(ripple);

      // Remove after animation completes
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}


/* ================================================================
   8. SMOOTH SCROLL FOR ANCHOR LINKS
   Intercepts clicks on href="#section" links and uses
   scrollIntoView with smooth behavior, accounting for the
   sticky navbar height so content isn't hidden under it.
   ================================================================ */
function initSmoothScroll() {
  const NAVBAR_HEIGHT = 80; // approx sticky navbar height in px

  document.addEventListener('click', (e) => {
    // Walk up the DOM to find an anchor
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    // Calculate position accounting for navbar
    const targetTop = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
}


/* ================================================================
   9. CHAT WIDGET — "LET'S TALK" TOGGLE
   Clicking the pill expands the social stack upward.
   Clicking the X button collapses it.
   The X button's icon rotates on hover (handled by CSS).
   ================================================================ */
function initChatWidget() {
  const pill      = document.getElementById('chatPill');
  const stack     = document.getElementById('chatStack');
  const closeBtn  = document.getElementById('chatClose');
  const widget    = document.getElementById('chatWidget');

  if (!pill || !stack || !closeBtn) return;

  let isOpen = false;

  const openWidget = () => {
    isOpen = true;
    stack.classList.add('visible');
    pill.classList.add('hidden');
    closeBtn.classList.add('visible');
    pill.setAttribute('aria-expanded', 'true');
  };

  const closeWidget = () => {
    isOpen = false;
    stack.classList.remove('visible');
    pill.classList.remove('hidden');
    closeBtn.classList.remove('visible');
    pill.setAttribute('aria-expanded', 'false');
  };

  // Open on pill click
  pill.addEventListener('click', openWidget);

  // Close on X button click
  closeBtn.addEventListener('click', closeWidget);

  // Keyboard support: Enter/Space activates
  [pill, closeBtn].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        isOpen ? closeWidget() : openWidget();
      }
    });
  });

  // Close when clicking outside the widget
  document.addEventListener('click', (e) => {
    if (isOpen && !widget.contains(e.target)) {
      closeWidget();
    }
  });
}


/* ================================================================
   10. BACK-TO-TOP BUTTON
   Shows when user scrolls past 300px.
   Smoothly scrolls to top on click.
   ================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_AFTER = 300;

  const checkScroll = () => {
    btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   11. STAT COUNTER ANIMATION
   When the stats bar scrolls into view, each number counts
   up from 0 to its target value with easing.
   Numbers with non-numeric suffixes (like "9AM-11PM") are
   detected and skipped.
   ================================================================ */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  /**
   * Animates a number from 0 to target over duration ms.
   * @param {HTMLElement} el   - Element to update
   * @param {number}      end  - Target value
   * @param {string}      suffix - Text after the number (e.g. "+")
   * @param {number}      duration - Animation duration in ms
   */
  const animateCounter = (el, end, suffix, duration = 1600) => {
    let start     = 0;
    const step    = 16; // ~60fps
    const total   = Math.ceil(duration / step);
    let current   = 0;

    const timer = setInterval(() => {
      current++;
      // Ease-out: fast start, slow finish
      const progress = current / total;
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * end);

      el.textContent = value.toLocaleString() + suffix;

      if (current >= total) {
        el.textContent = end.toLocaleString() + suffix;
        clearInterval(timer);
      }
    }, step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el   = entry.target;
        const text = el.textContent.trim();

        // Skip non-numeric values like "9AM–11PM"
        if (isNaN(parseInt(text))) return;

        // Extract number and suffix (e.g. "5000+" → 5000, "+")
        const match  = text.match(/^(\d+)(.*)$/);
        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = match[2] || '';

        animateCounter(el, target, suffix);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}


/* ================================================================
   12. NAV LINK SPY (Active State on Scroll)
   Highlights the correct nav link based on which section
   is currently visible in the viewport as the user scrolls.
   Uses IntersectionObserver on each major section.
   ================================================================ */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');

  if (!sections.length || !navLinks.length) return;

  /**
   * Finds the nav link whose href matches the section id
   * and marks it as .active, removing from all others.
   */
  const setActive = (id) => {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -60% 0px', // Offset for sticky navbar
    }
  );

  sections.forEach(section => observer.observe(section));
}
