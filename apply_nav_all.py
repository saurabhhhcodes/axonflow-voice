import os, re

BASE = "/Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/autonomiq-website"

NEW_NAV = """<div style="display:flex;align-items:center;gap:1.1rem;font-size:.78rem;font-weight:500" role="menubar">
<a href="/" class="ef-navlink" role="menuitem">Home</a>
<a href="/what-we-do" class="ef-navlink" role="menuitem">Services</a>
<a href="/case-studies" class="ef-navlink" role="menuitem">Case Studies</a>
<a href="/testimonials" class="ef-navlink" role="menuitem">Testimonials</a>
<a href="/open-source" class="ef-navlink" role="menuitem">Open Source</a>
<a href="/blog" class="ef-navlink" role="menuitem">Blog</a>
<a href="/about-us" class="ef-navlink" role="menuitem">About</a>
<a href="/pricing" class="ef-navlink" role="menuitem">Pricing</a>
<a href="/contact" class="ef-cta" style="padding:.45rem 1.1rem;font-size:.78rem" role="menuitem">Talk to us</a>
</div>"""

NAV_REGEX = re.compile(r'<div style="display:flex;align-items:center;gap:[^"]+" role="menubar">.*?</div>', re.DOTALL)

count = 0
for root, dirs, files in os.walk(BASE):
    if ".git" in root or ".netlify" in root:
        continue
    for file in files:
        if file.endswith(".html"):
            p = os.path.join(root, file)
            with open(p, "r", encoding="utf-8") as f:
                content = f.read()
            if NAV_REGEX.search(content):
                updated = NAV_REGEX.sub(NEW_NAV, content)
                with open(p, "w", encoding="utf-8") as f:
                    f.write(updated)
                count += 1

print(f"Updated header navigation bar across {count} HTML pages!")
