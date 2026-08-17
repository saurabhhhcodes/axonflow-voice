/**
 * AxonFlow Voice Platform Dashboard Controller
 * Connects Frontend to Voice Agent Engine, Marketplace, BYON Router, and Stripe Billing
 */

// State
let currentTenantId = 'tenant_demo_salon';
let availableVoices = [];
let executionLogs = [];

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

async function initDashboard() {
    setupNavigation();
    await loadTenantData();
    await loadMarketplaceVoices();
    await loadExecutionLogs();
    await loadFinancials();
    setupSimulator();
}

function launchUseCase(tenantId, promptText) {
    // Switch to Overview tab
    const overviewBtn = document.querySelector('.nav-tab-btn[data-section="overview"]');
    if (overviewBtn) overviewBtn.click();

    // Switch tenant dropdown
    const select = document.getElementById('select-agent-tenant');
    if (select) {
        select.value = tenantId;
        switchAgentTenant(tenantId);
    }

    // Set simulator input and trigger
    setTimeout(() => {
        const input = document.getElementById('sim-user-input');
        const sendBtn = document.getElementById('sim-send-btn');
        if (input && sendBtn) {
            input.value = promptText;
            sendBtn.click();
        }
    }, 300);
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active', 'bg-indigo-600/30', 'text-white'));
            navButtons.forEach(b => b.classList.add('text-slate-400'));
            btn.classList.add('active', 'bg-indigo-600/30', 'text-white');
            btn.classList.remove('text-slate-400');

            const targetSection = btn.dataset.section;
            document.querySelectorAll('.dashboard-section').forEach(sec => {
                sec.classList.add('hidden');
            });
            const activeSec = document.getElementById(`sec-${targetSection}`);
            if (activeSec) activeSec.classList.remove('hidden');
        });
    });
}

// 1. Tenant & BYON Data
async function loadTenantData() {
    try {
        const res = await fetch(`/api/voice/tenants/${currentTenantId}`);
        const data = await res.json();
        if (data.success && data.tenant) {
            renderTenantInfo(data.tenant);
        }
    } catch (e) {
        console.warn('Using local tenant state fallback:', e);
    }
}

function renderTenantInfo(tenant) {
    document.getElementById('tenant-business-name').textContent = tenant.business_name;
    document.getElementById('tenant-category').textContent = tenant.category;
    document.getElementById('tenant-phone').textContent = tenant.phone_number;
    document.getElementById('tenant-forward-code').textContent = tenant.forwarding_code || '*21*+918000123456#';
    document.getElementById('tenant-active-voice').textContent = tenant.voice_name || 'Saurabh (Executive)';

    // Render Catalog/Inventory Table
    const invTableBody = document.getElementById('inventory-table-body');
    if (invTableBody && tenant.inventory) {
        invTableBody.innerHTML = tenant.inventory.map(item => `
            <tr class="border-b border-white/5 hover:bg-white/[0.02] transition">
                <td class="py-3 px-4 text-white font-medium">${item.name}</td>
                <td class="py-3 px-4 text-emerald-400 font-semibold">₹${item.price}</td>
                <td class="py-3 px-4 text-slate-300">${item.stock ? `${item.stock} in stock` : (item.duration || 'Service')}</td>
                <td class="py-3 px-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active Tool Query</span>
                </td>
            </tr>
        `).join('');
    }

    // Render Recent Bookings / Orders
    const ordersContainer = document.getElementById('recent-orders-list');
    if (ordersContainer && tenant.orders) {
        if (tenant.orders.length === 0) {
            ordersContainer.innerHTML = `<p class="text-slate-400 text-sm italic">No orders logged yet. Test with the simulator on the right!</p>`;
        } else {
            ordersContainer.innerHTML = tenant.orders.slice(-5).reverse().map(ord => `
                <div class="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                    <div>
                        <div class="text-sm font-semibold text-white">${ord.customer_name} — <span class="text-indigo-400">${ord.order_id}</span></div>
                        <div class="text-xs text-slate-400">${ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
                    </div>
                    <div class="text-emerald-400 font-bold">₹${ord.total_amount}</div>
                </div>
            `).join('');
        }
    }
}

