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

  function scrollToTradeIndex(index) {
    var cards = document.querySelectorAll('.trade-card');
    var card = cards[index];
    if (!card) return;

    if (window.innerWidth < 900) {
      var tradesSection = document.getElementById('trades');
      if (tradesSection) tradesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(function () {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 450);
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
      scrollToTradeIndex(idx);
      gsap.fromTo(btn, { scale: 1 }, { scale: 0.86, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' });
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
