/* AxonFlow AI — Master Portfolio Grid.
   Renders ultra-sleek, pixel-perfect cards with curated gradient cover art, 
   crisp tech badges, and instant modal preview triggers. */
(function () {
  var PROJECTS = [
    { name: 'HeteroMind Ent.', url: 'https://heteromind-enterprise.onrender.com/', host: 'heteromind-enterprise.onrender.com', desc: 'Hardware-aware AI agent orchestration platform with dynamic compute routing.', icon: '🧠', tag: 'AI Platform', gradient: 'linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)' },
    { name: 'HelixMind', url: 'https://helixmind.onrender.com/', host: 'helixmind.onrender.com', desc: 'AI-driven healthcare platform designed for diagnostic workflows.', icon: '🧬', tag: 'Healthcare AI', gradient: 'linear-gradient(135deg, #064e3b, #047857, #10b981)' },
    { name: 'Orchestrator AI', url: 'https://orchestrateai.netlify.app/', host: 'orchestrateai.netlify.app', desc: 'Centralized command system for multi-agent workflows.', icon: '🌐', tag: 'Production AI', gradient: 'linear-gradient(135deg, #0f172a, #1e293b, #3b82f6)' },
    { name: 'you.fyi', url: 'https://you-fyi.onrender.com/ui/', host: 'you-fyi.onrender.com', desc: 'Personalized AI ecosystem dashboard.', icon: '✨', tag: 'AI Dashboard', gradient: 'linear-gradient(135deg, #581c87, #6b21a8, #9333ea)' },
    { name: 'SahayakAI', url: 'https://sahayakai-okwu.onrender.com/app/', host: 'sahayakai-okwu.onrender.com', desc: 'Omni-lingual educational assistant.', icon: '🎓', tag: 'EdTech AI', gradient: 'linear-gradient(135deg, #7c2d12, #9a3412, #ea580c)' },
    { name: 'GeneInsight', url: 'https://geneinsight-platform.vercel.app', host: 'geneinsight-platform.vercel.app', desc: 'AI SaaS bioinformatics diagnostic platform.', icon: '🧬', tag: 'Bioinformatics', gradient: 'linear-gradient(135deg, #14532d, #15803d, #22c55e)' },
    { name: 'Chatlly Assistant', url: 'https://pal.chatlly.com', host: 'pal.chatlly.com', desc: 'Enterprise RAG knowledge assistant.', icon: '💬', tag: 'Enterprise RAG', gradient: 'linear-gradient(135deg, #1e3a8a, #1d4ed8, #3b82f6)' },
    { name: 'AI Calendar Agent', url: 'https://ai-outlook-calendar-agent.streamlit.app', host: 'ai-outlook-calendar-agent.streamlit.app', desc: 'Natural language Outlook automation.', icon: '📅', tag: 'Automation', gradient: 'linear-gradient(135deg, #701a75, #86198f, #c026d3)' },
    { name: 'OpenBioGen-AI', url: 'https://openbiogen.vercel.app', host: 'openbiogen.vercel.app', desc: 'Biological data generation system.', icon: '🧬', tag: 'Genomics AI', gradient: 'linear-gradient(135deg, #065f46, #059669, #34d399)' },
    { name: 'Smart Plant Care', url: 'https://smart-plant-care-langchain.streamlit.app/', host: 'smart-plant-care-langchain.streamlit.app', desc: 'AI-powered plant health monitoring.', icon: '🌿', tag: 'Vision AI', gradient: 'linear-gradient(135deg, #166534, #15803d, #4ade80)' },
    { name: 'NPMChat', url: 'https://npm-chat-fxjq.vercel.app/', host: 'npm-chat-fxjq.vercel.app', desc: 'Real-time collaborative developer chat & code execution platform.', icon: '💬', tag: 'Open Source', gradient: 'linear-gradient(135deg, #881337, #9f1239, #e11d48)' },
    { name: 'MergeShip', url: 'https://mergeship.vercel.app', host: 'mergeship.vercel.app', desc: 'Gamified open-source bridge & AI Command Center for PR velocity.', icon: '🚀', tag: 'Open Source', gradient: 'linear-gradient(135deg, #312e81, #3730a3, #6366f1)' },
    { name: 'CommitPulse 3D', url: 'https://commitpulse.vercel.app', host: 'commitpulse.vercel.app', desc: 'Real-time GraphQL 3D isometric GitHub contribution visualizer.', icon: '📊', tag: 'Open Source', gradient: 'linear-gradient(135deg, #1e293b, #334155, #64748b)' },
    { name: 'Work to Words', url: 'https://worktowords.in', host: 'worktowords.in', desc: 'AI platform turning daily developer work into published posts.', icon: '✍️', tag: 'Production AI', gradient: 'linear-gradient(135deg, #701a75, #a21caf, #e879f9)' },
    { name: 'AlgoScope', url: 'https://algo-scope-virid.vercel.app', host: 'algo-scope-virid.vercel.app', desc: 'Interactive algorithm visualizer with real-time high-fidelity animations.', icon: '⚡', tag: 'Open Source', gradient: 'linear-gradient(135deg, #0284c7, #0369a1, #38bdf8)' },
    { name: 'DoubtDesk AI', url: 'https://doubt-desk-seven.vercel.app/', host: 'doubt-desk-seven.vercel.app', desc: 'Anonymous AI doubt-solving platform integrated with classrooms.', icon: '🙋', tag: 'Production AI', gradient: 'linear-gradient(135deg, #4c1d95, #5b21b6, #8b5cf6)' },
    { name: 'VidyaSetu', url: 'https://vidya-setu-olive.vercel.app', host: 'vidya-setu-olive.vercel.app', desc: 'AI-powered study platform for NCERT quizzes, notes & revision.', icon: '🎓', tag: 'Production AI', gradient: 'linear-gradient(135deg, #b45309, #d97706, #f59e0b)' },
    { name: 'CertiNova', url: 'https://certinova.vercel.app', host: 'certinova.vercel.app', desc: 'Bulk certificate generator and validation platform.', icon: '📜', tag: 'Open Source', gradient: 'linear-gradient(135deg, #047857, #059669, #10b981)' },
    { name: 'Prestige Estates', url: 'https://legendary-tapioca-50caa6.netlify.app', host: 'legendary-tapioca-50caa6.netlify.app', desc: 'Ultra-luxury real estate showcase platform built for an Irvine, CA client.', icon: '🏰', tag: 'Client Project', gradient: 'linear-gradient(135deg, #1e1b4b, #2e1065, #581c87)' },
    { name: 'Wanderlux Landing', url: 'https://animated-profiterole-542134.netlify.app', host: 'animated-profiterole-542134.netlify.app', desc: 'Bespoke ultra-luxury travel experiences landing platform.', icon: '✈️', tag: 'Client Project', gradient: 'linear-gradient(135deg, #831843, #9d174d, #be123c)' }
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function card(p) {
    return (
      '<article class="group relative ef-card overflow-hidden p-6 cursor-pointer" data-preview-url="' + esc(p.url) + '" data-preview-name="' + esc(p.name) + '" role="button" tabindex="0" aria-label="Open live preview of ' + esc(p.name) + '">' +
        '<div class="browser-mockup mb-5 relative">' +
          '<div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url-bar">' + esc(p.host) + '</span></div>' +
          '<div class="screen" style="position:relative;height:210px;background:' + p.gradient + ';display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;box-shadow:inset 0 0 60px rgba(0,0,0,0.5)">' +
            '<div style="width:64px;height:64px;border-radius:16px;background:rgba(255,255,255,0.12);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:1rem;box-shadow:0 8px 24px rgba(0,0,0,0.3)">' + p.icon + '</div>' +
            '<div style="font-family:var(--font-mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.9);background:rgba(0,0,0,0.35);padding:.3rem .75rem;border-radius:20px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15)">' + esc(p.tag) + '</div>' +
            '<span class="preview-tag" style="z-index:2;position:absolute;top:.75rem;right:.75rem;background:rgba(84,87,255,0.9);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.2)">▶ Live preview</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="text-xl font-bold mb-2">' + esc(p.name) + '</h3>' +
        '<p class="text-sm mb-4 leading-relaxed" style="color:var(--text-dim)">' + esc(p.desc) + '</p>' +
        '<span class="text-sm font-semibold inline-flex items-center gap-1" style="color:var(--accent)">Launch live interactive app <span aria-hidden="true">→</span></span>' +
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
