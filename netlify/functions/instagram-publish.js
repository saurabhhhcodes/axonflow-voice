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

        if (!accountId || !accessToken || !mediaUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required parameters (accountId, accessToken, mediaUrl).',
                    help: 'To post directly to live Instagram, configure your Meta Developer App Token in Configure API Keys.'
                })
            };
        }

        // Step 1: Create Media Container via Meta Graph API
        const isVideo = mediaType === 'video' || mediaUrl.endsWith('.mp4');
        const containerUrl = `https://graph.facebook.com/v18.0/${accountId}/media`;
        
        const params = new URLSearchParams();
        params.append('access_token', accessToken);
        params.append('caption', caption || '');

        if (isVideo) {
            params.append('media_type', 'REELS');
            params.append('video_url', mediaUrl);
            params.append('share_to_feed', 'true');
        } else {
            params.append('image_url', mediaUrl);
        }

        const createRes = await fetch(`${containerUrl}?${params.toString()}`, { method: 'POST' });
        const createData = await createRes.json();

        if (createData.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: createData.error.message, details: createData.error })
            };
        }

        const containerId = createData.id;

        // Step 2: Publish Media Container
        const publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`;
        const publishParams = new URLSearchParams();
        publishParams.append('creation_id', containerId);
        publishParams.append('access_token', accessToken);

        const publishRes = await fetch(`${publishUrl}?${publishParams.toString()}`, { method: 'POST' });
        const publishData = await publishRes.json();

        if (publishData.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: publishData.error.message, details: publishData.error })
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                mediaId: publishData.id,
                message: 'Post successfully published to live Instagram account!'
            })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
