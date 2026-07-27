import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_nav_pattern = re.compile(r'<nav class="ef-nav" aria-label="Main navigation">.*?</nav>', re.DOTALL)
new_nav = """<nav class="ef-nav" aria-label="Main navigation">
<div class="wrap" style="height:4rem;display:flex;align-items:center;justify-content:space-between">
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
</script>
</nav>"""

content = old_nav_pattern.sub(new_nav, content)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated root index.html with mobile responsive nav!")
