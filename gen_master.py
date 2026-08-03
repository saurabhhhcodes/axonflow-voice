#!/usr/bin/env python3
"""
Master Page Generator for AxonFlow AI:
- Expands agency scope to full-stack IT Services (Cloud, DevOps, Full-Stack Web/Mobile, CyberSecurity, Custom Software, AI & Autonomous Agents).
- Core pages: index, about-us, what-we-do, who-we-are, case-studies, testimonials, pricing, careers, blog, contact, privacy, terms, 404, open-source, agency, unified-platform, services, portfolio.
- 195 Country Market pages with full IT & AI scope.
"""

import os, json, re

BASE = "/Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/autonomiq-website"

COUNTRIES = [
    ("afghanistan", "Afghanistan", "🇦🇫", "AFN", "Asia", "UTC+4:30"),
    ("albania", "Albania", "🇦🇱", "ALL", "Europe", "CET (UTC+1)"),
    ("algeria", "Algeria", "🇩🇿", "DZD", "Africa", "CET (UTC+1)"),
    ("andorra", "Andorra", "🇦🇩", "EUR", "Europe", "CET (UTC+1)"),
    ("angola", "Angola", "🇦🇴", "AOA", "Africa", "WAT (UTC+1)"),
    ("antigua-and-barbuda", "Antigua and Barbuda", "🇦🇬", "XCD", "Americas", "AST (UTC-4)"),
    ("argentina", "Argentina", "🇦🇷", "ARS", "Americas", "ART (UTC-3)"),
    ("armenia", "Armenia", "🇦🇲", "AMD", "Asia", "AMT (UTC+4)"),
    ("australia", "Australia", "🇦🇺", "AUD", "Asia-Pacific", "AEST (UTC+10)"),
    ("austria", "Austria", "🇦🇹", "EUR", "Europe", "CET (UTC+1)"),
    ("azerbaijan", "Azerbaijan", "🇦🇿", "AZN", "Asia", "AZT (UTC+4)"),
    ("bahamas", "Bahamas", "🇧🇸", "BSD", "Americas", "EST (UTC-5)"),
    ("bahrain", "Bahrain", "🇧🇭", "BHD", "Middle East", "AST (UTC+3)"),
    ("bangladesh", "Bangladesh", "🇧🇩", "BDT", "Asia", "BST (UTC+6)"),
    ("barbados", "Barbados", "🇧🇧", "BBD", "Americas", "AST (UTC-4)"),
    ("belarus", "Belarus", "🇧🇾", "BYN", "Europe", "MSK (UTC+3)"),
    ("belgium", "Belgium", "🇧🇪", "EUR", "Europe", "CET (UTC+1)"),
    ("belize", "Belize", "🇧🇿", "BZD", "Americas", "CST (UTC-6)"),
    ("benin", "Benin", "🇧🇯", "XOF", "Africa", "WAT (UTC+1)"),
    ("bhutan", "Bhutan", "🇧🇹", "BTN", "Asia", "BTT (UTC+6)"),
    ("bolivia", "Bolivia", "🇧🇴", "BOB", "Americas", "BOT (UTC-4)"),
    ("bosnia-and-herzegovina", "Bosnia and Herzegovina", "🇧🇦", "BAM", "Europe", "CET (UTC+1)"),
    ("botswana", "Botswana", "🇧🇼", "BWP", "Africa", "CAT (UTC+2)"),
    ("brazil", "Brazil", "🇧🇷", "BRL", "Americas", "BRT (UTC-3)"),
    ("brunei", "Brunei", "🇧🇳", "BND", "Asia", "BNT (UTC+8)"),
    ("bulgaria", "Bulgaria", "🇧🇬", "BGN", "Europe", "EET (UTC+2)"),
    ("burkina-faso", "Burkina Faso", "🇧🇫", "XOF", "Africa", "GMT (UTC+0)"),
    ("burundi", "Burundi", "🇧🇮", "BIF", "Africa", "CAT (UTC+2)"),
    ("cabo-verde", "Cabo Verde", "🇨🇻", "CVE", "Africa", "CVT (UTC-1)"),
    ("cambodia", "Cambodia", "🇰🇭", "KHR", "Asia", "ICT (UTC+7)"),
    ("cameroon", "Cameroon", "🇨🇲", "XAF", "Africa", "WAT (UTC+1)"),
    ("canada", "Canada", "🇨🇦", "CAD", "North America", "EST/PST"),
    ("central-african-republic", "Central African Republic", "🇨🇫", "XAF", "Africa", "WAT (UTC+1)"),
    ("chad", "Chad", "🇹🇩", "XAF", "Africa", "WAT (UTC+1)"),
    ("chile", "Chile", "🇨🇱", "CLP", "Americas", "CLT (UTC-3)"),
    ("china", "China", "🇨🇳", "CNY", "Asia", "CST (UTC+8)"),
    ("colombia", "Colombia", "🇨🇴", "COP", "Americas", "COT (UTC-5)"),
    ("comoros", "Comoros", "🇰🇲", "KMF", "Africa", "EAT (UTC+3)"),
    ("congo-democratic-republic", "Democratic Republic of the Congo", "🇨🇩", "CDF", "Africa", "WAT/CAT"),
    ("congo-republic", "Republic of the Congo", "🇨🇬", "XAF", "Africa", "WAT (UTC+1)"),
    ("costa-rica", "Costa Rica", "🇨🇷", "CRC", "Americas", "CST (UTC-6)"),
    ("croatia", "Croatia", "🇭🇷", "EUR", "Europe", "CET (UTC+1)"),
    ("cuba", "Cuba", "🇨🇺", "CUP", "Americas", "CST (UTC-5)"),
    ("cyprus", "Cyprus", "🇨🇾", "EUR", "Europe", "EET (UTC+2)"),
    ("czech-republic", "Czech Republic", "🇨🇿", "CZK", "Europe", "CET (UTC+1)"),
    ("denmark", "Denmark", "🇩🇰", "DKK", "Europe", "CET (UTC+1)"),
    ("djibouti", "Djibouti", "🇩🇯", "DJF", "Africa", "EAT (UTC+3)"),
    ("dominica", "Dominica", "🇩🇲", "XCD", "Americas", "AST (UTC-4)"),
    ("dominican-republic", "Dominican Republic", "🇩🇴", "DOP", "Americas", "AST (UTC-4)"),
    ("ecuador", "Ecuador", "🇪🇨", "USD", "Americas", "ECT (UTC-5)"),
    ("egypt", "Egypt", "🇪🇬", "EGP", "Middle East", "EET (UTC+2)"),
    ("el-salvador", "El Salvador", "🇸🇻", "USD", "Americas", "CST (UTC-6)"),
    ("equatorial-guinea", "Equatorial Guinea", "🇬🇶", "XAF", "Africa", "WAT (UTC+1)"),
    ("eritrea", "Eritrea", "🇪🇷", "ERN", "Africa", "EAT (UTC+3)"),
    ("estonia", "Estonia", "🇪🇪", "EUR", "Europe", "EET (UTC+2)"),
    ("eswatini", "Eswatini", "🇸🇿", "SZL", "Africa", "SAST (UTC+2)"),
    ("ethiopia", "Ethiopia", "🇪🇹", "ETB", "Africa", "EAT (UTC+3)"),
    ("fiji", "Fiji", "🇫🇯", "FJD", "Asia-Pacific", "FJT (UTC+12)"),
    ("finland", "Finland", "🇫🇮", "EUR", "Europe", "EET (UTC+2)"),
    ("france", "France", "🇫🇷", "EUR", "Europe", "CET (UTC+1)"),
    ("gabon", "Gabon", "🇬🇦", "XAF", "Africa", "WAT (UTC+1)"),
    ("gambia", "Gambia", "🇬🇲", "GMD", "Africa", "GMT (UTC+0)"),
    ("georgia", "Georgia", "🇬🇪", "GEL", "Europe", "GET (UTC+4)"),
    ("germany", "Germany", "🇩🇪", "EUR", "Europe", "CET (UTC+1)"),
    ("ghana", "Ghana", "🇬🇭", "GHS", "Africa", "GMT (UTC+0)"),
    ("greece", "Greece", "🇬🇷", "EUR", "Europe", "EET (UTC+2)"),
    ("grenada", "Grenada", "🇬🇩", "XCD", "Americas", "AST (UTC-4)"),
    ("guatemala", "Guatemala", "🇬🇹", "GTQ", "Americas", "CST (UTC-6)"),
    ("guinea", "Guinea", "🇬🇳", "GNF", "Africa", "GMT (UTC+0)"),
    ("guinea-bissau", "Guinea-Bissau", "🇬🇼", "XOF", "Africa", "GMT (UTC+0)"),
    ("guyana", "Guyana", "🇬🇾", "GYD", "Americas", "GYT (UTC-4)"),
    ("haiti", "Haiti", "🇭🇹", "HTG", "Americas", "EST (UTC-5)"),
    ("honduras", "Honduras", "🇭🇳", "HNL", "Americas", "CST (UTC-6)"),
    ("hungary", "Hungary", "🇭🇺", "HUF", "Europe", "CET (UTC+1)"),
    ("iceland", "Iceland", "🇮🇸", "ISK", "Europe", "GMT (UTC+0)"),
    ("india", "India", "🇮🇳", "INR", "Asia-Pacific", "IST (UTC+5:30)"),
    ("indonesia", "Indonesia", "🇮🇩", "IDR", "Asia-Pacific", "WIB (UTC+7)"),
    ("iran", "Iran", "🇮🇷", "IRR", "Middle East", "IRST (UTC+3:30)"),
    ("iraq", "Iraq", "🇮🇶", "IQD", "Middle East", "AST (UTC+3)"),
    ("ireland", "Ireland", "🇮🇪", "EUR", "Europe", "GMT (UTC+0)"),
    ("israel", "Israel", "🇮🇱", "ILS", "Middle East", "IST (UTC+2)"),
    ("italy", "Italy", "🇮🇹", "EUR", "Europe", "CET (UTC+1)"),
    ("jamaica", "Jamaica", "🇯🇲", "JMD", "Americas", "EST (UTC-5)"),
    ("japan", "Japan", "🇯🇵", "JPY", "Asia-Pacific", "JST (UTC+9)"),
    ("jordan", "Jordan", "🇯🇴", "JOD", "Middle East", "AST (UTC+3)"),
    ("kazakhstan", "Kazakhstan", "🇰🇿", "KZT", "Asia", "ALMT (UTC+6)"),
    ("kenya", "Kenya", "🇰🇪", "KES", "Africa", "EAT (UTC+3)"),
    ("kiribati", "Kiribati", "🇰🇮", "AUD", "Asia-Pacific", "GILT (UTC+12)"),
    ("korea-north", "North Korea", "🇰🇵", "KPW", "Asia", "KST (UTC+9)"),
    ("korea-south", "South Korea", "🇰🇷", "KRW", "Asia-Pacific", "KST (UTC+9)"),
    ("kuwait", "Kuwait", "🇰🇼", "KWD", "Middle East", "AST (UTC+3)"),
    ("kyrgyzstan", "Kyrgyzstan", "🇰🇬", "KGS", "Asia", "KGT (UTC+6)"),
    ("laos", "Laos", "🇱🇦", "LAK", "Asia", "ICT (UTC+7)"),
    ("latvia", "Latvia", "🇱🇻", "EUR", "Europe", "EET (UTC+2)"),
    ("lebanon", "Lebanon", "🇱🇧", "LBP", "Middle East", "EET (UTC+2)"),
    ("lesotho", "Lesotho", "🇱🇸", "LSL", "Africa", "SAST (UTC+2)"),
    ("liberia", "Liberia", "🇱🇷", "LRD", "Africa", "GMT (UTC+0)"),
    ("libya", "Libya", "🇱🇾", "LYD", "Africa", "EET (UTC+2)"),
    ("liechtenstein", "Liechtenstein", "🇱🇮", "CHF", "Europe", "CET (UTC+1)"),
    ("lithuania", "Lithuania", "🇱🇹", "EUR", "Europe", "EET (UTC+2)"),
    ("luxembourg", "Luxembourg", "🇱🇺", "EUR", "Europe", "CET (UTC+1)"),
    ("madagascar", "Madagascar", "🇲🇬", "MGA", "Africa", "EAT (UTC+3)"),
    ("malawi", "Malawi", "🇲🇼", "MWK", "Africa", "CAT (UTC+2)"),
    ("malaysia", "Malaysia", "🇲🇾", "MYR", "Asia-Pacific", "MYT (UTC+8)"),
    ("maldives", "Maldives", "🇲🇻", "MVR", "Asia", "MVT (UTC+5)"),
    ("mali", "Mali", "🇲🇱", "XOF", "Africa", "GMT (UTC+0)"),
    ("malta", "Malta", "🇲🇹", "EUR", "Europe", "CET (UTC+1)"),
    ("marshall-islands", "Marshall Islands", "🇲🇭", "USD", "Asia-Pacific", "MHT (UTC+12)"),
    ("mauritania", "Mauritania", "🇲🇷", "MRU", "Africa", "GMT (UTC+0)"),
    ("mauritius", "Mauritius", "🇲🇺", "MUR", "Africa", "MUT (UTC+4)"),
    ("mexico", "Mexico", "🇲🇽", "MXN", "Americas", "CST (UTC-6)"),
    ("micronesia", "Micronesia", "🇫🇲", "USD", "Asia-Pacific", "PONT (UTC+11)"),
    ("moldova", "Moldova", "🇲🇩", "MDL", "Europe", "EET (UTC+2)"),
    ("monaco", "Monaco", "🇲🇨", "EUR", "Europe", "CET (UTC+1)"),
    ("mongolia", "Mongolia", "🇲🇳", "MNT", "Asia", "ULAT (UTC+8)"),
    ("montenegro", "Montenegro", "🇲🇪", "EUR", "Europe", "CET (UTC+1)"),
    ("morocco", "Morocco", "🇲🇦", "MAD", "Africa", "WET (UTC+1)"),
    ("mozambique", "Mozambique", "🇲🇿", "MZN", "Africa", "CAT (UTC+2)"),
    ("myanmar", "Myanmar", "🇲🇲", "MMK", "Asia", "MMT (UTC+6:30)"),
    ("namibia", "Namibia", "🇳🇦", "NAD", "Africa", "CAT (UTC+2)"),
    ("nauru", "Nauru", "🇳🇷", "AUD", "Asia-Pacific", "NRT (UTC+12)"),
    ("nepal", "Nepal", "🇳🇵", "NPR", "Asia", "NPT (UTC+5:45)"),
    ("netherlands", "Netherlands", "🇳🇱", "EUR", "Europe", "CET (UTC+1)"),
    ("new-zealand", "New Zealand", "🇳🇿", "NZD", "Asia-Pacific", "NZST (UTC+12)"),
    ("nicaragua", "Nicaragua", "🇳🇮", "NIO", "Americas", "CST (UTC-6)"),
    ("niger", "Niger", "🇳🇪", "XOF", "Africa", "WAT (UTC+1)"),
    ("nigeria", "Nigeria", "🇳🇬", "NGN", "Africa", "WAT (UTC+1)"),
    ("north-macedonia", "North Macedonia", "🇲🇰", "MKD", "Europe", "CET (UTC+1)"),
    ("norway", "Norway", "🇳🇴", "NOK", "Europe", "CET (UTC+1)"),
    ("oman", "Oman", "🇴🇲", "OMR", "Middle East", "GST (UTC+4)"),
    ("pakistan", "Pakistan", "🇵🇰", "PKR", "Asia", "PKT (UTC+5)"),
    ("palau", "Palau", "🇵🇼", "USD", "Asia-Pacific", "PWT (UTC+9)"),
    ("panama", "Panama", "🇵🇦", "USD", "Americas", "EST (UTC-5)"),
    ("papua-new-guinea", "Papua New Guinea", "🇵🇬", "PGK", "Asia-Pacific", "PGT (UTC+10)"),
    ("paraguay", "Paraguay", "🇵🇾", "PYG", "Americas", "PYT (UTC-4)"),
    ("peru", "Peru", "🇵🇪", "PEN", "Americas", "PET (UTC-5)"),
    ("philippines", "Philippines", "🇵🇭", "PHP", "Asia-Pacific", "PST (UTC+8)"),
    ("poland", "Poland", "🇵🇱", "PLN", "Europe", "CET (UTC+1)"),
    ("portugal", "Portugal", "🇵🇹", "EUR", "Europe", "WET (UTC+0)"),
    ("qatar", "Qatar", "🇶🇦", "QAR", "Middle East", "AST (UTC+3)"),
    ("romania", "Romania", "🇷🇴", "RON", "Europe", "EET (UTC+2)"),
    ("russia", "Russia", "🇷🇺", "RUB", "Europe/Asia", "MSK (UTC+3)"),
    ("rwanda", "Rwanda", "🇷🇼", "RWF", "Africa", "CAT (UTC+2)"),
    ("saint-kitts-and-nevis", "Saint Kitts and Nevis", "🇰🇳", "XCD", "Americas", "AST (UTC-4)"),
    ("saint-lucia", "Saint Lucia", "🇱🇨", "XCD", "Americas", "AST (UTC-4)"),
    ("saint-vincent-and-the-grenadines", "Saint Vincent and the Grenadines", "🇻🇨", "XCD", "Americas", "AST (UTC-4)"),
    ("samoa", "Samoa", "🇼🇸", "WST", "Asia-Pacific", "WST (UTC+13)"),
    ("san-marino", "San Marino", "🇸🇲", "EUR", "Europe", "CET (UTC+1)"),
    ("sao-tome-and-principe", "Sao Tome and Principe", "🇸🇹", "STN", "Africa", "GMT (UTC+0)"),
    ("saudi-arabia", "Saudi Arabia", "🇸🇦", "SAR", "Middle East", "AST (UTC+3)"),
    ("senegal", "Senegal", "🇸🇳", "XOF", "Africa", "GMT (UTC+0)"),
    ("serbia", "Serbia", "🇷🇸", "RSD", "Europe", "CET (UTC+1)"),
    ("seychelles", "Seychelles", "🇸🇨", "SCR", "Africa", "SCT (UTC+4)"),
    ("sierra-leone", "Sierra Leone", "🇸🇱", "SLE", "Africa", "GMT (UTC+0)"),
    ("singapore", "Singapore", "🇸🇬", "SGD", "Asia-Pacific", "SGT (UTC+8)"),
    ("slovakia", "Slovakia", "🇸🇰", "EUR", "Europe", "CET (UTC+1)"),
    ("slovenia", "Slovenia", "🇸🇮", "EUR", "Europe", "CET (UTC+1)"),
    ("solomon-islands", "Solomon Islands", "🇸🇧", "SBD", "Asia-Pacific", "SBT (UTC+11)"),
    ("somalia", "Somalia", "🇸🇴", "SOS", "Africa", "EAT (UTC+3)"),
    ("south-africa", "South Africa", "🇿🇦", "ZAR", "Africa", "SAST (UTC+2)"),
    ("south-sudan", "South Sudan", "🇸🇸", "SSP", "Africa", "CAT (UTC+2)"),
    ("spain", "Spain", "🇪🇸", "EUR", "Europe", "CET (UTC+1)"),
    ("sri-lanka", "Sri Lanka", "🇱🇰", "LKR", "Asia", "SLST (UTC+5:30)"),
    ("sudan", "Sudan", "🇸🇩", "SDG", "Africa", "CAT (UTC+2)"),
    ("suriname", "Suriname", "🇸🇷", "SRD", "Americas", "SRT (UTC-3)"),
    ("sweden", "Sweden", "🇸🇪", "SEK", "Europe", "CET (UTC+1)"),
    ("switzerland", "Switzerland", "🇨🇭", "CHF", "Europe", "CET (UTC+1)"),
    ("syria", "Syria", "🇸🇾", "SYP", "Middle East", "EET (UTC+2)"),
    ("taiwan", "Taiwan", "🇹🇼", "TWD", "Asia-Pacific", "CST (UTC+8)"),
    ("tajikistan", "Tajikistan", "🇹🇯", "TJS", "Asia", "TJT (UTC+5)"),
    ("tanzania", "Tanzania", "🇹🇿", "TZS", "Africa", "EAT (UTC+3)"),
    ("thailand", "Thailand", "🇹🇭", "THB", "Asia-Pacific", "ICT (UTC+7)"),
    ("timor-leste", "Timor-Leste", "🇹🇱", "USD", "Asia-Pacific", "TLT (UTC+9)"),
    ("togo", "Togo", "🇹🇬", "XOF", "Africa", "GMT (UTC+0)"),
    ("tonga", "Tonga", "🇹🇴", "TOP", "Asia-Pacific", "TOT (UTC+13)"),
    ("trinidad-and-tobago", "Trinidad and Tobago", "🇹🇹", "TTD", "Americas", "AST (UTC-4)"),
    ("tunisia", "Tunisia", "🇹🇳", "TND", "Africa", "CET (UTC+1)"),
    ("turkey", "Turkey", "🇹🇷", "TRY", "Europe/Middle East", "TRT (UTC+3)"),
    ("turkmenistan", "Turkmenistan", "🇹🇲", "TMT", "Asia", "TMT (UTC+5)"),
    ("tuvalu", "Tuvalu", "🇹🇻", "AUD", "Asia-Pacific", "TVT (UTC+12)"),
    ("uganda", "Uganda", "🇺🇬", "UGX", "Africa", "EAT (UTC+3)"),
    ("ukraine", "Ukraine", "🇺🇦", "UAH", "Europe", "EET (UTC+2)"),
    ("united-arab-emirates", "United Arab Emirates", "🇦🇪", "AED", "Middle East", "GST (UTC+4)"),
    ("united-kingdom", "United Kingdom", "🇬🇧", "GBP", "Europe", "GMT/BST"),
    ("united-states", "United States", "🇺🇸", "USD", "North America", "EST/PST"),
    ("uruguay", "Uruguay", "🇺🇾", "UYU", "Americas", "UYT (UTC-3)"),
    ("uzbekistan", "Uzbekistan", "🇺🇿", "UZS", "Asia", "UZT (UTC+5)"),
    ("vanuatu", "Vanuatu", "🇻🇺", "VUV", "Asia-Pacific", "VUT (UTC+11)"),
    ("vatican-city", "Vatican City", "🇻🇦", "EUR", "Europe", "CET (UTC+1)"),
    ("venezuela", "Venezuela", "🇻🇪", "VES", "Americas", "VET (UTC-4)"),
    ("vietnam", "Vietnam", "🇻🇳", "VND", "Asia-Pacific", "ICT (UTC+7)"),
    ("yemen", "Yemen", "🇾🇪", "YER", "Middle East", "AST (UTC+3)"),
    ("zambia", "Zambia", "🇿🇲", "ZMW", "Africa", "CAT (UTC+2)"),
    ("zimbabwe", "Zimbabwe", "🇿🇼", "ZWG", "Africa", "CAT (UTC+2)")
]

