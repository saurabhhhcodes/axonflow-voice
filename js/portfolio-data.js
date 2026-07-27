/* AxonFlow AI — Portfolio grid renderer.
   Single source of truth for project cards on homepage and case studies. */
(function () {
  var PROJECTS = [
    { name: 'NPMChat', url: 'https://npm-chat-fxjq.vercel.app/', host: 'npm-chat-fxjq.vercel.app', desc: 'Real-time collaborative developer chat & code execution platform.', icon: '💬', tag: 'Open Source' },
    { name: 'MergeShip', url: 'https://mergeship.vercel.app', host: 'mergeship.vercel.app', desc: 'Gamified open-source bridge & AI Command Center for PR velocity.', icon: '🚀', tag: 'Open Source' },
    { name: 'CommitPulse 3D', url: 'https://commitpulse.vercel.app', host: 'commitpulse.vercel.app', desc: 'Real-time GraphQL 3D isometric GitHub contribution visualizer.', icon: '📊', tag: 'Open Source' },
    { name: 'Work to Words', url: 'https://worktowords.in', host: 'worktowords.in', desc: 'AI platform turning daily developer work into published posts.', icon: '✍️', tag: 'Production AI' },
    { name: 'AlgoScope', url: 'https://algo-scope-virid.vercel.app', host: 'algo-scope-virid.vercel.app', desc: 'Interactive algorithm visualizer with real-time high-fidelity animations.', icon: '⚡', tag: 'Open Source' },
    { name: 'DoubtDesk AI', url: 'https://doubt-desk-seven.vercel.app/', host: 'doubt-desk-seven.vercel.app', desc: 'Anonymous AI doubt-solving platform integrated with classrooms.', icon: '🙋', tag: 'Production AI' },
    { name: 'VidyaSetu', url: 'https://vidya-setu-olive.vercel.app', host: 'vidya-setu-olive.vercel.app', desc: 'AI-powered study platform for NCERT quizzes, notes & revision.', icon: '🎓', tag: 'Production AI' },
    { name: 'CertiNova', url: 'https://certinova.vercel.app', host: 'certinova.vercel.app', desc: 'Bulk certificate generator and validation platform.', icon: '📜', tag: 'Open Source' },
    { name: 'GSoC Org Finder', url: 'https://findmygsoc.vercel.app/', host: 'findmygsoc.vercel.app', desc: 'GSoC 2026 organization filter by tech stack, language & domain.', icon: '🔍', tag: 'Open Source' },
    { name: 'Palettegram', url: 'https://palettegram.vercel.app', host: 'palettegram.vercel.app', desc: 'Social platform for UI designers to discover color palettes.', icon: '🎨', tag: 'Open Source' },
    { name: 'GeneInsight', url: 'https://geneinsight-platform.vercel.app', host: 'geneinsight-platform.vercel.app', desc: 'AI SaaS bioinformatics diagnostic platform.', icon: '🧬', tag: 'Production AI' },
    { name: 'OpenBioGen-AI', url: 'https://openbiogen.vercel.app', host: 'openbiogen.vercel.app', desc: 'Biological data generation and sequence analysis platform.', icon: '🧬', tag: 'Open Source' },
    { name: 'Orchestrator AI', url: 'https://orchestrateai.netlify.app/', host: 'orchestrateai.netlify.app', desc: 'Centralized command system for multi-agent workflows.', icon: '🌐', tag: 'Production AI' },
    { name: 'Prestige Estates', url: 'https://legendary-tapioca-50caa6.netlify.app', host: 'legendary-tapioca-50caa6.netlify.app', desc: 'Ultra-luxury real estate showcase platform.', icon: '🏰', tag: 'Client Project' },
    { name: 'Wanderlux Landing', url: 'https://animated-profiterole-542134.netlify.app', host: 'animated-profiterole-542134.netlify.app', desc: 'Bespoke ultra-luxury travel experiences platform.', icon: '✈️', tag: 'Client Project' }
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function card(p) {
    return (
      '<article class="group relative ef-card overflow-hidden p-6 cursor-pointer" data-preview-url="' + esc(p.url) + '" data-preview-name="' + esc(p.name) + '" role="button" tabindex="0" aria-label="Open live preview of ' + esc(p.name) + '">' +
        '<div class="browser-mockup mb-4 relative">' +
          '<div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url-bar">' + esc(p.host) + '</span></div>' +
          '<div class="screen" style="position:relative;height:240px;background:#06080c;overflow:hidden">' +
            '<iframe src="' + esc(p.url) + '" title="' + esc(p.name) + ' live preview" loading="lazy" style="width:144%;height:144%;border:none;transform:scale(0.69);transform-origin:0 0;pointer-events:none"></iframe>' +
            '<div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold" style="background:var(--accent-soft);color:var(--text);z-index:2">' + p.icon + ' ' + esc(p.tag || 'Project') + '</div>' +
            '<span class="preview-tag" style="z-index:2">▶ Interactive preview</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="text-xl font-bold mb-2">' + esc(p.name) + '</h3>' +
        '<p class="text-sm mb-3 leading-relaxed" style="color:var(--text-dim)">' + esc(p.desc) + '</p>' +
        '<span class="text-sm font-semibold inline-flex items-center gap-1" style="color:var(--accent)">Open full view <span aria-hidden="true">→</span></span>' +
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
