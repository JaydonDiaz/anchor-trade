(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     Rail active-state helpers
     ============================================================ */

  var railIcons = document.querySelectorAll('.rail-trades .rail-icon');

  function setActiveRail(index) {
    railIcons.forEach(function (icon, i) {
      icon.classList.toggle('is-active', i === index);
    });
  }

  function clearActiveRail() {
    railIcons.forEach(function (icon) {
      icon.classList.remove('is-active');
    });
  }

  /* ============================================================
     Trade detail modal
     ============================================================ */

  var TRADE_INFO = [
    {
      icon: 'icon-bolt',
      tag: '01 — ELECTRICAL',
      name: 'Electrical',
      formValue: 'Electrical',
      body: "From flickering lights to a full panel upgrade, our licensed electricians handle residential work safely and up to code. Every job is permitted where required and backed by our 12-month guarantee.",
      bullets: [
        'Panel & breaker upgrades',
        'Outlet, switch & GFCI repair',
        'Ceiling fans & lighting installs',
        'Code corrections & inspection fixes',
        'EV charger & appliance circuits'
      ]
    },
    {
      icon: 'icon-drop',
      tag: '02 — PLUMBING',
      name: 'Plumbing',
      formValue: 'Plumbing',
      body: "Leaks, clogs, and failing fixtures don't wait for a convenient time. We diagnose the problem on-site and quote a flat rate before any work starts — no surprise charges once the wall's already open.",
      bullets: [
        'Leak detection & repair',
        'Faucet, toilet & fixture swaps',
        'Garbage disposal installs',
        'Water heater service & replacement',
        'Clogged & slow drain clearing'
      ]
    },
    {
      icon: 'icon-hammer',
      tag: '03 — CARPENTRY',
      name: 'Carpentry',
      formValue: 'Carpentry',
      body: 'Trim work, built-ins, and structural repairs need a steady hand and the right tools — both of which our carpenters bring on every visit, from a loose stair tread to a full deck rebuild.',
      bullets: [
        'Trim, molding & baseboards',
        'Custom shelving & built-ins',
        'Door, cabinet & drawer repair',
        'Deck framing & repair',
        'Fence repair & replacement'
      ]
    },
    {
      icon: 'icon-roller',
      tag: '04 — PAINTING',
      name: 'Painting',
      formValue: 'Painting',
      body: "A fresh coat done right starts with prep — patched walls, taped edges, and primer where it's needed. We bring drop cloths and clean up after ourselves, whether it's one accent wall or a full exterior.",
      bullets: [
        'Interior wall & ceiling painting',
        'Exterior siding & trim',
        'Cabinet refinishing',
        'Accent walls & trim detail',
        'Drywall prep before painting'
      ]
    },
    {
      icon: 'icon-patch',
      tag: '05 — DRYWALL',
      name: 'Drywall & Patching',
      formValue: 'Drywall & Patching',
      body: "Holes, cracks, and water damage patched so the repair disappears — not just fills in. We match existing texture (orange peel, knockdown, smooth) so there's no visible seam once it's painted.",
      bullets: [
        'Hole & crack repair',
        'Texture matching',
        'Popcorn ceiling removal',
        'Water damage patching',
        'New drywall installation'
      ]
    },
    {
      icon: 'icon-tile',
      tag: '06 — TILE',
      name: 'Tile & Flooring',
      formValue: 'Tile & Flooring',
      body: 'From a cracked bathroom tile to a full kitchen backsplash, we handle layout, cutting, and grout work with a level eye and clean lines. Luxury vinyl plank and subfloor repair are on the truck too.',
      bullets: [
        'Bathroom & kitchen tile',
        'Backsplash installation',
        'Grout & caulk renewal',
        'Luxury vinyl plank flooring',
        'Subfloor repair'
      ]
    }
  ];

  var tradeModal = document.getElementById('trade-modal');
  var tradeModalBackdrop = document.getElementById('trade-modal-backdrop');
  var tradeModalPanel = tradeModal ? tradeModal.querySelector('.trade-modal-panel') : null;
  var tradeModalClose = document.getElementById('trade-modal-close');
  var tradeModalIconUse = document.getElementById('trade-modal-icon-use');
  var tradeModalTag = document.getElementById('trade-modal-tag');
  var tradeModalTitle = document.getElementById('trade-modal-title');
  var tradeModalBody = document.getElementById('trade-modal-body');
  var tradeModalList = document.getElementById('trade-modal-list');
  var tradeModalQuoteBtn = document.getElementById('trade-modal-quote');
  var tradeModalLastFocused = null;
  var tradeModalCurrentValue = '';

  function openTradeModal(index) {
    var info = TRADE_INFO[index];
    if (!info || !tradeModal) return;

    tradeModalIconUse.setAttribute('href', '#' + info.icon);
    tradeModalTag.textContent = info.tag;
    tradeModalTitle.textContent = info.name;
    tradeModalBody.textContent = info.body;
    tradeModalList.innerHTML = '';
    info.bullets.forEach(function (b) {
      var li = document.createElement('li');
      li.textContent = b;
      tradeModalList.appendChild(li);
    });
    tradeModalCurrentValue = info.formValue;

    tradeModalLastFocused = document.activeElement;
    tradeModal.hidden = false;

    gsap.set(tradeModalBackdrop, { opacity: 0 });
    gsap.set(tradeModalPanel, { opacity: 0, y: 24, scale: 0.96 });
    gsap.to(tradeModalBackdrop, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.to(tradeModalPanel, {
      opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out',
      onComplete: function () { if (tradeModalClose) tradeModalClose.focus(); }
    });
  }

  function closeTradeModal() {
    if (!tradeModal || tradeModal.hidden) return;
    gsap.to(tradeModalPanel, { opacity: 0, y: 16, scale: 0.97, duration: 0.2, ease: 'power2.in' });
    gsap.to(tradeModalBackdrop, {
      opacity: 0, duration: 0.22, ease: 'power2.in',
      onComplete: function () {
        tradeModal.hidden = true;
        if (tradeModalLastFocused && typeof tradeModalLastFocused.focus === 'function') {
          tradeModalLastFocused.focus();
        }
      }
    });
  }

  if (tradeModalBackdrop) tradeModalBackdrop.addEventListener('click', closeTradeModal);
  if (tradeModalClose) tradeModalClose.addEventListener('click', closeTradeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && tradeModal && !tradeModal.hidden) closeTradeModal();
  });
  if (tradeModalQuoteBtn) {
    tradeModalQuoteBtn.addEventListener('click', function () {
      var select = document.getElementById('qf-trade');
      if (select && tradeModalCurrentValue) select.value = tradeModalCurrentValue;
      closeTradeModal();
      var quoteSection = document.getElementById('quote');
      if (quoteSection) {
        window.setTimeout(function () {
          quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    });
  }

  function scrollToTradeCard(index) {
    var cards = document.querySelectorAll('.trade-card');
    var card = cards[index];
    if (!card) return;

    if (window.innerWidth < 900) {
      var tradesSection = document.getElementById('trades');
      if (tradesSection) tradesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      return;
    }

    var st = ScrollTrigger.getById('tradesPin');
    if (!st) return;
    var progress = cards.length > 1 ? index / (cards.length - 1) : 0;
    var target = st.start + progress * (st.end - st.start);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-trade-index]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.getAttribute('data-trade-index'), 10);
      scrollToTradeCard(idx);
      openTradeModal(idx);
      gsap.fromTo(btn, { scale: 1 }, { scale: 0.86, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    });
  });

  document.querySelectorAll('.trade-card').forEach(function (card, i) {
    card.addEventListener('click', function () { openTradeModal(i); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTradeModal(i);
      }
    });
  });

  /* ============================================================
     Horizontal pinned trades strip (desktop only)
     ============================================================ */

  var mm = gsap.matchMedia();

  mm.add('(min-width: 900px)', function () {
    var track = document.getElementById('trades-track');
    var wrap = document.querySelector('.trades-pin');
    var cards = gsap.utils.toArray('.trade-card');
    if (!track || !wrap || !cards.length) return;

    function getMaxX() {
      return Math.max(0, track.scrollWidth - wrap.offsetWidth);
    }

    var tween = gsap.to(track, {
      x: function () { return -getMaxX(); },
      ease: 'none',
      scrollTrigger: {
        id: 'tradesPin',
        trigger: '.trades-pin',
        start: 'top top',
        end: function () { return '+=' + getMaxX(); },
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var idx = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
          setActiveRail(idx);
        },
        onLeave: clearActiveRail,
        onLeaveBack: clearActiveRail
      }
    });

    return function () {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      clearActiveRail();
    };
  });

  /* ============================================================
     Hero entrance
     ============================================================ */

  gsap.timeline({ delay: 0.15 })
    .from('.hero-copy .eyebrow', { opacity: 0, y: 14, duration: 0.6, ease: 'power3.out' })
    .from('.hero-title', { opacity: 0, y: 26, duration: 0.75, ease: 'power3.out' }, '-=0.4')
    .from('.hero-sub', { opacity: 0, y: 18, duration: 0.6, ease: 'power3.out' }, '-=0.45')
    .from('.hero-ctas', { opacity: 0, y: 18, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from('.hero-ticket', { opacity: 0, y: 24, rotate: -3, duration: 0.55, stagger: 0.12, ease: 'back.out(1.6)' }, '-=0.35')
    .from('.hero-photo', { opacity: 0, scale: 1.05, duration: 0.9, ease: 'power2.out' }, '-=0.9');

  /* ============================================================
     Section head reveals
     ============================================================ */

  [
    '.trades-head', '.process-head', '.gallery-head',
    '.dispatch-copy', '.reviews-head', '.quote-copy'
  ].forEach(function (sel) {
    var el = document.querySelector(sel);
    if (!el) return;
    gsap.from(el, {
      opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ============================================================
     Process — ticket stubs
     ============================================================ */

  gsap.utils.toArray('.stub').forEach(function (stub, i) {
    gsap.from(stub, {
      opacity: 0,
      y: 40,
      rotate: i % 2 === 0 ? -2.5 : 2.5,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: stub, start: 'top 88%' }
    });
  });

  var stubThread = document.querySelector('.stub-thread');
  if (stubThread) {
    gsap.to(stubThread, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.process-stubs', start: 'top 80%', end: 'bottom 65%', scrub: true }
    });
  }

  /* ============================================================
     Stats — count up
     ============================================================ */

  gsap.utils.toArray('.stat-num').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimalDivisor = el.getAttribute('data-decimal') ? parseFloat(el.getAttribute('data-decimal')) : null;
    var obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = decimalDivisor
              ? (obj.val / decimalDivisor).toFixed(1)
              : Math.round(obj.val).toLocaleString();
          }
        });
      }
    });
  });

  /* ============================================================
     Gallery + reviews reveals
     ============================================================ */

  gsap.utils.toArray('.gallery-item').forEach(function (item) {
    gsap.from(item, {
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.review-card').forEach(function (card) {
    gsap.from(card, {
      opacity: 0, y: 24, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%' }
    });
  });

  var townChips = gsap.utils.toArray('.town-chip');
  if (townChips.length) {
    gsap.from(townChips, {
      opacity: 0, y: 14, duration: 0.5, stagger: 0.06, ease: 'power3.out',
      scrollTrigger: { trigger: '.dispatch-towns', start: 'top 88%' }
    });
  }

  var quoteTicketEl = document.querySelector('.quote-ticket');
  if (quoteTicketEl) {
    gsap.from(quoteTicketEl, {
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: quoteTicketEl, start: 'top 88%' }
    });
  }

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });
})();