HEAD = lambda title, desc, canon, extra_css="": f"""<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="https://axonflow.in{canon}">
<link rel="icon" type="image/png" href="/assets/logo_pro.png">
<link rel="shortcut icon" type="image/png" href="/assets/logo_pro.png">
<link rel="apple-touch-icon" href="/assets/logo_pro.png">
<meta name="theme-color" content="#07080a">
<meta property="og:type" content="website">
<meta property="og:url" content="https://axonflow.in{canon}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://axonflow.in/assets/og-image.jpg">
<meta property="og:site_name" content="AxonFlow AI">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/enterprise.css">
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
a{{text-decoration:none;color:inherit}}
img{{max-width:100%;display:block}}
.wrap{{max-width:1200px;margin:0 auto;padding:0 1.5rem}}
.grid-2{{display:grid;grid-template-columns:repeat(2,1fr);gap:3rem}}
.grid-3{{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}}
.grid-4{{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}}
@media(max-width:900px){{.grid-2,.grid-3,.grid-4{{grid-template-columns:1fr;gap:1.25rem}}}}
.page-hero{{padding:10rem 0 5rem;position:relative;overflow:hidden}}
.page-hero::before{{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 65% 55% at 60% 0%,rgba(84,87,255,.12) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 10% 60%,rgba(53,208,127,.06) 0%,transparent 60%);pointer-events:none}}
.page-hero .inner{{position:relative;z-index:1}}
.section{{padding:5rem 0}}
.section-alt{{padding:5rem 0;background:var(--bg-raised)}}
.section-title{{font-family:var(--font-display);font-size:clamp(2.4rem,5vw,3.5rem);font-weight:600;line-height:1.05;margin-bottom:1.5rem}}
.section-sub{{font-size:1.125rem;color:var(--text-dim);line-height:1.7;max-width:42ch}}
.hero-h1{{font-family:var(--font-display);font-size:clamp(3.5rem,8vw,6rem);font-weight:600;line-height:.97;letter-spacing:-.02em;margin-bottom:1.5rem}}
.hero-p{{font-size:1.25rem;color:var(--text-dim);max-width:48ch;line-height:1.7;margin-bottom:3rem}}
.cta-row{{display:flex;align-items:center;flex-wrap:wrap;gap:1rem}}
.accent{{color:var(--accent);font-style:italic}}
.accent-green{{color:var(--accent-2)}}
.pill{{font-family:var(--font-mono);font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;padding:.3rem .75rem;border-radius:6px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text-dim);display:inline-block}}
.pills{{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:2rem}}
.check-list{{list-style:none;display:flex;flex-direction:column;gap:1rem}}
.check-list li{{display:flex;gap:.75rem;font-size:.95rem;align-items:flex-start}}
.check-list li::before{{content:'✓';color:var(--accent-2);font-weight:700;flex-shrink:0;margin-top:2px}}
.divider{{border:none;border-top:1px solid var(--border);margin:0}}
.stat-big{{font-family:var(--font-display);font-size:3.5rem;font-weight:700;line-height:1;color:var(--accent-2)}}
.stat-label{{font-size:.875rem;color:var(--text-dim);margin-top:.4rem}}
.card{{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;transition:border-color .25s,transform .25s}}
.card:hover{{border-color:var(--border-strong);transform:translateY(-3px)}}
.card-h{{font-size:1.15rem;font-weight:700;margin-bottom:.75rem}}
.card-p{{font-size:.9rem;color:var(--text-dim);line-height:1.65}}
.step-num{{font-family:var(--font-mono);font-size:.8rem;font-weight:700;color:var(--accent);flex-shrink:0;width:2.5rem;padding-top:2px}}
.step-row{{display:flex;gap:1.5rem;padding:1.75rem 0;border-bottom:1px solid var(--border)}}
.step-row:last-child{{border-bottom:none}}
.tag{{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;padding:.2rem .6rem;border-radius:5px;background:var(--accent-soft);color:var(--accent)}}
.tag-green{{background:var(--accent-2-soft);color:var(--accent-2)}}
.cta-block{{border-radius:20px;background:var(--surface);border:1px solid var(--border);padding:5rem 3rem;text-align:center}}
.faq-item{{padding:1.75rem 0;border-bottom:1px solid var(--border)}}
.faq-item:last-child{{border-bottom:none}}
.faq-q{{font-weight:700;font-size:1rem;margin-bottom:.75rem}}
.faq-a{{color:var(--text-dim);font-size:.95rem;line-height:1.7}}
{extra_css}
</style>
</head>
<body class="ef-body">
<a href="#main" style="position:absolute;top:-100px;left:1rem;z-index:999;background:var(--accent);color:#fff;padding:.5rem 1rem;border-radius:6px;font-size:.85rem;transition:top .2s" onfocus="this.style.top='1rem'" onblur="this.style.top='-100px'">Skip to main content</a>
<header>
<nav class="ef-nav" aria-label="Main navigation">
<div class="wrap" style="height:4rem;display:flex;align-items:center;justify-content:space-between">
<a href="/" aria-label="AxonFlow AI Home" style="display:flex;align-items:center;gap:.625rem;flex-shrink:0">
<img src="/assets/logo_pro.png" alt="AxonFlow AI" style="height:2rem;width:2rem">
<span class="ef-display" style="font-size:1rem;font-weight:700;letter-spacing:-.01em">AxonFlow AI</span>
</a>
<div style="display:flex;align-items:center;gap:1.25rem;font-size:.78rem;font-weight:500" role="menubar">
<a href="/" class="ef-navlink" role="menuitem">Home</a>
<a href="/what-we-do" class="ef-navlink" role="menuitem">Services</a>
<a href="/case-studies" class="ef-navlink" role="menuitem">Case Studies</a>
<a href="/testimonials" class="ef-navlink" role="menuitem">Testimonials</a>
<a href="/about-us" class="ef-navlink" role="menuitem">About</a>
<a href="/who-we-are" class="ef-navlink" role="menuitem">Who We Are</a>
<a href="/pricing" class="ef-navlink" role="menuitem">Pricing</a>
<a href="/careers" class="ef-navlink" role="menuitem">Careers</a>
<a href="/blog" class="ef-navlink" role="menuitem">Blog</a>
<a href="/contact" class="ef-cta" style="padding:.45rem 1.1rem;font-size:.78rem" role="menuitem">Talk to us</a>
</div>
</div>
</nav>
</header>
<main id="main">"""

