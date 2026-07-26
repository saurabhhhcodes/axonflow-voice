#!/usr/bin/env python3
"""Generates differentiated market pages for AxonFlow AI.

Deliberately NOT one page per country (that's a doorway-page pattern that
gets sites penalized). Instead: a small set of markets where AxonFlow AI
can realistically deliver, each with genuinely different content —
currency, working-hours overlap, relevant compliance framework, and the
most relevant portfolio project for that market's buyer.
"""
import os

MARKETS = [
    {
        "slug": "united-states",
        "name": "United States",
        "flag": "🇺🇸",
        "currency": "USD",
        "overlap": "9:30 AM – 12:30 PM ET overlaps with our team's evening hours (IST) — same-day standups are normal, not a stretch.",
        "compliance": "We build with SOC 2-aligned logging and access controls from day one, and can work inside your existing AWS/GCP compliance boundary.",
        "case_study": "GeneInsight",
        "case_url": "https://geneinsight-platform.vercel.app",
        "case_desc": "a bioinformatics SaaS platform built for a US life-sciences team, now running in production.",
        "pitch": "US teams come to us for agent systems that need to survive an actual audit — not just a demo.",
    },
    {
        "slug": "united-kingdom",
        "name": "United Kingdom",
        "flag": "🇬🇧",
        "currency": "GBP",
        "overlap": "Greenwich Mean Time overlaps directly with the back half of our working day — afternoon UK calls land in our evening, same day.",
        "compliance": "UK GDPR-aware data handling by default: EU/UK data residency options, and retrieval systems that don't silently ship customer data to third-party training pipelines.",
        "case_study": "Chatlly Assistant",
        "case_url": "https://pal.chatlly.com",
        "case_desc": "an enterprise RAG knowledge assistant built for teams that need cited, auditable answers, not confident guesses.",
        "pitch": "UK clients typically start with a RAG or knowledge-assistant build, then extend into agentic automation once trust is established.",
    },
    {
        "slug": "uae",
        "name": "United Arab Emirates",
        "flag": "🇦🇪",
        "currency": "AED",
        "overlap": "Gulf Standard Time sits only 1.5 hours behind IST — the easiest overlap window we have, essentially a full shared working day.",
        "compliance": "Built with UAE PDPL data-handling principles in mind, and comfortable operating inside free-zone (DIFC/ADGM) corporate structures common to Gulf clients.",
        "case_study": "Orchestrator AI",
        "case_url": "https://orchestrateai.netlify.app/",
        "case_desc": "a centralized command system coordinating multiple autonomous agents — the pattern most Gulf enterprise clients ask for first.",
        "pitch": "Our closest timezone overlap of any market — most UAE engagements run with near-real-time collaboration, not async handoffs.",
    },
    {
        "slug": "singapore",
        "name": "Singapore",
        "flag": "🇸🇬",
        "currency": "SGD",
        "overlap": "SGT is 2.5 hours ahead of IST — mornings in Singapore line up with our late morning, giving a clean daily sync window.",
        "compliance": "Designed around Singapore's PDPA principles, with architecture choices (self-hosted retrieval, regional model routing) that keep sensitive data in-region on request.",
        "case_study": "HeteroMind Enterprise",
        "case_url": "https://heteromind-enterprise.onrender.com/",
        "case_desc": "a hardware-aware agent orchestration platform built for teams optimizing compute cost across regions — a common APAC priority.",
        "pitch": "Singapore engagements tend to prioritize cost-aware infrastructure and multi-region routing over flashy demos.",
    },
    {
        "slug": "canada",
        "name": "Canada",
        "flag": "🇨🇦",
        "currency": "CAD",
        "overlap": "Eastern Canada's morning hours land in our late evening — most Canadian clients run on a structured async cadence with a weekly live sync.",
        "compliance": "PIPEDA-aware data practices, with a preference for architectures that keep client data inside client-owned infrastructure wherever possible.",
        "case_study": "HelixMind",
        "case_url": "https://helixmind.onrender.com/",
        "case_desc": "an AI-driven healthcare platform built for diagnostic workflows — relevant experience for Canada's health-tech and public-sector buyers.",
        "pitch": "Canadian engagements often start in healthcare, public-sector-adjacent, or regulated industries, where auditability matters more than speed.",
    },
    {
        "slug": "australia",
        "name": "Australia",
        "flag": "🇦🇺",
        "currency": "AUD",
        "overlap": "AEST is 4.5 hours ahead of IST — Australian mornings overlap with our afternoon, a workable same-day window for most projects.",
        "compliance": "Built with the Australian Privacy Principles in mind, and happy to work inside client-managed cloud environments rather than shipping data offshore by default.",
        "case_study": "SahayakAI",
        "case_url": "https://sahayakai-okwu.onrender.com/app/",
        "case_desc": "an omni-lingual educational assistant — evidence of building for linguistically diverse user bases, a recurring ANZ requirement.",
        "pitch": "Australian clients frequently ask for multilingual or accessibility-first agents; it's a genuine specialty of ours.",
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AxonFlow AI in {name} | Enterprise AI Agents &amp; RAG Systems</title>
    <meta name="description" content="AxonFlow AI delivers autonomous agent systems and enterprise RAG for {name}-based teams. {pitch}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://axonflow.in/markets/{slug}/">
    <link rel="icon" type="image/png" href="/assets/logo_pro.png">
    <meta name="theme-color" content="#07080a">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://axonflow.in/markets/{slug}/">
    <meta property="og:title" content="AxonFlow AI in {name}">
    <meta property="og:description" content="{pitch}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/enterprise.css">
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AxonFlow AI",
        "url": "https://axonflow.in/markets/{slug}/",
        "areaServed": "{name}",
        "sameAs": ["https://axonflow.in"]
    }}
    </script>