/* ============================================================
   Quote form — ticket number, dropzone, fake submit
   ============================================================ */

(function () {
  'use strict';

  var form = document.getElementById('quote-form');
  var success = document.getElementById('quote-success');
  var ticketNumEl = document.getElementById('ticket-num');
  var ticketDateEl = document.getElementById('ticket-date');
  var successTicketEl = document.getElementById('success-ticket');
  var resetBtn = document.getElementById('quote-reset');
  var dropzone = document.getElementById('dropzone');
  var fileInput = document.getElementById('qf-file');
  var dropzoneText = document.getElementById('dropzone-text');

  var currentTicket = '';

  function randomTicket() {
    var n = Math.floor(100000 + Math.random() * 899999);
    return 'WO-' + n;
  }

  function formattedDate() {
    var d = new Date();
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
  }

  function stampTicket() {
    currentTicket = randomTicket();
    if (ticketNumEl) ticketNumEl.textContent = currentTicket;
    if (ticketDateEl) ticketDateEl.textContent = formattedDate();
  }

  function resetDropzoneText() {
    if (!dropzoneText) return;
    dropzoneText.textContent = '';
    dropzoneText.appendChild(document.createTextNode('Drop a photo of the job, or '));
    var span = document.createElement('span');
    span.textContent = 'browse';
    dropzoneText.appendChild(span);
  }

  function updateDropzoneText(file) {
    if (dropzoneText) dropzoneText.textContent = file.name;
  }

  stampTicket();

  if (dropzone && fileInput) {
    dropzone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function () {
        dropzone.classList.remove('is-dragover');
      });
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      var files = e.dataTransfer ? e.dataTransfer.files : null;
      if (files && files[0]) {
        fileInput.files = files;
        updateDropzoneText(files[0]);
      }
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) updateDropzoneText(fileInput.files[0]);
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (successTicketEl) successTicketEl.textContent = currentTicket;
      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (form) {
        form.reset();
        form.hidden = false;
      }
      if (success) success.hidden = true;
      resetDropzoneText();
      stampTicket();
    });
  }
})();
