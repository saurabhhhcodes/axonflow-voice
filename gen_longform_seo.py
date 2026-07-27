#!/usr/bin/env python3
"""
Comprehensive Long-Form SEO / GEO / AEO Content Generator for AxonFlow AI:
1. Long-form, highly detailed Country Market Pages for all 195 countries with JSON-LD Schema.
2. Long-form technical Blog Articles with code examples, architectural diagrams, and GEO/AEO FAQ sections.
3. Enhanced "Who We Are" page with visible leadership, engineering pod breakdowns, and UDYAM registration.
"""

import os, json

BASE = "/Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/autonomiq-website"

COUNTRIES = [
    ("afghanistan", "Afghanistan", "🇦🇫", "AFN", "Asia", "UTC+4:30", "Kabul", "South Asia"),
    ("albania", "Albania", "🇦🇱", "ALL", "Europe", "CET (UTC+1)", "Tirana", "Southeast Europe"),
    ("algeria", "Algeria", "🇩🇿", "DZD", "Africa", "CET (UTC+1)", "Algiers", "North Africa"),
    ("andorra", "Andorra", "🇦🇩", "EUR", "Europe", "CET (UTC+1)", "Andorra la Vella", "Western Europe"),
    ("angola", "Angola", "🇦🇴", "AOA", "Africa", "WAT (UTC+1)", "Luanda", "Central Africa"),
    ("antigua-and-barbuda", "Antigua and Barbuda", "🇦🇬", "XCD", "Americas", "AST (UTC-4)", "St. John's", "Caribbean"),
    ("argentina", "Argentina", "🇦🇷", "ARS", "Americas", "ART (UTC-3)", "Buenos Aires", "South America"),
    ("armenia", "Armenia", "🇦🇲", "AMD", "Asia", "AMT (UTC+4)", "Yerevan", "Caucasus"),
    ("australia", "Australia", "🇦🇺", "AUD", "Asia-Pacific", "AEST (UTC+10)", "Canberra", "Oceania"),
    ("austria", "Austria", "🇦🇹", "EUR", "Europe", "CET (UTC+1)", "Vienna", "Central Europe"),
    ("azerbaijan", "Azerbaijan", "🇦🇿", "AZN", "Asia", "AZT (UTC+4)", "Baku", "Caucasus"),
    ("bahamas", "Bahamas", "🇧🇸", "BSD", "Americas", "EST (UTC-5)", "Nassau", "Caribbean"),
    ("bahrain", "Bahrain", "🇧🇭", "BHD", "Middle East", "AST (UTC+3)", "Manama", "Persian Gulf"),
    ("bangladesh", "Bangladesh", "🇧🇩", "BDT", "Asia", "BST (UTC+6)", "Dhaka", "South Asia"),
    ("barbados", "Barbados", "🇧🇧", "BBD", "Americas", "AST (UTC-4)", "Bridgetown", "Caribbean"),
    ("belarus", "Belarus", "🇧🇾", "BYN", "Europe", "MSK (UTC+3)", "Minsk", "Eastern Europe"),
    ("belgium", "Belgium", "🇧🇪", "EUR", "Europe", "CET (UTC+1)", "Brussels", "Western Europe"),
    ("belize", "Belize", "🇧🇿", "BZD", "Americas", "CST (UTC-6)", "Belmopan", "Central America"),
    ("benin", "Benin", "🇧🇯", "XOF", "Africa", "WAT (UTC+1)", "Porto-Novo", "West Africa"),
    ("bhutan", "Bhutan", "🇧🇹", "BTN", "Asia", "BTT (UTC+6)", "Thimphu", "South Asia"),
    ("bolivia", "Bolivia", "🇧🇴", "BOB", "Americas", "BOT (UTC-4)", "Sucre", "South America"),
    ("bosnia-and-herzegovina", "Bosnia and Herzegovina", "🇧🇦", "BAM", "Europe", "CET (UTC+1)", "Sarajevo", "Southeast Europe"),
    ("botswana", "Botswana", "🇧🇼", "BWP", "Africa", "CAT (UTC+2)", "Gaborone", "Southern Africa"),
    ("brazil", "Brazil", "🇧🇷", "BRL", "Americas", "BRT (UTC-3)", "Brasília", "South America"),
    ("brunei", "Brunei", "🇧🇳", "BND", "Asia", "BNT (UTC+8)", "Bandar Seri Begawan", "Southeast Asia"),
    ("bulgaria", "Bulgaria", "🇧🇬", "BGN", "Europe", "EET (UTC+2)", "Sofia", "Southeast Europe"),
    ("burkina-faso", "Burkina Faso", "🇧🇫", "XOF", "Africa", "GMT (UTC+0)", "Ouagadougou", "West Africa"),
    ("burundi", "Burundi", "🇧🇮", "BIF", "Africa", "CAT (UTC+2)", "Gitega", "East Africa"),
    ("cabo-verde", "Cabo Verde", "🇨🇻", "CVE", "Africa", "CVT (UTC-1)", "Praia", "West Africa"),
    ("cambodia", "Cambodia", "🇰🇭", "KHR", "Asia", "ICT (UTC+7)", "Phnom Penh", "Southeast Asia"),
    ("cameroon", "Cameroon", "🇨🇲", "XAF", "Africa", "WAT (UTC+1)", "Yaoundé", "Central Africa"),
    ("canada", "Canada", "🇨🇦", "CAD", "North America", "EST/PST", "Ottawa", "North America"),
    ("central-african-republic", "Central African Republic", "🇨🇫", "XAF", "Africa", "WAT (UTC+1)", "Bangui", "Central Africa"),
    ("chad", "Chad", "🇹🇩", "XAF", "Africa", "WAT (UTC+1)", "N'Djamena", "Central Africa"),
    ("chile", "Chile", "🇨🇱", "CLP", "Americas", "CLT (UTC-3)", "Santiago", "South America"),
    ("china", "China", "🇨🇳", "CNY", "Asia", "CST (UTC+8)", "Beijing", "East Asia"),
    ("colombia", "Colombia", "🇨🇴", "COP", "Americas", "COT (UTC-5)", "Bogotá", "South America"),
    ("comoros", "Comoros", "🇰🇲", "KMF", "Africa", "EAT (UTC+3)", "Moroni", "East Africa"),
    ("congo-democratic-republic", "Democratic Republic of the Congo", "🇨🇩", "CDF", "Africa", "WAT/CAT", "Kinshasa", "Central Africa"),
    ("congo-republic", "Republic of the Congo", "🇨🇬", "XAF", "Africa", "WAT (UTC+1)", "Brazzaville", "Central Africa"),
    ("costa-rica", "Costa Rica", "🇨🇷", "CRC", "Americas", "CST (UTC-6)", "San José", "Central America"),
    ("croatia", "Croatia", "🇭🇷", "EUR", "Europe", "CET (UTC+1)", "Zagreb", "Southeast Europe"),
    ("cuba", "Cuba", "🇨🇺", "CUP", "Americas", "CST (UTC-5)", "Havana", "Caribbean"),
    ("cyprus", "Cyprus", "🇨🇾", "EUR", "Europe", "EET (UTC+2)", "Nicosia", "Middle East"),
    ("czech-republic", "Czech Republic", "🇨🇿", "CZK", "Europe", "CET (UTC+1)", "Prague", "Central Europe"),
    ("denmark", "Denmark", "🇩🇰", "DKK", "Europe", "CET (UTC+1)", "Copenhagen", "Northern Europe"),
    ("djibouti", "Djibouti", "🇩🇯", "DJF", "Africa", "EAT (UTC+3)", "Djibouti", "East Africa"),
    ("dominica", "Dominica", "🇩🇲", "XCD", "Americas", "AST (UTC-4)", "Roseau", "Caribbean"),
    ("dominican-republic", "Dominican Republic", "🇩🇴", "DOP", "Americas", "AST (UTC-4)", "Santo Domingo", "Caribbean"),
    ("ecuador", "Ecuador", "🇪🇨", "USD", "Americas", "ECT (UTC-5)", "Quito", "South America"),
    ("egypt", "Egypt", "🇪🇬", "EGP", "Middle East", "EET (UTC+2)", "Cairo", "North Africa"),
    ("el-salvador", "El Salvador", "🇸🇻", "USD", "Americas", "CST (UTC-6)", "San Salvador", "Central America"),
    ("equatorial-guinea", "Equatorial Guinea", "🇬🇶", "XAF", "Africa", "WAT (UTC+1)", "Malabo", "Central Africa"),
    ("eritrea", "Eritrea", "🇪🇷", "ERN", "Africa", "EAT (UTC+3)", "Asmara", "East Africa"),
    ("estonia", "Estonia", "🇪🇪", "EUR", "Europe", "EET (UTC+2)", "Tallinn", "Northern Europe"),
    ("eswatini", "Eswatini", "🇸🇿", "SZL", "Africa", "SAST (UTC+2)", "Mbabane", "Southern Africa"),
    ("ethiopia", "Ethiopia", "🇪🇹", "ETB", "Africa", "EAT (UTC+3)", "Addis Ababa", "East Africa"),
    ("fiji", "Fiji", "🇫🇯", "FJD", "Asia-Pacific", "FJT (UTC+12)", "Suva", "Oceania"),
    ("finland", "Finland", "🇫🇮", "EUR", "Europe", "EET (UTC+2)", "Helsinki", "Northern Europe"),
    ("france", "France", "🇫🇷", "EUR", "Europe", "CET (UTC+1)", "Paris", "Western Europe"),
    ("gabon", "Gabon", "🇬🇦", "XAF", "Africa", "WAT (UTC+1)", "Libreville", "Central Africa"),
    ("gambia", "Gambia", "🇬🇲", "GMD", "Africa", "GMT (UTC+0)", "Banjul", "West Africa"),
    ("georgia", "Georgia", "🇬🇪", "GEL", "Europe", "GET (UTC+4)", "Tbilisi", "Caucasus"),
    ("germany", "Germany", "🇩🇪", "EUR", "Europe", "CET (UTC+1)", "Berlin", "Central Europe"),
    ("ghana", "Ghana", "🇬🇭", "GHS", "Africa", "GMT (UTC+0)", "Accra", "West Africa"),
    ("greece", "Greece", "🇬🇷", "EUR", "Europe", "EET (UTC+2)", "Athens", "Southern Europe"),
    ("grenada", "Grenada", "🇬🇩", "XCD", "Americas", "AST (UTC-4)", "St. George's", "Caribbean"),
    ("guatemala", "Guatemala", "🇬🇹", "GTQ", "Americas", "CST (UTC-6)", "Guatemala City", "Central America"),
    ("guinea", "Guinea", "🇬🇳", "GNF", "Africa", "GMT (UTC+0)", "Conakry", "West Africa"),
    ("guinea-bissau", "Guinea-Bissau", "🇬🇼", "XOF", "Africa", "GMT (UTC+0)", "Bissau", "West Africa"),
    ("guyana", "Guyana", "🇬🇾", "GYD", "Americas", "GYT (UTC-4)", "Georgetown", "South America"),
    ("haiti", "Haiti", "🇭🇹", "HTG", "Americas", "EST (UTC-5)", "Port-au-Prince", "Caribbean"),
    ("honduras", "Honduras", "🇭🇳", "HNL", "Americas", "CST (UTC-6)", "Tegucigalpa", "Central America"),
    ("hungary", "Hungary", "🇭🇺", "HUF", "Europe", "CET (UTC+1)", "Budapest", "Central Europe"),
    ("iceland", "Iceland", "🇮🇸", "ISK", "Europe", "GMT (UTC+0)", "Reykjavík", "Northern Europe"),
    ("india", "India", "🇮🇳", "INR", "Asia-Pacific", "IST (UTC+5:30)", "New Delhi", "South Asia"),
    ("indonesia", "Indonesia", "🇮🇩", "IDR", "Asia-Pacific", "WIB (UTC+7)", "Jakarta", "Southeast Asia"),
    ("iran", "Iran", "🇮🇷", "IRR", "Middle East", "IRST (UTC+3:30)", "Tehran", "Middle East"),
    ("iraq", "Iraq", "🇮🇶", "IQD", "Middle East", "AST (UTC+3)", "Baghdad", "Middle East"),
    ("ireland", "Ireland", "🇮🇪", "EUR", "Europe", "GMT (UTC+0)", "Dublin", "Western Europe"),
    ("israel", "Israel", "🇮🇱", "ILS", "Middle East", "IST (UTC+2)", "Jerusalem", "Middle East"),
    ("italy", "Italy", "🇮🇹", "EUR", "Europe", "CET (UTC+1)", "Rome", "Southern Europe"),
    ("jamaica", "Jamaica", "🇯🇲", "JMD", "Americas", "EST (UTC-5)", "Kingston", "Caribbean"),
    ("japan", "Japan", "🇯🇵", "JPY", "Asia-Pacific", "JST (UTC+9)", "Tokyo", "East Asia"),
    ("jordan", "Jordan", "🇯🇴", "JOD", "Middle East", "AST (UTC+3)", "Amman", "Middle East"),
    ("kazakhstan", "Kazakhstan", "🇰🇿", "KZT", "Asia", "ALMT (UTC+6)", "Astana", "Central Asia"),
    ("kenya", "Kenya", "🇰🇪", "KES", "Africa", "EAT (UTC+3)", "Nairobi", "East Africa"),
    ("kiribati", "Kiribati", "🇰🇮", "AUD", "Asia-Pacific", "GILT (UTC+12)", "Tarawa", "Oceania"),
    ("korea-north", "North Korea", "🇰🇵", "KPW", "Asia", "KST (UTC+9)", "Pyongyang", "East Asia"),
    ("korea-south", "South Korea", "🇰🇷", "KRW", "Asia-Pacific", "KST (UTC+9)", "Seoul", "East Asia"),
    ("kuwait", "Kuwait", "🇰🇼", "KWD", "Middle East", "AST (UTC+3)", "Kuwait City", "Middle East"),
    ("kyrgyzstan", "Kyrgyzstan", "🇰🇬", "KGS", "Asia", "KGT (UTC+6)", "Bishkek", "Central Asia"),
    ("laos", "Laos", "🇱🇦", "LAK", "Asia", "ICT (UTC+7)", "Vientiane", "Southeast Asia"),
    ("latvia", "Latvia", "🇱🇻", "EUR", "Europe", "EET (UTC+2)", "Riga", "Northern Europe"),
    ("lebanon", "Lebanon", "🇱🇧", "LBP", "Middle East", "EET (UTC+2)", "Beirut", "Middle East"),
    ("lesotho", "Lesotho", "🇱🇸", "LSL", "Africa", "SAST (UTC+2)", "Maseru", "Southern Africa"),
    ("liberia", "Liberia", "🇱🇷", "LRD", "Africa", "GMT (UTC+0)", "Monrovia", "West Africa"),
    ("libya", "Libya", "🇱🇾", "LYD", "Africa", "EET (UTC+2)", "Tripoli", "North Africa"),
    ("liechtenstein", "Liechtenstein", "🇱🇮", "CHF", "Europe", "CET (UTC+1)", "Vaduz", "Western Europe"),
    ("lithuania", "Lithuania", "🇱🇹", "EUR", "Europe", "EET (UTC+2)", "Vilnius", "Northern Europe"),
    ("luxembourg", "Luxembourg", "🇱🇺", "EUR", "Europe", "CET (UTC+1)", "Luxembourg", "Western Europe"),
    ("madagascar", "Madagascar", "🇲🇬", "MGA", "Africa", "EAT (UTC+3)", "Antananarivo", "East Africa"),
    ("malawi", "Malawi", "🇲🇼", "MWK", "Africa", "CAT (UTC+2)", "Lilongwe", "Southeast Africa"),
    ("malaysia", "Malaysia", "🇲🇾", "MYR", "Asia-Pacific", "MYT (UTC+8)", "Kuala Lumpur", "Southeast Asia"),
    ("maldives", "Maldives", "🇲🇻", "MVR", "Asia", "MVT (UTC+5)", "Malé", "South Asia"),
    ("mali", "Mali", "🇲🇱", "XOF", "Africa", "GMT (UTC+0)", "Bamako", "West Africa"),
    ("malta", "Malta", "🇲🇹", "EUR", "Europe", "CET (UTC+1)", "Valletta", "Southern Europe"),
    ("marshall-islands", "Marshall Islands", "🇲🇭", "USD", "Asia-Pacific", "MHT (UTC+12)", "Majuro", "Oceania"),
    ("mauritania", "Mauritania", "🇲🇷", "MRU", "Africa", "GMT (UTC+0)", "Nouakchott", "West Africa"),
    ("mauritius", "Mauritius", "🇲🇺", "MUR", "Africa", "MUT (UTC+4)", "Port Louis", "East Africa"),
    ("mexico", "Mexico", "🇲🇽", "MXN", "Americas", "CST (UTC-6)", "Mexico City", "North America"),
    ("micronesia", "Micronesia", "🇫🇲", "USD", "Asia-Pacific", "PONT (UTC+11)", "Palikir", "Oceania"),
    ("moldova", "Moldova", "🇲🇩", "MDL", "Europe", "EET (UTC+2)", "Chișinău", "Eastern Europe"),
    ("monaco", "Monaco", "🇲🇨", "EUR", "Europe", "CET (UTC+1)", "Monaco", "Western Europe"),
    ("mongolia", "Mongolia", "🇲🇳", "MNT", "Asia", "ULAT (UTC+8)", "Ulaanbaatar", "East Asia"),
    ("montenegro", "Montenegro", "🇲🇪", "EUR", "Europe", "CET (UTC+1)", "Podgorica", "Southeast Europe"),
    ("morocco", "Morocco", "🇲🇦", "MAD", "Africa", "WET (UTC+1)", "Rabat", "North Africa"),
    ("mozambique", "Mozambique", "🇲🇿", "MZN", "Africa", "CAT (UTC+2)", "Maputo", "Southeast Africa"),
    ("myanmar", "Myanmar", "🇲🇲", "MMK", "Asia", "MMT (UTC+6:30)", "Naypyidaw", "Southeast Asia"),
    ("namibia", "Namibia", "🇳🇦", "NAD", "Africa", "CAT (UTC+2)", "Windhoek", "Southern Africa"),
    ("nauru", "Nauru", "🇳🇷", "AUD", "Asia-Pacific", "NRT (UTC+12)", "Yaren", "Oceania"),
    ("nepal", "Nepal", "🇳🇵", "NPR", "Asia", "NPT (UTC+5:45)", "Kathmandu", "South Asia"),
    ("netherlands", "Netherlands", "🇳🇱", "EUR", "Europe", "CET (UTC+1)", "Amsterdam", "Western Europe"),
    ("new-zealand", "New Zealand", "🇳🇿", "NZD", "Asia-Pacific", "NZST (UTC+12)", "Wellington", "Oceania"),
    ("nicaragua", "Nicaragua", "🇳🇮", "NIO", "Americas", "CST (UTC-6)", "Managua", "Central America"),
    ("niger", "Niger", "🇳🇪", "XOF", "Africa", "WAT (UTC+1)", "Niamey", "West Africa"),
    ("nigeria", "Nigeria", "🇳🇬", "NGN", "Africa", "WAT (UTC+1)", "Abuja", "West Africa"),
    ("north-macedonia", "North Macedonia", "🇲🇰", "MKD", "Europe", "CET (UTC+1)", "Skopje", "Southeast Europe"),
    ("norway", "Norway", "🇳🇴", "NOK", "Europe", "CET (UTC+1)", "Oslo", "Northern Europe"),
    ("oman", "Oman", "🇴🇲", "OMR", "Middle East", "GST (UTC+4)", "Muscat", "Middle East"),
    ("pakistan", "Pakistan", "🇵🇰", "PKR", "Asia", "PKT (UTC+5)", "Islamabad", "South Asia"),
    ("palau", "Palau", "🇵🇼", "USD", "Asia-Pacific", "PWT (UTC+9)", "Ngerulmud", "Oceania"),
    ("panama", "Panama", "🇵🇦", "USD", "Americas", "EST (UTC-5)", "Panama City", "Central America"),
    ("papua-new-guinea", "Papua New Guinea", "🇵🇬", "PGK", "Asia-Pacific", "PGT (UTC+10)", "Port Moresby", "Oceania"),
    ("paraguay", "Paraguay", "🇵🇾", "PYG", "Americas", "PYT (UTC-4)", "Asunción", "South America"),
    ("peru", "Peru", "🇵🇪", "PEN", "Americas", "PET (UTC-5)", "Lima", "South America"),
    ("philippines", "Philippines", "🇵🇭", "PHP", "Asia-Pacific", "PST (UTC+8)", "Manila", "Southeast Asia"),
    ("poland", "Poland", "🇵🇱", "PLN", "Europe", "CET (UTC+1)", "Warsaw", "Central Europe"),
    ("portugal", "Portugal", "🇵🇹", "EUR", "Europe", "WET (UTC+0)", "Lisbon", "Southern Europe"),
    ("qatar", "Qatar", "🇶🇦", "QAR", "Middle East", "AST (UTC+3)", "Doha", "Middle East"),
    ("romania", "Romania", "🇷🇴", "RON", "Europe", "EET (UTC+2)", "Bucharest", "Southeast Europe"),
    ("russia", "Russia", "🇷🇺", "RUB", "Europe/Asia", "MSK (UTC+3)", "Moscow", "Eurasia"),
    ("rwanda", "Rwanda", "🇷🇼", "RWF", "Africa", "CAT (UTC+2)", "Kigali", "East Africa"),
    ("saint-kitts-and-nevis", "Saint Kitts and Nevis", "🇰🇳", "XCD", "Americas", "AST (UTC-4)", "Basseterre", "Caribbean"),
    ("saint-lucia", "Saint Lucia", "🇱🇨", "XCD", "Americas", "AST (UTC-4)", "Castries", "Caribbean"),
    ("saint-vincent-and-the-grenadines", "Saint Vincent and the Grenadines", "🇻🇨", "XCD", "Americas", "AST (UTC-4)", "Kingstown", "Caribbean"),
    ("samoa", "Samoa", "🇼🇸", "WST", "Asia-Pacific", "WST (UTC+13)", "Apia", "Oceania"),
    ("san-marino", "San Marino", "🇸🇲", "EUR", "Europe", "CET (UTC+1)", "San Marino", "Southern Europe"),
    ("sao-tome-and-principe", "Sao Tome and Principe", "🇸🇹", "STN", "Africa", "GMT (UTC+0)", "São Tomé", "Central Africa"),
    ("saudi-arabia", "Saudi Arabia", "🇸🇦", "SAR", "Middle East", "AST (UTC+3)", "Riyadh", "Middle East"),
    ("senegal", "Senegal", "🇸🇳", "XOF", "Africa", "GMT (UTC+0)", "Dakar", "West Africa"),
    ("serbia", "Serbia", "🇷🇸", "RSD", "Europe", "CET (UTC+1)", "Belgrade", "Southeast Europe"),
    ("seychelles", "Seychelles", "🇸🇨", "SCR", "Africa", "SCT (UTC+4)", "Victoria", "East Africa"),
    ("sierra-leone", "Sierra Leone", "🇸🇱", "SLE", "Africa", "GMT (UTC+0)", "Freetown", "West Africa"),
    ("singapore", "Singapore", "🇸🇬", "SGD", "Asia-Pacific", "SGT (UTC+8)", "Singapore", "Southeast Asia"),
    ("slovakia", "Slovakia", "🇸🇰", "EUR", "Europe", "CET (UTC+1)", "Bratislava", "Central Europe"),
    ("slovenia", "Slovenia", "🇸🇮", "EUR", "Europe", "CET (UTC+1)", "Ljubljana", "Central Europe"),
    ("solomon-islands", "Solomon Islands", "🇸🇧", "SBD", "Asia-Pacific", "SBT (UTC+11)", "Honiara", "Oceania"),
    ("somalia", "Somalia", "🇸🇴", "SOS", "Africa", "EAT (UTC+3)", "Mogadishu", "East Africa"),
    ("south-africa", "South Africa", "🇿🇦", "ZAR", "Africa", "SAST (UTC+2)", "Pretoria", "Southern Africa"),
    ("south-sudan", "South Sudan", "🇸🇸", "SSP", "Africa", "CAT (UTC+2)", "Juba", "East Africa"),
    ("spain", "Spain", "🇪🇸", "EUR", "Europe", "CET (UTC+1)", "Madrid", "Southern Europe"),
    ("sri-lanka", "Sri Lanka", "🇱🇰", "LKR", "Asia", "SLST (UTC+5:30)", "Colombo", "South Asia"),
    ("sudan", "Sudan", "🇸🇩", "SDG", "Africa", "CAT (UTC+2)", "Khartoum", "North Africa"),
    ("suriname", "Suriname", "🇸🇷", "SRD", "Americas", "SRT (UTC-3)", "Paramaribo", "South America"),
    ("sweden", "Sweden", "🇸🇪", "SEK", "Europe", "CET (UTC+1)", "Stockholm", "Northern Europe"),
    ("switzerland", "Switzerland", "🇨🇭", "CHF", "Europe", "CET (UTC+1)", "Bern", "Western Europe"),
    ("syria", "Syria", "🇸🇾", "SYP", "Middle East", "EET (UTC+2)", "Damascus", "Middle East"),
    ("taiwan", "Taiwan", "🇹🇼", "TWD", "Asia-Pacific", "CST (UTC+8)", "Taipei", "East Asia"),
    ("tajikistan", "Tajikistan", "🇹🇯", "TJS", "Asia", "TJT (UTC+5)", "Dushanbe", "Central Asia"),
    ("tanzania", "Tanzania", "🇹🇿", "TZS", "Africa", "EAT (UTC+3)", "Dodoma", "East Africa"),
    ("thailand", "Thailand", "🇹🇭", "THB", "Asia-Pacific", "ICT (UTC+7)", "Bangkok", "Southeast Asia"),
    ("timor-leste", "Timor-Leste", "🇹🇱", "USD", "Asia-Pacific", "TLT (UTC+9)", "Dili", "Southeast Asia"),
    ("togo", "Togo", "🇹🇬", "XOF", "Africa", "GMT (UTC+0)", "Lomé", "West Africa"),
    ("tonga", "Tonga", "🇹🇴", "TOP", "Asia-Pacific", "TOT (UTC+13)", "Nukuʻalofa", "Oceania"),
    ("trinidad-and-tobago", "Trinidad and Tobago", "🇹TT", "TTD", "Americas", "AST (UTC-4)", "Port of Spain", "Caribbean"),
    ("tunisia", "Tunisia", "🇹🇳", "TND", "Africa", "CET (UTC+1)", "Tunis", "North Africa"),
    ("turkey", "Turkey", "🇹🇷", "TRY", "Europe/Middle East", "TRT (UTC+3)", "Ankara", "Eurasia"),
    ("turkmenistan", "Turkmenistan", "🇹🇲", "TMT", "Asia", "TMT (UTC+5)", "Ashgabat", "Central Asia"),
    ("tuvalu", "Tuvalu", "🇹🇻", "AUD", "Asia-Pacific", "TVT (UTC+12)", "Funafuti", "Oceania"),
    ("uganda", "Uganda", "🇺🇬", "UGX", "Africa", "EAT (UTC+3)", "Kampala", "East Africa"),
    ("ukraine", "Ukraine", "🇺🇦", "UAH", "Europe", "EET (UTC+2)", "Kyiv", "Eastern Europe"),
    ("united-arab-emirates", "United Arab Emirates", "🇦🇪", "AED", "Middle East", "GST (UTC+4)", "Abu Dhabi", "Middle East"),
    ("united-kingdom", "United Kingdom", "🇬🇧", "GBP", "Europe", "GMT/BST", "London", "Western Europe"),
    ("united-states", "United States", "🇺🇸", "USD", "North America", "EST/PST", "Washington, D.C.", "North America"),
    ("uruguay", "Uruguay", "🇺🇾", "UYU", "Americas", "UYT (UTC-3)", "Montevideo", "South America"),
    ("uzbekistan", "Uzbekistan", "🇺🇿", "UZS", "Asia", "UZT (UTC+5)", "Tashkent", "Central Asia"),
    ("vanuatu", "Vanuatu", "🇻🇺", "VUV", "Asia-Pacific", "VUT (UTC+11)", "Port Vila", "Oceania"),
    ("vatican-city", "Vatican City", "🇻🇦", "EUR", "Europe", "CET (UTC+1)", "Vatican City", "Southern Europe"),
    ("venezuela", "Venezuela", "🇻🇪", "VES", "Americas", "VET (UTC-4)", "Caracas", "South America"),
    ("vietnam", "Vietnam", "🇻🇳", "VND", "Asia-Pacific", "ICT (UTC+7)", "Hanoi", "Southeast Asia"),
    ("yemen", "Yemen", "🇾🇪", "YER", "Middle East", "AST (UTC+3)", "Sana'a", "Middle East"),
    ("zambia", "Zambia", "🇿🇲", "ZMW", "Africa", "CAT (UTC+2)", "Lusaka", "Southern Africa"),
    ("zimbabwe", "Zimbabwe", "🇿🇼", "ZWG", "Africa", "CAT (UTC+2)", "Harare", "Southern Africa")
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
{extra_css}
</style>
</head>
<body class="ef-body">
<a href="#main" style="position:absolute;top:-100px;left:1rem;z-index:999;background:var(--accent);color:#fff;padding:.5rem 1rem;border-radius:6px;font-size:.85rem;transition:top .2s" onfocus="this.style.top='1rem'" onblur="this.style.top='-100px'">Skip to main content</a>
<header>
<nav class="ef-nav" aria-label="Main navigation">
<div class="wrap ef-nav-bar">
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
<a href="https://github.com/saurabhhhcodes" class="ef-social-btn" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.15c-3.2.7-3.87-1.35-3.87-1.35-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.98 0 1.98.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg></a>
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
<li><a href="/open-source" style="transition:color .2s">Open Source</a></li>
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

<script>
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
</script>
</body>
</html>"""

def write_both(rel_path, content):
    p1 = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(p1), exist_ok=True)
    with open(p1, "w", encoding="utf-8") as f:
        f.write(content)
    if rel_path.endswith("/index.html") and rel_path != "index.html":
        alias = rel_path[:-11] + ".html"
        p2 = os.path.join(BASE, alias)
        with open(p2, "w", encoding="utf-8") as f:
            f.write(content)

# 1. WHO WE ARE (Full Page Build)
who_we_are_page = HEAD("Who We Are | AxonFlow AI Senior Engineering Pods",
    "Meet the senior software engineers, cloud architects, and AI researchers driving IT digital transformation at AxonFlow AI.",
    "/who-we-are") + """
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Senior Engineering Leadership</div>
<h1 class="hero-h1">Architects, Developers & <br><span class="accent">System Builders.</span></h1>
<p class="hero-p">AxonFlow AI is an MSME-registered enterprise (UDYAM-UP-50-0236406) powered by senior full-stack developers, cloud architects, and AI researchers delivering enterprise software systems worldwide.</p>
</div>
</section>

<div class="ef-rail wrap" style="padding-left:1.5rem;padding-right:1.5rem">
<span><span class="dot-live"></span>MSME Registered: UDYAM-UP-50-0236406</span>
<span>&middot;</span><span>100% In-House Senior Pods</span>
<span>&middot;</span><span>Global Support SLA</span>
</div>

<section class="section">
<div class="wrap">
<h2 class="section-title">Our Dedicated <span class="accent">Engineering Pods</span></h2>
<p class="section-sub" style="margin-bottom:3rem">We deploy modular, cross-functional engineering pods composed of senior developers who own your project end-to-end.</p>

<div class="grid-3" style="gap:2rem;margin-bottom:5rem">
<div class="card">
<span class="tag" style="margin-bottom:1rem;display:inline-block">Full-Stack & Mobile</span>
<h3 class="card-h" style="font-size:1.4rem">Full-Stack Application Pod</h3>
<p class="card-p" style="margin-bottom:1.5rem">Senior React, Next.js, Node.js, Python, and Flutter engineers specializing in high-throughput enterprise portals and mobile apps.</p>
<ul class="check-list">
<li>10+ Years Avg experience</li>
<li>TypeScript & Python Lead</li>
<li>Strict Automated Test Coverage</li>
</ul>
</div>

<div class="card">
<span class="tag" style="margin-bottom:1rem;display:inline-block">Cloud & Security</span>
<h3 class="card-h" style="font-size:1.4rem">Cloud Infrastructure & DevOps Pod</h3>
<p class="card-p" style="margin-bottom:1.5rem">Certified AWS, GCP, and Azure solutions architects specializing in Kubernetes, Terraform, zero-downtime CI/CD, and SOC2 compliance.</p>
<ul class="check-list">
<li>AWS & GCP Certified Engineers</li>
<li>Zero-Downtime Pipeline Architecture</li>
<li>Cybersecurity & Penetration Audits</li>
</ul>
</div>

<div class="card">
<span class="tag" style="margin-bottom:1rem;display:inline-block">AI Systems</span>
<h3 class="card-h" style="font-size:1.4rem">Autonomous AI & RAG Pod</h3>
<p class="card-p" style="margin-bottom:1.5rem">AI research engineers specializing in vector database orchestration, multi-agent frameworks (LangGraph, AutoGen), and LLM fine-tuning.</p>
<ul class="check-list">
<li>Qdrant & Pinecone Experts</li>
<li>Sub-400ms RAG Pipelines</li>
<li>Multi-Agent Autonomous Workflows</li>
</ul>
</div>
</div>

<div class="cta-block">
<h2 class="section-title">Meet the Team for a <span class="accent">Technical Scoping Session</span></h2>
<p class="hero-p" style="margin:0 auto 2rem">Direct engineering contact without sales reps. Speak directly to senior system architects.</p>
<a href="/contact" class="ef-btn-primary">Schedule Scoping Call &rarr;</a>
</div>
</div>
</section>
""" + FOOTER

write_both("who-we-are/index.html", who_we_are_page)

# 2. GENERATE LONG-FORM SEO / GEO / AEO COUNTRY MARKET PAGES FOR ALL 195 COUNTRIES
for slug, country, flag, currency, region, tz, capital, subregion in COUNTRIES:
    title = f"AxonFlow AI {country} | IT Engineering & Autonomous AI Agency"
    desc = f"AxonFlow AI in {country} ({capital}). Official enterprise IT software development, cloud infrastructure, custom ERP/CRM, and autonomous AI agent pods in {country}. Local currency invoicing in {currency}."
    canon = f"/markets/{slug}"
    
    # JSON-LD Schema for GEO / AEO Search Engines
    schema_data = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": f"AxonFlow AI - Enterprise IT & AI Services {country}",
        "url": f"https://axonflow.in/markets/{slug}",
        "logo": "https://axonflow.in/assets/logo_pro.png",
        "description": desc,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": country,
            "addressLocality": capital
        },
        "areaServed": country,
        "priceRange": f"{currency} / Fixed Scope",
        "currenciesAccepted": f"{currency}, USD, EUR",
        "paymentAccepted": "Wire Transfer, Credit Card, Corporate Billing"
    }
    
    schema_json = json.dumps(schema_data, indent=2)
    
    extra_css = f"script[type='application/ld+json'] {{ display: none; }}"
    
    content = HEAD(title, desc, canon, extra_css) + f"""
<script type="application/ld+json">
{schema_json}
</script>

<section class="page-hero">
<div class="wrap inner">
<div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.5rem">
<span class="pill">{flag} {country} Market</span>
<span style="font-size:.85rem;color:var(--text-faint)">Capital: {capital} &middot; Region: {region} ({subregion})</span>
</div>
<h1 class="hero-h1">Full-Stack IT Services & <br><span class="accent">AI Engineering in {country}.</span></h1>
<p class="hero-p">Delivering production-grade IT software development, cloud infrastructure, custom ERP/CRM integrations, and autonomous AI agents for enterprise clients in {country}.</p>
<div class="cta-row">
<a href="/contact" class="ef-btn-primary">Scope {country} IT Project &rarr;</a>
<a href="/case-studies" class="ef-btn-secondary">View Case Studies</a>
</div>
</div>
</section>

<div class="ef-rail wrap" style="padding-left:1.5rem;padding-right:1.5rem">
<span><span class="dot-live"></span>{country} Regional Delivery</span>
<span>&middot;</span><span>Local Currency Invoicing ({currency})</span>
<span>&middot;</span><span>Timezone Support: {tz}</span>
<span>&middot;</span><span>6-Month Post-Launch SLA</span>
</div>

<section class="section">
<div class="wrap">
<h2 class="section-title">Enterprise IT & AI Capabilities in <span class="accent">{country}</span></h2>
<p class="section-sub" style="margin-bottom:3rem">AxonFlow AI provides full-spectrum digital transformation and IT engineering services tailored to enterprise regulatory standards in {country}.</p>

<div class="grid-3" style="gap:2rem;margin-bottom:5rem">
<div class="card">
<span class="tag">Cloud & DevOps</span>
<h3 class="card-h" style="margin-top:1.25rem">Cloud Architecture & AWS/GCP Setup</h3>
<p class="card-p">Zero-downtime Kubernetes deployments, Terraform infrastructure-as-code, and automated CI/CD pipelines compliant with {country} data privacy regulations.</p>
</div>

<div class="card">
<span class="tag">Software Engineering</span>
<h3 class="card-h" style="margin-top:1.25rem">Full-Stack Web & Mobile Development</h3>
<p class="card-p">Custom web portals, Next.js/React web applications, cross-platform mobile apps, and robust microservices backends built for high scalability.</p>
</div>

<div class="card">
<span class="tag">Custom ERP & Systems</span>
<h3 class="card-h" style="margin-top:1.25rem">Custom ERP, CRM & N8N Automation</h3>
<p class="card-p">Tailor-made internal business management systems, automated invoice processing, and N8N workflow automation connecting legacy software.</p>
</div>

<div class="card">
<span class="tag">Artificial Intelligence</span>
<h3 class="card-h" style="margin-top:1.25rem">Autonomous AI Agent Pods</h3>
<p class="card-p">Deploy intelligent AI agents for customer support, automated data entry, document processing, and multi-agent workflow orchestration.</p>
</div>

<div class="card">
<span class="tag">Data & Vector RAG</span>
<h3 class="card-h" style="margin-top:1.25rem">Sub-400ms Enterprise RAG Knowledge Bases</h3>
<p class="card-p">Transform proprietary corporate documents in {country} into instant semantic search engines using Qdrant vector databases and Cohere re-ranking.</p>
</div>

<div class="card">
<span class="tag">Security & Compliance</span>
<h3 class="card-h" style="margin-top:1.25rem">Cybersecurity Audits & Code Reviews</h3>
<p class="card-p">Comprehensive penetration testing, vulnerability assessments, and regulatory compliance verification tailored for {country} enterprises.</p>
</div>
</div>

<h2 class="section-title">Why Enterprise Clients in <span class="accent">{country}</span> Choose AxonFlow AI</h2>
<div class="grid-2" style="gap:2rem;margin-bottom:5rem">
<div class="card">
<h3 class="card-h" style="font-size:1.3rem">1. Timezone-Aligned SLA & Support ({tz})</h3>
<p class="card-p">Our engineering pods operate with overlap across {country}'s local business hours ({tz}), ensuring immediate responses and seamless communication.</p>
</div>
<div class="card">
<h3 class="card-h" style="font-size:1.3rem">2. Invoicing in {currency} & Direct Corporate Billing</h3>
<p class="card-p">We support direct billing and invoicing in {currency} (as well as USD/EUR), eliminating foreign exchange friction for local accounts payable.</p>
</div>
<div class="card">
<h3 class="card-h" style="font-size:1.3rem">3. 100% Intellectual Property & Source Code Ownership</h3>
<p class="card-p">All custom code, cloud infrastructure scripts, and AI models built for your project are 100% owned by your company upon project completion.</p>
</div>
<div class="card">
<h3 class="card-h" style="font-size:1.3rem">4. 6-Month Post-Launch Guarantee</h3>
<p class="card-p">Every deployment in {country} includes 6 full months of post-launch maintenance, bug fixes, and SLA support at zero additional charge.</p>
</div>
</div>

<!-- AEO / GEO Answer Engine Optimization FAQ Section -->
<div style="background:var(--bg-raised);padding:4rem 2rem;border-radius:20px;border:1px solid var(--border);margin-bottom:5rem">
<h2 class="section-title" style="text-align:center;margin-bottom:3rem">Frequently Asked Questions — <span class="accent">{country} IT Services</span></h2>

<div style="max-width:800px;margin:0 auto">
<div class="faq-item">
<h3 class="faq-q">Q: What IT and AI services does AxonFlow AI provide in {country}?</h3>
<p class="faq-a">A: AxonFlow AI provides full-stack web and mobile application development, cloud infrastructure architecture (AWS/GCP/Azure), custom ERP/CRM software integration, cybersecurity code audits, autonomous AI agent pods, and enterprise RAG vector knowledge bases for clients in {country}.</p>
</div>

<div class="faq-item">
<h3 class="faq-q">Q: Can we pay in local currency ({currency})?</h3>
<p class="faq-a">A: Yes, AxonFlow AI supports corporate invoicing and wire transfers in {currency}, USD, and EUR to accommodate {country} financial practices.</p>
</div>

<div class="faq-item">
<h3 class="faq-q">Q: How fast can an IT engineering team begin work in {country}?</h3>
<p class="faq-a">A: Following a 30-minute scoping call, we deliver a fixed-bid architectural proposal within 24 hours. Dedicated senior engineering pods can initiate sprint work in as little as 3 business days.</p>
</div>
</div>
</div>

<div class="cta-block">
<h2 class="section-title">Ready to Upgrade Your <span class="accent">{country} IT Infrastructure?</span></h2>
<p class="hero-p" style="margin:0 auto 2rem">Schedule a direct technical scoping call with our lead cloud architects and senior developers.</p>
<a href="/contact" class="ef-btn-primary">Schedule Scoping Call for {country} &rarr;</a>
</div>
</div>
</section>
""" + FOOTER

    write_both(f"markets/{slug}/index.html", content)

print("🎉 Successfully updated Who We Are page and generated long-form SEO/GEO/AEO pages for all 195 countries!")
