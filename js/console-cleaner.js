// Console Cleaner for AxonFlow Academy
class ConsoleCleaner {
    constructor() {
        this.init();
    }

    init() {
        // Clean console on load
        this.cleanConsole();
        
        // Add professional branding
        this.addBranding();
        
        // Set up periodic cleaning
        setInterval(() => this.cleanConsole(), 30000);
    }

    cleanConsole() {
        if (typeof console !== 'undefined' && console.clear) {
            console.clear();
        }
    }

    addBranding() {
        const styles = {
            title: 'color: #06b6d4; font-size: 24px; font-weight: bold;',
            subtitle: 'color: #8b5cf6; font-size: 16px;',
            info: 'color: #10b981; font-size: 14px;',
            warning: 'color: #f59e0b; font-size: 12px;'
        };

        console.log('%c🚀 AxonFlow Academy', styles.title);
        console.log('%cAI-Powered Learning Platform', styles.subtitle);
        console.log('%c✨ Learn AI • Build Projects • Get Mentorship', styles.info);
        console.log('%c⚠️  This is a browser feature intended for developers. Do not paste any code here unless you understand what it does.', styles.warning);
        console.log('%c📧 Contact: hello@axonflow.in', styles.info);
    }
}

// Initialize console cleaner
new ConsoleCleaner();