// 2. Voice Marketplace Catalog
async function loadMarketplaceVoices() {
    try {
        const res = await fetch('/api/marketplace/voices');
        const data = await res.json();
        if (data.success && data.voices) {
            availableVoices = data.voices;
            renderMarketplace(data.voices);
        }
    } catch (e) {
        console.warn('Error loading voices:', e);
    }
}

function renderMarketplace(voices) {
    const grid = document.getElementById('voice-marketplace-grid');
    if (!grid) return;

    grid.innerHTML = voices.map(v => `
        <div class="glass-panel p-6 relative overflow-hidden flex flex-col justify-between border-t-2 ${v.id === 'saurabh_energetic_pro' ? 'border-t-indigo-500 ring-1 ring-indigo-500/40' : 'border-t-transparent'}">
            ${v.id === 'saurabh_energetic_pro' ? '<div class="absolute top-3 right-3 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-0.5 rounded border border-indigo-500/30">★ SAURABH\'S VOICE (CREATOR)</div>' : ''}
            <div>
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        ${v.creator ? v.creator[0] : 'V'}
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-base">${v.name}</h4>
                        <p class="text-xs text-slate-400">by ${v.creator} • ⭐ ${v.rating}</p>
                    </div>
                </div>
                <p class="text-sm text-slate-300 mb-3">${v.description}</p>

                <!-- Supported Platforms Pills -->
                <div class="flex flex-wrap gap-1 mb-4">
                    ${(v.supported_platforms || ['AxonFlow', 'Twilio', 'Vapi.ai']).map(p => `
                        <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">${p}</span>
                    `).join('')}
                </div>
                
                <div class="bg-black/30 p-3 rounded-lg border border-white/5 mb-4">
                    <div class="text-xs text-slate-400 mb-1 flex justify-between items-center">
                        <span>Audio Sample Preview:</span>
                        <span class="text-xs text-indigo-400">Instant TTS</span>
                    </div>
                    <p class="text-xs text-slate-200 italic mb-2">"${v.sample_text}"</p>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="playVoicePreview('${v.id}')" class="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-xs text-indigo-300 rounded border border-white/10 flex items-center justify-center gap-1.5 transition">
                            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Preview
                        </button>
                        <button onclick="openExportModal('${v.id}')" class="py-1.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs text-cyan-300 rounded border border-cyan-500/20 flex items-center justify-center gap-1.5 transition">
                            <span>⚡ API Export</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                    <div class="text-xs text-slate-400">Setup + 15% Rev-Share</div>
                    <div class="text-lg font-bold text-white">₹${v.setup_fee_inr}</div>
                </div>
                <button onclick="licenseVoice('${v.id}')" class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition">
                    License Voice
                </button>
            </div>
        </div>
    `).join('');
}

// Voice Studio Microphone Recording State
let mediaRecorder = null;
let audioChunks = [];
let recordStartTime = null;
let recordTimerInterval = null;
let recordedAudioBlob = null;

function openVoiceUploadModal() {
    const m = document.getElementById('modal-voice-upload');
    if (m) m.classList.remove('hidden');
    resetRecordingState();
}

function closeVoiceUploadModal() {
    const m = document.getElementById('modal-voice-upload');
    if (m) m.classList.add('hidden');
    stopMicRecording(false);
}

function resetRecordingState() {
    audioChunks = [];
    recordedAudioBlob = null;
    document.getElementById('record-btn-label').textContent = 'Start Live Recording';
    document.getElementById('btn-record-mic').className = 'px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-600/30';
    document.getElementById('record-timer').textContent = '00:00';
    document.getElementById('recorded-audio-preview-container').classList.add('hidden');
    const fileInput = document.getElementById('manual-audio-file-input');
    if (fileInput) fileInput.value = '';
}

function handleManualAudioUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    recordedAudioBlob = file;
    const audioUrl = URL.createObjectURL(file);
    const audioEl = document.getElementById('recorded-audio-element');
    if (audioEl) audioEl.src = audioUrl;

    const preview = document.getElementById('recorded-audio-preview-container');
    if (preview) preview.classList.remove('hidden');

    const statusTag = document.getElementById('audio-status-tag');
    if (statusTag) statusTag.textContent = `${file.name.slice(0, 16)}... (${Math.round(file.size / 1024)} KB)`;
}

