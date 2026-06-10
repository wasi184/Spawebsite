/**
 * ================================================================
 * DHAKA SERENITY SPA — SERVICES PAGE SCRIPT
 * ================================================================
 * Modules:
 *  1.  Service Data Registry
 *  2.  Modal System (open / close / keyboard / focus trap)
 *  3.  Card Click Binding
 *  4.  URL Param: auto-open service on load (?service=0)
 *  5.  Modal Image Injection
 *  6.  Staggered card entrance on load
 *  7.  Hero parallax orbs
 *  8.  Card hover tilt
 *  9.  Ripple effect on modal buttons
 * ================================================================
 *
 * PRICING TIERS
 * ─────────────
 * Premium  → Aroma Oil (id 0), Four Hand (id 3)
 *            60 or 120 min only (no 90 min)
 *
 *            id 0 Gulshan: 60 min – 10,000 Tk | 120 min – 15,000 Tk
 *            id 0 Mirpur : 60 min –  7,000 Tk | 120 min – 12,000 Tk
 *
 *            id 3 Gulshan: 60 min – 15,000 Tk | 120 min – 25,000 Tk
 *            id 3 Mirpur : 60 min – 12,000 Tk | 120 min – 22,000 Tk
 *
 * Usual    → All other services (ids 1–2, 4–11)
 *            Gulshan: 60 min – 8,000 | 90 min – 11,000 | 120 min – 13,000 Tk
 *            Mirpur : 60 min – 7,000 | 90 min – 10,000 | 120 min – 12,000 Tk
 *            (Mirpur is 1,000 Tk less than Gulshan for usual services)
 * ================================================================
 */

'use strict';

/* ================================================================
   1. SERVICE DATA REGISTRY
   ================================================================ */
