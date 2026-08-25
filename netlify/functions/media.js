// Netlify Serverless Function: media.js
// Handles uploading custom media from CRM and serving it as a public HTTPS URL for Meta Graph API crawlers

// In-memory / temporary buffer store for uploaded media items
// Note: In serverless environments, global memory persists across warm container invocations
const mediaStore = new Map();

exports.handler = async function(event, context) {
    // 1. GET request: Serve the media file to Meta Graph API crawlers
    if (event.httpMethod === 'GET') {
        const id = event.queryStringParameters && event.queryStringParameters.id;
        if (!id || !mediaStore.has(id)) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Media asset not found or expired'
            };
        }

        const item = mediaStore.get(id);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': item.mimeType || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
            },
            body: item.base64Data,
            isBase64Encoded: true
        };
    }

    // 2. POST request: Upload custom image/video from CRM dashboard
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body || '{}');
            const { fileData, fileName, mimeType } = body;

            if (!fileData) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'fileData (base64 string) is required' })
                };
            }

            // Extract pure base64
            let cleanBase64 = fileData;
            let detectedMime = mimeType || 'image/jpeg';
            if (fileData.includes(';base64,')) {
                const parts = fileData.split(';base64,');
                detectedMime = parts[0].replace('data:', '');
                cleanBase64 = parts[1];
            }

            const mediaId = 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
            mediaStore.set(mediaId, {
                base64Data: cleanBase64,
                mimeType: detectedMime,
                name: fileName || 'uploaded_media',
                createdAt: Date.now()
            });

            // Construct public URL
            const host = event.headers.host || 'www.axonflow.in';
            const protocol = host.includes('localhost') ? 'http' : 'https';
            const publicUrl = `${protocol}://${host}/.netlify/functions/media?id=${mediaId}`;

            return {
                statusCode: 200,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: true,
                    mediaId: mediaId,
                    publicUrl: publicUrl,
                    mimeType: detectedMime
                })
            };
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: err.message })
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
    };
};
