with open("gen_master.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = None
end_idx = None

for i, l in enumerate(lines):
    if '# 2. CASE STUDIES' in l:
        start_idx = i
    if start_idx is not None and i > start_idx and 'write_both("case-studies/index.html", case_studies)' in l:
        end_idx = i
        break

print(f"Replacing lines {start_idx} to {end_idx}")

new_case_studies_block = [
'# 2. CASE STUDIES (Live Systems Portfolio Modal Grid)\n',
'case_studies = HEAD("Case Studies & Live Production Deployments | AxonFlow AI",\n',
'    "Explore live production systems engineered by AxonFlow AI. Click any project to launch its live working preview inline.",\n',
'    "/case-studies",\n',
'    """\n',
'.browser-mockup { border-radius: 12px; background: var(--surface); border: 1px solid var(--border-strong); overflow: hidden; position: relative; }\n',
'.browser-mockup .bar { background: rgba(255,255,255,0.03); padding: .5rem .75rem; display: flex; align-items: center; gap: .4rem; border-bottom: 1px solid var(--border); }\n',
'.browser-mockup .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-strong); }\n',
'.browser-mockup .url-bar { font-family: var(--font-mono); font-size: .68rem; color: var(--text-dim); margin-left: .5rem; background: rgba(0,0,0,0.3); padding: .15rem .6rem; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n',
'.browser-mockup .screen { height: 210px; position: relative; overflow: hidden; background: #040507; display: flex; align-items: center; justify-content: center; }\n',
'.browser-mockup .screen img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .4s ease; }\n',
'.ef-card:hover .browser-mockup .screen img { transform: scale(1.04); }\n',
'.preview-tag { position: absolute; top: .75rem; right: .75rem; background: var(--accent); color: #fff; font-family: var(--font-mono); font-size: .65rem; font-weight: 600; padding: .35rem .75rem; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; gap: .35rem; }\n',
'""") + """\n',
'<section class="page-hero">\n',
'<div class="wrap inner">\n',
'<div class="ef-eyebrow" style="margin-bottom:1.5rem">Live Systems Portfolio</div>\n',
'<h1 class="hero-h1">Portfolio you can open, <br><span class="accent">not just read about.</span></h1>\n',
'<p class="hero-p">Click any project to load it live, right here in an inline interactive modal — no new tab required.</p>\n',
'</div>\n',
'</section>\n',
'\n',
'<div class="ef-rail wrap" style="padding-left:1.5rem;padding-right:1.5rem">\n',
'<span><span class="dot-live"></span>12 Interactive Production Projects</span>\n',
'<span>&middot;</span><span>Click to Test Live Systems</span>\n',
'<span>&middot;</span><span>6-Month Post-Launch SLA</span>\n',
'</div>\n',
'\n',
'<section class="section">\n',
'<div class="wrap">\n',
'<div class="grid-3" style="gap:2rem;margin-bottom:4rem" id="portfolio-grid">\n',
'<!-- Live cards injected via JS -->\n',
'</div>\n',
'\n',
'<div class="cta-block">\n',
'<h2 class="section-title">Want Us to Build a Similar <span class="accent">Live System for You?</span></h2>\n',
'<p class="hero-p" style="margin:0 auto 2rem">Speak directly with our lead solution architects and senior developers.</p>\n',
'<a href="/contact" class="ef-btn-primary">Schedule Scoping Call &rarr;</a>\n',
'</div>\n',
'</div>\n',
'</section>\n',
'<script src="/js/portfolio-modal.js" defer></script>\n',
'<script src="/js/portfolio-data.js" defer></script>\n',
'""" + FOOTER\n',
'\n',
'write_both("case-studies/index.html", case_studies)\n'
]

lines[start_idx:end_idx+1] = new_case_studies_block

with open("gen_master.py", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("🎉 gen_master.py patched cleanly!")
