/* ================================================================
   DHAKA SERENITY SPA — ABOUT PAGE JS
   All global logic (navbar, chat widget, back-to-top, reveal)
   is handled by script.js — no duplication here.
   ================================================================ */

(function () {
  'use strict';

  /* ── Reveal-up observer (mirrors script.js pattern) ──────────── */
  const revealEls = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.style.getPropertyValue('--delay') || '0s';
            el.style.transitionDelay = delay;
            el.classList.add('revealed');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    /* Fallback for old browsers */
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

})();
