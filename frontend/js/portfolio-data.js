/* AxonFlow AI — Portfolio grid renderer.
   Single source of truth for project cards on the homepage so the
   preview-modal wiring (data-preview-url) stays consistent everywhere. */
(function () {
  var PROJECTS = [
    { name: 'HeteroMind Ent.', url: 'https://heteromind-enterprise.onrender.com/', host: 'heteromind-enterprise.onrender.com', img: '/assets/heteromind_thumbnail_1773347454341.png', desc: 'Hardware-aware AI agent orchestration platform with dynamic compute routing.', icon: '🧠' },
    { name: 'HelixMind', url: 'https://helixmind.onrender.com/', host: 'helixmind.onrender.com', img: '/assets/helixmind_thumbnail_1773347475642.png', desc: 'AI-driven healthcare platform designed for diagnostic workflows.', icon: '🧬' },
    { name: 'Orchestrator AI', url: 'https://orchestrateai.netlify.app/', host: 'orchestrateai.netlify.app', img: '/assets/orchestrator_ai_thumbnail_1773348166867.png', desc: 'Centralized command system for multi-agent workflows.', icon: '🌐' },
    { name: 'you.fyi', url: 'https://you-fyi.onrender.com/ui/', host: 'you-fyi.onrender.com', img: '/assets/you_fyi_thumbnail_1773347635723.png', desc: 'Personalized AI ecosystem dashboard.', icon: '✨' },
    { name: 'SahayakAI', url: 'https://sahayakai-okwu.onrender.com/app/', host: 'sahayakai-okwu.onrender.com', img: '/assets/sahayakai_thumbnail_1773347527788.png', desc: 'Omni-lingual educational assistant.', icon: '🎓' },
    { name: 'GeneInsight', url: 'https://geneinsight-platform.vercel.app', host: 'geneinsight-platform.vercel.app', img: '/assets/geneinsight_thumbnail_1773348593288.png', desc: 'AI SaaS bioinformatics platform.', icon: '🧬' },
    { name: 'Chatlly Assistant', url: 'https://pal.chatlly.com', host: 'pal.chatlly.com', img: '/assets/chatlly_thumbnail_1773348633645.png', desc: 'Enterprise RAG knowledge assistant.', icon: '💬' },
    { name: 'AI Calendar Agent', url: 'https://ai-outlook-calendar-agent.streamlit.app', host: 'ai-outlook-calendar-agent.streamlit.app', img: '/assets/outlook_agent_thumbnail_v2_1773348691601.png', desc: 'Natural language Outlook automation.', icon: '📅' },
    { name: 'OpenBioGen-AI', url: 'https://openbiogen.vercel.app', host: 'openbiogen.vercel.app', img: '/assets/openbiogen_thumbnail_1773348613701.png', desc: 'Biological data generation system.', icon: '🧬' },
    { name: 'Smart Plant Care', url: 'https://smart-plant-care-langchain.streamlit.app/', host: 'smart-plant-care-langchain.streamlit.app', img: '/assets/plant_care_thumbnail_v2_1773348708767.png', desc: 'AI-powered plant health monitoring.', icon: '🌿' }
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function card(p) {
    return (
      '<article class="group relative ef-card overflow-hidden p-8 cursor-pointer" data-preview-url="' + esc(p.url) + '" data-preview-name="' + esc(p.name) + '" role="button" tabindex="0" aria-label="Open live preview of ' + esc(p.name) + '">' +
        '<div class="browser-mockup mb-6 relative">' +
          '<div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url-bar">' + esc(p.host) + '</span></div>' +
          '<div class="screen">' +
            '<img src="' + p.img + '" alt="' + esc(p.name) + ' screenshot" loading="lazy">' +
            '<div class="gradient-overlay"></div>' +
            '<div class="absolute bottom-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:var(--accent-soft)" aria-hidden="true">' + p.icon + '</div>' +
            '<span class="preview-tag">▶ Live preview</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="text-xl font-bold mb-2">' + esc(p.name) + '</h3>' +
        '<p class="text-sm mb-2 leading-relaxed" style="color:var(--text-dim)">' + esc(p.desc) + '</p>' +
        '<span class="text-sm font-semibold inline-flex items-center gap-1" style="color:var(--accent)">Open live preview <span aria-hidden="true">→</span></span>' +
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