const SERVICES = [
  {
    id: 0,
    title:    'Aroma Oil Massage',
    badge:    '✦ BESTSELLER',
    tag:      '● AROMATHERAPY',
    desc:     'Premium essential oils — chosen to match your mood and needs — are blended into long, flowing strokes that ease tension while their therapeutic scent calms the nervous system. Your skin drinks in nourishment as your mind exhales deeply, releasing the weight of everyday life.',
    duration: '60 or 120 min',
    price:    '7,000 – 15,000 Tk',
    benefit:  '✦ Nourishes skin & calms nerves. Great for sleep improvement and deep relaxation.',
    imgClass: 'svc-img-aroma',
  },
  {
    id: 1,
    title:    'Deep Tissue Massage',
    badge:    '✦ THERAPEUTIC',
    tag:      '● DEEP RELIEF',
    desc:     'Slow, deliberate strokes reach beneath the superficial muscles to break down adhesions and knots in the connective tissue. Designed for those carrying long-term muscular strain or recovering from physical overuse. Experience lasting relief you can feel for days.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Relieves chronic pain & stiffness. Best post-workout recovery and tension release.',
    imgClass: 'svc-img-deep',
  },
  {
    id: 2,
    title:    'Full Body Massage',
    badge:    '✦ COMPLETE RESET',
    tag:      '● TOTAL WELLNESS',
    desc:     'A head-to-toe journey through every major muscle group, balancing relaxation strokes with therapeutic pressure to leave the whole body feeling unified and at ease. The definitive reset for a tired body and an overworked mind — the ultimate full-circle wellness experience.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Complete muscular renewal. Perfect full-body restoration and total mind-body harmony.',
    imgClass: 'svc-img-full',
  },
  {
    id: 3,
    title:    'Four Hand Massage',
    badge:    '✦ BESTSELLER',
    tag:      '● SYNCHRONIZED',
    desc:     'Two therapists move in perfect unison across your body, creating a seamless, almost meditative flow of touch. The mirrored movements trick the mind into deeper relaxation than a single therapist can achieve — a truly extraordinary and rare luxury wellness experience.',
    duration: '60 or 120 min',
    price:    '12,000 – 25,000 Tk',
    benefit:  '✦ Deeply sedating. Ideal for anxiety & mental fatigue. Pure luxury relaxation.',
    imgClass: 'svc-img-fourhand',
  },
  {
    id: 4,
    title:    'Thai Massage',
    badge:    '✦ ANCIENT RITUAL',
    tag:      '● TRADITIONAL THAI',
    desc:     'Rooted in centuries of tradition, Thai massage combines passive yoga stretches, rhythmic compression, and acupressure along energy meridians to unlock stagnation, restore flexibility, and deliver a profound whole-body renewal. Performed fully clothed on a mat by a skilled therapist.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Improves flexibility & energy flow. Ideal for tension from long sitting or travel.',
    imgClass: 'svc-img-thai',
  },
  {
    id: 5,
    title:    'Nuru Massage',
    badge:    '✦ JAPANESE ORIGIN',
    tag:      '● FULL IMMERSION',
    desc:     'Originating in Japan, this full-body immersion technique uses a warm, ultra-slick nuru gel derived from seaweed. The frictionless gliding motions cover every muscle group for a profoundly deep release and skin-conditioning treatment that conventional massage simply cannot replicate.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Full-body tension release. Conditions skin deeply. Unique sensory experience.',
    imgClass: 'svc-img-nuru',
  },
  {
    id: 6,
    title:    'Dry Massage',
    badge:    '✦ TRADITIONAL',
    tag:      '● HEALING RITUAL',
    desc:     'Rooted in ancient healing traditions, this oil-free massage targets pressure points and applies deep rhythmic stretching to dissolve chronic tension — no oils, just skilled hands and focused technique. Perfect for those who prefer a drier, firmer therapeutic touch with lasting results.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Increases flexibility & blood flow. Best for office stress and chronic stiffness.',
    imgClass: 'svc-img-dry',
  },
  {
    id: 7,
    title:    'Sensual Massage',
    badge:    '✦ SIGNATURE',
    tag:      '● AWAKEN THE SENSES',
    desc:     'A slow, exploratory full-body experience designed to heighten bodily awareness and dissolve inhibition. Gentle feather strokes and deliberate touch work together to awaken every nerve ending and restore the deep sensory connection between mind and body that modern life erodes.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Restores mind-body connection. Perfect for deep personal unwinding and presence.',
    imgClass: 'svc-img-sensual',
  },
  {
    id: 8,
    title:    'Body Scrub with Facial',
    badge:    '✦ RADIANCE GLOW',
    tag:      '● SKIN RENEWAL',
    desc:     'A dual-action treatment that exfoliates the entire body with a fine mineral scrub to reveal fresh, luminous skin — then pairs it with a targeted facial cleanse and deep hydration ritual, leaving face and body glowing in perfect unison. Ideal before any special event.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Removes dead skin & brightens complexion. Ideal pre-event radiance treatment.',
    imgClass: 'svc-img-scrub',
  },
  {
    id: 9,
    title:    'Back & Shoulder Massage',
    badge:    '✦ TENSION RELIEF',
    tag:      '● FOCUSED THERAPY',
    desc:     'A focused, high-impact session targeting the two areas that bear the most daily strain — the upper back and shoulder girdle. Therapists use firm kneading and cross-fiber friction to break up knots and restore range of motion fast. Perfect for desk workers and commuters.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Fast-acting knot relief. Perfect for desk workers, drivers & frequent travellers.',
    imgClass: 'svc-img-back',
  },
  {
    id: 10,
    title:    'Special Massage',
    badge:    '✦ BESPOKE',
    tag:      '● TAILORED FOR YOU',
    desc:     'Your body, your rules. Our therapist consults with you before the session to build a fully bespoke treatment — drawing from our full range of techniques, pressures, and focus areas to match exactly what you need that day. No two sessions are ever alike.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Fully personalized to your body. No two sessions are ever the same.',
    imgClass: 'svc-img-special',
  },
  {
    id: 11,
    title:    'Body to Body Massage',
    badge:    '✦ ULTIMATE',
    tag:      '● ULTIMATE CONNECTION',
    desc:     'An immersive full-body experience that forges a profound connection between therapist and guest. Warm, all-encompassing contact dissolves every boundary of stress and tension, leaving you in a state of complete surrender to deep, whole-body relaxation unlike anything else.',
    duration: '60, 90, or 120 min',
    price:    '7,000 – 13,000 Tk',
    benefit:  '✦ Total full-body immersion. The most profound relaxation experience we offer.',
    imgClass: 'svc-img-b2b',
  },
];