</head>
<body class="ef-body antialiased">
    <header>
        <nav class="ef-nav" aria-label="Main navigation">
            <div class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <a href="/" class="flex items-center space-x-2 shrink-0" aria-label="AxonFlow AI Home">
                    <img src="/assets/logo_pro.png" alt="AxonFlow AI" class="h-8 w-8" width="32" height="32">
                    <span class="ef-display text-base font-bold tracking-tight">AxonFlow AI</span>
                </a>
                <div class="hidden lg:flex items-center space-x-5 text-xs font-medium">
                    <a href="/" class="ef-navlink">Home</a>
                    <a href="/#services" class="ef-navlink">Services</a>
                    <a href="/#portfolio" class="ef-navlink">Portfolio</a>
                    <a href="/about-us" class="ef-navlink">About</a>
                    <a href="/what-we-do" class="ef-navlink">What We Do</a>
                    <a href="/who-we-are" class="ef-navlink">Who We Are</a>
                    <a href="/case-studies" class="ef-navlink">Case Studies</a>
                    <a href="/testimonials" class="ef-navlink">Testimonials</a>
                    <a href="/pricing" class="ef-navlink">Pricing</a>
                    <a href="/careers/" class="ef-navlink">Careers</a>
                    <a href="/blog" class="ef-navlink">Blog</a>
                    <a href="/contact" class="ef-cta py-1.5 px-3 text-xs">Talk to us</a>
                </div>
            </div>
        </nav>
    </header>
    <main class="pt-40 pb-24">
        <div class="max-w-4xl mx-auto px-6">
            <div class="ef-eyebrow mb-6">{flag} AxonFlow AI — {name}</div>
            <h1 class="ef-display text-5xl md:text-6xl font-semibold mb-8 leading-tight">Enterprise AI systems for teams in {name}</h1>
            <p class="text-xl mb-12 leading-relaxed" style="color:var(--text-dim)">{pitch}</p>

            <div class="grid md:grid-cols-2 gap-6 mb-16">
                <div class="ef-card p-8">
                    <div class="ef-mono text-xs mb-3" style="color:var(--accent)">TIMEZONE OVERLAP</div>
                    <p style="color:var(--text-dim)">{overlap}</p>
                </div>
                <div class="ef-card p-8">
                    <div class="ef-mono text-xs mb-3" style="color:var(--accent)">DATA &amp; COMPLIANCE</div>
                    <p style="color:var(--text-dim)">{compliance}</p>
                </div>
            </div>

            <div class="ef-card p-8 mb-16" data-preview-url="{case_url}" data-preview-name="{case_study}" role="button" tabindex="0" style="cursor:pointer">
                <div class="ef-mono text-xs mb-3" style="color:var(--accent-2)">RELEVANT WORK</div>
                <h3 class="text-2xl font-bold mb-3">{case_study}</h3>
                <p class="mb-4" style="color:var(--text-dim)">{case_desc}</p>
                <span class="text-sm font-semibold" style="color:var(--accent)">Open live preview →</span>
            </div>

            <div class="ef-card p-10 text-center">
                <h3 class="text-2xl font-bold mb-4">Pricing in {currency}</h3>
                <p class="mb-8" style="color:var(--text-dim)">We quote and invoice in {currency} for {name}-based clients on request. Every engagement includes 6 months of post-launch support.</p>
                <a href="/contact" class="ef-btn-primary">Start a conversation →</a>
            </div>
        </div>
    </main>
    <footer class="ef-footer py-16" role="contentinfo">
        <div class="max-w-7xl mx-auto px-6 text-center text-sm" style="color:var(--text-faint)">
            <p>&copy; 2026 AxonFlow AI. MSME UDYAM-UP-50-0236406. <a href="/" class="underline">axonflow.in</a></p>
        </div>
    </footer>
    <script src="/js/portfolio-modal.js" defer></script>