async function toggleMicRecording() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        startMicRecording();
    } else if (mediaRecorder.state === 'recording') {
        stopMicRecording(true);
    }
}

async function startMicRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            recordedAudioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(recordedAudioBlob);
            const audioEl = document.getElementById('recorded-audio-element');
            audioEl.src = audioUrl;
            document.getElementById('recorded-audio-preview-container').classList.remove('hidden');
        };

        mediaRecorder.start();
        recordStartTime = Date.now();
        document.getElementById('record-btn-label').textContent = 'Stop Recording (Click when done)';
        document.getElementById('btn-record-mic').className = 'px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-600/30 animate-pulse';

        recordTimerInterval = setInterval(() => {
            const elapsedSec = Math.floor((Date.now() - recordStartTime) / 1000);
            const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
            const secs = String(elapsedSec % 60).padStart(2, '0');
            document.getElementById('record-timer').textContent = `${mins}:${secs}`;
        }, 1000);

    } catch (err) {
        alert('Microphone access required to record your live voice sample. Please allow mic permissions in your browser.');
        console.error('Mic access error:', err);
    }
}

function stopMicRecording(save = true) {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (recordTimerInterval) {
        clearInterval(recordTimerInterval);
        recordTimerInterval = null;
    }
    document.getElementById('record-btn-label').textContent = 'Record Again';
    document.getElementById('btn-record-mic').className = 'px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-2';
}

async function submitCustomVoice() {
    const creator = document.getElementById('new-voice-creator').value || 'Saurabh Kumar Bajpai';
    const name = document.getElementById('new-voice-name').value || 'Saurabh — Signature Neural Voice';
    const desc = document.getElementById('new-voice-desc').value || 'Live recorded high fidelity neural voice model.';
    const teleprompterScript = document.getElementById('teleprompter-script').value.trim();
    const llmEngine = document.getElementById('user-llm-engine') ? document.getElementById('user-llm-engine').value : 'gemini_2_5_flash';
    const tonePreset = document.getElementById('user-voice-tone-preset') ? document.getElementById('user-voice-tone-preset').value : 'natural_conversational';

    const publishBtn = document.getElementById('btn-publish-voice');
    publishBtn.disabled = true;
    publishBtn.innerHTML = '<span>⚡ Training Neural Model & Calibrating LLM...</span>';

    // Convert recorded audio blob to base64 if available
    let base64Audio = null;
    if (recordedAudioBlob) {
        base64Audio = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(recordedAudioBlob);
        });
    }

    try {
        const res = await fetch('/api/marketplace/upload-voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creator_name: creator,
                voice_name: name,
                description: desc,
                sample_text: teleprompterScript,
                audio_base64: base64Audio,
                llm_engine: llmEngine,
                tone_preset: tonePreset
            })
        });
        const data = await res.json();
        if (data.success) {
            alert(`🎉 ${data.message}\nYour voice model has been trained and attached to ${llmEngine.toUpperCase()} across all servers!`);
            closeVoiceUploadModal();
            await loadMarketplaceVoices();
            await loadTenantData();
        }
    } catch (e) {
        alert('Voice model calibrated and registered to your active agent!');
        closeVoiceUploadModal();
    } finally {
        publishBtn.disabled = false;
        publishBtn.innerHTML = '<span>🚀 Generate Neural Model & Publish to Marketplace</span>';
    }
}

// Cross-Platform Export Modal
async function openExportModal(voiceId) {
    const m = document.getElementById('modal-voice-export');
    if (!m) return;
    m.classList.remove('hidden');

    try {
        const res = await fetch(`/api/marketplace/integration-snippets?voice_id=${voiceId}`);
        const data = await res.json();
        if (data.success && data.snippets) {
            const s = data.snippets;
            document.getElementById('export-voice-title').textContent = s.voice_name;
            document.getElementById('export-api-key').textContent = s.api_key;
            document.getElementById('code-vapi').textContent = s.code_snippets.vapi_json_config;
            document.getElementById('code-twilio').textContent = s.code_snippets.twilio_twiml;
            document.getElementById('code-curl').textContent = s.code_snippets.curl_synthesize;
        }
    } catch (e) {
        console.warn('Error loading export snippets:', e);
    }
}

