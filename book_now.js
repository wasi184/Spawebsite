/**
 * ================================================================
 * DHAKA SERENITY SPA — BOOK NOW PAGE SCRIPT
 * ================================================================
 * Modules:
 *  1.  Data Definitions
 *  2.  State
 *  3.  Modal System
 *  4.  Service Selector
 *  5.  Duration Selector
 *  6.  Day Selector
 *  7.  Time Selector
 *  8.  Location Selector
 *  9.  Receipt Generator
 *  9b. EmailJS — Send Booking Email
 *  10. Form Submit
 *  11. Validation
 * ================================================================
 */

'use strict';

/* ================================================================
   1. DATA DEFINITIONS
   ================================================================ */
const SERVICES = [
  { id: 'aroma',   name: 'Aroma Oil Massage',      icon: 'fa-solid fa-wind' },
  { id: 'deep',    name: 'Deep Tissue Massage',     icon: 'fa-solid fa-hand-fist' },
  { id: 'full',    name: 'Full Body Massage',       icon: 'fa-solid fa-person' },
  { id: 'four',    name: 'Four Hand Massage',       icon: 'fa-solid fa-hands' },
  { id: 'thai',    name: 'Thai Massage',            icon: 'fa-solid fa-yin-yang' },
  { id: 'nuru',    name: 'Nuru Massage',            icon: 'fa-solid fa-droplet' },
  { id: 'dry',     name: 'Dry Massage',             icon: 'fa-solid fa-feather' },
  { id: 'sensual', name: 'Sensual Massage',         icon: 'fa-solid fa-heart' },
  { id: 'scrub',   name: 'Body Scrub with Facial',  icon: 'fa-solid fa-face-smile' },
  { id: 'back',    name: 'Back & Shoulder Massage', icon: 'fa-solid fa-spa' },
  { id: 'special', name: 'Special Massage',         icon: 'fa-solid fa-star' },
  { id: 'b2b',     name: 'Body to Body Massage',    icon: 'fa-solid fa-circle-nodes' },
];

const DURATIONS = [
  { id: 60,  label: '60 min',  sublabel: 'Standard Session',   price: 6000  },
  { id: 90,  label: '90 min',  sublabel: 'Relaxation Session', price: 9000  },
  { id: 120, label: '120 min', sublabel: 'Premium Session',    price: 11000 },
];

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TIMES = [
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM',
  '09:00 PM',
];


/* ================================================================
   2. STATE
   ================================================================ */
const state = {
  selectedServices: [],   // Array of service ids
  duration:         null, // Duration id (60 | 90 | 120)
  day:              null, // Day string
  time:             null, // Time string
  location:         null, // Location string
};


/* ================================================================
   3. MODAL SYSTEM
   ================================================================ */
function openModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlayId);
  }, { once: true });
}

function closeModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function bindCloseBtn(btnId, overlayId) {
  const btn = document.getElementById(btnId);
  if (btn) btn.addEventListener('click', () => closeModal(overlayId));
}


/* ================================================================
   4. SERVICE SELECTOR
   ================================================================ */
function initServiceSelector() {
  const grid       = document.getElementById('serviceGrid');
  const openBtn    = document.getElementById('openServiceModal');
  const confirmBtn = document.getElementById('confirmServices');

  if (!grid || !openBtn) return;

  // Build service cards
  SERVICES.forEach(svc => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'bn-service-card';
    card.dataset.id = svc.id;
    card.innerHTML = `
      <div class="bn-svc-icon"><i class="${svc.icon}"></i></div>
      <span class="bn-svc-name">${svc.name}</span>
      <span class="bn-svc-check"><i class="fa-solid fa-check"></i></span>
    `;

    card.addEventListener('click', () => {
      const isSelected = state.selectedServices.includes(svc.id);
      if (isSelected) {
        state.selectedServices = state.selectedServices.filter(s => s !== svc.id);
        card.classList.remove('selected');
      } else {
        state.selectedServices.push(svc.id);
        card.classList.add('selected');
      }
    });

    grid.appendChild(card);
  });

  openBtn.addEventListener('click', () => openModal('serviceModalOverlay'));
  bindCloseBtn('closeServiceModal', 'serviceModalOverlay');

  confirmBtn.addEventListener('click', () => {
    closeModal('serviceModalOverlay');
    renderServicePills();
    updateServiceBtn();
  });
}

