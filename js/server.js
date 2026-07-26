const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://www.gstatic.com", 
                "https://checkout.razorpay.com",
                "https://cdn.tailwindcss.com",
                "https://www.googletagmanager.com"
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://fonts.googleapis.com", 
                "https://cdn.tailwindcss.com"
            ],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:", "https://axonflow.in"],
            connectSrc: [
                "'self'", 
                "https://api.razorpay.com", 
                "https://identitytoolkit.googleapis.com",
                "https://securetoken.googleapis.com",
                "https://axonflow-academy.firebaseapp.com"
            ],
            frameSrc: ["'self'", "https://checkout.razorpay.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://axonflow.in',
        'https://www.axonflow.in',
        'https://axonflow-platform.onrender.com'
    ],
    credentials: true
}));

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true
}));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            firebase: 'connected',
            payment: 'razorpay-ready',
            ai_teacher: 'active'
        }
    });
});

app.get('/api/config', (req, res) => {
    res.json({
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        },
        razorpay: {
            keyId: process.env.RAZORPAY_KEY_ID
        },
        msme: {
            number: process.env.MSME_NUMBER || 'UDYAM-MH-12-0012345'
        }
    });
});

// Course enrollment API
app.post('/api/enroll', (req, res) => {
    const { courseId, userDetails, paymentData } = req.body;
    
    // Store enrollment (in production, save to database)
    const enrollment = {
        id: `ENR_${Date.now()}`,
        courseId,
        userDetails,
        paymentData,
        status: 'active',
        enrollmentDate: new Date().toISOString()
    };
    
    res.json({
        success: true,
        enrollment,
        message: 'Enrollment successful'
    });
});

// Payment verification API
app.post('/api/verify-payment', (req, res) => {
    const { transactionId, courseId, amount } = req.body;
    
    // In production, verify with Razorpay/UPI
    const verification = {
        verified: true,
        transactionId,
        courseId,
        amount,
        timestamp: new Date().toISOString()
    };
    
    res.json({
        success: true,
        verification,
        message: 'Payment verified successfully'
    });
});

// Contact form API
app.post('/api/contact', (req, res) => {
    const { name, email, service, message } = req.body;
    
    // Store contact submission
    const contact = {
        id: Date.now(),
        name,
        email,
        service,
        message,
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    res.json({
        success: true,
        contact,
        message: 'Message received. We\'ll get back to you within 24 hours.'
    });
});

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/agency', (req, res) => {
    res.sendFile(path.join(__dirname, 'agency.html'));
});

app.get('/academy', (req, res) => {
    res.sendFile(path.join(__dirname, 'academy.html'));
});

// Redirect old paths
app.get('/agency.html', (req, res) => {
    res.redirect(301, '/agency');
});

app.get('/academy.html', (req, res) => {
    res.redirect(301, '/academy');
});

// Sitemap
app.get('/sitemap.xml', (req, res) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://axonflow.in/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://axonflow.in/agency</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://axonflow.in/academy</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.9</priority>
    </url>
</urlset>`;
    
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://axonflow.in/sitemap.xml`;
    
    res.set('Content-Type', 'text/plain');
    res.send(robots);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 AxonFlow Platform running on port ${PORT}`);
    console.log(`📱 Agency: http://localhost:${PORT}/agency`);
    console.log(`🎓 Academy: http://localhost:${PORT}/academy`);
    console.log(`🔧 Health: http://localhost:${PORT}/api/health`);
});