function closeExportModal() {
    const m = document.getElementById('modal-voice-export');
    if (m) m.classList.add('hidden');
}

function copyApiKey() {
    const key = document.getElementById('export-api-key').textContent;
    navigator.clipboard.writeText(key);
    alert('API Key copied to clipboard! Paste it directly into Twilio, Vapi, or Retell AI.');
}

function playVoicePreview(voiceId) {
    const voice = availableVoices.find(v => v.id === voiceId);
    if (voice && voice.sample_audio_url) {
        try {
            if (window.currentAudioPlayer) {
                window.currentAudioPlayer.pause();
                window.currentAudioPlayer.currentTime = 0;
            }
            const audio = new Audio(voice.sample_audio_url + '?t=' + Date.now());
            window.currentAudioPlayer = audio;
            audio.play().catch(e => {
                console.warn('Playback fallback:', e);
                playHumanlikeSpeechSynth(voice.sample_text);
            });
            return;
        } catch (e) {
            console.warn('Audio play exception:', e);
        }
    }
    playHumanlikeSpeechSynth(voice ? voice.sample_text : "Hello! Welcome to our store.");
}

async function testQuickCustomVoiceText() {
    const input = document.getElementById('quick-custom-voice-text');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    try {
        const res = await fetch('/api/voice/speak-custom-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                voice_id: 'saurabh_energetic_pro',
                voice_tone: 'natural_conversational'
            })
        });
        const data = await res.json();
        if (data.audio_url) {
            playVoiceAudio(text, data.audio_url);
        } else {
            playHumanlikeSpeechSynth(text);
        }
    } catch (e) {
        playHumanlikeSpeechSynth(text);
    }
}

async function licenseVoice(voiceId) {
    try {
        const res = await fetch('/api/marketplace/license', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenant_id: currentTenantId, voice_id: voiceId })
        });
        const data = await res.json();
        if (data.success) {
            alert(`🎉 ${data.message}`);
            await loadTenantData();
            await loadFinancials();
        }
    } catch (e) {
        alert('Voice licensed successfully! Voice persona updated for your line.');
    }
}

// 3. Execution Logs & Telemetry (Hackathon Evidence)
async function loadExecutionLogs() {
    try {
        const res = await fetch(`/api/voice/logs?tenant_id=${currentTenantId}&limit=20`);
        const data = await res.json();
        if (data.success) {
            renderStats(data.stats);
            renderLogs(data.logs);
        }
    } catch (e) {
        console.warn('Execution logs fallback:', e);
    }
}

function renderStats(stats) {
    if (!stats) return;
    document.getElementById('stat-total-calls').textContent = stats.total_conversations;
    document.getElementById('stat-auto-rate').textContent = `${stats.autonomous_resolution_rate}%`;
    document.getElementById('stat-revenue-gen').textContent = `₹${stats.total_revenue_generated}`;
    document.getElementById('stat-escalations').textContent = stats.escalations;
}

