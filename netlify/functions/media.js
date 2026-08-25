// Netlify Serverless Function: media.js
// Handles uploading custom media from CRM and serving it as a public HTTPS URL for Meta Graph API crawlers
const fs = require('fs');
const path = require('path');
const os = require('os');

const TMP_DIR = os.tmpdir();
const mediaStore = new Map();

exports.handler = async function(event, context) {
    // 1. GET request: Serve the media file to Meta Graph API crawlers
    if (event.httpMethod === 'GET') {
        const id = event.queryStringParameters && event.queryStringParameters.id;
        if (!id) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Media ID required'
            };
        }

        let base64Data = null;
        let mimeType = 'image/jpeg';

        if (mediaStore.has(id)) {
            const item = mediaStore.get(id);
            base64Data = item.base64Data;
            mimeType = item.mimeType;
        } else {
            // Check /tmp filesystem fallback
            const filePath = path.join(TMP_DIR, `axon_${id}.bin`);
            const metaPath = path.join(TMP_DIR, `axon_${id}.meta`);
            if (fs.existsSync(filePath)) {
                base64Data = fs.readFileSync(filePath, 'utf8');
                if (fs.existsSync(metaPath)) {
                    mimeType = fs.readFileSync(metaPath, 'utf8').trim();
                }
            }
        }

        if (!base64Data) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Media asset expired or not found'
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': mimeType || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
            },
            body: base64Data,
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
            
            // Save in-memory
            mediaStore.set(mediaId, {
                base64Data: cleanBase64,
                mimeType: detectedMime,
                name: fileName || 'uploaded_media',
                createdAt: Date.now()
            });

            // Save to /tmp filesystem for persistence across serverless container recycling
            try {
                fs.writeFileSync(path.join(TMP_DIR, `axon_${mediaId}.bin`), cleanBase64, 'utf8');
                fs.writeFileSync(path.join(TMP_DIR, `axon_${mediaId}.meta`), detectedMime, 'utf8');
            } catch(fErr) {
                console.warn('Filesystem temp store warning:', fErr);
            }

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
