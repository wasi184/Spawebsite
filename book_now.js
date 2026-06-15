/**
 * ================================================================
 * DHAKA SERENITY SPA — BOOK NOW PAGE SCRIPT
 * ================================================================
 * Modules:
 *  1.  Data Definitions
 *  2.  State
 *  3.  Modal System
 *  4.  Service Selector
 *  5.  Duration Selector  ← FULLY REBUILT: per-treatment, branch-aware
 *  6.  Day Selector
 *  7.  Time Selector
 *  8.  Location Selector  ← UPDATED: sets selectedBranch, invalidates durations
 *  9.  Receipt Generator  ← UPDATED: promo discount breakdown
 *  9b. EmailJS — Send Booking Email  ← UPDATED: correct total from selectedDurations
 *  10. Form Submit
 *  11. Validation         ← UPDATED: checks all treatments have durations
 * ================================================================
 */

"use strict";

/* ================================================================
   1. DATA DEFINITIONS
   ================================================================ */
const SERVICES = [
    { id: "aroma", name: "Aroma Oil Massage", icon: "fa-solid fa-wind" },
    { id: "deep", name: "Deep Tissue Massage", icon: "fa-solid fa-hand-fist" },
    { id: "full", name: "Full Body Massage", icon: "fa-solid fa-person" },
    { id: "four", name: "Four Hand Massage", icon: "fa-solid fa-hands" },
    { id: "thai", name: "Thai Massage", icon: "fa-solid fa-yin-yang" },
    { id: "nuru", name: "Nuru Massage", icon: "fa-solid fa-droplet" },
    { id: "dry", name: "Dry Massage", icon: "fa-solid fa-feather" },
    { id: "sensual", name: "Sensual Massage", icon: "fa-solid fa-heart" },
    {
        id: "scrub",
        name: "Body Scrub with Facial",
        icon: "fa-solid fa-face-smile",
    },
    { id: "back", name: "Back & Shoulder Massage", icon: "fa-solid fa-spa" },
    { id: "special", name: "Special Massage", icon: "fa-solid fa-star" },
    {
        id: "b2b",
        name: "Body to Body Massage",
        icon: "fa-solid fa-circle-nodes",
    },
];

/**
 * PRICING MASTER OBJECT
 * Structure: PRICING[branch][treatmentName][durationMinutes] = priceInTk
 * Branch keys MUST match state.selectedBranch values: 'gulshan' | 'mirpur'
 * All prices in Bangladeshi Taka (BDT).
 */
const PRICING = {
    gulshan: {
        "Aroma Oil Massage": { 60: 10000, 120: 15000 },
        "Deep Tissue Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Full Body Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Four Hand Massage": { 60: 15000, 120: 25000 },
        "Thai Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Nuru Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Dry Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Sensual Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Body Scrub with Facial": { 60: 8000, 90: 11000, 120: 13000 },
        "Back & Shoulder Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Special Massage": { 60: 8000, 90: 11000, 120: 13000 },
        "Body to Body Massage": { 60: 8000, 90: 11000, 120: 13000 },
    },

    mirpur: {
        "Aroma Oil Massage": { 60: 7000, 120: 12000 },
        "Deep Tissue Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Full Body Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Four Hand Massage": { 60: 12000, 120: 22000 },
        "Thai Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Nuru Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Dry Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Sensual Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Body Scrub with Facial": { 60: 7000, 90: 10000, 120: 12000 },
        "Back & Shoulder Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Special Massage": { 60: 7000, 90: 10000, 120: 12000 },
        "Body to Body Massage": { 60: 7000, 90: 10000, 120: 12000 },
    },
};

/**
 * DURATION_META — labels and sublabels only. NO prices here.
 * Prices are always read from PRICING at runtime.
 */
const DURATION_META = [
    { id: 60, label: "60 min", sublabel: "Standard Session" },
    { id: 90, label: "90 min", sublabel: "Relaxation Session" },
    { id: 120, label: "120 min", sublabel: "Premium Session" },
];

const DAYS = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

const TIMES = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
];

/* ================================================================
   2. STATE
   ================================================================ */