function renderServicePills() {
  const pillRow = document.getElementById('selectedServicePills');
  if (!pillRow) return;
  pillRow.innerHTML = '';

  state.selectedServices.forEach(id => {
    const svc  = SERVICES.find(s => s.id === id);
    if (!svc) return;
    const pill = document.createElement('div');
    pill.className = 'bn-pill';
    pill.innerHTML = `
      <i class="${svc.icon}" style="font-size:0.75rem; color:var(--color-gold)"></i>
      <span>${svc.name}</span>
      <button class="bn-pill-remove" data-id="${id}" aria-label="Remove ${svc.name}" type="button">
        <i class="fa-solid fa-minus"></i>
      </button>
    `;
    pillRow.appendChild(pill);
  });

  pillRow.querySelectorAll('.bn-pill-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      state.selectedServices = state.selectedServices.filter(s => s !== id);
      // Deselect card in modal
      const card = document.querySelector(`.bn-service-card[data-id="${id}"]`);
      if (card) card.classList.remove('selected');
      renderServicePills();
      updateServiceBtn();
    });
  });
}

function updateServiceBtn() {
  const btn   = document.getElementById('openServiceModal');
  const label = document.getElementById('serviceBtnLabel');
  if (!label || !btn) return;

  if (state.selectedServices.length === 0) {
    label.textContent = 'Choose Your Treatment';
    btn.classList.remove('has-value');
  } else {
    const count = state.selectedServices.length;
    label.textContent = `${count} Treatment${count > 1 ? 's' : ''} Selected`;
    btn.classList.add('has-value');
  }
}


/* ================================================================
   5. DURATION SELECTOR
   ================================================================ */
function initDurationSelector() {
  const list    = document.getElementById('durationList');
  const openBtn = document.getElementById('openDurationModal');

  if (!list || !openBtn) return;

  DURATIONS.forEach(dur => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bn-dur-btn';
    btn.dataset.id = dur.id;
    btn.innerHTML = `
      <div class="bn-dur-left">
        <div class="bn-dur-icon"><i class="fa-solid fa-hourglass-half"></i></div>
        <div>
          <div class="bn-dur-min">${dur.label}</div>
          <div class="bn-dur-label">${dur.sublabel}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:14px">
        <span class="bn-dur-price">${dur.price.toLocaleString()} Tk</span>
        <i class="fa-solid fa-circle-check bn-dur-check"></i>
      </div>
    `;

    btn.addEventListener('click', () => {
      // Deselect all
      list.querySelectorAll('.bn-dur-btn').forEach(b => b.classList.remove('selected'));
      // Select this
      btn.classList.add('selected');
      state.duration = dur.id;
      // Update display & close
      updateDurationDisplay(dur);
      setTimeout(() => closeModal('durationModalOverlay'), 280);
    });

    list.appendChild(btn);
  });

  openBtn.addEventListener('click', () => openModal('durationModalOverlay'));
  bindCloseBtn('closeDurationModal', 'durationModalOverlay');
}

function updateDurationDisplay(dur) {
  const display = document.getElementById('durationDisplay');
  const btn     = document.getElementById('openDurationModal');
  const label   = document.getElementById('durationBtnLabel');
  if (!display || !btn || !label) return;

  label.textContent = `${dur.label} — ${dur.price.toLocaleString()} Tk`;
  btn.classList.add('has-value');

  display.className = 'bn-selection-display visible';
  display.innerHTML = `
    <i class="fa-solid fa-hourglass-half"></i>
    <span>${dur.label} — ${dur.price.toLocaleString()} Tk per treatment</span>
  `;
}


/* ================================================================
   6. DAY SELECTOR
   ================================================================ */
function initDaySelector() {
  const grid    = document.getElementById('dayGrid');
  const openBtn = document.getElementById('openDayModal');

  if (!grid || !openBtn) return;

  DAYS.forEach(day => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'bn-chip';
    chip.textContent = day;

    chip.addEventListener('click', () => {
      grid.querySelectorAll('.bn-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.day = day;
      updateDayDisplay(day);
      setTimeout(() => closeModal('dayModalOverlay'), 280);
    });

    grid.appendChild(chip);
  });

  openBtn.addEventListener('click', () => openModal('dayModalOverlay'));
  bindCloseBtn('closeDayModal', 'dayModalOverlay');
}

