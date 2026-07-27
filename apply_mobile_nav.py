import os, re

BASE = "/Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/autonomiq-website"

NEW_NAV = """<div class="wrap" style="height:4rem;display:flex;align-items:center;justify-content:space-between">
<a href="/" aria-label="AxonFlow AI Home" style="display:flex;align-items:center;gap:.625rem;flex-shrink:0">
<img src="/assets/logo_pro.png" alt="AxonFlow AI" style="height:2rem;width:2rem">
<span class="ef-display" style="font-size:1rem;font-weight:700;letter-spacing:-.01em">AxonFlow AI</span>
</a>
<button class="ef-menu-toggle" id="efMenuToggle" aria-label="Toggle navigation menu">
<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>
</button>
<div class="ef-nav-menu" id="efNavMenu" role="menubar">
<a href="/" class="ef-navlink" role="menuitem">Home</a>
<a href="/what-we-do" class="ef-navlink" role="menuitem">Services</a>
<a href="/case-studies" class="ef-navlink" role="menuitem">Case Studies</a>
<a href="/testimonials" class="ef-navlink" role="menuitem">Testimonials</a>
<a href="/open-source" class="ef-navlink" role="menuitem">Open Source</a>
<a href="/blog" class="ef-navlink" role="menuitem">Blog</a>
<a href="/about-us" class="ef-navlink" role="menuitem">About</a>
<a href="/pricing" class="ef-navlink" role="menuitem">Pricing</a>
<a href="/contact" class="ef-cta" role="menuitem">Talk to us</a>
</div>
</div>
<script>
(function(){
  var btn = document.getElementById('efMenuToggle');
  var menu = document.getElementById('efNavMenu');
  if(btn && menu){
    btn.addEventListener('click', function(){
      menu.classList.toggle('open');
    });
  }
})();
</script>"""

NAV_WRAP_REGEX = re.compile(r'<div class="wrap" style="height:4rem;display:flex;align-items:center;justify-content:space-between">.*?</div>', re.DOTALL)

count = 0
for root, dirs, files in os.walk(BASE):
    if ".git" in root or ".netlify" in root:
        continue
    for file in files:
        if file.endswith(".html"):
            p = os.path.join(root, file)
            with open(p, "r", encoding="utf-8") as f:
                content = f.read()
            if NAV_WRAP_REGEX.search(content):
                updated = NAV_WRAP_REGEX.sub(NEW_NAV, content)
                with open(p, "w", encoding="utf-8") as f:
                    f.write(updated)
                count += 1

print(f"Updated mobile hamburger navigation & JS drawer across {count} HTML pages!")