const state = {
    selectedBranch: null, // Canonical pricing key: 'gulshan' | 'mirpur'
    location: null, // Display string: 'Gulshan-2' | 'Mirpur-1'
    selectedServices: [], // Array of service ids
    selectedDurations: {}, // { treatmentName: { duration: 60, price: 10000 } }
    day: null, // Day string
    time: null, // Time string
    promoApplied: false, // Whether SERENITY20 promo is active
};

/* ================================================================
   3. MODAL SYSTEM
   ================================================================ */
function openModal(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    overlay.addEventListener(
        "click",
        (e) => {
            if (e.target === overlay) closeModal(overlayId);
        },
        { once: true },
    );
}

function closeModal(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
}

function bindCloseBtn(btnId, overlayId) {
    const btn = document.getElementById(btnId);
    if (btn) btn.addEventListener("click", () => closeModal(overlayId));
}

/* ================================================================
   4. SERVICE SELECTOR
   ================================================================ */
function initServiceSelector() {
    const grid = document.getElementById("serviceGrid");
    const openBtn = document.getElementById("openServiceModal");
    const confirmBtn = document.getElementById("confirmServices");

    if (!grid || !openBtn) return;

    SERVICES.forEach((svc) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "bn-service-card";
        card.dataset.id = svc.id;
        card.innerHTML = `
      <div class="bn-svc-icon"><i class="${svc.icon}"></i></div>
      <span class="bn-svc-name">${svc.name}</span>
      <span class="bn-svc-check"><i class="fa-solid fa-check"></i></span>
    `;

        card.addEventListener("click", () => {
            const isSelected = state.selectedServices.includes(svc.id);
            if (isSelected) {
                state.selectedServices = state.selectedServices.filter(
                    (s) => s !== svc.id,
                );
                card.classList.remove("selected");
                // Remove stale duration entry for this treatment when deselected
                delete state.selectedDurations[svc.name];
            } else {
                state.selectedServices.push(svc.id);
                card.classList.add("selected");
            }
        });

        grid.appendChild(card);
    });

    openBtn.addEventListener("click", () => openModal("serviceModalOverlay"));
    bindCloseBtn("closeServiceModal", "serviceModalOverlay");

    confirmBtn.addEventListener("click", () => {
        closeModal("serviceModalOverlay");
        renderServicePills();
        updateServiceBtn();
        // Invalidate any duration selections for treatments that were removed
        pruneStaleDurations();
        updateDurationBtnFromState();
    });
}

function renderServicePills() {
    const pillRow = document.getElementById("selectedServicePills");
    if (!pillRow) return;
    pillRow.innerHTML = "";

    state.selectedServices.forEach((id) => {
        const svc = SERVICES.find((s) => s.id === id);
        if (!svc) return;
        const pill = document.createElement("div");
        pill.className = "bn-pill";
        pill.innerHTML = `
      <i class="${svc.icon}" style="font-size:0.75rem; color:var(--color-gold)"></i>
      <span>${svc.name}</span>
      <button class="bn-pill-remove" data-id="${id}" aria-label="Remove ${svc.name}" type="button">
        <i class="fa-solid fa-minus"></i>
      </button>
    `;
        pillRow.appendChild(pill);
    });

    pillRow.querySelectorAll(".bn-pill-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const svc = SERVICES.find((s) => s.id === id);
            state.selectedServices = state.selectedServices.filter(
                (s) => s !== id,
            );
            // Remove stale duration for this treatment
            if (svc) delete state.selectedDurations[svc.name];
            const card = document.querySelector(
                `.bn-service-card[data-id="${id}"]`,
            );
            if (card) card.classList.remove("selected");
            renderServicePills();
            updateServiceBtn();
            updateDurationBtnFromState();
        });
    });
}

function updateServiceBtn() {
    const btn = document.getElementById("openServiceModal");
    const label = document.getElementById("serviceBtnLabel");
    if (!label || !btn) return;

    if (state.selectedServices.length === 0) {
        label.textContent = "Choose Your Treatment";
        btn.classList.remove("has-value");
    } else {
        const count = state.selectedServices.length;
        label.textContent = `${count} Treatment${count > 1 ? "s" : ""} Selected`;
        btn.classList.add("has-value");
    }
}

/**
 * Remove duration entries for treatments that are no longer selected.
 * Called whenever the service selection changes.
 */
