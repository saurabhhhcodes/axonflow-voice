// Intro Themes & Loading Animations
class IntroThemes {
    constructor() {
        this.themes = {
            matrix: this.createMatrixTheme,
            particles: this.createParticlesTheme,
            neural: this.createNeuralTheme,
            cyber: this.createCyberTheme,
            minimal: this.createMinimalTheme
        };
        this.currentTheme = 'neural';
        this.init();
    }

    init() {
        this.createIntroLoader();
        this.setupThemeSelector();
    }

    createIntroLoader() {
        const loader = document.createElement('div');
        loader.id = 'intro-loader';
        loader.className = 'fixed inset-0 z-[9999] bg-black flex items-center justify-center';
        loader.innerHTML = `
            <div class="intro-content text-center">
                <div class="logo-container mb-8">
                    <img src="https://axonflow.in/logo.png" alt="AxonFlow" class="w-20 h-20 mx-auto rounded-2xl mb-4" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4" style="display:none">
                        <span class="text-white font-bold text-3xl">A</span>
                    </div>
                    <h1 class="text-4xl font-black text-white mb-2">AxonFlow</h1>
                    <p class="text-cyan-400 text-lg">AI-Powered Future</p>
                </div>
                <div class="theme-canvas" id="theme-canvas"></div>
                <div class="loading-text mt-8">
                    <div class="text-white text-xl font-semibold mb-4" id="loading-text">Initializing AI Systems...</div>
                    <div class="progress-bar w-64 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
                        <div class="progress-fill h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loader);
        this.startIntroSequence();
    }

    async startIntroSequence() {
        const canvas = document.getElementById('theme-canvas');
        const loadingText = document.getElementById('loading-text');
        const progressFill = document.querySelector('.progress-fill');
        
        // Start theme animation
        this.themes[this.currentTheme](canvas);
        
        const steps = [
            { text: "Loading AI Models...", progress: 20 },
            { text: "Connecting Neural Networks...", progress: 40 },
            { text: "Initializing Learning Systems...", progress: 60 },
            { text: "Preparing Interactive Experience...", progress: 80 },
            { text: "Welcome to the Future!", progress: 100 }
        ];

        for (let i = 0; i < steps.length; i++) {
            await this.delay(800);
            loadingText.textContent = steps[i].text;
            progressFill.style.width = steps[i].progress + '%';
        }

        await this.delay(1000);
        this.hideIntroLoader();
    }

    createMatrixTheme(canvas) {
        canvas.innerHTML = `
            <div class="matrix-rain w-full h-32 relative overflow-hidden bg-black rounded-lg">
                <div class="matrix-code absolute inset-0"></div>
            </div>
        `;
        
        const matrixCode = canvas.querySelector('.matrix-code');
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        for (let i = 0; i < 20; i++) {
            const column = document.createElement('div');
            column.className = 'absolute top-0 text-green-400 text-xs font-mono opacity-70';
            column.style.left = (i * 5) + '%';
            column.style.animationDelay = (Math.random() * 2) + 's';
            
            let columnText = '';
            for (let j = 0; j < 15; j++) {
                columnText += chars[Math.floor(Math.random() * chars.length)] + '<br>';
            }
            column.innerHTML = columnText;
            
            column.style.animation = 'matrix-fall 3s linear infinite';
            matrixCode.appendChild(column);
        }
        
        this.addMatrixCSS();
    }

    createParticlesTheme(canvas) {
        canvas.innerHTML = `
            <div class="particles-container w-full h-32 relative bg-gradient-to-br from-slate-900 to-black rounded-lg overflow-hidden">
                <div class="particles absolute inset-0"></div>
            </div>
        `;
        
        const particlesContainer = canvas.querySelector('.particles');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animation = 'particle-float 4s ease-in-out infinite';
            particlesContainer.appendChild(particle);
        }
        
        this.addParticlesCSS();
    }

    createNeuralTheme(canvas) {
        canvas.innerHTML = `
            <div class="neural-network w-full h-32 relative bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg overflow-hidden">
                <svg class="w-full h-full" viewBox="0 0 400 128">
                    <defs>
                        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.8" />
                            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.8" />
                        </linearGradient>
                    </defs>
                    <!-- Neural connections -->
                    <g class="neural-connections">
                        <line x1="50" y1="30" x2="150" y2="60" stroke="url(#neuralGrad)" stroke-width="1" opacity="0.6">
                            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50" y1="30" x2="150" y2="90" stroke="url(#neuralGrad)" stroke-width="1" opacity="0.6">
                            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite"/>
                        </line>
                        <line x1="150" y1="60" x2="250" y2="40" stroke="url(#neuralGrad)" stroke-width="1" opacity="0.6">
                            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.8s" repeatCount="indefinite"/>
                        </line>
                        <line x1="150" y1="90" x2="250" y2="80" stroke="url(#neuralGrad)" stroke-width="1" opacity="0.6">
                            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="250" y1="40" x2="350" y2="64" stroke="url(#neuralGrad)" stroke-width="1" opacity="0.6">
                            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.8s" repeatCount="indefinite"/>
                        </line>
                    </g>
                    <!-- Neural nodes -->
                    <g class="neural-nodes">
                        <circle cx="50" cy="30" r="4" fill="#06b6d4">
                            <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="150" cy="60" r="4" fill="#8b5cf6">
                            <animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="150" cy="90" r="4" fill="#06b6d4">
                            <animate attributeName="r" values="3;6;3" dur="1.8s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="250" cy="40" r="4" fill="#8b5cf6">
                            <animate attributeName="r" values="3;6;3" dur="2.2s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="250" cy="80" r="4" fill="#06b6d4">
                            <animate attributeName="r" values="3;6;3" dur="2.8s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="350" cy="64" r="4" fill="#8b5cf6">
                            <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
                        </circle>
                    </g>
                </svg>
            </div>
        `;
    }

    createCyberTheme(canvas) {
        canvas.innerHTML = `
            <div class="cyber-grid w-full h-32 relative bg-black rounded-lg overflow-hidden">
                <div class="grid-lines absolute inset-0 opacity-30">
                    <div class="grid-horizontal"></div>
                    <div class="grid-vertical"></div>
                </div>
                <div class="cyber-pulse absolute inset-0 flex items-center justify-center">
                    <div class="pulse-ring"></div>
                </div>
            </div>
        `;
        
        this.addCyberCSS();
    }

    createMinimalTheme(canvas) {
        canvas.innerHTML = `
            <div class="minimal-loader w-full h-32 flex items-center justify-center">
                <div class="minimal-dots flex space-x-2">
                    <div class="dot w-3 h-3 bg-cyan-400 rounded-full"></div>
                    <div class="dot w-3 h-3 bg-purple-400 rounded-full"></div>
                    <div class="dot w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
            </div>
        `;
        
        this.addMinimalCSS();
    }

    setupThemeSelector() {
        // Add theme selector to settings (if exists)
        const settingsPanel = document.querySelector('.settings-panel');
        if (settingsPanel) {
            const themeSelector = document.createElement('div');
            themeSelector.innerHTML = `
                <div class="theme-selector mb-4">
                    <label class="text-sm text-slate-300 mb-2 block">Intro Theme</label>
                    <select id="intro-theme-select" class="bg-slate-800 text-white rounded px-3 py-2 w-full">
                        <option value="neural">Neural Network</option>
                        <option value="matrix">Matrix Rain</option>
                        <option value="particles">Particles</option>
                        <option value="cyber">Cyber Grid</option>
                        <option value="minimal">Minimal</option>
                    </select>
                </div>
            `;
            settingsPanel.appendChild(themeSelector);
            
            document.getElementById('intro-theme-select').addEventListener('change', (e) => {
                this.currentTheme = e.target.value;
                localStorage.setItem('axonflow_intro_theme', this.currentTheme);
            });
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('axonflow_intro_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
    }

    hideIntroLoader() {
        const loader = document.getElementById('intro-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                loader.remove();
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addMatrixCSS() {
        if (!document.getElementById('matrix-styles')) {
            const style = document.createElement('style');
            style.id = 'matrix-styles';
            style.textContent = `
                @keyframes matrix-fall {
                    0% { transform: translateY(-100%); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(200%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addParticlesCSS() {
        if (!document.getElementById('particles-styles')) {
            const style = document.createElement('style');
            style.id = 'particles-styles';
            style.textContent = `
                @keyframes particle-float {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
                    25% { transform: translateY(-10px) translateX(5px); opacity: 1; }
                    50% { transform: translateY(-5px) translateX(-5px); opacity: 0.8; }
                    75% { transform: translateY(-15px) translateX(3px); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addCyberCSS() {
        if (!document.getElementById('cyber-styles')) {
            const style = document.createElement('style');
            style.id = 'cyber-styles';
            style.textContent = `
                .grid-horizontal {
                    background: repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 20px,
                        #06b6d4 20px,
                        #06b6d4 21px
                    );
                    height: 100%;
                }
                .grid-vertical {
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 20px,
                        #8b5cf6 20px,
                        #8b5cf6 21px
                    );
                    height: 100%;
                    position: absolute;
                    top: 0;
                    width: 100%;
                }
                .pulse-ring {
                    width: 60px;
                    height: 60px;
                    border: 2px solid #06b6d4;
                    border-radius: 50%;
                    animation: cyber-pulse 2s ease-in-out infinite;
                }
                @keyframes cyber-pulse {
                    0% { transform: scale(0.8); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(0.8); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addMinimalCSS() {
        if (!document.getElementById('minimal-styles')) {
            const style = document.createElement('style');
            style.id = 'minimal-styles';
            style.textContent = `
                .minimal-dots .dot:nth-child(1) {
                    animation: minimal-bounce 1.4s ease-in-out infinite both;
                    animation-delay: -0.32s;
                }
                .minimal-dots .dot:nth-child(2) {
                    animation: minimal-bounce 1.4s ease-in-out infinite both;
                    animation-delay: -0.16s;
                }
                .minimal-dots .dot:nth-child(3) {
                    animation: minimal-bounce 1.4s ease-in-out infinite both;
                }
                @keyframes minimal-bounce {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                    40% { transform: scale(1.2); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Public method to show intro on demand
    showIntro() {
        if (!document.getElementById('intro-loader')) {
            this.createIntroLoader();
        }
    }
}

// Initialize intro themes
document.addEventListener('DOMContentLoaded', () => {
    // Only show intro on first visit or if explicitly requested
    const hasSeenIntro = sessionStorage.getItem('axonflow_intro_shown');
    
    if (!hasSeenIntro || window.location.hash === '#intro') {
        window.introThemes = new IntroThemes();
        sessionStorage.setItem('axonflow_intro_shown', 'true');
    }
});

// Export for manual triggering
window.showIntro = () => {
    if (!window.introThemes) {
        window.introThemes = new IntroThemes();
    } else {
        window.introThemes.showIntro();
    }
};