function updateDayDisplay(day) {
  const display = document.getElementById('dayDisplay');
  const btn     = document.getElementById('openDayModal');
  const label   = document.getElementById('dayBtnLabel');
  if (!display || !btn || !label) return;

  label.textContent = day;
  btn.classList.add('has-value');

  display.className = 'bn-selection-display visible';
  display.innerHTML = `<i class="fa-solid fa-calendar-days"></i><span>${day}</span>`;
}


/* ================================================================
   7. TIME SELECTOR
   ================================================================ */
function initTimeSelector() {
  const grid    = document.getElementById('timeGrid');
  const openBtn = document.getElementById('openTimeModal');

  if (!grid || !openBtn) return;

  TIMES.forEach(time => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'bn-chip';
    chip.textContent = time;

    chip.addEventListener('click', () => {
      grid.querySelectorAll('.bn-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.time = time;
      updateTimeDisplay(time);
      setTimeout(() => closeModal('timeModalOverlay'), 280);
    });

    grid.appendChild(chip);
  });

  openBtn.addEventListener('click', () => openModal('timeModalOverlay'));
  bindCloseBtn('closeTimeModal', 'timeModalOverlay');
}

function updateTimeDisplay(time) {
  const display = document.getElementById('timeDisplay');
  const btn     = document.getElementById('openTimeModal');
  const label   = document.getElementById('timeBtnLabel');
  if (!display || !btn || !label) return;

  label.textContent = time;
  btn.classList.add('has-value');

  display.className = 'bn-selection-display visible';
  display.innerHTML = `<i class="fa-regular fa-clock"></i><span>${time}</span>`;
}


/* ================================================================
   8. LOCATION SELECTOR
   ================================================================ */
function initLocationSelector() {
  const cards = document.querySelectorAll('.bn-loc-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.location = card.dataset.location;
    });
  });
}


/* ================================================================
   9. RECEIPT GENERATOR
   ================================================================ */