function pruneStaleDurations() {
    const selectedNames = new Set(
        state.selectedServices
            .map((id) => SERVICES.find((s) => s.id === id)?.name)
            .filter(Boolean),
    );
    Object.keys(state.selectedDurations).forEach((name) => {
        if (!selectedNames.has(name)) {
            delete state.selectedDurations[name];
        }
    });
}

/* ================================================================
   5. DURATION SELECTOR
   ── FULLY REBUILT ──
   - Guard: blocks modal open if no treatments selected
   - Dynamic: rebuilds #durationList per selected treatment on every open
   - Branch-aware: reads prices from PRICING[state.selectedBranch]
   - Per-treatment: state.selectedDurations[treatmentName] = { duration, price }
   ================================================================ */
function initDurationSelector() {
    const openBtn = document.getElementById("openDurationModal");
    if (!openBtn) return;

    openBtn.addEventListener("click", () => {
        // ── GUARD: no treatments selected ──
        if (state.selectedServices.length === 0) {
            showDurationWarning();
            return;
        }
        // ── GUARD: no branch selected ──
        if (!state.selectedBranch) {
            showNoBranchWarning();
            return;
        }
        // Build the modal content fresh every open
        buildDurationModal();
        openModal("durationModalOverlay");
    });

    bindCloseBtn("closeDurationModal", "durationModalOverlay");
}

/**
 * Renders a styled warning message inline where the duration modal trigger is,
 * instead of opening the modal. Does NOT use alert().
 */
function showDurationWarning() {
    const existing = document.getElementById("dur-inline-warning");
    if (existing) {
        existing.style.animation = "none";
        existing.offsetHeight; // reflow
        existing.style.animation = "";
        return;
    }

    const warn = document.createElement("div");
    warn.id = "dur-inline-warning";
    warn.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    margin-top: 10px;
    background: rgba(180,138,78,0.08);
    border: 1.5px dashed rgba(180,138,78,0.5);
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-gold);
    animation: warnFadeIn 0.3s ease forwards;
  `;
    warn.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation" style="font-size:1rem;flex-shrink:0"></i>
    <span>Please select at least one treatment first before choosing a duration.</span>
  `;

    // Inject warning style (idempotent)
    if (!document.getElementById("dur-warn-style")) {
        const style = document.createElement("style");
        style.id = "dur-warn-style";
        style.textContent = `
      @keyframes warnFadeIn {
        from { opacity:0; transform:translateY(-6px); }
        to   { opacity:1; transform:translateY(0);    }
      }
    `;
        document.head.appendChild(style);
    }

    const step = document
        .getElementById("openDurationModal")
        .closest(".bn-step");
    step.appendChild(warn);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        warn.style.opacity = "0";
        warn.style.transition = "opacity 0.35s ease";
        setTimeout(() => warn.remove(), 380);
    }, 4000);
}

function showNoBranchWarning() {
    const existing = document.getElementById("dur-inline-warning");
    if (existing) existing.remove();

    const warn = document.createElement("div");
    warn.id = "dur-inline-warning";
    warn.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    margin-top: 10px;
    background: rgba(180,138,78,0.08);
    border: 1.5px dashed rgba(180,138,78,0.5);
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-gold);
    animation: warnFadeIn 0.3s ease forwards;
  `;
    warn.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation" style="font-size:1rem;flex-shrink:0"></i>
    <span>Please select a branch first so we can show you the correct pricing.</span>
  `;

    const step = document
        .getElementById("openDurationModal")
        .closest(".bn-step");
    step.appendChild(warn);

    setTimeout(() => {
        warn.style.opacity = "0";
        warn.style.transition = "opacity 0.35s ease";
        setTimeout(() => warn.remove(), 380);
    }, 4000);
}

/**
 * Dynamically builds #durationList.
 * One treatment block per selected treatment.
 * For each treatment block: duration pills read from PRICING[branch][treatmentName].
 * Previously selected duration for a treatment is visually restored.
 */
