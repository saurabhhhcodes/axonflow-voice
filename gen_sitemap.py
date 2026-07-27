import os
from gen_longform_seo import COUNTRIES

BASE_URL = "https://axonflow.in"

urls = [
    ("/", "1.0", "weekly"),
    ("/what-we-do", "0.9", "monthly"),
    ("/case-studies", "0.9", "monthly"),
    ("/testimonials", "0.8", "monthly"),
    ("/open-source", "0.8", "monthly"),
    ("/blog", "0.9", "weekly"),
    ("/about-us", "0.8", "monthly"),
    ("/who-we-are", "0.8", "monthly"),
    ("/pricing", "0.9", "monthly"),
    ("/contact", "0.9", "monthly"),
    ("/agency", "0.8", "monthly"),
    ("/unified-platform", "0.8", "monthly"),
    ("/markets", "0.9", "weekly")
]

xml = ['<?xml version="1.0" encoding="UTF-8"?>']
xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
xml.append('        xmlns:xhtml="http://www.w3.org/1999/xhtml">')

for path, priority, freq in urls:
    xml.append('  <url>')
    xml.append(f'    <loc>{BASE_URL}{path}</loc>')
    xml.append('    <lastmod>2026-07-27</lastmod>')
    xml.append(f'    <changefreq>{freq}</changefreq>')
    xml.append(f'    <priority>{priority}</priority>')
    xml.append('  </url>')

for slug, country, flag, currency, region, tz, capital, subregion in COUNTRIES:
    xml.append('  <url>')
    xml.append(f'    <loc>{BASE_URL}/markets/{slug}</loc>')
    xml.append('    <lastmod>2026-07-27</lastmod>')
    xml.append('    <changefreq>monthly</changefreq>')
    xml.append('    <priority>0.85</priority>')
    xml.append('  </url>')

xml.append('</urlset>')

sitemap_content = '\n'.join(xml)

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap_content)

with open("frontend/sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap_content)

print(f"🎉 Generated full sitemap.xml with all {len(COUNTRIES)} country market pages!")
