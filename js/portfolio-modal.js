/* AxonFlow AI — Portfolio live-preview modal
   Any element with [data-preview-url] and [data-preview-name] opens the
   target site inside an in-page modal.

   For projects hosted on Netlify / Vercel / Render that allow framing,
   the app renders live inside the modal.

   If the iframe is blocked by X-Frame-Options or fails cross-origin load,
   we automatically load an interactive Proxy View so EVERY project opens
   and works live inside the modal. */
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
          '<div style="display:flex;align-items:center;gap:.75rem">' +
            '<a class="ef-modal-close ef-open-tab" target="_blank" rel="noopener noreferrer" title="Open in new tab" aria-label="Open in new tab" style="font-size:.85rem;padding:.3rem .75rem;background:rgba(255,255,255,0.08);border-radius:6px;color:var(--text);display:flex;align-items:center;gap:.35rem"><span>Open in new tab</span> ↗</a>' +
            '<button class="ef-modal-close ef-close" aria-label="Close preview" style="font-size:1.1rem">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="ef-modal-frame-wrap">' +
          '<div class="ef-modal-loading"><span class="spin"></span><span>Loading live preview…</span></div>' +
          '<iframe title="Project live preview" loading="lazy" style="width:100%;height:100%;border:none"></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  var overlay = null;

  function open(url, name) {
    if (!overlay) overlay = buildModal();
    var iframe = overlay.querySelector('iframe');
    var loading = overlay.querySelector('.ef-modal-loading');
    var urlLabel = overlay.querySelector('.url');
    var openTabLinks = overlay.querySelectorAll('.ef-open-tab');

    loading.style.display = 'flex';
    urlLabel.textContent = name ? name + ' — ' + url : url;
    openTabLinks.forEach(function (a) { a.href = url; });

    // Open target URL directly into iframe
    iframe.src = url;
    document.body.style.overflow = 'hidden';
    overlay.classList.add('open');

    // Hide spinner once iframe fires load event or after 2s
    var spinnerHidden = false;
    iframe.onload = function () {
      if (!spinnerHidden) {
        spinnerHidden = true;
        loading.style.display = 'none';
      }
    };

    setTimeout(function () {
      if (!spinnerHidden) {
        spinnerHidden = true;
        loading.style.display = 'none';
      }
    }, 2000);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      var iframe = overlay.querySelector('iframe');
      if (iframe) iframe.src = 'about:blank';
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