function buildDurationModal() {
    const list = document.getElementById("durationList");
    if (!list) return;
    list.innerHTML = "";

    const branchPricing = PRICING[state.selectedBranch] || {};

    state.selectedServices.forEach((id) => {
        const svc = SERVICES.find((s) => s.id === id);
        if (!svc) return;

        const treatmentPricing = branchPricing[svc.name] || {};
        const availableDurations = DURATION_META.filter(
            (dm) => treatmentPricing[dm.id] !== undefined,
        );

        // ── Treatment block wrapper ──
        const block = document.createElement("div");
        block.className = "bn-dur-treatment-block";
        block.style.cssText = `
      border: 1.5px solid var(--color-cream-3);
      border-radius: var(--radius-md);
      padding: 16px 18px;
      background: var(--color-cream);
      margin-bottom: 4px;
    `;

        // ── Treatment header ──
        const header = document.createElement("div");
        header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    `;
        header.innerHTML = `
      <div style="
        width:34px; height:34px;
        border-radius:var(--radius-md);
        background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
        display:flex; align-items:center; justify-content:center;
        color:var(--color-white); font-size:0.8rem;
        box-shadow: 0 4px 14px rgba(180,138,78,0.3);
        flex-shrink:0;
      ">
        <i class="${svc.icon}"></i>
      </div>
      <span style="
        font-family:var(--font-display);
        font-size:0.92rem;
        font-weight:700;
        color:var(--color-dark);
        letter-spacing:-0.01em;
      ">${svc.name}</span>
    `;
        block.appendChild(header);

        // ── Duration pills row ──
        const pillsRow = document.createElement("div");
        pillsRow.style.cssText = `display:flex; flex-direction:column; gap:8px;`;

        availableDurations.forEach((dm) => {
            const price = treatmentPricing[dm.id];
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "bn-dur-btn";
            btn.dataset.treatmentName = svc.name;
            btn.dataset.durationId = dm.id;

            // Restore visual selected state if already chosen in this session
            const alreadyChosen = state.selectedDurations[svc.name];
            if (alreadyChosen && alreadyChosen.duration === dm.id) {
                btn.classList.add("selected");
            }

            btn.innerHTML = `
        <div class="bn-dur-left">
          <div class="bn-dur-icon"><i class="fa-solid fa-hourglass-half"></i></div>
          <div>
            <div class="bn-dur-min">${dm.label}</div>
            <div class="bn-dur-label">${dm.sublabel}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:14px">
          <span class="bn-dur-price">${price.toLocaleString()} Tk</span>
          <i class="fa-solid fa-circle-check bn-dur-check"></i>
        </div>
      `;

            btn.addEventListener("click", () => {
                // Deselect all buttons in this treatment block only
                pillsRow
                    .querySelectorAll(".bn-dur-btn")
                    .forEach((b) => b.classList.remove("selected"));
                btn.classList.add("selected");
                // Store per-treatment selection
                state.selectedDurations[svc.name] = { duration: dm.id, price };
            });

            pillsRow.appendChild(btn);
        });

        block.appendChild(pillsRow);
        list.appendChild(block);
    });

    // ── Add a "Done" / "Confirm Durations" footer button inside the modal ──
    // The modal HTML has no confirm button for duration — we inject it once.
    let confirmDurBtn = document.getElementById("confirmDurations");
    if (!confirmDurBtn) {
        const modalEl = document
            .getElementById("durationModalOverlay")
            .querySelector(".bn-modal");
        const footer = document.createElement("div");
        footer.className = "bn-modal-footer";
        footer.style.cssText = "padding-top:0;";
        footer.innerHTML = `
      <button class="btn btn-dark ripple-btn" id="confirmDurations" type="button">
        <span>Confirm Durations</span>
        <i class="fa-solid fa-check btn-icon"></i>
      </button>
    `;
        modalEl.appendChild(footer);
        confirmDurBtn = footer.querySelector("#confirmDurations");
    }

    // Re-bind each time modal is opened (idempotent via cloneNode trick)
    const newBtn = confirmDurBtn.cloneNode(true);
    confirmDurBtn.replaceWith(newBtn);
    newBtn.addEventListener("click", () => {
        closeModal("durationModalOverlay");
        updateDurationBtnFromState();
        updateDurationDisplayFromState();
    });
}

/**
 * Updates the duration selector button label based on current selectedDurations.
 * Called after confirm or when treatments are removed.
 */
function updateDurationBtnFromState() {
    const btn = document.getElementById("openDurationModal");
    const label = document.getElementById("durationBtnLabel");
    if (!btn || !label) return;

    const keys = Object.keys(state.selectedDurations);
    if (keys.length === 0) {
        label.textContent = "Choose Duration & Price";
        btn.classList.remove("has-value");
    } else {
        label.textContent = `${keys.length} Duration${keys.length > 1 ? "s" : ""}`;
        btn.classList.add("has-value");
    }
}

/**
 * Renders the inline duration summary below the duration button.
 * Shows each treatment + chosen duration. Does NOT show individual prices.
 */
function updateDurationDisplayFromState() {
    const display = document.getElementById("durationDisplay");
    if (!display) return;

    const keys = Object.keys(state.selectedDurations);
    if (keys.length === 0) {
        display.className = "bn-selection-display";
        display.innerHTML = "";
        return;
    }

    const durMeta = (k) => {
        const dm = DURATION_META.find(
            (d) => d.id === state.selectedDurations[k].duration,
        );
        return dm ? dm.label : `${state.selectedDurations[k].duration} min`;
    };

    const lines = keys
        .map(
            (name) => `
    <div style="display:flex;align-items:center;gap:8px;padding:4px 0;">
      <i class="fa-solid fa-hourglass-half" style="color:var(--color-gold);font-size:0.8rem;width:14px;text-align:center;"></i>
      <span style="font-size:0.85rem;font-weight:600;color:var(--color-dark);">${name}</span>
      <span style="font-size:0.78rem;color:var(--color-text-muted);">— ${durMeta(name)}</span>
    </div>
  `,
        )
        .join("");

    display.className = "bn-selection-display visible";
    display.innerHTML = lines;
}

/**
 * Returns raw subtotal (no discount applied).
 */
function computeRawTotal() {
    return Object.values(state.selectedDurations).reduce(
        (acc, v) => acc + v.price,
        0,
    );
}

/**
 * Returns final total — applies 20% discount if promo is active.
 */
function computeTotal() {
    const raw = computeRawTotal();
    return state.promoApplied ? Math.round(raw * 0.8) : raw;
}

/* ================================================================
   6. DAY SELECTOR
   ================================================================ */
function initDaySelector() {
    const grid = document.getElementById("dayGrid");
    const openBtn = document.getElementById("openDayModal");

    if (!grid || !openBtn) return;

    DAYS.forEach((day) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "bn-chip";
        chip.textContent = day;

        chip.addEventListener("click", () => {
            grid.querySelectorAll(".bn-chip").forEach((c) =>
                c.classList.remove("selected"),
            );
            chip.classList.add("selected");
            state.day = day;
            updateDayDisplay(day);
            setTimeout(() => closeModal("dayModalOverlay"), 280);
        });

        grid.appendChild(chip);
    });

    openBtn.addEventListener("click", () => openModal("dayModalOverlay"));
    bindCloseBtn("closeDayModal", "dayModalOverlay");
}

function updateDayDisplay(day) {
    const display = document.getElementById("dayDisplay");
    const btn = document.getElementById("openDayModal");
    const label = document.getElementById("dayBtnLabel");
    if (!display || !btn || !label) return;

    label.textContent = day;
    btn.classList.add("has-value");

    display.className = "bn-selection-display visible";
    display.innerHTML = `<i class="fa-solid fa-calendar-days"></i><span>${day}</span>`;
}

/* ================================================================
   7. TIME SELECTOR
   ================================================================ */
function initTimeSelector() {
    const grid = document.getElementById("timeGrid");
    const openBtn = document.getElementById("openTimeModal");

    if (!grid || !openBtn) return;

    TIMES.forEach((time) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "bn-chip";
        chip.textContent = time;

        chip.addEventListener("click", () => {
            grid.querySelectorAll(".bn-chip").forEach((c) =>
                c.classList.remove("selected"),
            );
            chip.classList.add("selected");
            state.time = time;
            updateTimeDisplay(time);
            setTimeout(() => closeModal("timeModalOverlay"), 280);
        });

        grid.appendChild(chip);
    });

    openBtn.addEventListener("click", () => openModal("timeModalOverlay"));
    bindCloseBtn("closeTimeModal", "timeModalOverlay");
}

function updateTimeDisplay(time) {
    const display = document.getElementById("timeDisplay");
    const btn = document.getElementById("openTimeModal");
    const label = document.getElementById("timeBtnLabel");
    if (!display || !btn || !label) return;

    label.textContent = time;
    btn.classList.add("has-value");

    display.className = "bn-selection-display visible";
    display.innerHTML = `<i class="fa-regular fa-clock"></i><span>${time}</span>`;
}

/* ================================================================
   8. LOCATION SELECTOR
   UPDATED: sets state.selectedBranch, invalidates stale durations on branch change
   ================================================================ */
function initLocationSelector() {
    const cards = document.querySelectorAll(".bn-loc-card");
    if (!cards.length) return;

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            cards.forEach((c) => c.classList.remove("selected"));
            card.classList.add("selected");

            const prevBranch = state.selectedBranch;
            state.location = card.dataset.location;

            // Map display location to pricing key
            const locToBranch = {
                "Gulshan-2": "gulshan",
                "Mirpur-1": "mirpur",
            };
            state.selectedBranch = locToBranch[state.location] || null;

            // If branch changed, all previously selected durations are invalid
            // (prices differ between branches — must re-select)
            if (prevBranch !== null && prevBranch !== state.selectedBranch) {
                state.selectedDurations = {};
                updateDurationBtnFromState();
                updateDurationDisplayFromState();
            }
        });
    });
}

/* ================================================================
   9. RECEIPT GENERATOR
   UPDATED:
   - Duration section: one row per treatment (Name — X min), NO per-item price
   - Promo breakdown: subtotal → discount line → final total
   ================================================================ */
function generateReceipt() {
    const name = document.getElementById("inp-name")?.value.trim() || "—";
    const phone = document.getElementById("inp-phone")?.value.trim() || "—";
    const email = document.getElementById("inp-email")?.value.trim() || "—";

    const serviceNames = state.selectedServices
        .map((id) => SERVICES.find((s) => s.id === id)?.name)
        .filter(Boolean);

    // ── Pricing breakdown ──
    const rawTotal = computeRawTotal();
    const discount = state.promoApplied ? Math.round(rawTotal * 0.2) : 0;
    const total = rawTotal - discount;

    // Build per-treatment duration lines for receipt
    const durationLines = serviceNames
        .map((treatmentName) => {
            const entry = state.selectedDurations[treatmentName];
            if (!entry)
                return `
      <div style="color:var(--color-text-muted);font-size:0.88rem;">
        ${escHtml(treatmentName)} — duration not set
      </div>
    `;
            const dm = DURATION_META.find((d) => d.id === entry.duration);
            return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:3px 0;">
        <span style="font-size:0.9rem;font-weight:600;color:var(--color-cream);">${escHtml(treatmentName)}</span>
        <span style="font-size:0.85rem;color:rgba(180,138,78,0.85);font-weight:500;">${dm ? dm.label : entry.duration + " min"}</span>
      </div>
    `;
        })
        .join("");

    // ── Promo section HTML (only rendered when promo is active) ──
    const promoHTML = state.promoApplied
        ? `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding: 8px 20px;
      font-family: var(--font-body);
      font-size: 0.85rem;
      color: rgba(245,235,220,0.55);
    ">
      <span>Subtotal</span>
      <span>${rawTotal.toLocaleString()} TK</span>
    </div>

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding: 6px 20px 12px;
      font-family: var(--font-body);
      font-size: 0.85rem;
      font-weight: 600;
      color: #6fcf97;
      border-bottom: 1px solid rgba(180,138,78,0.15);
      margin-bottom: 2px;
    ">
      <span>
        <i class="fa-solid fa-tag" style="margin-right:6px;font-size:0.75rem;"></i>
        SERENITY20 — 20% off
      </span>
      <span>−${discount.toLocaleString()} TK</span>
    </div>
  `
        : "";

    const card = document.getElementById("receiptCard");
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
          <span class="bn-rr-label">Treatment${serviceNames.length > 1 ? "s" : ""}</span>
          <span class="bn-rr-value">${serviceNames.length ? serviceNames.join(" · ") : "—"}</span>
        </div>
      </div>

      <div class="bn-receipt-row" style="align-items:flex-start;">
        <div class="bn-rr-icon" style="margin-top:3px;"><i class="fa-solid fa-hourglass-half"></i></div>
        <div class="bn-rr-content" style="width:100%;">
          <span class="bn-rr-label">Duration</span>
          <div style="display:flex;flex-direction:column;gap:2px;margin-top:4px;">
            ${durationLines || '<span class="bn-rr-value">—</span>'}
          </div>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-calendar-days"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Day</span>
          <span class="bn-rr-value">${state.day || "—"}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-regular fa-clock"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Time</span>
          <span class="bn-rr-value">${state.time || "—"}</span>
        </div>
      </div>

      <div class="bn-receipt-row">
        <div class="bn-rr-icon"><i class="fa-solid fa-map-pin"></i></div>
        <div class="bn-rr-content">
          <span class="bn-rr-label">Branch</span>
          <span class="bn-rr-value">${state.location || "—"}</span>
        </div>
      </div>
    </div>

    ${promoHTML}

    <div class="bn-receipt-total-row">
      <span class="bn-receipt-total-label">Total</span>
      <span class="bn-receipt-total-amount">${total.toLocaleString()} TK</span>
    </div>
  `;

    openModal("receiptModalOverlay");
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/* ================================================================
   9b. EMAILJS — SEND BOOKING EMAIL
   UPDATED: duration string + discounted total rebuilt from selectedDurations
   ================================================================ */
function sendBookingEmail() {
    const name = document.getElementById("inp-name")?.value.trim() || "—";
    const phone = document.getElementById("inp-phone")?.value.trim() || "—";
    const email = document.getElementById("inp-email")?.value.trim() || "—";

    const serviceNames = state.selectedServices
        .map((id) => SERVICES.find((s) => s.id === id)?.name)
        .filter(Boolean);

    // Build duration summary string: "Thai Massage (60 min), Four Hand Massage (120 min)"
    const durationSummary =
        serviceNames
            .map((svcName) => {
                const entry = state.selectedDurations[svcName];
                if (!entry) return `${svcName} (duration not set)`;
                const dm = DURATION_META.find((d) => d.id === entry.duration);
                return `${svcName} (${dm ? dm.label : entry.duration + " min"})`;
            })
            .join(", ") || "—";

    // Build promo summary for email
    const rawTotal = computeRawTotal();
    const discount = state.promoApplied ? Math.round(rawTotal * 0.2) : 0;
    const total = rawTotal - discount;
    const promoNote = state.promoApplied
        ? `SERENITY20 applied (−${discount.toLocaleString()} TK)`
        : "None";

    const templateParams = {
        guest_name: name,
        phone: phone,
        email: email,
        treatments: serviceNames.join(", ") || "—",
        duration: durationSummary,
        price: total.toLocaleString() + " TK",
        promo: promoNote,
        day: state.day || "—",
        time: state.time || "—",
        branch: state.location || "—",
    };

    const btn = document.getElementById("submitBooking");
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<span>Sending…</span><i class="fa-solid fa-spinner fa-spin btn-icon"></i>`;
    btn.disabled = true;

    return emailjs
        .send("service_9e372vg", "template_0lob9qm", templateParams)
        .then(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        })
        .catch((err) => {
            console.error("EmailJS error:", err);
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        });
}

