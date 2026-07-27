import os, re

BASE = "/Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/autonomiq-website"

# CORRECT REGEX: match the full nav div block up to the matching </div></div></nav>
# Instead of using a greedy-match regex that eats content,
# we replace the full <nav class="ef-nav"> block correctly.

NEW_NAV_INNER = """<div class="wrap ef-nav-bar">
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
<a href="/who-we-are" class="ef-navlink" role="menuitem">Who We Are</a>
<a href="/pricing" class="ef-navlink" role="menuitem">Pricing</a>
<a href="/contact" class="ef-cta" role="menuitem">Talk to us</a>
</div>
</div>"""

NAV_JS = """<script>
(function(){
  var btn = document.getElementById('efMenuToggle');
  var menu = document.getElementById('efNavMenu');
  if(btn && menu){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function(e){
      if(!menu.contains(e.target) && !btn.contains(e.target)){
        menu.classList.remove('open');
      }
    });
  }
})();
</script>"""

# Match the FULL nav block: from <nav class="ef-nav" ...> to </nav>
# We replace the interior of the .ef-nav-bar div only to be safe
NAV_BAR_REGEX = re.compile(
    r'(<nav[^>]*class="ef-nav"[^>]*>)\s*.*?(<\/nav>)',
    re.DOTALL
)

def build_full_nav(m):
    nav_open = m.group(1)
    nav_close = m.group(2)
    return f'{nav_open}\n{NEW_NAV_INNER}\n{NAV_JS}\n{nav_close}'

count = 0
skipped = 0
for root, dirs, files in os.walk(BASE):
    # Skip git internals, node_modules, hidden dirs
    dirs[:] = [d for d in dirs if d not in ['.git', '.netlify', 'node_modules', '__pycache__']]
    for file in files:
        if not file.endswith(".html"):
            continue
        p = os.path.join(root, file)
        # Skip CRM login/dashboard which has their own nav
        if 'crm' in file.lower():
            continue
        try:
            with open(p, "r", encoding="utf-8") as f:
                content = f.read()
            if 'class="ef-nav"' not in content:
                skipped += 1
                continue
            updated = NAV_BAR_REGEX.sub(build_full_nav, content)
            if updated != content:
                with open(p, "w", encoding="utf-8") as f:
                    f.write(updated)
                count += 1
        except Exception as e:
            print(f"  SKIP {p}: {e}")

print(f"✅ Fixed mobile nav across {count} HTML pages. Skipped {skipped} pages without ef-nav.")