function generateReceipt() {
  const name  = document.getElementById('inp-name')?.value.trim()  || '—';
  const phone = document.getElementById('inp-phone')?.value.trim() || '—';
  const email = document.getElementById('inp-email')?.value.trim() || '—';

  const serviceNames = state.selectedServices.map(
    id => SERVICES.find(s => s.id === id)?.name
  ).filter(Boolean);

  const dur       = DURATIONS.find(d => d.id === state.duration);
  const durLabel  = dur ? dur.label : '—';
  const priceEach = dur ? dur.price : 0;
  const total     = priceEach * (serviceNames.length || 1);

  const card = document.getElementById('receiptCard');
  if (!card) return;

  card.innerHTML = `
    <div class="bn-receipt-top">
      <svg class="bn-receipt-logo" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" stroke="#B48A4E" stroke-width="1.5"/>
        <circle cx="28" cy="28" r="19" stroke="#B48A4E" stroke-width="0.5" stroke-dasharray="3 3"/>
        <path d="M22 24 Q28 18 34 24 Q38 30 34 36 Q28 42 22 36 Q18 30 22 24Z" fill="#B48A4E" opacity="0.4"/>
        <circle cx="28" cy="28" r="5" fill="#B48A4E"/>
      </svg>
      <div class="bn-receipt-brand">
        <span class="bn-receipt-brand-name">Dhaka Serenity Spa</span>
        <span class="bn-receipt-brand-sub">Booking Confirmation</span>
      </div>
      <div class="bn-receipt-confirmed">
        <i class="fa-solid fa-check" style="font-size:0.6rem"></i>
        Confirmed
      </div>
    </div>

    <div class="bn-receipt-rows">
      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-user"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Guest Name</span>
          <span class="bn-rr-value">${escHtml(name)}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-phone"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Phone</span>
          <span class="bn-rr-value">${escHtml(phone)}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-envelope"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Email</span>
          <span class="bn-rr-value">${escHtml(email)}</span>
        </div>
      </div>

      <div class="bn-receipt-divider"></div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-spa"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Treatment${serviceNames.length > 1 ? 's' : ''}</span>
          <span class="bn-rr-value">${serviceNames.length ? serviceNames.join(' · ') : '—'}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-hourglass-half"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Duration</span>
          <span class="bn-rr-value">${durLabel}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-calendar-days"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Day</span>
          <span class="bn-rr-value">${state.day || '—'}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-regular fa-clock"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Time</span>
          <span class="bn-rr-value">${state.time || '—'}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-map-pin"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Branch</span>
          <span class="bn-rr-value">${state.location || '—'}</span>
        </div>
      </div>
    </div>

    <div class="bn-receipt-total-row">
      <span class="bn-receipt-total-label">Total</span>
      <span class="bn-receipt-total-amount">${total.toLocaleString()} TK</span>
    </div>
  `;

  openModal('receiptModalOverlay');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ================================================================
   9b. EMAILJS — SEND BOOKING EMAIL
   ================================================================ */
function sendBookingEmail() {
  const name  = document.getElementById('inp-name')?.value.trim()  || '—';
  const phone = document.getElementById('inp-phone')?.value.trim() || '—';
  const email = document.getElementById('inp-email')?.value.trim() || '—';

  const serviceNames = state.selectedServices
    .map(id => SERVICES.find(s => s.id === id)?.name)
    .filter(Boolean);

  const dur       = DURATIONS.find(d => d.id === state.duration);
  const durLabel  = dur ? dur.label : '—';
  const priceEach = dur ? dur.price : 0;
  const total     = priceEach * (serviceNames.length || 1);

  const templateParams = {
    guest_name: name,
    phone:      phone,
    email:      email,
    treatments: serviceNames.join(', ') || '—',
    duration:   durLabel,
    price:      total.toLocaleString() + ' TK',
    day:        state.day      || '—',
    time:       state.time     || '—',
    branch:     state.location || '—',
  };

  // Show loading state on button
  const btn = document.getElementById('submitBooking');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `<span>Sending…</span><i class="fa-solid fa-spinner fa-spin btn-icon"></i>`;
  btn.disabled = true;

  return emailjs.send(
    'service_9e372vg',
    'template_0lob9qm',
    templateParams
  )
  .then(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  });
}


/* ================================================================
   10. FORM SUBMIT
   ================================================================ */
function initSubmit() {
  const btn = document.getElementById('submitBooking');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!validateForm()) return;
    sendBookingEmail().then(() => generateReceipt());
  });

  bindCloseBtn('closeReceiptModal', 'receiptModalOverlay');
}


/* ================================================================
   11. VALIDATION
   ================================================================ */
function validateForm() {
  const name  = document.getElementById('inp-name')?.value.trim();
  const phone = document.getElementById('inp-phone')?.value.trim();
  const email = document.getElementById('inp-email')?.value.trim();

  const missing = [];

  if (!name)                               missing.push('Full Name');
  if (!phone)                              missing.push('Phone Number');
  if (!email || !email.includes('@'))      missing.push('Valid Email');
  if (state.selectedServices.length === 0) missing.push('at least one Treatment');
  if (!state.duration)                     missing.push('Session Duration');
  if (!state.day)                          missing.push('Preferred Day');
  if (!state.time)                         missing.push('Time Slot');
  if (!state.location)                     missing.push('Branch Location');

  if (missing.length) {
    showValidationToast(missing);
    return false;
  }

  return true;
}

function showValidationToast(missing) {
  const existing = document.getElementById('bn-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'bn-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(12px);
    background: var(--color-dark);
    color: var(--color-cream);
    padding: 14px 24px;
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-xl), 0 0 0 1px rgba(180,138,78,0.3);
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    z-index: 9999;
    max-width: 90vw;
    text-align: center;
    opacity: 0;
    border-left: 3px solid var(--color-gold);
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    line-height: 1.5;
  `;
  toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--color-gold); margin-right:8px"></i>Please complete: <strong>${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}</strong>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(12px)';
    setTimeout(() => toast.remove(), 350);
  }, 3800);
}


/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initServiceSelector();
  initDurationSelector();
  initDaySelector();
  initTimeSelector();
  initLocationSelector();
  initSubmit();

  // Keyboard support: Escape closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openOverlay = document.querySelector('.bn-modal-overlay.open');
    if (openOverlay) {
      openOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