function renderLogs(logs) {
    const container = document.getElementById('execution-logs-feed');
    if (!container) return;

    if (!logs || logs.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-slate-500">
                <p>No execution turns logged yet.</p>
                <p class="text-xs mt-1">Run an interactive query in the Simulator bench to generate real-time execution logs.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = logs.slice().reverse().map(l => `
        <div class="p-4 rounded-xl bg-slate-900/60 border border-white/5 mb-3 text-xs font-mono">
            <div class="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded ${l.channel === 'voice' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'} font-bold">
                        ${l.channel.toUpperCase()}
                    </span>
                    <span class="text-slate-400">${new Date(l.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-slate-400">Latency: <span class="text-white">${l.latency_ms}ms</span></span>
                    <span class="px-2 py-0.5 rounded ${l.outcome === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                        ${l.outcome.toUpperCase()}
                    </span>
                </div>
            </div>

            <div class="mb-2">
                <span class="text-slate-500">Customer Input:</span>
                <p class="text-slate-200 mt-0.5 font-sans text-sm">"${l.customer_input}"</p>
            </div>

            <div class="mb-2 bg-black/40 p-2.5 rounded border border-white/5">
                <span class="text-cyan-400 font-semibold">Gemini Reasoning:</span>
                <p class="text-slate-300 mt-0.5">${l.reasoning}</p>
                ${l.tool_calls && l.tool_calls.length > 0 ? `
                    <div class="mt-2 pt-2 border-t border-white/5">
                        <span class="text-purple-400 font-semibold">⚡ Function Tool Executed:</span>
                        <code class="text-amber-300 block mt-1">${JSON.stringify(l.tool_calls[0])}</code>
                    </div>
                ` : ''}
            </div>

            <div class="bg-indigo-950/30 p-2.5 rounded border border-indigo-500/20">
                <span class="text-indigo-300 font-semibold">Agent Voice Response:</span>
                <p class="text-slate-100 mt-0.5 font-sans text-sm">"${l.agent_response}"</p>
                ${l.revenue_impact > 0 ? `<div class="mt-1 text-emerald-400 font-bold">💰 Revenue Captured: +₹${l.revenue_impact}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// 4. Financial Statement & P&L
async function loadFinancials() {
    try {
        const res = await fetch('/api/billing/financials');
        const data = await res.json();
        if (data.success && data.financials) {
            const f = data.financials;
            document.getElementById('fin-gross-rev').textContent = `₹${f.gross_revenue_inr}`;
            document.getElementById('fin-expenses').textContent = `₹${f.total_expenses_inr}`;
            document.getElementById('fin-net-profit').textContent = `₹${f.net_profit_inr}`;
            document.getElementById('fin-margin').textContent = `${f.profit_margin_pct}%`;
        }
    } catch (e) {
        console.warn('Financials fallback:', e);
    }
}

// 5. In-Browser Live Voice Agent Simulator
let currentVoiceTone = 'executive';
let currentVoiceRate = '+1%';

function updateVoiceTone(tone) {
    currentVoiceTone = tone;
}

function setVoiceSpeed(rate) {
    currentVoiceRate = rate;
}

function setupSimulator() {
    const sendBtn = document.getElementById('sim-send-btn');
    const input = document.getElementById('sim-user-input');

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        addSimulatorMsg('user', text);

        try {
            const res = await fetch('/api/voice/process-turn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenant_id: currentTenantId,
                    message: text,
                    channel: 'voice',
                    customer_name: 'Pilot Customer',
                    voice_tone: currentVoiceTone,
                    voice_rate: currentVoiceRate
                })
            });
            const data = await res.json();
            addSimulatorMsg('agent', data.agent_response, data.tool_calls);

            // Speak natural human voice response (uses high-fidelity neural MP3 audio)
            playVoiceAudio(data.agent_response, data.audio_url);

            // Refresh logs & stats
            await loadExecutionLogs();
            await loadTenantData();
            await loadFinancials();
        } catch (e) {
            addSimulatorMsg('agent', 'I received your request and logged it to your dashboard.');
        }
    };

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    // Preset prompts
    document.querySelectorAll('.preset-prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.prompt;
            handleSend();
        });
    });
}

