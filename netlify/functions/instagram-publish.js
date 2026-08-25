// Netlify Serverless Function: instagram-publish
// Endpoint: /.netlify/functions/instagram-publish
// Supports both Instagram Graph API (graph.instagram.com) & Meta Graph API (graph.facebook.com)

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

        // Choose API base: graph.instagram.com for IGA... tokens, graph.facebook.com for EAA... tokens
        const apiBase = token.startsWith('IGA') 
            ? 'https://graph.instagram.com/v18.0' 
            : 'https://graph.facebook.com/v18.0';

        const isVideo = mediaType === 'video' || (mediaUrl && mediaUrl.endsWith('.mp4'));
        const publicMediaUrl = mediaUrl || 'https://www.axonflow.in/axonflow_cinematic_reels_shorts.mp4';

        // Step 1: Create Media Container
        const containerEndpoint = `${apiBase}/${igUserId}/media`;
        const params = new URLSearchParams();
        params.append('access_token', token);
        params.append('caption', caption || '🚀 Transforming enterprise operations with autonomous AI agents & sub-400ms RAG pipelines. Explore systems: https://axonflow.in\n\n#AxonFlowAI #EnterpriseAI #AutonomousAgents #FullStackAI');

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

        // Step 2: Publish Container
        // For video reels, allow a brief delay for Meta container processing
        if (isVideo) {
            await new Promise(r => setTimeout(r, 3000));
        }

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