/* ================================================================
   10. FORM SUBMIT
   ================================================================ */
function initSubmit() {
    const btn = document.getElementById("submitBooking");
    if (!btn) return;

    btn.addEventListener("click", () => {
        if (!validateForm()) return;
        sendBookingEmail().then(() => generateReceipt());
    });

    bindCloseBtn("closeReceiptModal", "receiptModalOverlay");
}

/* ================================================================
   11. VALIDATION
   UPDATED: checks all selectedServices have a duration entry in selectedDurations
   ================================================================ */
function validateForm() {
    const name = document.getElementById("inp-name")?.value.trim();
    const phone = document.getElementById("inp-phone")?.value.trim();
    const email = document.getElementById("inp-email")?.value.trim();

    const missing = [];

    if (!state.location) missing.push("Branch Location");
    if (!name) missing.push("Full Name");
    if (!phone) missing.push("Phone Number");
    if (!email || !email.includes("@")) missing.push("Valid Email");
    if (state.selectedServices.length === 0)
        missing.push("at least one Treatment");

    // Every selected treatment must have a duration chosen
    if (state.selectedServices.length > 0) {
        const missingDurations = state.selectedServices
            .map((id) => SERVICES.find((s) => s.id === id)?.name)
            .filter((name) => name && !state.selectedDurations[name]);

        if (missingDurations.length > 0) {
            missing.push(
                `Duration for: ${missingDurations.slice(0, 2).join(", ")}${missingDurations.length > 2 ? "…" : ""}`,
            );
        }
    }

    if (!state.day) missing.push("Preferred Day");
    if (!state.time) missing.push("Time Slot");

    if (missing.length) {
        showValidationToast(missing);
        return false;
    }

    return true;
}

