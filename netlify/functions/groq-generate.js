const https = require('https');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const prompt = body.prompt || '';
        const format = body.format || 'reel'; // reel, story, post, carousel, autopilot
        const apiKey = (body.apiKey && body.apiKey.trim()) ? body.apiKey.trim() : process.env.GROQ_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Missing Groq API Key' })
            };
        }

        const systemPrompt = `You are the Lead Creative Director & AI Infrastructure Architect at AxonFlow (https://axonflow.in).
AxonFlow builds high-performance autonomous AI agent infrastructure:
- Sub-400ms Production RAG with semantic vector caching
- Zero-downtime Kubernetes deployments & canary rollbacks
- Air-gapped Healthcare/MedTech AI (HIPAA/SOC2 compliant)
- Self-hosted n8n Enterprise ERP automations
- FinTech fraud triage & legal contract analysis

Your tone is: Authoritative, authentic, technical, direct, and zero generic buzzwords.
Format: ALWAYS return a valid JSON object with the following keys:
- "title": Short punchy title (max 6 words)
- "hook": High-retention opening hook (first 3 seconds / top line)
- "caption": Complete high-converting Instagram caption with bullet points, value proposition, CTA booking link (https://axonflow.in/contact), and curated hashtags
- "voiceScript": Natural, spoken narrative text (15-30 seconds spoken) formatted specifically for ElevenLabs voiceover synthesis (no bracket cues, pure natural speech)
- "tags": Array of 5-8 relevant hashtags`;

        let userPrompt = '';
        if (format === 'autopilot') {
            const autopilotThemes = [
                'Why vector database drift causes 80% of enterprise RAG latency spikes and how memory semantic clustering fixes it',
                'How to migrate 40+ microservices to Kubernetes with zero downtime and automatic rollback triggers',
                'Why enterprise teams are moving away from expensive cloud webhooks to self-hosted n8n ERP agents',
                'Building HIPAA-compliant air-gapped clinical triage AI pipelines with deterministic BAA execution',
                'How autonomous algorithmic fraud triage reduces manual FinTech review queues by 88%',
                'Why LLM agent tool-calling fails in production without deterministic JSON schema enforcement'
            ];
            const randomTheme = autopilotThemes[Math.floor(Math.random() * autopilotThemes.length)];
            userPrompt = `Autonomous Autopilot: Create a viral 20-second ${body.targetFormat || 'reel'} on: "${randomTheme}".`;
        } else {
            userPrompt = `Create an Instagram ${format} based on this prompt: "${prompt}".`;
        }

        const modelsToTry = ['openai/gpt-oss-120b', 'qwen/qwen3.6-27b', 'groq/compound-mini'];
        let resultJson = null;
        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const responseText = await callGroqChat(apiKey, model, systemPrompt, userPrompt);
                const parsed = JSON.parse(responseText);
                if (parsed && (parsed.caption || parsed.hook)) {
                    resultJson = parsed;
                    break;
                }
            } catch (err) {
                lastError = err;
            }
        }

        if (!resultJson) {
            throw new Error(lastError ? lastError.message : 'Groq generation failed across all models');
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: resultJson
            })
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                error: err.message || 'Internal Server Error'
            })
        };
    }
};

function callGroqChat(apiKey, model, systemPrompt, userPrompt) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 1024
        });

        const req = https.request({
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 10000
        }, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const json = JSON.parse(data);
                        const content = json.choices[0].message.content;
                        resolve(content);
                    } catch (e) {
                        reject(new Error(`Failed to parse Groq response: ${data}`));
                    }
                } else {
                    reject(new Error(`Groq API returned ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Groq API request timed out'));
        });

        req.write(payload);
        req.end();
    });
}
