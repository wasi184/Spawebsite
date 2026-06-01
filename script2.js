/**
 * ================================================================
 * LUXURY SPA GULSHAN — UPGRADED MASTER SCRIPT
 * ================================================================
 * Modules:
 *  1.  Page Loader
 *  2.  Navbar: Scroll State
 *  3.  Nav Pill Highlight
 *  4.  Mobile Menu Toggle
 *  5.  Scroll Reveal (IntersectionObserver)
 *  6.  Tabbed Filter / Accordion System
 *  7.  Ripple Effect on Buttons
 *  8.  Smooth Scroll for Anchor Links
 *  9.  Chat Widget
 *  10. Back-to-Top Button
 *  11. Stat Counter Animation
 *  12. Active Nav Link Spy
 *  13. [NEW] Feature Card 3D Tilt Effect
 *  14. [NEW] Service Card Parallax Shimmer
 *  15. [NEW] Accordion Item Stagger on Load
 * ================================================================
 */

'use strict';

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
  initCardTilt();
  initParallaxOrbs();
});


/* ================================================================
   1. PAGE LOADER
   ================================================================ */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const minTime  = 1700;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed   = Date.now() - startTime;
    const remaining = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, remaining);
  });
}


/* ================================================================
   2. NAVBAR SCROLL STATE
   ================================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const THRESHOLD = 60;
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > THRESHOLD);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}


/* ================================================================
   3. NAV PILL HIGHLIGHT
   ================================================================ */
function initNavPillHighlight() {
  const navLinks          = document.querySelectorAll('[data-nav]');
  const pill              = document.getElementById('nav-pill');
  const navLinksContainer = document.querySelector('.nav-links');

  if (!navLinks.length || !pill || !navLinksContainer) return;

  const movePillTo = (linkEl) => {
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect      = linkEl.getBoundingClientRect();
    pill.style.opacity  = '1';
    pill.style.left     = `${linkRect.left - containerRect.left}px`;
    pill.style.width    = `${linkRect.width}px`;
  };

  const hidePill = () => { pill.style.opacity = '0'; };

  navLinks.forEach(link => link.addEventListener('mouseenter', () => movePillTo(link)));
  navLinksContainer.addEventListener('mouseleave', hidePill);
}


/* ================================================================
   4. MOBILE MENU TOGGLE
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

  mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });
}


/* ================================================================
   5. SCROLL REVEAL (IntersectionObserver)
   ================================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ================================================================
   6. TABBED FILTER + ACCORDION
   ================================================================ */
function initTabFilter() {
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const accItems = document.querySelectorAll('.accordion-item');

  if (!tabBtns.length || !accItems.length) return;

  const applyFilter = (category) => {
    let visibleCount = 0;

    accItems.forEach((item) => {
      const cats = item.getAttribute('data-category') || '';

      if (category === 'all' || cats.includes(category)) {
        item.classList.remove('hidden');

        // Staggered entrance animation
        item.style.opacity   = '0';
        item.style.transform = 'translateX(-12px)';

        const delay = visibleCount * 55;
        setTimeout(() => {
          item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          item.style.opacity    = '1';
          item.style.transform  = 'translateX(0)';
        }, delay);

        visibleCount++;
      } else {
        item.classList.add('hidden');
        item.style.opacity   = '';
        item.style.transform = '';
        item.style.transition = '';
      }
    });
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.getAttribute('data-tab'));
    });
  });

  applyFilter('all');
}


/* ================================================================
   7. RIPPLE EFFECT
   ================================================================ */
function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const existing = btn.querySelector('.ripple');
      if (existing) existing.remove();

      const ripple   = document.createElement('span');
      ripple.classList.add('ripple');

      const diameter = Math.max(btn.offsetWidth, btn.offsetHeight);
      const radius   = diameter / 2;
      const rect     = btn.getBoundingClientRect();

      ripple.style.width  = ripple.style.height = `${diameter}px`;
      ripple.style.left   = `${e.clientX - rect.left - radius}px`;
      ripple.style.top    = `${e.clientY - rect.top  - radius}px`;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}


/* ================================================================
   8. SMOOTH SCROLL
   ================================================================ */
function initSmoothScroll() {
  const NAVBAR_HEIGHT = 82;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const targetTop = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
}


/* ================================================================
   9. CHAT WIDGET
   ================================================================ */
function initChatWidget() {
  const pill     = document.getElementById('chatPill');
  const stack    = document.getElementById('chatStack');
  const closeBtn = document.getElementById('chatClose');
  const widget   = document.getElementById('chatWidget');

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

  pill.addEventListener('click', openWidget);
  closeBtn.addEventListener('click', closeWidget);

  [pill, closeBtn].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        isOpen ? closeWidget() : openWidget();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !widget.contains(e.target)) closeWidget();
  });
}


/* ================================================================
   10. BACK-TO-TOP
   ================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const checkScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   11. STAT COUNTER ANIMATION
   ================================================================ */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const animateCounter = (el, end, suffix, duration = 1800) => {
    const step    = 16;
    const total   = Math.ceil(duration / step);
    let current   = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / total;
      // Ease-out cubic
      const eased  = 1 - Math.pow(1 - progress, 3);
      const value  = Math.round(eased * end);

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

        if (isNaN(parseInt(text))) return;

        const match = text.match(/^(\d+)(.*)$/);
        if (!match) return;

        animateCounter(el, parseInt(match[1]), match[2] || '');
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}


/* ================================================================
   12. NAV LINK SPY
   ================================================================ */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');

  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}


/* ================================================================
   13. [NEW] FEATURE CARD 3D TILT EFFECT
   Subtle perspective tilt on mouse move over feature cards.
   ================================================================ */
function initCardTilt() {
  const cards = document.querySelectorAll('.feature-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);

      // Max ±6deg tilt
      const tiltX = dy * -6;
      const tiltY = dx *  6;

      card.style.transform =
        `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px) scale(1.01)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}


/* ================================================================
   14. [NEW] HERO ORB PARALLAX ON MOUSE MOVE
   Orbs shift subtly based on cursor position for a living feel.
   ================================================================ */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect  = hero.getBoundingClientRect();
    const mx    = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
    const my    = (e.clientY - rect.top)  / rect.height - 0.5;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 14;  // Different speeds per orb
      const tx    = mx * speed;
      const ty    = my * speed;
      orb.style.transform  = `translate(${tx}px, ${ty}px)`;
      orb.style.transition = 'transform 0.6s ease-out';
    });
  });

  hero.addEventListener('mouseleave', () => {
    orbs.forEach(orb => {
      orb.style.transform  = '';
      orb.style.transition = 'transform 1.2s ease-out';
    });
  });
}