/* ─── Pricing lookup ───────────────────────────────────────────── */

/**
 * Returns { gulshanPrices, mirpurPrices } for a given service id.
 * Premium services (0, 3) have bespoke prices; all others share the
 * usual tier.  Mirpur prices are computed by subtracting the tier
 * discount from each Gulshan price.
 */
function getPricePills(serviceId) {
  switch (serviceId) {
    case 0: // Aroma Oil Massage — Premium (3,000 Tk discount for Mirpur)
      return {
        gulshan: ['60 min – 10,000 Tk', '120 min – 15,000 Tk'],
        mirpur:  ['60 min – 7,000 Tk',  '120 min – 12,000 Tk'],
      };
    case 3: // Four Hand Massage — Premium (3,000 Tk discount for Mirpur)
      return {
        gulshan: ['60 min – 15,000 Tk', '120 min – 25,000 Tk'],
        mirpur:  ['60 min – 12,000 Tk', '120 min – 22,000 Tk'],
      };
    default: // All usual services (1,000 Tk discount for Mirpur)
      return {
        gulshan: ['60 min – 8,000 Tk', '90 min – 11,000 Tk', '120 min – 13,000 Tk'],
        mirpur:  ['60 min – 7,000 Tk', '90 min – 10,000 Tk', '120 min – 12,000 Tk'],
      };
  }
}


/* ================================================================
   2. MODAL SYSTEM
   ================================================================ */
let modalOpen = false;
let previouslyFocused = null;

function buildModalImage(service) {
  const img = document.getElementById('svcModalImg');
  if (!img) return;

  img.className = `svc-modal-img ${service.imgClass}`;
  img.style.position = 'relative';
  img.innerHTML = '';

  // Map service id directly to its card image (id is 0-indexed)
  const imageSrc = `scard${service.id + 1}.png`;
  const image = document.createElement('img');
  image.src = imageSrc;
  image.className = 'modal-real-img';
  img.appendChild(image);

  const overlay = document.createElement('div');
  overlay.className = 'card-img-overlay';
  img.appendChild(overlay);
}

function populateModal(serviceId) {
  const s = SERVICES[serviceId];
  if (!s) return;

  buildModalImage(s);

  const setInner = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  setInner('svcModalBadge',    s.badge);
  setInner('svcModalTag',      s.tag);
  setInner('svcModalTitle',    s.title);
  setInner('svcModalDesc',     s.desc);
  setInner('svcModalDuration', s.duration);
  setInner('svcModalPrice',    s.price);
  setInner('svcModalBenefit',  s.benefit);

  // Price pills — split by branch
  const gulshanEl = document.getElementById('svcModalPricesGulshan');
  const mirpurEl  = document.getElementById('svcModalPricesMirpur');

  if (gulshanEl && mirpurEl) {
    const { gulshan, mirpur } = getPricePills(s.id);

    gulshanEl.innerHTML = gulshan
      .map(p => `<span class="svc-modal-price-pill">${p}</span>`)
      .join('');

    mirpurEl.innerHTML = mirpur
      .map(p => `<span class="svc-modal-price-pill">${p}</span>`)
      .join('');
  }
}

function openModal(serviceId) {
  const overlay = document.getElementById('svcModalOverlay');
  if (!overlay) return;

  populateModal(serviceId);

  previouslyFocused = document.activeElement;

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalOpen = true;

  // Focus close button
  requestAnimationFrame(() => {
    const closeBtn = document.getElementById('svcModalClose');
    if (closeBtn) closeBtn.focus();
  });

  // Update URL without reload
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('service', serviceId);
    history.replaceState({ serviceId }, '', url.toString());
  } catch (_) {}
}

function closeModal() {
  const overlay = document.getElementById('svcModalOverlay');
  if (!overlay) return;

  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalOpen = false;

  if (previouslyFocused) {
    previouslyFocused.focus();
    previouslyFocused = null;
  }

  // Clean URL
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('service');
    history.replaceState({}, '', url.toString());
  } catch (_) {}
}