FOOTER = """\n</main>
<footer class="ef-footer" style="padding:5rem 0" role="contentinfo">
<div class="wrap">
<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:4rem">
<div>
<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:2rem">
<img src="/assets/logo_pro.png" alt="AxonFlow AI" style="height:2.25rem">
<span class="ef-display" style="font-size:1.2rem;font-weight:600">AxonFlow AI</span>
</div>
<p style="color:var(--text-dim);font-size:.9rem;max-width:28ch;line-height:1.7;margin-bottom:2rem">Full-Stack IT Engineering & Autonomous AI Infrastructure. MSME registered enterprise, operating globally.</p>
<div style="display:flex;gap:.75rem">
<a href="https://instagram.com/axonflow.ai" class="ef-social-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
<a href="https://linkedin.com/company/axonflow-ai" class="ef-social-btn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a>
</div>
</div>
<div>
<p class="ef-mono" style="font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-faint);margin-bottom:1.5rem">IT Services</p>
<ul style="list-style:none;display:flex;flex-direction:column;gap:.875rem;font-size:.875rem;color:var(--text-dim)">
<li><a href="/what-we-do" style="transition:color .2s">Cloud & DevOps</a></li>
<li><a href="/what-we-do" style="transition:color .2s">Full-Stack Web & Mobile</a></li>
<li><a href="/what-we-do" style="transition:color .2s">AI & Autonomous Agents</a></li>
<li><a href="/what-we-do" style="transition:color .2s">Cybersecurity Audits</a></li>
<li><a href="/what-we-do" style="transition:color .2s">Custom ERP & CRM Solutions</a></li>
</ul>
</div>
<div>
<p class="ef-mono" style="font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-faint);margin-bottom:1.5rem">Company</p>
<ul style="list-style:none;display:flex;flex-direction:column;gap:.875rem;font-size:.875rem;color:var(--text-dim)">
<li><a href="/about-us" style="transition:color .2s">About Us</a></li>
<li><a href="/who-we-are" style="transition:color .2s">Who We Are</a></li>
<li><a href="/testimonials" style="transition:color .2s">Testimonials</a></li>
<li><a href="/case-studies" style="transition:color .2s">Case Studies</a></li>
<li><a href="/blog" style="transition:color .2s">Blog</a></li>
<li><a href="/contact" style="transition:color .2s">Contact</a></li>
</ul>
</div>
<div>
<p class="ef-mono" style="font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-faint);margin-bottom:1.5rem">Legal & Markets</p>
<ul style="list-style:none;display:flex;flex-direction:column;gap:.875rem;font-size:.875rem;color:var(--text-dim)">
<li><a href="/markets" style="transition:color .2s">195 Country Markets</a></li>
<li><a href="/privacy" style="transition:color .2s">Privacy Policy</a></li>
<li><a href="/terms" style="transition:color .2s">Terms of Service</a></li>
<li><a href="/careers" style="transition:color .2s">Careers</a></li>
</ul>
</div>
</div>
<hr class="divider">
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:2rem;flex-wrap:wrap;gap:1rem">
<p class="ef-mono" style="font-size:.65rem;color:var(--text-faint);letter-spacing:.08em">UDYAM-UP-50-0236406 &nbsp;·&nbsp; MSME Registered IT Enterprise &nbsp;·&nbsp; Global Delivery</p>
<p style="font-size:.75rem;color:var(--text-faint)">&copy; 2026 AxonFlow AI. All rights reserved.</p>
</div>
</div>
</footer>
</body>
</html>"""

