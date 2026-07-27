import re

with open("gen_master.py", "r", encoding="utf-8") as f:
    code = f.read()

# Remove the technical explanation box from contact page
OLD_BOX = """<div class="card" style="padding:2rem;background:var(--accent-soft);border-color:var(--accent)">
<span class="tag" style="margin-bottom:.75rem">Offline Resilient Sync Active</span>
<h4 style="font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:.5rem">Real-Time CRM & MongoDB Replication</h4>
<p style="font-size:.85rem;color:var(--text-dim);line-height:1.6">All form submissions are automatically captured into client/intern storage and pushed to local MongoDB listeners. If network connectivity drops, submissions queue securely in client cache and auto-sync the instant you reconnect.</p>
</div>"""

if OLD_BOX in code:
    code = code.replace(OLD_BOX, "")

# Also update the hero paragraph on contact page to be clean and simple
code = code.replace(
    "Submissions instantly sync to our CRM dashboard & local MongoDB backup with offline offline-resilient sync queueing.",
    "Submit your IT project requirement or student internship proposal to get connected with our lead engineering team."
)

with open("gen_master.py", "w", encoding="utf-8") as f:
    f.write(code)

print("🎉 Cleaned contact page text and removed technical offline box from gen_master.py")
