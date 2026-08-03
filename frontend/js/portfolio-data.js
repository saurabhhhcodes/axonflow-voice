/* AxonFlow AI — Master Portfolio Grid.
   Filters to exclusively high-performing, verified live interactive deployments
   that load seamlessly inside inline iframes and full-screen preview modals. */
(function () {
  var PROJECTS = [
    { name: 'HeteroMind Ent.', url: 'https://heteromind-enterprise.onrender.com/', host: 'heteromind-enterprise.onrender.com', desc: 'Hardware-aware AI agent orchestration platform with dynamic compute routing.', icon: '🧠', tag: 'AI Platform', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' },
    { name: 'HelixMind', url: 'https://helixmind.onrender.com/', host: 'helixmind.onrender.com', desc: 'AI-driven healthcare platform designed for diagnostic workflows.', icon: '🧬', tag: 'Healthcare AI', gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)' },
    { name: 'Orchestrator AI', url: 'https://orchestrateai.netlify.app/', host: 'orchestrateai.netlify.app', desc: 'Centralized command system for multi-agent workflows.', icon: '🌐', tag: 'Production AI', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #3b82f6 100%)' },
    { name: 'you.fyi', url: 'https://you-fyi.onrender.com/ui/', host: 'you-fyi.onrender.com', desc: 'Personalized AI ecosystem dashboard.', icon: '✨', tag: 'AI Dashboard', gradient: 'linear-gradient(135deg, #581c87 0%, #6b21a8 50%, #9333ea 100%)' },
    { name: 'SahayakAI', url: 'https://sahayakai-okwu.onrender.com/app/', host: 'sahayakai-okwu.onrender.com', desc: 'Omni-lingual educational assistant.', icon: '🎓', tag: 'EdTech AI', gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)' },
    { name: 'GeneInsight', url: 'https://geneinsight-platform.vercel.app', host: 'geneinsight-platform.vercel.app', desc: 'AI SaaS bioinformatics diagnostic platform.', icon: '🧬', tag: 'Bioinformatics', gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)' }
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function card(p) {
    return (
      '<article class="card ef-card overflow-hidden cursor-pointer" data-preview-url="' + esc(p.url) + '" data-preview-name="' + esc(p.name) + '" role="button" tabindex="0" aria-label="Open live preview of ' + esc(p.name) + '" style="padding:0;background:var(--surface);border:1px solid var(--border);border-radius:18px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease">' +
        '<div>' +
          '<div class="browser-mockup" style="border-radius:18px 18px 0 0;border:none;border-bottom:1px solid var(--border)">' +
            '<div class="bar" style="background:rgba(255,255,255,0.04);padding:.6rem .85rem;display:flex;align-items:center;gap:.4rem">' +
              '<span class="dot" style="width:8px;height:8px;border-radius:50%;background:#ff5f56"></span>' +
              '<span class="dot" style="width:8px;height:8px;border-radius:50%;background:#ffbd2e"></span>' +
              '<span class="dot" style="width:8px;height:8px;border-radius:50%;background:#27c93f"></span>' +
              '<span class="url-bar" style="font-family:var(--font-mono);font-size:.7rem;color:var(--text-dim);margin-left:.5rem;background:rgba(0,0,0,0.35);padding:.2rem .75rem;border-radius:6px">' + esc(p.host) + '</span>' +
            '</div>' +
            '<div class="screen" style="position:relative;height:240px;background:#06080c;overflow:hidden;margin:0;padding:0">' +
              '<iframe src="' + esc(p.url) + '" title="' + esc(p.name) + ' live preview" loading="lazy" style="width:1280px;height:800px;border:none;transform:scale(0.28);transform-origin:0 0;position:absolute;top:0;left:0;pointer-events:none"></iframe>' +
              '<div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(7,8,10,0.65) 100%);pointer-events:none"></div>' +
              '<div style="position:absolute;bottom:.75rem;left:.85rem;font-family:var(--font-mono);font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#ffffff;background:rgba(7,8,10,0.85);padding:.35rem .85rem;border-radius:20px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);z-index:2">' + p.icon + ' ' + esc(p.tag) + '</div>' +
              '<span class="preview-tag" style="z-index:2;position:absolute;top:.75rem;right:.75rem;background:rgba(84,87,255,0.95);color:#fff;font-family:var(--font-mono);font-size:.65rem;font-weight:600;padding:.35rem .75rem;border-radius:8px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.25);box-shadow:0 4px 14px rgba(0,0,0,0.4)">▶ Expand live app</span>' +
            '</div>' +
          '</div>' +
          '<div style="padding:1.5rem 1.5rem 1rem">' +
            '<h3 style="font-size:1.25rem;font-weight:700;color:var(--text);margin-bottom:.5rem">' + esc(p.name) + '</h3>' +
            '<p style="font-size:.9rem;color:var(--text-dim);line-height:1.6;margin-bottom:0">' + esc(p.desc) + '</p>' +
          '</div>' +
        '</div>' +
        '<div style="padding:0 1.5rem 1.5rem">' +
          '<span style="font-size:.88rem;font-weight:600;color:var(--accent);display:inline-flex;align-items:center;gap:.35rem">Launch full screen modal <span aria-hidden="true">→</span></span>' +
        '</div>' +
      '</article>'
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(card).join('');
    grid.querySelectorAll('[data-preview-url]').forEach(function (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  });
})();