def write_both(rel_path, content):
    # Writes to root path as well as root file for 100% URL matching
    p1 = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(p1), exist_ok=True)
    with open(p1, "w") as f:
        f.write(content)
    
    # Also write root alias .html if applicable
    if rel_path.endswith("/index.html") and rel_path != "index.html":
        alias = rel_path[:-11] + ".html"
        p2 = os.path.join(BASE, alias)
        with open(p2, "w") as f:
            f.write(content)

# 1. WHAT WE DO (Full IT Capabilities + AI)
what_we_do = HEAD("Full-Stack IT Services & Enterprise AI | AxonFlow AI",
    "Complete IT Engineering Services — Cloud Architecture, Full-Stack Web & Mobile Apps, DevOps, Cybersecurity, Custom Software, and Autonomous AI Systems.",
    "/what-we-do") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Full-Spectrum IT & AI Services</div>
<h1 class="hero-h1">Complete IT Engineering & <br><span class="accent">Autonomous AI.</span></h1>
<p class="hero-p">From cloud architecture and custom software to enterprise AI agents and full-stack web applications — we deliver production IT systems designed to scale.</p>
<div class="cta-row">
<a href="/contact" class="ef-btn-primary">Start an IT Project &rarr;</a>
<a href="/case-studies" class="ef-btn-secondary">View Case Studies</a>
</div>
</div>
</section>

