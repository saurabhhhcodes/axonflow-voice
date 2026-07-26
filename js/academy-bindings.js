/**
 * Global bindings for Academy Page
 * Bridges HTML onclick events to class instances
 */

// Global function to show enrollment form
window.showEnrollmentForm = function (courseId, courseName, price) {
    console.log('Opening enrollment for:', courseName);
    if (window.enrollmentSystem) {
        // Map simplified course types for display
        const typeMap = {
            'ai-agent': 'Premium',
            'fullstack': 'Standard',
            'n8n': 'Standard',
            'data-analysis': 'Standard',
            'testing': 'Basic',
            'database': 'Basic'
        };
        const type = typeMap[courseId] || 'Standard';

        window.enrollmentSystem.showEnrollmentModal(courseId, courseName, type, price);
    } else {
        console.error('Enrollment System not initialized');
        alert('Enrollment system loading... please try again in a moment.');
    }
};

// Global function to show AI Teacher
window.showAITeacher = function () {
    console.log('Opening AI Teacher');
    if (window.productionAI) {
        window.productionAI.show();
    } else {
        console.error('AI Teacher not initialized');
        alert('AI Teacher loading... please try again in a moment.');
    }
};

// Global function to show Auth Modal
window.showAuthModal = function () {
    if (window.buttonManager) {
        window.buttonManager.showAuthModal();
    } else {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('hidden');
    }
};

// Global function to close intro screen
window.closeIntro = function () {
    const intro = document.getElementById('intro-screen');
    if (intro) {
        intro.style.opacity = '0';
        setTimeout(() => intro.remove(), 500);
    }
};

console.log('Academy bindings initialized');