function showValidationToast(missing) {
    const existing = document.getElementById("bn-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "bn-toast";
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
    toast.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation" style="color:var(--color-gold); margin-right:8px"></i>
    Please complete: <strong>${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "…" : ""}</strong>
  `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(12px)";
        setTimeout(() => toast.remove(), 350);
    }, 3800);
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initServiceSelector();
    initDurationSelector();
    initDaySelector();
    initTimeSelector();
    initLocationSelector();
    initSubmit();
    initPromoCode();

    // Keyboard support: Escape closes any open modal
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const openOverlay = document.querySelector(".bn-modal-overlay.open");
        if (openOverlay) {
            openOverlay.classList.remove("open");
            document.body.style.overflow = "";
        }
    });
});

/* ================================================================
   PROMO CODE SYSTEM
   UPDATED: uses state.promoApplied instead of a local variable
   ================================================================ */
function initPromoCode() {
    const toggleBtn = document.getElementById("promoToggleBtn");
    const content = document.getElementById("promoContent");
    const chevron = document.getElementById("promoChevron");
    const applyBtn = document.getElementById("applyPromoBtn");
    const input = document.getElementById("promoInput");
    const successBox = document.getElementById("promoSuccess");

    if (!toggleBtn) return;

    // TOGGLE
    toggleBtn.addEventListener("click", () => {
        // IF PROMO ALREADY APPLIED — toggle the success box instead
        if (state.promoApplied) {
            const isOpen = successBox.classList.contains("visible");
            if (isOpen) {
                successBox.classList.remove("visible");
            } else {
                successBox.classList.add("visible");
            }
            chevron.style.transform = successBox.classList.contains("visible")
                ? "rotate(180deg)"
                : "rotate(0deg)";
            return;
        }

        // NORMAL (before apply)
        content.classList.toggle("open");
        chevron.style.transform = content.classList.contains("open")
            ? "rotate(180deg)"
            : "rotate(0deg)";
    });

    applyBtn.addEventListener("click", () => {
        const code = input.value.trim().toUpperCase();
        if (!code) return;

        // CORRECT PROMO
        if (code === "SERENITY20") {
            state.promoApplied = true;

            successBox.classList.add("active");
            successBox.classList.add("visible");

            successBox.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:6px;width:100%;">

          <div style="display:flex;align-items:center;gap:10px;">
            <i class="fa-solid fa-circle-check" style="color:#2e7d32;"></i>
            <span style="font-weight:700;">Promo code applied successfully!</span>
          </div>

          <div style="font-size:0.8rem;color:#2e7d32;">
            You saved 20% on your booking.
          </div>

          <div style="
            margin-top:8px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            background:#fff;
            border-radius:10px;
            padding:8px 12px;
            border:1px solid rgba(0,0,0,0.05);
          ">
            <div style="display:flex;align-items:center;gap:6px;">
              <i class="fa-solid fa-tag"></i>
              <span style="font-weight:600;">SERENITY20</span>
            </div>
            <button id="removePromo" style="
              background:none;
              border:none;
              color:#2e7d32;
              font-weight:600;
              cursor:pointer;
            ">Remove</button>
          </div>

        </div>

        <div style="
          margin-top:10px;
          padding:10px;
          border-radius:10px;
          background:rgba(255,193,7,0.1);
          color:#b48a4e;
          font-size:0.8rem;
        ">
          Amazing! You're getting an exclusive discount.
        </div>
      `;

            content.classList.remove("open");

            // REMOVE BUTTON
            document
                .getElementById("removePromo")
                .addEventListener("click", () => {
                    state.promoApplied = false;

                    successBox.classList.remove("active");
                    successBox.classList.remove("visible");

                    input.value = "";
                    content.classList.add("open");
                });
        } else {
            alert("Invalid promo code");
        }
    });
}
