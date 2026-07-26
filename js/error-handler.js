// Immediately suppress extension errors
(function() {
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('Video element not found') || 
            message.includes('content.js') ||
            message.includes('extension://')) {
            return;
        }
        originalError.apply(console, args);
    };
})();

// Global error handler for AxonFlow platform
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.init();
    }

    init() {
        // Handle uncaught JavaScript errors
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', e.message, e.filename, e.lineno);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Promise Rejection', e.reason, 'Promise', 0);
        });

        // Handle 404 and network errors
        this.interceptFetch();
        
        // Suppress video element errors from browser extensions
        this.suppressExtensionErrors();
    }

    logError(type, message, source, line) {
        // Skip browser extension errors
        if (source && source.includes('extension://')) return;
        if (message && message.includes('Video element not found')) return;
        if (source && source.includes('content.js')) return;

        const error = {
            type,
            message,
            source,
            line,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        this.errors.push(error);
        console.warn('AxonFlow Error:', error);

        // Send to backend dashboard if available
        this.reportToBackend(error);
    }

    suppressExtensionErrors() {
        // Override console methods to filter extension errors
        const originalError = console.error;
        console.error = (...args) => {
            const message = args.join(' ');
            if (message.includes('Video element not found') || 
                message.includes('content.js') ||
                message.includes('extension://')) {
                return; // Suppress these errors
            }
            originalError.apply(console, args);
        };
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok && response.status === 404) {
                    this.logError('Network Error', `404 Not Found: ${args[0]}`, 'fetch', 0);
                }
                return response;
            } catch (error) {
                this.logError('Network Error', error.message, 'fetch', 0);
                throw error;
            }
        };
    }

    async reportToBackend(error) {
        try {
            await fetch('/api/error-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(error)
            });
        } catch (e) {
            // Silently fail if backend is not available
        }
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }
}

// Initialize global error handler
window.errorHandler = new ErrorHandler();