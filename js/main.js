document.addEventListener('DOMContentLoaded', function () {
  // Kit selector
  const buttons = document.querySelectorAll('.kit-btn');
  const cards = document.querySelectorAll('.kit-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const kit = btn.dataset.kit;
      cards.forEach(card => {
        if (card.dataset.kit === kit) { card.hidden = false; }
        else { card.hidden = true; }
      });
    });
  });

  // Setup per-card gallery state (show one image at a time)
  document.querySelectorAll('.kit-card').forEach(card => {
    const imgs = Array.from(card.querySelectorAll('.gallery-img'));
    if (imgs.length === 0) return;
    let current = 0;

    const prevBtn = card.querySelector('.gallery-prev');
    const nextBtn = card.querySelector('.gallery-next');
    const counter = card.querySelector('.gallery-counter');

    function show(index) {
      current = (index + imgs.length) % imgs.length;
      imgs.forEach((img, i) => {
        if (i === current) img.removeAttribute('hidden'); else img.setAttribute('hidden', '');
      });
      if (counter) counter.textContent = (current + 1) + ' / ' + imgs.length;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => show(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(current + 1));

    // allow clicking image to advance to next
    imgs.forEach(img => img.addEventListener('click', () => show(current + 1)));

    // initialize
    show(0);
  });

  // Lightbox for images inside gallery (opens the currently visible image as well)
  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'js-lightbox';
    overlay.tabIndex = -1;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.className = 'lightbox-img';

    overlay.appendChild(img);

    function remove() {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
      document.removeEventListener('keyup', onKey);
    }

    overlay.addEventListener('click', remove);

    function onKey(e) {
      if (e.key === 'Escape') remove();
    }
    document.addEventListener('keyup', onKey);

    document.body.appendChild(overlay);
    overlay.focus();
  }

  // Open lightbox when clicking visible image
  document.addEventListener('click', function (e) {
    const t = e.target;
    if (t.tagName === 'IMG' && t.classList.contains('gallery-img')) {
      // only open if image is visible (not hidden)
      if (!t.hasAttribute('hidden')) {
        openLightbox(t.src, t.alt);
      }
    }
  });

});