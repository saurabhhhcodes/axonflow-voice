// Intro Loader System
class IntroLoader {
    constructor() {
        this.createLoader();
        this.startAnimation();
    }

    createLoader() {
        // Wait for body to be available
        if (!document.body) {
            setTimeout(() => this.createLoader(), 100);
            return;
        }
        
        const loader = document.createElement('div');
        loader.id = 'intro-loader';
        loader.className = 'fixed inset-0 z-[9999] bg-gray-950 flex items-center justify-center';
        loader.innerHTML = `
            <div class="text-center">
                <div class="relative mb-8">
                    <div class="w-32 h-32 mx-auto">
                        <svg viewBox="0 0 500 500" class="w-full h-full animate-pulse">
                            <defs>
                                <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#00d4ff"/>
                                    <stop offset="50%" style="stop-color:#0ea5e9"/>
                                    <stop offset="100%" style="stop-color:#8b5cf6"/>
                                </linearGradient>
                            </defs>
                            <circle cx="250" cy="250" r="240" fill="url(#loaderGrad)"/>
                            <circle cx="180" cy="180" r="20" fill="white" opacity="0.9"/>
                            <circle cx="320" cy="180" r="20" fill="white" opacity="0.9"/>
                            <circle cx="250" cy="250" r="25" fill="white"/>
                            <circle cx="180" cy="320" r="20" fill="white" opacity="0.9"/>
                            <circle cx="320" cy="320" r="20" fill="white" opacity="0.9"/>
                            <path d="M180 180 L250 250 L320 180" stroke="white" stroke-width="6" fill="none" opacity="0.8"/>
                            <path d="M180 320 L250 250 L320 320" stroke="white" stroke-width="6" fill="none" opacity="0.8"/>
                            <path d="M180 180 L180 320" stroke="white" stroke-width="4" fill="none" opacity="0.6"/>
                            <path d="M320 180 L320 320" stroke="white" stroke-width="4" fill="none" opacity="0.6"/>
                            <path d="M150 380 Q250 360 350 380" stroke="white" stroke-width="8" fill="none" opacity="0.9"/>
                            <polygon points="340,375 350,380 340,385" fill="white" opacity="0.9"/>
                        </svg>
                    </div>
                    <div class="absolute inset-0 rounded-full border-4 border-cyan-400/30 animate-spin"></div>
                </div>
                <h1 class="text-4xl font-bold text-white mb-4 animate-fade-in">AxonFlow Academy</h1>
                <p class="text-cyan-400 text-lg mb-6 animate-fade-in-delay">AI-Powered Learning Platform</p>
                <div class="flex items-center justify-center space-x-2 text-gray-400">
                    <div class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    startAnimation() {
        setTimeout(() => {
            const loader = document.getElementById('intro-loader');
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s ease-out';
            setTimeout(() => {
                loader.remove();
                document.body.style.visibility = 'visible';
            }, 800);
        }, 2500);
    }
}

// Initialize loader safely
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => new IntroLoader(), 100);
    });
} else {
    setTimeout(() => new IntroLoader(), 100);
}