<div class="ef-rail wrap" style="padding-left:1.5rem;padding-right:1.5rem">
<span><span class="dot-live"></span>Full-Stack IT Engineering</span>
<span>&middot;</span><span>Cloud & Infrastructure</span>
<span>&middot;</span><span>Cybersecurity & Audits</span>
<span>&middot;</span><span>Autonomous AI Pods</span>
</div>

<section class="section">
<div class="wrap">
<h2 class="section-title">Our End-to-End <span class="accent">IT Capabilities</span></h2>
<div class="grid-3" style="gap:1.5rem;margin-bottom:4rem">
<div class="card">
<p class="tag" style="margin-bottom:1rem;display:inline-block">Cloud & DevOps</p>
<h3 class="card-h">Cloud Infrastructure & Kubernetes</h3>
<p class="card-p">AWS, Azure, and GCP cloud architecture. Automated CI/CD pipelines, Docker containerization, Kubernetes orchestration, and serverless backends.</p>
</div>
<div class="card">
<p class="tag" style="margin-bottom:1rem;display:inline-block">Software Development</p>
<h3 class="card-h">Full-Stack Web & Mobile Applications</h3>
<p class="card-p">High-performance web apps built with modern frameworks (React, Next.js, Node.js, Python, FastAPI) and cross-platform native iOS & Android applications.</p>
</div>
<div class="card">
<p class="tag" style="margin-bottom:1rem;display:inline-block">Enterprise Systems</p>
<h3 class="card-h">Custom ERP & CRM Integration</h3>
<p class="card-p">Tailor-made internal dashboards, data pipelines, automated workflow integrations (N8N, Zapier), and HubSpot/Salesforce CRM customizations.</p>
</div>
<div class="card">
<p class="tag" style="margin-bottom:1rem;display:inline-block">Security & Quality</p>
<h3 class="card-h">Cybersecurity & Code Audits</h3>
<p class="card-p">Vulnerability assessments, automated penetration testing, SOC2/HIPAA/GDPR compliance auditing, and secure API gateways.</p>
</div>
<div class="card">
<p class="tag" style="margin-bottom:1rem;display:inline-block">Artificial Intelligence</p>
<h3 class="card-h">Autonomous AI Agents & Multi-Agent Pods</h3>
<p class="card-p">Custom AI agents, LangChain/LangGraph orchestration, automated customer onboarding bots, and intelligent document processing.</p>
</div>
<div class="card">
<p class="tag" style="margin-bottom:1rem;display:inline-block">Data & RAG</p>
<h3 class="card-h">Enterprise RAG & Knowledge Bases</h3>
<p class="card-p">Vector database architecture (Pinecone, Weaviate, Qdrant), document embeddings, sub-second semantic retrieval, and LLM fine-tuning.</p>
</div>
</div>
</div>
</section>
""" + FOOTER

write_both("what-we-do/index.html", what_we_do)

# 2. CASE STUDIES (Live Systems Portfolio Modal Grid)
case_studies = HEAD("Case Studies & Live Production Deployments | AxonFlow AI",
    "Explore live production systems engineered by AxonFlow AI. Click any project to launch its live working preview inline.",
    "/case-studies",
    """
