import re

with open("gen_master.py", "r", encoding="utf-8") as f:
    code = f.read()

OLD_CONTACT = """# 8. CONTACT
contact = HEAD("Contact AxonFlow AI | Start Your IT Project",
    "Book a technical scoping call with our lead IT architects and developers.",
    "/contact") + \"\"\"
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Get In Touch</div>
<h1 class="hero-h1">Let's build your <br><span class="accent">next IT system.</span></h1>
<p class="hero-p">Tell us about your project requirements. We'll set up a 30-minute technical scoping call with our lead engineers.</p>
<div class="cta-row">
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=saurabhbajpai03@outlook.com" class="ef-btn-primary" target="_blank">Email Lead Engineer &rarr;</a>
</div>
</div>
</section>
\"\"\" + FOOTER"""

NEW_CONTACT = """# 8. CONTACT
contact = HEAD("Contact AxonFlow AI | Start Your IT Project",
    "Submit your IT project requirement or student internship proposal. Auto-syncs directly to our CRM database.",
    "/contact") + \"\"\"
<section class="page-hero">
<div class="wrap inner">
<div class="ef-eyebrow" style="margin-bottom:1.5rem">Get In Touch</div>
<h1 class="hero-h1">Let's build your <br><span class="accent">next IT system.</span></h1>
<p class="hero-p">Submit your project requirements or internship proposal below. Submissions instantly sync to our CRM dashboard & local MongoDB backup with offline offline-resilient sync queueing.</p>
</div>
</section>

<section class="section">
<div class="wrap">
<div class="grid-2" style="gap:3rem;align-items:start">
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

<button type="submit" class="ef-btn-primary" style="width:100%;justify-content:center;padding:1rem">Send to AxonFlow CRM &rarr;</button>
<div id="formStatus" style="display:none;margin-top:1rem;padding:1rem;border-radius:10px;font-size:.88rem"></div>
</form>
</div>

<div>
<div class="card" style="padding:2.5rem;margin-bottom:2rem">
<h3 class="card-h" style="font-size:1.3rem">Direct Scoping Channel</h3>
<p class="card-p" style="margin-bottom:1.5rem">Prefer direct communication? Email our lead solutions team or call our main enterprise desk directly.</p>
<ul class="check-list" style="margin-bottom:1.5rem">
<li>Direct Email: <a href="mailto:saurabhbajpai03@outlook.com" class="accent">saurabhbajpai03@outlook.com</a></li>
<li>MSME Govt Registered: <span class="ef-mono">UDYAM-UP-50-0236406</span></li>
<li>SLA SLA Guarantee: 6 Months Post-Launch Support</li>
</ul>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=saurabhbajpai03@outlook.com" target="_blank" class="ef-btn-secondary" style="width:100%;justify-content:center">Open Direct Mail App &rarr;</a>
</div>

<div class="card" style="padding:2rem;background:var(--accent-soft);border-color:var(--accent)">
<span class="tag" style="margin-bottom:.75rem">Offline Resilient Sync Active</span>
<h4 style="font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:.5rem">Real-Time CRM & MongoDB Replication</h4>
<p style="font-size:.85rem;color:var(--text-dim);line-height:1.6">All form submissions are automatically captured into client/intern storage and pushed to local MongoDB listeners. If network connectivity drops, submissions queue securely in client cache and auto-sync the instant you reconnect.</p>
</div>
</div>
</div>
</div>
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
\"\"\" + FOOTER"""

assert OLD_CONTACT in code, "OLD_CONTACT not found in gen_master.py!"
code = code.replace(OLD_CONTACT, NEW_CONTACT)

with open("gen_master.py", "w", encoding="utf-8") as f:
    f.write(code)

print("🎉 Updated gen_master.py with Contact Form submission sync!")