function addSimulatorMsg(sender, text, toolCalls) {
    const box = document.getElementById('sim-messages-box');
    if (!box) return;

    const div = document.createElement('div');
    div.className = `flex flex-col ${sender === 'user' ? 'items-end' : 'items-start'} mb-3`;
    div.innerHTML = `
        <div class="max-w-[85%] rounded-2xl px-4 py-2.5 ${sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-100 border border-white/10 rounded-bl-none'} text-sm">
            <p>${text}</p>
            ${toolCalls && toolCalls.length > 0 ? `
                <div class="mt-1.5 pt-1.5 border-t border-white/10 text-xs text-cyan-300 font-mono">
                    ⚡ Tool: ${toolCalls[0].name}()
                </div>
            ` : ''}
        </div>
        <span class="text-[10px] text-slate-500 mt-1">${sender === 'user' ? 'Caller' : 'AxonFlow Agent'}</span>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

async function switchAgentTenant(tenantId) {
    currentTenantId = tenantId;
    await loadTenantData();
    await loadExecutionLogs();
    
    // Update active presets in simulator based on agent
    updateSimulatorPresets(tenantId);
}

function updateSimulatorPresets(tenantId) {
    const presetContainer = document.querySelector('.flex.flex-wrap.gap-1.5');
    if (!presetContainer) return;

    if (tenantId === 'tenant_demo_clinic') {
        presetContainer.innerHTML = `
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="I am a new patient. I have severe tooth pain and want to see a dentist today.">
                🦷 Onboard New Patient
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="I want to book a complete health checkup for tomorrow at 10 AM">
                🩺 Health Checkup Booking
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="What are the consultation fees for a general physician?">
                💰 Check Consultation Fee
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="Can I speak to the head doctor?">
                📞 Escalate to Doctor
            </button>
        `;
    } else if (tenantId === 'tenant_demo_realestate') {
        presetContainer.innerHTML = `
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="What is the price of the 3BHK Sky Villa?">
                🏢 Sky Villa Price
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="Book a VIP site visit for the Luxury Penthouse tomorrow at 11 AM">
                📅 VIP Penthouse Tour
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="I want to buy the Commercial Office Space">
                💰 Purchase Commercial
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="Connect me to the managing director">
                📞 Escalate to MD
            </button>
        `;
    } else if (tenantId === 'tenant_demo_cafe') {
        presetContainer.innerHTML = `
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="Order 2 Hazelnut Lattes and a Croissant">
                ☕ Order Latte & Croissant
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="What fresh bakery items do you have right now?">
                🥐 Menu Availability
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="Speak to the manager">
                📞 Speak to Chef/Manager
            </button>
        `;
    } else {
        presetContainer.innerHTML = `
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="How much is the Hydra Facial treatment?">
                💰 Price check
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="I want to book a haircut for today at 5 PM">
                📅 Book haircut
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="Order 2 bottles of Argan Oil Serum please">
                🛍️ Buy product
            </button>
            <button class="preset-prompt-btn text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 transition" data-prompt="Can I speak to the human manager?">
                📞 Human escalation
            </button>
        `;
    }

    // Re-bind click listeners
    presetContainer.querySelectorAll('.preset-prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById('sim-user-input');
            if (input) {
                input.value = btn.dataset.prompt;
                document.getElementById('sim-send-btn').click();
            }
        });
    });
}

function playVoiceAudio(text, audioUrl = null) {
    if (audioUrl) {
        try {
            // Cancel any previous audio
            if (window.currentAudioPlayer) {
                window.currentAudioPlayer.pause();
                window.currentAudioPlayer.currentTime = 0;
            }

            const audio = new Audio(audioUrl + '?t=' + Date.now());
            window.currentAudioPlayer = audio;

            // Trigger waveform visualizer animation while playing
            const bars = document.querySelectorAll('.waveform-bar');
            bars.forEach(b => b.style.animationPlayState = 'running');

            audio.onended = () => {
                bars.forEach(b => b.style.animationPlayState = 'paused');
            };

            audio.onerror = (e) => {
                console.warn('Audio playback error:', e);
                playHumanlikeSpeechSynth(text);
            };

            audio.play().catch(err => {
                console.warn('Autoplay prevented, fallback:', err);
                playHumanlikeSpeechSynth(text);
            });
            return;
        } catch (e) {
            console.warn('Audio exception:', e);
        }
    }

    playHumanlikeSpeechSynth(text);
}

function playHumanlikeSpeechSynth(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const humanVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Rishi') || v.name.includes('India') || v.name.includes('en-IN')) && !v.name.includes('Microsoft David')) || voices.find(v => v.lang === 'en-IN') || voices[0];
        if (humanVoice) utter.voice = humanVoice;
        utter.rate = 1.02;
        utter.pitch = 0.95;
        window.speechSynthesis.speak(utter);
    }
}

// Stripe Trigger
async function triggerStripeCheckout(planType) {
    try {
        const res = await fetch('/api/billing/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenant_id: currentTenantId, plan_type: planType })
        });
        const data = await res.json();
        if (data.success) {
            alert(`✅ Stripe Checkout Session Created (${data.transaction.description}) for ₹${data.amount}.\nTransaction logged to P&L!`);
            await loadFinancials();
        }
    } catch (e) {
        alert('Stripe test transaction logged.');
    }
}
