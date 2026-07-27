with open("crmdashboard.html", "r", encoding="utf-8") as f:
    html = f.read()

OLD_CSS = """    <style>
        body { font-family: var(--font-body); background: var(--bg); color: var(--text); }
        .glass-card {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(100, 116, 139, 0.2);
        }
        .sidebar-link { transition: all 0.2s ease; }
        .sidebar-link.active {
            background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(147,51,234,0.15));
            border-color: rgba(6,182,212,0.4);
        }
        .sidebar-link:hover:not(.active) { background: rgba(100,116,139,0.15); }
        .input-field {
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(100, 116, 139, 0.3);
            transition: all 0.3s ease;
        }
        .input-field:focus {
            border-color: rgba(6, 182, 212, 0.6);
            box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
            outline: none;
        }
        .btn-gradient {
            background: linear-gradient(135deg, #06b6d4, #9333ea);
            transition: all 0.3s ease;
        }
        .btn-gradient:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(6,182,212,0.3); }
        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: rgba(100,116,139,0.08); }
        .pie-chart { width: 160px; height: 160px; border-radius: 50%; }
        .bar-chart-bar { transition: height 0.5s ease; }
        .status-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 9999px; font-weight: 600; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
    </style>"""

NEW_CSS = """    <style>
        body { font-family: var(--font-body); background: #07080a; color: var(--text); }
        .glass-card {
            background: rgba(15, 19, 26, 0.85);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        }
        .sidebar-link { transition: all 0.2s ease; }
        .sidebar-link.active {
            background: linear-gradient(135deg, rgba(84, 87, 255, 0.25), rgba(53, 208, 127, 0.15));
            border-color: rgba(84, 87, 255, 0.5);
            color: #ffffff !important;
            font-weight: 600;
        }
        .sidebar-link:hover:not(.active) { background: rgba(255, 255, 255, 0.05); color: #ffffff; }
        .input-field {
            background: #0f1218;
            border: 1px solid rgba(255, 255, 255, 0.12);
            transition: all 0.2s ease;
            color: #ffffff;
        }
        .input-field option {
            background: #0d0f13;
            color: #ffffff;
        }
        .input-field:focus {
            border-color: #5457ff;
            box-shadow: 0 0 0 3px rgba(84, 87, 255, 0.2);
            outline: none;
        }
        .btn-gradient {
            background: linear-gradient(135deg, #5457ff, #35d07f);
            transition: all 0.25s ease;
        }
        .btn-gradient:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(84, 87, 255, 0.35); }
        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: rgba(255, 255, 255, 0.04); }
        .status-badge { font-size: 0.72rem; padding: 3px 10px; border-radius: 9999px; font-weight: 600; font-family: var(--font-mono); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
    </style>"""

if OLD_CSS in html:
    html = html.replace(OLD_CSS, NEW_CSS)

with open("crmdashboard.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("crmadminlogin.html", "r", encoding="utf-8") as f:
    login_html = f.read()

LOGIN_OLD_CSS = """        .glass-card {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(100, 116, 139, 0.2);
        }"""

LOGIN_NEW_CSS = """        .glass-card {
            background: rgba(13, 15, 19, 0.85);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
        }"""

if LOGIN_OLD_CSS in login_html:
    login_html = login_html.replace(LOGIN_OLD_CSS, LOGIN_NEW_CSS)

with open("crmadminlogin.html", "w", encoding="utf-8") as f:
    f.write(login_html)

print("🎉 Fixed CRM Dashboard and Login CSS styling!")
