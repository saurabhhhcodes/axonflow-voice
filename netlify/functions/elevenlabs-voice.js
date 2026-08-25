// Netlify Serverless Function: elevenlabs-voice.js
// Endpoint: /.netlify/functions/elevenlabs-voice
// Converts Reel Script & Hooks to natural human speech using ElevenLabs TTS API

const DEFAULT_ELEVENLABS_KEY = 'sk_9e952ab06ef480bda1f9d7a50a7daa6d10f04bf70d772a78';

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { text, voiceId, apiKey, modelId } = body;

        if (!text) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Script text is required for voiceover generation' })
            };
        }

        const elevenApiKey = apiKey || process.env.ELEVENLABS_API_KEY || DEFAULT_ELEVENLABS_KEY;
        const selectedVoice = voiceId || 'pNInz6obpgDQGcFmaJgB'; // Default: Adam (Authoritative Tech Founder)
        const selectedModel = modelId || 'eleven_multilingual_v2';

        const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`;

        const ttsRes = await fetch(ttsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': elevenApiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: selectedModel,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });

        if (!ttsRes.ok) {
            const errText = await ttsRes.text();
            return {
                statusCode: ttsRes.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: `ElevenLabs API Error: ${errText}` })
            };
        }

        const arrayBuffer = await ttsRes.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');
        const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                voiceId: selectedVoice,
                audioDataUrl: audioDataUrl,
                audioSize: (base64Audio.length * 0.75 / 1024).toFixed(1) + ' KB'
            })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: err.message })
        };
    }
};