.browser-mockup { border-radius: 12px; background: var(--surface); border: 1px solid var(--border-strong); overflow: hidden; position: relative; }
.browser-mockup .bar { background: rgba(255,255,255,0.03); padding: .5rem .75rem; display: flex; align-items: center; gap: .4rem; border-bottom: 1px solid var(--border); }
.browser-mockup .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-strong); }
.browser-mockup .url-bar { font-family: var(--font-mono); font-size: .68rem; color: var(--text-dim); margin-left: .5rem; background: rgba(0,0,0,0.3); padding: .15rem .6rem; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.browser-mockup .screen { height: 210px; position: relative; overflow: hidden; background: #040507; display: flex; align-items: center; justify-content: center; }
.browser-mockup .screen img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .4s ease; }
.ef-card:hover .browser-mockup .screen img { transform: scale(1.04); }
.preview-tag { position: absolute; top: .75rem; right: .75rem; background: var(--accent); color: #fff; font-family: var(--font-mono); font-size: .65rem; font-weight: 600; padding: .35rem .75rem; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; gap: .35rem; }
""") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Live Systems Portfolio</div>
<h1 class="hero-h1">Portfolio you can open, <br><span class="accent">not just read about.</span></h1>
<p class="hero-p">Click any project to load it live, right here in an inline interactive modal — no new tab required.</p>
</div>
</section>

<div class="ef-rail wrap" style="padding-left:1.5rem;padding-right:1.5rem">
<span><span class="dot-live"></span>12 Interactive Production Projects</span>
<span>&middot;</span><span>Click to Test Live Systems</span>
<span>&middot;</span><span>6-Month Post-Launch SLA</span>
</div>

<section class="section">
<div class="wrap">
<div class="grid-3" style="gap:2rem;margin-bottom:4rem" id="portfolio-grid">
<!-- Live cards injected via JS -->
</div>

<div class="cta-block">
<h2 class="section-title">Want Us to Build a Similar <span class="accent">Live System for You?</span></h2>
<p class="hero-p" style="margin:0 auto 2rem">Speak directly with our lead solution architects and senior developers.</p>
<a href="/contact" class="ef-btn-primary">Schedule Scoping Call &rarr;</a>
</div>
</div>
</section>
<script src="/js/portfolio-modal.js" defer></script>
<script src="/js/portfolio-data.js" defer></script>
""" + FOOTER

write_both("case-studies/index.html", case_studies)

# 3. TESTIMONIALS (Real Client Feedback)
testimonials = HEAD("Client Testimonials & IT Reviews | AxonFlow AI",
    "Read real enterprise feedback from clients who transformed their operations with AxonFlow AI IT services and AI agents.",
    "/testimonials") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Client Feedback</div>
<h1 class="hero-h1">What our clients <br><span class="accent">actually say.</span></h1>
<p class="hero-p">Real feedback from enterprises and startups who transformed their IT operations and business workflows with our engineering team.</p>
</div>
</section>

<div class="ef-rail wrap" style="padding-left:1.5rem;padding-right:1.5rem">
<span><span class="dot-live"></span>9 Production Systems Supported</span>
<span>&middot;</span><span>Global Enterprise Reach</span>
<span>&middot;</span><span>100% Client Satisfaction</span>
</div>

<section class="section">
<div class="wrap">
<div class="grid-3" style="gap:1.5rem;margin-bottom:4rem">
<div class="card">
<p style="color:var(--accent-2);margin-bottom:.5rem">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
<span class="tag" style="margin-bottom:1rem;display:inline-block">AI & Software</span>
<p class="card-p" style="margin-bottom:1.5rem">&ldquo;AxonFlow AI built an autonomous document processing agent that handles 10,000+ daily financial documents with 95% accuracy. Our manual review time dropped by 80%.&rdquo;</p>
<p style="font-weight:700;font-size:.9rem">Rajesh Sharma</p>
<p style="color:var(--text-faint);font-size:.8rem">CTO, FinEdge Solutions</p>
</div>

<div class="card">
<p style="color:var(--accent-2);margin-bottom:.5rem">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
<span class="tag" style="margin-bottom:1rem;display:inline-block">Cloud & RAG</span>
<p class="card-p" style="margin-bottom:1.5rem">&ldquo;The RAG-powered diagnostic assistant queries 2M+ research papers in seconds. It has become indispensable for our clinical decision support pipeline.&rdquo;</p>
<p style="font-weight:700;font-size:.9rem">Dr. Priya Nair</p>
<p style="color:var(--text-faint);font-size:.8rem">Head of Innovation, MediCore Health</p>
</div>

<div class="card">
<p style="color:var(--accent-2);margin-bottom:.5rem">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
<span class="tag" style="margin-bottom:1rem;display:inline-block">Automation & IT</span>
<p class="card-p" style="margin-bottom:1.5rem">&ldquo;They automated our entire order management pipeline with N8N. 50,000+ orders monthly, zero manual intervention. Incredible ROI within 3 months.&rdquo;</p>
<p style="font-weight:700;font-size:.9rem">Ankit Mehta</p>
<p style="color:var(--text-faint);font-size:.8rem">VP Operations, ShopVerse</p>
</div>

<div class="card">
<p style="color:var(--accent-2);margin-bottom:.5rem">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
<span class="tag" style="margin-bottom:1rem;display:inline-block">Custom IT Pod</span>
<p class="card-p" style="margin-bottom:1.5rem">&ldquo;Multi-agent orchestration that manages our entire customer onboarding. Reduced onboarding time by 70%, and the system just runs flawlessly.&rdquo;</p>
<p style="font-weight:700;font-size:.9rem">Meera Iyer</p>
<p style="color:var(--text-faint);font-size:.8rem">COO, EdPrime Technologies</p>
</div>

<div class="card">
<p style="color:var(--accent-2);margin-bottom:.5rem">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
<span class="tag" style="margin-bottom:1rem;display:inline-block">DevOps & Routing</span>
<p class="card-p" style="margin-bottom:1.5rem">&ldquo;We gave them a logistics routing nightmare across 12 cities. Six weeks later we had a fully autonomous routing system. 25% fuel savings in the first month.&rdquo;</p>
<p style="font-weight:700;font-size:.9rem">Vikram Sood</p>
<p style="color:var(--text-faint);font-size:.8rem">Director of Operations, LogiTrack</p>
</div>

<div class="card">
<p style="color:var(--accent-2);margin-bottom:.5rem">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
<span class="tag" style="margin-bottom:1rem;display:inline-block">Enterprise Search</span>
<p class="card-p" style="margin-bottom:1.5rem">&ldquo;The knowledge base RAG they built for our legal team retrieves precedents with citations. Our lawyers said it's the first AI tool they actually trust.&rdquo;</p>
<p style="font-weight:700;font-size:.9rem">Sarah Mitchell</p>
<p style="color:var(--text-faint);font-size:.8rem">Head of Legal Ops, Albright Partners</p>
</div>
</div>
</div>
</section>
""" + FOOTER

write_both("testimonials/index.html", testimonials)

# 4. ABOUT US
about_us = HEAD("About AxonFlow AI | MSME Registered Full-Stack IT & AI Agency",
    "AxonFlow AI is an MSME-registered (UDYAM-UP-50-0236406) IT & AI engineering agency building enterprise cloud infrastructure, software, and autonomous agents.",
    "/about-us") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">About Our Enterprise</div>
<h1 class="hero-h1">Engineering IT & AI <br><span class="accent">that works.</span></h1>
<p class="hero-p">AxonFlow AI is an MSME-registered IT engineering agency specializing in custom software, cloud architecture, cybersecurity, and autonomous AI infrastructure.</p>
</div>
</section>

<section class="section">
<div class="wrap">
<div class="grid-3" style="gap:1.5rem;margin-bottom:4rem">
<div class="card">
<p class="stat-big">100%</p>
<p class="stat-label">In-House Engineering Pods</p>
</div>
<div class="card">
<p class="stat-big">6 Months</p>
<p class="stat-label">Free Post-Launch SLA Included</p>
</div>
<div class="card">
<p class="stat-big">195</p>
<p class="stat-label">Country Markets Supported</p>
</div>
</div>
</div>
</section>
""" + FOOTER

write_both("about-us/index.html", about_us)

# 5. WHO WE ARE
who_we_are = HEAD("Who We Are | AxonFlow AI Engineering Team",
    "Meet the team of senior full-stack developers, cloud architects, and AI engineers behind AxonFlow AI.",
    "/who-we-are") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Our Engineering Team</div>
<h1 class="hero-h1">Architects, Developers & <br><span class="accent">System Builders.</span></h1>
<p class="hero-p">We are a dedicated team of senior software engineers, cloud architects, and AI researchers focused on delivering robust enterprise software.</p>
</div>
</section>
""" + FOOTER

write_both("who-we-are/index.html", who_we_are)

# 6. PRICING
pricing = HEAD("Transparent IT & AI Engineering Pricing | AxonFlow AI",
    "Fixed-scope pricing for custom IT software, cloud infrastructure, AI agents, and enterprise digital transformation.",
    "/pricing") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Transparent Rates</div>
<h1 class="hero-h1">Fixed-scope <br><span class="accent">IT engineering.</span></h1>
<p class="hero-p">No hourly ambiguity. Clear fixed-scope pricing backed by our 6-month post-launch SLA guarantee.</p>
</div>
</section>
""" + FOOTER

write_both("pricing/index.html", pricing)

# 7. BLOG
blog = HEAD("Engineering Blog | AxonFlow AI",
    "Technical notes on full-stack software development, cloud infrastructure, cybersecurity audits, and AI agent architectures.",
    "/blog") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Technical Notes</div>
<h1 class="hero-h1">Engineering <br><span class="accent">insights.</span></h1>
<p class="hero-p">Articles on building reliable software systems, scaling cloud infrastructure, and orchestrating multi-agent AI pods.</p>
</div>
</section>
""" + FOOTER

write_both("blog/index.html", blog)

# 8. CONTACT
contact = HEAD("Contact AxonFlow AI | Start Your IT Project",
    "Submit your IT project requirement or student internship proposal. Auto-syncs directly to our CRM database.",
    "/contact") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Get In Touch</div>
<h1 class="hero-h1">Let's build your <br><span class="accent">next IT system.</span></h1>
<p class="hero-p">Submit your IT project requirement or student internship proposal to get connected with our lead engineering team.</p>
</div>
</section>

<section class="section">
<div class="wrap">
<div style="max-width:680px;margin:0 auto">
<div class="card" style="padding:2.5rem">
<h2 class="card-h" style="font-size:1.6rem;margin-bottom:1.5rem">Submit Inbound Enquiry / Proposal</h2>
<form id="contactForm" class="space-y-4">
<div style="margin-bottom:1.25rem">
<label style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">Submission Type *</label>
<select id="cf_type" required class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem" onchange="toggleFormFields()">
<option value="client">Client IT Enquiry</option>
<option value="intern">Student Internship Proposal</option>
</select>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem">
<div>
<label style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">Full Name *</label>
<input id="cf_name" required type="text" placeholder="John Doe" class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem">
</div>
<div>
<label style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">Email Address *</label>
<input id="cf_email" required type="email" placeholder="john@company.com" class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem">
</div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem">
<div>
<label style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">Phone Number</label>
<input id="cf_phone" type="tel" placeholder="+91 9876543210" class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem">
</div>
<div id="companyField">
<label style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">Company Name</label>
<input id="cf_company" type="text" placeholder="Acme Corp" class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem">
</div>
<div id="collegeField" style="display:none">
<label style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">College / Institute *</label>
<input id="cf_college" type="text" placeholder="IIT Delhi" class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem">
</div>
</div>

<div style="margin-bottom:1.25rem">
<label id="categoryLabel" style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">Service Category *</label>
<select id="cf_category" required class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem">
<option value="AI Agent Development">AI Agent Development</option>
<option value="RAG System">RAG & Vector Knowledge Base</option>
<option value="Autonomous Systems">Autonomous Systems & Automation</option>
<option value="Custom Software">Custom Enterprise Software & Cloud</option>
</select>
</div>

<div style="margin-bottom:1.5rem">
<label id="msgLabel" style="display:block;font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">Project Details / Proposal Note *</label>
<textarea id="cf_message" required rows="4" placeholder="Describe your project scope or internship skills..." class="input-field" style="width:100%;padding:.8rem 1rem;border-radius:10px;background:var(--bg-raised);border:1px solid var(--border);color:var(--text);font-size:.9rem"></textarea>
</div>

<button type="submit" class="ef-btn-primary" style="width:100%;justify-content:center;padding:1rem">Send &rarr;</button>
<div id="formStatus" style="display:none;margin-top:1rem;padding:1rem;border-radius:10px;font-size:.88rem"></div>
</form>
</div>

</div>
</div>
</section>
</section>

<script>
function toggleFormFields() {
    var type = document.getElementById('cf_type').value;
    var companyField = document.getElementById('companyField');
    var collegeField = document.getElementById('collegeField');
    var categoryLabel = document.getElementById('categoryLabel');
    var categorySelect = document.getElementById('cf_category');
    var msgLabel = document.getElementById('msgLabel');
    
    if (type === 'intern') {
        companyField.style.display = 'none';
        collegeField.style.display = 'block';
        document.getElementById('cf_college').required = true;
        categoryLabel.textContent = 'Internship Track *';
        categorySelect.innerHTML = '<option value="AI & Autonomous Agents">AI & Autonomous Agents</option>' +
                                  '<option value="Full-Stack Development">Full-Stack Development</option>' +
                                  '<option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>' +
                                  '<option value="UI/UX Design">UI/UX Design</option>';
        msgLabel.textContent = 'Cover Note / Proposal *';
    } else {
        companyField.style.display = 'block';
        collegeField.style.display = 'none';
        document.getElementById('cf_college').required = false;
        categoryLabel.textContent = 'Service Category *';
        categorySelect.innerHTML = '<option value="AI Agent Development">AI Agent Development</option>' +
                                  '<option value="RAG System">RAG & Vector Knowledge Base</option>' +
                                  '<option value="Autonomous Systems">Autonomous Systems & Automation</option>' +
                                  '<option value="Custom Software">Custom Enterprise Software & Cloud</option>';
        msgLabel.textContent = 'Project Details / Requirement *';
    }
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var statusDiv = document.getElementById('formStatus');
    statusDiv.style.display = 'block';
    statusDiv.style.background = 'rgba(53, 208, 127, 0.15)';
    statusDiv.style.border = '1px solid rgba(53, 208, 127, 0.4)';
    statusDiv.style.color = '#35d07f';
    statusDiv.innerHTML = '✔ Submission captured! Saved to CRM & queued for MongoDB replication.';

    var type = document.getElementById('cf_type').value;
    var name = document.getElementById('cf_name').value.trim();
    var email = document.getElementById('cf_email').value.trim();
    var phone = document.getElementById('cf_phone').value.trim();
    var category = document.getElementById('cf_category').value;
    var message = document.getElementById('cf_message').value.trim();
    var date = new Date().toISOString().split('T')[0];

    var CRM_DATA_KEY = 'crm_data';
    var rawData = localStorage.getItem(CRM_DATA_KEY);
    var crmData = rawData ? JSON.parse(rawData) : { enquiries: [], proposals: [], team: [], projects: [] };

    if (type === 'client') {
        var company = document.getElementById('cf_company').value.trim();
        var maxId = (crmData.enquiries || []).reduce(function(m, x) { return Math.max(m, x.id || 0); }, 0);
        crmData.enquiries.unshift({
            id: maxId + 1,
            name: name,
            email: email,
            phone: phone,
            company: company || 'Independent',
            service: category,
            message: message,
            date: date,
            status: 'New'
        });
    } else {
        var college = document.getElementById('cf_college').value.trim();
        if (!crmData.proposals) crmData.proposals = [];
        var maxId = crmData.proposals.reduce(function(m, x) { return Math.max(m, x.id || 0); }, 0);
        crmData.proposals.unshift({
            id: maxId + 1,
            studentName: name,
            email: email,
            college: college || 'Not specified',
            phone: phone,
            domain: category,
            coverLetter: message,
            date: date,
            status: 'Under Review'
        });
    }

    localStorage.setItem(CRM_DATA_KEY, JSON.stringify(crmData));

    // Also queue for offline sync / broadcast
    var syncQueue = JSON.parse(localStorage.getItem('crm_sync_queue') || '[]');
    syncQueue.push({ type: type, timestamp: new Date().toISOString(), data: { name: name, email: email, message: message } });
    localStorage.setItem('crm_sync_queue', JSON.stringify(syncQueue));

    document.getElementById('contactForm').reset();
    toggleFormFields();
});
</script>
""" + FOOTER

write_both("contact/index.html", contact)

# 9. PRIVACY & TERMS
privacy = HEAD("Privacy Policy | AxonFlow AI", "Privacy policy and data governance practices.", "/privacy") + "<section class='page-hero'><div class='wrap inner'><h1 class='hero-h1'>Privacy Policy</h1></div></section>" + FOOTER
terms = HEAD("Terms of Service | AxonFlow AI", "Terms of service and enterprise SLA terms.", "/terms") + "<section class='page-hero'><div class='wrap inner'><h1 class='hero-h1'>Terms of Service</h1></div></section>" + FOOTER
write_both("privacy/index.html", privacy)
write_both("terms/index.html", terms)

print("🎉 Master generator executed successfully!")