function initModal() {
  const overlay  = document.getElementById('svcModalOverlay');
  const closeBtn = document.getElementById('svcModalClose');
  if (!overlay || !closeBtn) return;

  // Close on overlay click (not modal itself)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  closeBtn.addEventListener('click', closeModal);

  // Keyboard: Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen) closeModal();
  });

  // Focus trap inside modal
  const modal = document.getElementById('svcModal');
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }
}


/* ================================================================
   3. CARD CLICK BINDING
   ================================================================ */
function initCardClicks() {
  // Click on entire card
  document.querySelectorAll('.service-card').forEach(card => {
    const serviceId = parseInt(card.getAttribute('data-service'), 10);
    if (isNaN(serviceId)) return;

    card.addEventListener('click', (e) => {
      // Don't double-fire if the "Learn More" button was clicked
      if (e.target.closest('.svc-card-btn')) return;
      openModal(serviceId);
    });

    // Keyboard: Enter / Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(serviceId);
      }
    });
  });

  // "Learn More" buttons
  document.querySelectorAll('.svc-card-btn').forEach(btn => {
    const serviceId = parseInt(btn.getAttribute('data-service'), 10);
    if (isNaN(serviceId)) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(serviceId);
    });
  });
}


/* ================================================================
   4. URL PARAM: auto-open on load (?service=N)
   ================================================================ */
function initUrlServiceParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('service');
    if (sid !== null) {
      const id = parseInt(sid, 10);
      if (!isNaN(id) && id >= 0 && id < SERVICES.length) {
        // Small delay to let layout settle
        setTimeout(() => openModal(id), 400);
      }
    }
  } catch (_) {}
}


/* ================================================================
   5. STAGGERED CARD ENTRANCE
   ================================================================ */
function initCardEntrance() {
  const cards = document.querySelectorAll('.svc-cards-grid .service-card');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    const row   = Math.floor(i / 3); // 3-col grid
    const col   = i % 3;
    const delay = (row * 0.12 + col * 0.06).toFixed(2);
    card.style.setProperty('--delay', `${delay}s`);
  });
}


/* ================================================================
   6. HERO PARALLAX
   ================================================================ */
function initSvcHeroParallax() {
  const orbs = document.querySelectorAll('.svc-hero-orb');
  const hero = document.querySelector('.svc-hero');
  if (!orbs.length || !hero) return;

  let rafId = null;
  let tX = 0, tY = 0, cX = 0, cY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    tX = (e.clientX - rect.left) / rect.width  - 0.5;
    tY = (e.clientY - rect.top)  / rect.height - 0.5;
    if (!rafId) rafId = requestAnimationFrame(animate);
  });

  hero.addEventListener('mouseleave', () => { tX = 0; tY = 0; });

  function animate() {
    const lerp = 0.06;
    cX += (tX - cX) * lerp;
    cY += (tY - cY) * lerp;
    orbs.forEach((orb, i) => {
      const spd = (i + 1) * 14;
      orb.style.transform = `translate(${cX * spd}px, ${cY * spd}px)`;
    });
    if (Math.abs(tX - cX) > 0.001 || Math.abs(tY - cY) > 0.001) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }
}


/* ================================================================
   7. CARD HOVER TILT (scoped to services grid)
   ================================================================ */
function initSvcCardTilt() {
  const cards = document.querySelectorAll('.svc-cards-grid .service-card');
  if (!cards.length) return;

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
      const tiltX = dy * -4;
      const tiltY = dx *  4;

      card.style.transform  = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.012)`;
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
   8. RIPPLE ON MODAL BUTTONS
   ================================================================ */
function initSvcRipple() {
  document.querySelectorAll('.svc-modal .ripple-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple     = document.createElement('span');
      ripple.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top  - size / 2}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
}


/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initCardClicks();
  initCardEntrance();
  initSvcHeroParallax();
  initSvcCardTilt();
  initSvcRipple();
  initUrlServiceParam();
});
