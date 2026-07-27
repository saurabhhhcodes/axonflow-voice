const http = require('http');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'axonflow_crm';

let db = null;

// Connect to MongoDB using modern v6 driver options
MongoClient.connect(MONGO_URI)
  .then(client => {
    console.log('✅ Connected successfully to MongoDB at', MONGO_URI);
    db = client.db(DB_NAME);
  })
  .catch(err => {
    console.warn('⚠️ Could not connect to MongoDB:', err.message);
  });

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && (req.url === '/api/sync' || req.url === '/api/contact')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        console.log('📥 Inbound CRM Submission:', payload);

        if (db) {
          const collectionName = payload.type === 'intern' ? 'proposals' : 'enquiries';
          await db.collection(collectionName).insertOne({
            ...payload,
            syncedAt: new Date().toISOString()
          });
          console.log(`💾 Persisted to collection [${collectionName}]`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', synced: !!db }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'running', mongodb: !!db }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`🚀 AxonFlow MongoDB Sync Agent running on http://localhost:${PORT}`);
});