</body>
</html>
"""

INDEX_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AxonFlow AI — Markets We Serve Worldwide</title>
    <meta name="description" content="AxonFlow AI delivers enterprise AI agent and RAG systems to clients across India, North America, Europe, the Gulf, and Asia-Pacific.">
    <link rel="canonical" href="https://axonflow.in/markets/">
    <link rel="icon" type="image/png" href="/assets/logo_pro.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/enterprise.css">
</head>
<body class="ef-body antialiased">
    <header>
        <nav class="ef-nav" aria-label="Main navigation">
            <div class="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                <a href="/" class="flex items-center space-x-3" aria-label="AxonFlow AI Home">
                    <img src="/assets/logo_pro.png" alt="AxonFlow AI" class="h-9" width="36" height="36">
                    <span class="ef-display text-lg font-semibold tracking-tight">AxonFlow AI</span>
                </a>
                <a href="/contact" class="ef-cta">Talk to us</a>
            </div>
        </nav>
    </header>
    <main class="pt-40 pb-24">
        <div class="max-w-5xl mx-auto px-6">
            <div class="ef-eyebrow mb-6">Global</div>
            <h1 class="ef-display text-5xl font-semibold mb-6">Markets we serve</h1>
            <p class="text-lg mb-16 max-w-2xl" style="color:var(--text-dim)">India-headquartered, built for global engagements. Pick your market for local timezone overlap, compliance notes, and pricing in your currency.</p>
            <div class="grid md:grid-cols-3 gap-6">
                {cards}
            </div>
        </div>
    </main>
    <footer class="ef-footer py-16" role="contentinfo">
        <div class="max-w-7xl mx-auto px-6 text-center text-sm" style="color:var(--text-faint)">
            <p>&copy; 2026 AxonFlow AI. <a href="/" class="underline">axonflow.in</a></p>
        </div>
    </footer>
</body>
</html>
"""

def main():
    base = os.path.dirname(os.path.abspath(__file__))
    cards = []
    for m in MARKETS:
        d = os.path.join(base, m["slug"])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w") as f:
            f.write(TEMPLATE.format(**m))
        cards.append(
            f'<a href="/markets/{m["slug"]}/" class="ef-card p-8 block">'
            f'<div class="text-3xl mb-4">{m["flag"]}</div>'
            f'<h3 class="text-xl font-bold mb-2">{m["name"]}</h3>'
            f'<span class="text-sm" style="color:var(--accent)">View details →</span></a>'
        )
    with open(os.path.join(base, "index.html"), "w") as f:
        f.write(INDEX_TEMPLATE.format(cards="\n                ".join(cards)))
    print(f"Generated {len(MARKETS)} market pages + index.")

if __name__ == "__main__":
    main()
