import os
import glob
from gen_longform_seo import COUNTRIES

BASE_URL = "https://axonflow.in"

# Core Pages
core_urls = [
    ("/", "1.0", "daily"),
    ("/what-we-do", "0.9", "weekly"),
    ("/case-studies", "0.9", "weekly"),
    ("/testimonials", "0.8", "monthly"),
    ("/open-source", "0.8", "weekly"),
    ("/blog", "0.9", "daily"),
    ("/about-us", "0.8", "monthly"),
    ("/who-we-are", "0.8", "monthly"),
    ("/pricing", "0.9", "weekly"),
    ("/contact", "0.9", "monthly"),
    ("/agency", "0.8", "monthly"),
    ("/unified-platform", "0.8", "monthly"),
    ("/markets", "0.9", "daily")
]

# Dedicated Projects
project_files = glob.glob("projects/*.html")
project_urls = [("/projects/" + os.path.splitext(os.path.basename(p))[0], "0.85", "weekly") for p in project_files]

# Deep Technology Blogs
blog_files = glob.glob("blog/*.html")
blog_urls = [("/blog/" + os.path.splitext(os.path.basename(b))[0], "0.85", "weekly") for b in blog_files]

xml = ['<?xml version="1.0" encoding="UTF-8"?>']
xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
xml.append('        xmlns:xhtml="http://www.w3.org/1999/xhtml">')

# Add Core URLs
for path, priority, freq in core_urls:
    xml.append('  <url>')
    xml.append(f'    <loc>{BASE_URL}{path}</loc>')
    xml.append('    <lastmod>2026-08-04</lastmod>')
    xml.append(f'    <changefreq>{freq}</changefreq>')
    xml.append(f'    <priority>{priority}</priority>')
    xml.append('  </url>')

# Add Project URLs
for path, priority, freq in project_urls:
    xml.append('  <url>')
    xml.append(f'    <loc>{BASE_URL}{path}</loc>')
    xml.append('    <lastmod>2026-08-04</lastmod>')
    xml.append(f'    <changefreq>{freq}</changefreq>')
    xml.append(f'    <priority>{priority}</priority>')
    xml.append('  </url>')

# Add Blog URLs
for path, priority, freq in blog_urls:
    xml.append('  <url>')
    xml.append(f'    <loc>{BASE_URL}{path}</loc>')
    xml.append('    <lastmod>2026-08-04</lastmod>')
    xml.append(f'    <changefreq>{freq}</changefreq>')
    xml.append(f'    <priority>{priority}</priority>')
    xml.append('  </url>')

# Add 195 Country Market URLs
for slug, country, flag, currency, region, tz, capital, subregion in COUNTRIES:
    xml.append('  <url>')
    xml.append(f'    <loc>{BASE_URL}/markets/{slug}</loc>')
    xml.append('    <lastmod>2026-08-04</lastmod>')
    xml.append('    <changefreq>monthly</changefreq>')
    xml.append('    <priority>0.85</priority>')
    xml.append('  </url>')

xml.append('</urlset>')

sitemap_content = '\n'.join(xml)

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap_content)

with open("frontend/sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap_content)

total_entries = len(core_urls) + len(project_urls) + len(blog_urls) + len(COUNTRIES)
print(f"🎉 Generated full comprehensive sitemap.xml with all {total_entries} indexed URLs!")
