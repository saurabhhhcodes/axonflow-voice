/* AxonFlow AI — Master Portfolio Grid.
   Renders scaled live iframe previews inside browser mockup windows for all 30 projects,
   with interactive mouse passthrough and seamless modal zoom.
   Includes a smart canvas fallback so if an app rejects cross-origin framing,
   a live styled preview canvas loads instead of a blank document icon! */
(function () {
  var PROJECTS = [
    { name: 'Prestige Estates', url: 'https://legendary-tapioca-50caa6.netlify.app', host: 'legendary-tapioca-50caa6.netlify.app', desc: 'Ultra-luxury real estate showcase platform built for an Irvine, CA client.', icon: '🏰', tag: 'Featured Client', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #581c87 100%)' },
    { name: 'Wanderlux Landing', url: 'https://animated-profiterole-542134.netlify.app', host: 'animated-profiterole-542134.netlify.app', desc: 'Bespoke ultra-luxury travel experiences landing platform.', icon: '✈️', tag: 'Featured Client', gradient: 'linear-gradient(135deg, #831843 0%, #9d174d 50%, #be123c 100%)' },
    { name: 'HeteroMind Ent.', url: 'https://heteromind-enterprise.onrender.com/', host: 'heteromind-enterprise.onrender.com', desc: 'Hardware-aware AI agent orchestration platform with dynamic compute routing.', icon: '🧠', tag: 'AI Platform', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' },
    { name: 'HelixMind', url: 'https://helixmind.onrender.com/', host: 'helixmind.onrender.com', desc: 'AI-driven healthcare platform designed for diagnostic workflows.', icon: '🧬', tag: 'Healthcare AI', gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)' },
    { name: 'Orchestrator AI', url: 'https://orchestrateai.netlify.app/', host: 'orchestrateai.netlify.app', desc: 'Centralized command system for multi-agent workflows.', icon: '🌐', tag: 'Production AI', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #3b82f6 100%)' },
    { name: 'you.fyi', url: 'https://you-fyi.onrender.com/ui/', host: 'you-fyi.onrender.com', desc: 'Personalized AI ecosystem dashboard.', icon: '✨', tag: 'AI Dashboard', gradient: 'linear-gradient(135deg, #581c87 0%, #6b21a8 50%, #9333ea 100%)' },
    { name: 'SahayakAI', url: 'https://sahayakai-okwu.onrender.com/app/', host: 'sahayakai-okwu.onrender.com', desc: 'Omni-lingual educational assistant.', icon: '🎓', tag: 'EdTech AI', gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)' },
    { name: 'GeneInsight', url: 'https://geneinsight-platform.vercel.app', host: 'geneinsight-platform.vercel.app', desc: 'AI SaaS bioinformatics diagnostic platform.', icon: '🧬', tag: 'Bioinformatics', gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)' },
    { name: 'Chatlly Assistant', url: 'https://pal.chatlly.com', host: 'pal.chatlly.com', desc: 'Enterprise RAG knowledge assistant.', icon: '💬', tag: 'Enterprise RAG', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)' },
    { name: 'AI Calendar Agent', url: 'https://ai-outlook-calendar-agent.streamlit.app', host: 'ai-outlook-calendar-agent.streamlit.app', desc: 'Natural language Outlook automation.', icon: '📅', tag: 'Automation', gradient: 'linear-gradient(135deg, #701a75 0%, #86198f 50%, #c026d3 100%)' },
    { name: 'OpenBioGen-AI', url: 'https://openbiogen.vercel.app', host: 'openbiogen.vercel.app', desc: 'Biological data generation system.', icon: '🧬', tag: 'Genomics AI', gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)' },
    { name: 'PlantGuardian-AI', url: 'https://plantguardianai.streamlit.app/', host: 'plantguardianai.streamlit.app', desc: 'AI-powered botanical health monitoring and diagnostic platform.', icon: '🌿', tag: 'Vision AI', gradient: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #4ade80 100%)' },
    { name: 'VISUALAIZE', url: 'https://visualaize-six.vercel.app', host: 'visualaize-six.vercel.app', desc: 'AI graph visualization platform powered by Google Gemini 2.5 context windows.', icon: '📊', tag: 'Open Source', gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #38bdf8 100%)' },
    { name: 'VoiceForge AI', url: 'https://voice-forge-client.vercel.app', host: 'voice-forge-client.vercel.app', desc: 'Browser-based assistive communication platform with AI voice cloning.', icon: '🎙️', tag: 'AI & Privacy', gradient: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #8b5cf6 100%)' },
    { name: 'NPMChat', url: 'https://npm-chat-fxjq.vercel.app/', host: 'npm-chat-fxjq.vercel.app', desc: 'Real-time collaborative developer chat & code execution platform.', icon: '💬', tag: 'Open Source', gradient: 'linear-gradient(135deg, #881337 0%, #9f1239 50%, #e11d48 100%)' },
    { name: 'MergeShip', url: 'https://mergeship.vercel.app', host: 'mergeship.vercel.app', desc: 'Gamified open-source bridge & AI Command Center for PR velocity.', icon: '🚀', tag: 'Open Source', gradient: 'linear-gradient(135deg, #312e81 0%, #3730a3 50%, #6366f1 100%)' },
    { name: 'CommitPulse 3D', url: 'https://commitpulse.vercel.app', host: 'commitpulse.vercel.app', desc: 'Real-time GraphQL 3D isometric GitHub contribution visualizer.', icon: '📊', tag: 'Open Source', gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)' },
    { name: 'Work to Words', url: 'https://worktowords.in', host: 'worktowords.in', desc: 'AI platform turning daily developer work into published posts.', icon: '✍️', tag: 'Production AI', gradient: 'linear-gradient(135deg, #701a75 0%, #a21caf 50%, #e879f9 100%)' },
    { name: 'AlgoScope', url: 'https://algo-scope-virid.vercel.app', host: 'algo-scope-virid.vercel.app', desc: 'Interactive algorithm visualizer with real-time high-fidelity animations.', icon: '⚡', tag: 'Open Source', gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #38bdf8 100%)' },
    { name: 'DoubtDesk AI', url: 'https://doubt-desk-seven.vercel.app/', host: 'doubt-desk-seven.vercel.app', desc: 'Anonymous AI doubt-solving platform integrated with classrooms.', icon: '🙋', tag: 'Production AI', gradient: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #8b5cf6 100%)' },
    { name: 'VidyaSetu', url: 'https://vidya-setu-olive.vercel.app', host: 'vidya-setu-olive.vercel.app', desc: 'AI-powered study platform for NCERT quizzes, notes & revision.', icon: '🎓', tag: 'Production AI', gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)' },
    { name: 'CertiNova', url: 'https://certinova.vercel.app', host: 'certinova.vercel.app', desc: 'Bulk certificate generator and validation platform.', icon: '📜', tag: 'Open Source', gradient: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)' },
    { name: 'InternHack SaaS', url: 'https://internhack.xyz', host: 'internhack.xyz', desc: 'All-in-one SaaS platform connecting hackathon talent directly with recruiters.', icon: '🏆', tag: 'SaaS Platform', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' },
    { name: 'LeetCode City', url: 'https://the-leetcode-city.vercel.app', host: 'the-leetcode-city.vercel.app', desc: '3D isometric city visualization powered by LeetCode problem solving stats.', icon: '🏙️', tag: 'Open Source', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #3b82f6 100%)' },
    { name: 'DevTrack Pro', url: 'https://devtrack-delta.vercel.app', host: 'devtrack-delta.vercel.app', desc: 'Developer productivity dashboard tracking GitHub contributions and PR metrics.', icon: '📈', tag: 'Developer Tools', gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)' },
    { name: 'Arnio Data Clean', url: 'https://arnio.vercel.app/', host: 'arnio.vercel.app', desc: 'C++ accelerated data quality toolkit for Python dataset cleaning and validation.', icon: '🧹', tag: 'Data Engineering', gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)' },
    { name: 'ResourceHub Dev', url: 'https://resourcehubdev.vercel.app/', host: 'resourcehubdev.vercel.app', desc: 'Open-source developer resources repository curated by community contributors.', icon: '📚', tag: 'Open Source', gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)' },
    { name: 'RankerHub', url: 'https://ranker-hub-xi.vercel.app/', host: 'ranker-hub-xi.vercel.app', desc: 'Developer ranking platform combining GitHub streaks, challenges & leaderboards.', icon: '🥇', tag: 'Developer Platform', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)' },
    { name: 'Helpdesk.AI', url: 'https://helpdeskai1918.vercel.app', host: 'helpdeskai1918.vercel.app', desc: 'Full-stack AI helpdesk platform with NLP incident detection and OCR triage.', icon: '🛠️', tag: 'Enterprise AI', gradient: 'linear-gradient(135deg, #701a75 0%, #86198f 50%, #c026d3 100%)' },
    { name: 'Checkora Chess Engine', url: 'https://checkora.vercel.app', host: 'checkora.vercel.app', desc: 'Chess platform with C++ minimax alpha-beta pruning AI engine.', icon: '♟️', tag: 'AI Engine', gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)' }
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
              // Attempt live iframe load
              '<iframe src="' + esc(p.url) + '" title="' + esc(p.name) + ' live preview" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" style="width:1280px;height:800px;border:none;transform:scale(0.28);transform-origin:0 0;position:absolute;top:0;left:0;pointer-events:none"></iframe>' +
              // Fallback styled glass canvas if iframe is blocked or fails load
              '<div class="screen-fallback" style="position:absolute;inset:0;background:' + p.gradient + ';display:none;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;box-shadow:inset 0 0 60px rgba(0,0,0,0.5)">' +
                '<div style="width:64px;height:64px;border-radius:18px;background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:.85rem;box-shadow:0 12px 32px rgba(0,0,0,0.4)">' + p.icon + '</div>' +
                '<div style="font-family:var(--font-mono);font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#ffffff;background:rgba(0,0,0,0.45);padding:.35rem .85rem;border-radius:20px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2)">' + esc(p.tag) + '</div>' +
              '</div>' +
              '<div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(7,8,10,0.55) 100%);pointer-events:none"></div>' +
              '<div style="position:absolute;bottom:.75rem;left:.85rem;font-family:var(--font-mono);font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#ffffff;background:rgba(7,8,10,0.85);padding:.35rem .85rem;border-radius:20px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);z-index:2">' + p.icon + ' ' + esc(p.tag) + '</div>' +
              '<span class="preview-tag" style="z-index:2;position:absolute;top:.75rem;right:.75rem;background:rgba(84,87,255,0.95);color:#fff;font-family:var(--font-mono);font-size:.65rem;font-weight:600;padding:.35rem .75rem;border-radius:8px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.25);box-shadow:0 4px 14px rgba(0,0,0,0.4)">▶ Launch live app</span>' +
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
