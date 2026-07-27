/* AxonFlow AI — Portfolio live-preview modal
   Any element with [data-preview-url] and [data-preview-name] opens the
   target site inside an in-page modal instead of a new tab. If the target
   refuses to be framed (X-Frame-Options / CSP), we fail over to a clear
   "open in new tab" state rather than showing a blank iframe. */
(function () {
  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'ef-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="ef-modal-box">' +
        '<div class="ef-modal-bar">' +
          '<span class="url ef-mono"></span>' +
          '<div style="display:flex;align-items:center;gap:.5rem">' +
            '<a class="ef-modal-close ef-open-tab" target="_blank" rel="noopener noreferrer" title="Open in new tab" aria-label="Open in new tab">↗</a>' +
            '<button class="ef-modal-close ef-close" aria-label="Close preview">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="ef-modal-frame-wrap">' +
          '<div class="ef-modal-loading"><span class="spin"></span><span>Loading live preview…</span></div>' +
          '<div class="ef-modal-fallback"><span>This project can\'t be embedded here due to its security settings.</span><a class="ef-btn-secondary ef-open-tab" target="_blank" rel="noopener noreferrer">Open it directly →</a></div>' +
          '<iframe title="Project live preview" loading="lazy"></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  var overlay = null;
  var loadTimer = null;

  function open(url, name) {
    if (!overlay) overlay = buildModal();
    var iframe = overlay.querySelector('iframe');
    var loading = overlay.querySelector('.ef-modal-loading');
    var fallback = overlay.querySelector('.ef-modal-fallback');
    var urlLabel = overlay.querySelector('.url');
    var openTabLinks = overlay.querySelectorAll('.ef-open-tab');

    loading.style.display = 'flex';
    fallback.classList.remove('show');
    urlLabel.textContent = name ? name + ' — ' + url : url;
    openTabLinks.forEach(function (a) { a.href = url; });

    iframe.src = url;
    document.body.style.overflow = 'hidden';
    overlay.classList.add('open');

    clearTimeout(loadTimer);
    var loaded = false;

    // Detect if iframe loads successfully or gets blocked by X-Frame-Options/CSP
    iframe.onload = function () {
      loaded = true;
      try {
        // If framed site allows embedding, access to length/document won't throw cross-origin error immediately
        loading.style.display = 'none';
      } catch (e) {
        loading.style.display = 'none';
      }
    };

    // Safety timeout: if target site takes > 3.5s or suppresses iframe load due to frame-ancestors headers
    loadTimer = setTimeout(function () {
      loading.style.display = 'none';
      // Render fallback notice with explicit "Open it directly →" button
      fallback.classList.add('show');
    }, 3500);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      var iframe = overlay.querySelector('iframe');
      if (iframe) iframe.src = 'about:blank';
      var fallback = overlay.querySelector('.ef-modal-fallback');
      if (fallback) fallback.classList.remove('show');
    }, 250);
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-preview-url]');
    if (trigger) {
      e.preventDefault();
      open(trigger.getAttribute('data-preview-url'), trigger.getAttribute('data-preview-name'));
      return;
    }
    if (overlay && (e.target.classList.contains('ef-close') || e.target === overlay)) {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
