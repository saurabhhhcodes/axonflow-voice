import re

with open("crmdashboard.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update DEFAULT_DATA in JS to include student proposals
default_data_old = """const DEFAULT_DATA = {
    enquiries: ["""

default_data_new = """const DEFAULT_DATA = {
    proposals: [
        { id: 1, studentName: 'Aarav Sharma', email: 'aarav@iitd.ac.in', college: 'IIT Delhi', phone: '+91-9876543210', domain: 'AI & Autonomous Agents', resumeUrl: '#', coverLetter: 'Ex-intern at ML lab, looking to work on multi-agent LLM systems.', date: '2025-04-10', status: 'Under Review' },
        { id: 2, studentName: 'Ananya Gupta', email: 'ananya@bits.ac.in', college: 'BITS Pilani', phone: '+91-9988776655', domain: 'Full-Stack Development', resumeUrl: '#', coverLetter: 'Experienced in Next.js, Node.js and PostgreSQL. Built 3 full-stack SaaS apps.', date: '2025-04-12', status: 'Shortlisted' }
    ],
    enquiries: ["""

if default_data_old in html:
    html = html.replace(default_data_old, default_data_new)

# 2. Add Student Proposals button in Nav Sidebar
nav_old = """<button onclick="showSection('enquiries')" data-section="enquiries" class="sidebar-link w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 border border-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>Enquiries</span>
        </button>"""

nav_new = """<button onclick="showSection('enquiries')" data-section="enquiries" class="sidebar-link w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 border border-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>Client Enquiries</span>
        </button>
        <button onclick="showSection('proposals')" data-section="proposals" class="sidebar-link w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 border border-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
            <span>Intern Proposals</span>
        </button>"""

if nav_old in html:
    html = html.replace(nav_old, nav_new)

# 3. Add titles for proposals
title_old = "const titles = { dashboard: 'Dashboard', enquiries: 'Enquiries', team: 'Team', projects: 'Projects', analytics: 'Analytics', social: 'Social Channels' };"
title_new = "const titles = { dashboard: 'Dashboard', enquiries: 'Client Enquiries', proposals: 'Internship Proposals', team: 'Team', projects: 'Projects', analytics: 'Analytics', social: 'Social Channels' };"
if title_old in html:
    html = html.replace(title_old, title_new)

# 4. Add case 'proposals' to renderSection
switch_old = "case 'enquiries': renderEnquiries(c); break;"
switch_new = "case 'enquiries': renderEnquiries(c); break;\n        case 'proposals': renderProposals(c); break;"
if switch_old in html:
    html = html.replace(switch_old, switch_new)

# 5. Add renderProposals implementation
render_proposals_code = """
// ---------- INTERNSHIP PROPOSALS ----------
function renderProposals(container) {
    if (!CRM.proposals) CRM.proposals = [];
    container.innerHTML = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <input type="text" id="propSearch" placeholder="Search student proposals..." class="input-field px-4 py-2.5 rounded-xl text-white text-sm w-full sm:w-64" oninput="filterProposals()" aria-label="Search proposals">
                <select id="propFilter" class="input-field px-4 py-2.5 rounded-xl text-white text-sm" onchange="filterProposals()" aria-label="Filter by status">
                    <option value="">All Status</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <div class="flex gap-2">
                <button onclick="openAddProposalModal()" class="btn-gradient px-4 py-2.5 rounded-xl text-sm font-medium text-white">+ Add Proposal</button>
            </div>
        </div>
        <div class="glass-card rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm" role="table">
                    <thead><tr class="border-b border-slate-700/50">
                        <th class="text-left text-slate-400 font-medium py-3 px-4">Student</th>
                        <th class="text-left text-slate-400 font-medium py-3 px-4 hidden lg:table-cell">Email</th>
                        <th class="text-left text-slate-400 font-medium py-3 px-4 hidden md:table-cell">College</th>
                        <th class="text-left text-slate-400 font-medium py-3 px-4">Domain</th>
                        <th class="text-left text-slate-400 font-medium py-3 px-4 hidden xl:table-cell">Cover Note</th>
                        <th class="text-left text-slate-400 font-medium py-3 px-4">Status</th>
                        <th class="text-left text-slate-400 font-medium py-3 px-4 hidden lg:table-cell">Date</th>
                        <th class="text-left text-slate-400 font-medium py-3 px-4">Actions</th>
                    </tr></thead>
                    <tbody id="propTableBody"></tbody>
                </table>
            </div>
        </div>`;
    filterProposals();
}

function filterProposals() {
    if (!CRM.proposals) CRM.proposals = [];
    const search = (document.getElementById('propSearch')?.value || '').toLowerCase();
    const status = document.getElementById('propFilter')?.value || '';
    const filtered = CRM.proposals.filter(p =>
        (!status || p.status === status) &&
        (!search || p.studentName.toLowerCase().includes(search) || p.email.toLowerCase().includes(search) || p.college.toLowerCase().includes(search) || p.domain.toLowerCase().includes(search))
    );
    document.getElementById('propTableBody').innerHTML = filtered.length ? filtered.map(p => `
        <tr class="table-row border-b border-slate-800/50">
            <td class="py-3 px-4 text-white font-medium">${esc(p.studentName)}</td>
            <td class="py-3 px-4 text-slate-400 hidden lg:table-cell">${esc(p.email)}</td>
            <td class="py-3 px-4 text-slate-300 hidden md:table-cell">${esc(p.college)}</td>
            <td class="py-3 px-4 text-slate-300">${esc(p.domain)}</td>
            <td class="py-3 px-4 text-slate-500 hidden xl:table-cell max-w-[200px] truncate" title="${esc(p.coverLetter)}">${esc(p.coverLetter)}</td>
            <td class="py-3 px-4">
                <select class="input-field px-2 py-1 rounded-lg text-xs text-white" onchange="updateProposalStatus(${p.id}, this.value)">
                    ${['Under Review','Shortlisted','Interviewed','Accepted','Rejected'].map(s => `<option value="${s}" ${s===p.status?'selected':''}>${s}</option>`).join('')}
                </select>
            </td>
            <td class="py-3 px-4 text-slate-500 hidden lg:table-cell">${p.date}</td>
            <td class="py-3 px-4">
                <button onclick="deleteProposal(${p.id})" class="text-red-400 hover:text-red-300 transition-colors p-1" title="Delete">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </td>
        </tr>`).join('') : '<tr><td colspan="8" class="py-8 text-center text-slate-500">No internship proposals found</td></tr>';
}

function updateProposalStatus(id, status) {
    const p = CRM.proposals.find(x => x.id === id);
    if (p) { p.status = status; saveData(CRM); }
}

function deleteProposal(id) {
    if (!confirm('Delete this proposal?')) return;
    CRM.proposals = CRM.proposals.filter(x => x.id !== id);
    saveData(CRM);
    filterProposals();
}

function openAddProposalModal() {
    showModal(`
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-bold text-white">Add Student Internship Proposal</h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-white" aria-label="Close modal"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form id="addPropForm" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm text-slate-300 mb-1">Student Name *</label><input required id="ap_name" class="input-field w-full px-3 py-2.5 rounded-xl text-white text-sm"></div>
                    <div><label class="block text-sm text-slate-300 mb-1">Email *</label><input required type="email" id="ap_email" class="input-field w-full px-3 py-2.5 rounded-xl text-white text-sm"></div>
                    <div><label class="block text-sm text-slate-300 mb-1">College/University *</label><input required id="ap_college" class="input-field w-full px-3 py-2.5 rounded-xl text-white text-sm"></div>
                    <div><label class="block text-sm text-slate-300 mb-1">Phone</label><input id="ap_phone" class="input-field w-full px-3 py-2.5 rounded-xl text-white text-sm"></div>
                    <div class="sm:col-span-2"><label class="block text-sm text-slate-300 mb-1">Domain / Track *</label>
                        <select required id="ap_domain" class="input-field w-full px-3 py-2.5 rounded-xl text-white text-sm">
                            <option value="">Select Domain</option>
                            <option>AI & Autonomous Agents</option>
                            <option>Full-Stack Development</option>
                            <option>Cloud Infrastructure & DevOps</option>
                            <option>UI/UX Design</option>
                        </select>
                    </div>
                    <div class="sm:col-span-2"><label class="block text-sm text-slate-300 mb-1">Cover Note / Proposal *</label><textarea required id="ap_cover" rows="3" class="input-field w-full px-3 py-2.5 rounded-xl text-white text-sm"></textarea></div>
                </div>
                <button type="submit" class="btn-gradient w-full py-3 rounded-xl text-white font-semibold text-sm">Submit Proposal</button>
            </form>
        </div>`);
    document.getElementById('addPropForm').onsubmit = function(e) {
        e.preventDefault();
        if (!CRM.proposals) CRM.proposals = [];
        const maxId = CRM.proposals.reduce((m, x) => Math.max(m, x.id), 0);
        CRM.proposals.push({
            id: maxId + 1,
            studentName: document.getElementById('ap_name').value.trim(),
            email: document.getElementById('ap_email').value.trim(),
            college: document.getElementById('ap_college').value.trim(),
            phone: document.getElementById('ap_phone').value.trim(),
            domain: document.getElementById('ap_domain').value,
            coverLetter: document.getElementById('ap_cover').value.trim(),
            date: new Date().toISOString().split('T')[0],
            status: 'Under Review'
        });
        saveData(CRM);
        closeModal();
        filterProposals();
    };
}
"""

if "// ---------- ENQUIRIES ----------" in html:
    html = html.replace("// ---------- ENQUIRIES ----------", render_proposals_code + "\n// ---------- ENQUIRIES ----------")

with open("crmdashboard.html", "w", encoding="utf-8") as f:
    f.write(html)

print("🎉 Updated crmdashboard.html with Student Internship Proposals tab!")
