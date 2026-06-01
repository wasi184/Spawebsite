/**
 * ================================================================
 * LUXURY SPA GULSHAN — PREMIUM ENHANCED MASTER SCRIPT
 * ================================================================
 * Modules:
 *  1.  Page Loader
 *  2.  Navbar: Scroll State
 *  3.  Nav Pill Highlight
 *  4.  Mobile Menu Toggle
 *  5.  Scroll Reveal (IntersectionObserver)
 *  6.  Tabbed Filter System
 *  7.  Ripple Effect on Buttons
 *  8.  Smooth Scroll for Anchor Links
 *  9.  Chat Widget
 *  10. Back-to-Top Button
 *  11. Stat Counter Animation
 *  12. Active Nav Link Spy
 *  13. Feature Card 3D Tilt Effect
 *  14. Hero Orb Parallax on Mouse Move
 *  15. [ENHANCED] Magnetic Button Pull
 *  16. [NEW] Cursor Glow Trail
 *  17. [NEW] Section Line Progress
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
  initMagneticButtons();
  initCursorGlow();
});


/* ================================================================
   1. PAGE LOADER
   ================================================================ */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const minTime   = 1700;
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
   5. SCROLL REVEAL (IntersectionObserver) — enhanced with stagger
   ================================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small RAF for smoother paint
          requestAnimationFrame(() => {
            entry.target.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ================================================================
   6. TABBED FILTER
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
        item.style.opacity   = '0';
        item.style.transform = 'translateX(-16px)';

        const delay = visibleCount * 50;
        setTimeout(() => {
          item.style.transition = 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)';
          item.style.opacity    = '1';
          item.style.transform  = 'translateX(0)';
        }, delay);

        visibleCount++;
      } else {
        // Fade out hidden items
        item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        item.style.opacity   = '0';
        item.style.transform = 'translateX(8px)';
        setTimeout(() => {
          item.classList.add('hidden');
          item.style.opacity   = '';
          item.style.transform = '';
          item.style.transition = '';
        }, 200);
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
   7. RIPPLE EFFECT — enhanced
   ================================================================ */
function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const existing = btn.querySelector('.ripple');
      if (existing) existing.remove();

      const ripple   = document.createElement('span');
      ripple.classList.add('ripple');

      const diameter = Math.max(btn.offsetWidth, btn.offsetHeight) * 2.2;
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
    const step  = 16;
    const total = Math.ceil(duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / total;
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * end);

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
   13. FEATURE CARD 3D TILT EFFECT — refined
   ================================================================ */
function initCardTilt() {
  const cards = document.querySelectorAll('.feature-card, .service-card');

  cards.forEach(card => {
    let isHovered = false;

    card.addEventListener('mouseenter', () => { isHovered = true; });

    card.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      const tiltX = dy * -5;
      const tiltY = dx *  5;

      card.style.transform  =
        `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.015)`;
      card.style.transition = 'transform 0.08s ease';
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}


/* ================================================================
   14. HERO ORB PARALLAX ON MOUSE MOVE
   ================================================================ */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  let rafId = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = (e.clientX - rect.left) / rect.width  - 0.5;
    targetY = (e.clientY - rect.top)  / rect.height - 0.5;

    if (!rafId) {
      rafId = requestAnimationFrame(animateOrbs);
    }
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function animateOrbs() {
    // Lerp for smooth inertia
    const lerpFactor = 0.06;
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 16;
      orb.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
    });

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      rafId = requestAnimationFrame(animateOrbs);
    } else {
      rafId = null;
    }
  }
}


/* ================================================================
   15. [ENHANCED] MAGNETIC BUTTON PULL
   Buttons gently attract toward the cursor when nearby.
   ================================================================ */
function initMagneticButtons() {
  const STRENGTH = 0.35;
  const RADIUS   = 80;

  const btns = document.querySelectorAll('.btn-dark.btn-hero, .btn-outline.btn-hero, .nav-cta');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const pull = (RADIUS - dist) / RADIUS;
        const tx   = dx * pull * STRENGTH;
        const ty   = dy * pull * STRENGTH;
        btn.style.transform  = `translate(${tx}px, ${ty}px) translateY(-3px)`;
        btn.style.transition = 'transform 0.12s ease';
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}


/* ================================================================
   16. [NEW] SUBTLE CURSOR GLOW TRAIL
   A soft gold orb follows the cursor — premium feel.
   Only on non-touch devices.
   ================================================================ */
function initCursorGlow() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,138,78,0.07) 0%, transparent 65%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    will-change: transform;
    left: -500px;
    top: -500px;
  `;
  document.body.appendChild(glow);

  let mouseX = -500, mouseY = -500;
  let glowX = -500, glowY = -500;
  let animating = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
    if (!animating) {
      animating = true;
      requestAnimationFrame(moveGlow);
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function moveGlow() {
    const lerpFactor = 0.1;
    glowX += (mouseX - glowX) * lerpFactor;
    glowY += (mouseY - glowY) * lerpFactor;
    glow.style.left = `${glowX}px`;
    glow.style.top  = `${glowY}px`;

    if (Math.abs(mouseX - glowX) > 0.5 || Math.abs(mouseY - glowY) > 0.5) {
      requestAnimationFrame(moveGlow);
    } else {
      animating = false;
    }
  }
}
