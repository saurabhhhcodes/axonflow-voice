// Netlify Serverless Function: instagram-publish
// Endpoint: /.netlify/functions/instagram-publish

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { accountId, accessToken, mediaUrl, caption, mediaType } = body;

        const token = accessToken || 'IGAAUpwSIMCRpBZAGFiYl9Gd1BRZAm1NYU5tVU91WDNxZAU1oQkVCbnEtUXZA0OU9mRWsxa1g4cWVycW1NU0FsRG9MRUU4NlpIUEZAseUJyaC04SXp2WXhmMXVEQ2JfbXpPbkgtVEpnekxJSmEtQy0tVm05T2ZAMakUyT3Q1WDFsRHNsTQZDZD';
        const igUserId = accountId || '27982373448109546';

        const apiBase = token.startsWith('IGA') 
            ? 'https://graph.instagram.com/v18.0' 
            : 'https://graph.facebook.com/v18.0';

        const isVideo = mediaType === 'video' || (mediaUrl && mediaUrl.endsWith('.mp4'));
        
        // Ensure a valid publicly accessible HTTPS media URL
        let publicMediaUrl = mediaUrl;
        if (!publicMediaUrl || publicMediaUrl.startsWith('data:') || publicMediaUrl.startsWith('/')) {
            publicMediaUrl = isVideo 
                ? 'https://www.axonflow.in/axonflow_cinematic_reels_shorts.mp4'
                : 'https://www.axonflow.in/assets/logo_pro.png';
        }

        // Step 1: Create Media Container
        const containerEndpoint = `${apiBase}/${igUserId}/media`;
        const params = new URLSearchParams();
        params.append('access_token', token);
        params.append('caption', caption || '🚀 Transforming enterprise operations with autonomous AI agents. Explore our production systems at https://axonflow.in #AxonFlowAI #EnterpriseAI');

        if (isVideo) {
            params.append('media_type', 'REELS');
            params.append('video_url', publicMediaUrl);
            params.append('share_to_feed', 'true');
        } else {
            params.append('image_url', publicMediaUrl);
        }

        const createRes = await fetch(`${containerEndpoint}?${params.toString()}`, { method: 'POST' });
        const createData = await createRes.json();

        if (createData.error) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: createData.error.message, details: createData.error })
            };
        }

        const containerId = createData.id;

        // Step 2: Poll container status until FINISHED
        let isReady = false;
        const maxAttempts = 15;
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const statusRes = await fetch(`${apiBase}/${containerId}?fields=status_code,status&access_token=${token}`);
            const statusData = await statusRes.json();
            
            if (statusData.status_code === 'FINISHED' || (!statusData.status_code && !statusData.error)) {
                isReady = true;
                break;
            } else if (statusData.status_code === 'ERROR') {
                return {
                    statusCode: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Meta media processing failed: ' + (statusData.status || 'Encoding error') })
                };
            }
        }

        // Step 3: Publish Media Container
        const publishEndpoint = `${apiBase}/${igUserId}/media_publish`;
        const pubParams = new URLSearchParams();
        pubParams.append('creation_id', containerId);
        pubParams.append('access_token', token);

        const publishRes = await fetch(`${publishEndpoint}?${pubParams.toString()}`, { method: 'POST' });
        const publishData = await publishRes.json();

        if (publishData.error) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: publishData.error.message, details: publishData.error })
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                mediaId: publishData.id,
                containerId: containerId,
                message: 'Post successfully published to live Instagram account @axonflowai.in!'
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
