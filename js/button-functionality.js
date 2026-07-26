// Universal Button Functionality System
class ButtonManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.makeAllButtonsWork();
    }

    setupGlobalEventListeners() {
        document.addEventListener('click', (e) => {
            this.handleButtonClick(e);
        });

        document.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });
    }

    handleButtonClick(e) {
        const button = e.target.closest('button, a[href], [role="button"]');
        if (!button) return;

        // Prevent default for buttons without specific handlers
        if (button.tagName === 'BUTTON' && !button.type) {
            e.preventDefault();
        }

        // Handle different button types
        this.routeButtonAction(button, e);
    }

    routeButtonAction(button, e) {
        const action = button.dataset.action || this.inferAction(button);
        const data = this.extractButtonData(button);

        switch (action) {
            case 'enroll':
                this.handleEnrollment(data, button);
                break;
            case 'start-course':
                this.startCourse(data);
                break;
            case 'ai-teacher':
                this.openAITeacher(data);
                break;
            case 'auth':
                this.handleAuth(data);
                break;
            case 'payment':
                this.handlePayment(data);
                break;
            case 'contact':
                this.handleContact(data);
                break;
            case 'navigation':
                this.handleNavigation(button, e);
                break;
            case 'modal':
                this.handleModal(data, button);
                break;
            default:
                this.handleGenericButton(button, data);
        }
    }

    inferAction(button) {
        const text = button.textContent.toLowerCase();
        const classes = button.className.toLowerCase();
        const href = button.href;

        if (text.includes('enroll') || classes.includes('enroll')) return 'enroll';
        if (text.includes('start') && (text.includes('course') || text.includes('learning'))) return 'start-course';
        if (text.includes('ai teacher') || text.includes('try ai')) return 'ai-teacher';
        if (text.includes('sign in') || text.includes('login') || classes.includes('auth')) return 'auth';
        if (text.includes('pay') || text.includes('payment') || classes.includes('payment')) return 'payment';
        if (text.includes('contact') || text.includes('get started')) return 'contact';
        if (href && href.startsWith('#')) return 'navigation';
        if (classes.includes('modal') || button.dataset.modal) return 'modal';
        
        return 'generic';
    }

    extractButtonData(button) {
        return {
            courseId: button.dataset.courseId || button.closest('[data-course-id]')?.dataset.courseId,
            courseName: button.dataset.courseName,
            price: button.dataset.price,
            action: button.dataset.action,
            target: button.dataset.target || button.href,
            modal: button.dataset.modal,
            form: button.dataset.form,
            ...this.parseDataAttributes(button)
        };
    }

    parseDataAttributes(element) {
        const data = {};
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-') && attr.name !== 'data-action') {
                const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                data[key] = attr.value;
            }
        }
        return data;
    }

    handleEnrollment(data, button) {
        if (!data.courseId) {
            console.error('No course ID found for enrollment');
            return;
        }

        // Check authentication
        const user = JSON.parse(localStorage.getItem('axonflow_user') || 'null');
        if (!user) {
            this.showAuthModal();
            return;
        }

        // Check if already enrolled
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        if (enrolledCourses.includes(data.courseId)) {
            this.accessCourse(data.courseId);
            return;
        }

        // Find course details
        const course = this.findCourse(data.courseId);
        if (!course) {
            console.error('Course not found:', data.courseId);
            return;
        }

        // Show enrollment form
        this.showEnrollmentForm(course);
    }

    startCourse(data) {
        if (window.aiTeacher && data.courseId) {
            const course = this.findCourse(data.courseId);
            if (course) {
                window.aiTeacher.startCourse(course);
                window.aiTeacher.toggleChat();
            }
        } else {
            this.openAITeacher(data);
        }
    }

    openAITeacher(data) {
        if (window.aiTeacher) {
            window.aiTeacher.toggleChat();
            if (data.courseId) {
                const course = this.findCourse(data.courseId);
                if (course) {
                    window.aiTeacher.startCourse(course);
                }
            }
        } else {
            alert('🤖 AI Teacher: Welcome! Sign up to access our interactive AI-powered courses with personalized tutoring.');
        }
    }

    handleAuth(data) {
        if (window.ssoAuth) {
            if (data.provider === 'google') {
                window.ssoAuth.signInWithGoogle();
            } else if (data.provider === 'microsoft') {
                window.ssoAuth.signInWithMicrosoft();
            } else {
                this.showAuthModal();
            }
        } else {
            this.showAuthModal();
        }
    }

    handlePayment(data) {
        if (window.paymentSystem && data.courseId) {
            const course = this.findCourse(data.courseId);
            const user = JSON.parse(localStorage.getItem('axonflow_user') || 'null');
            
            if (!user) {
                this.showAuthModal();
                return;
            }

            if (course) {
                window.paymentSystem.showPaymentModal(
                    course.id, 
                    course.title, 
                    course.price, 
                    { name: user.name, email: user.email, phone: user.phone || '' }
                );
            }
        }
    }

    handleContact(data) {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Show contact modal if no contact section
            this.showContactModal();
        }
    }

    handleNavigation(button, e) {
        if (button.href && button.href.includes('#')) {
            e.preventDefault();
            const targetId = button.href.split('#')[1];
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    handleModal(data, button) {
        const modalId = data.modal || data.target;
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.remove('hidden');
        } else {
            // Create dynamic modal based on button content
            this.createDynamicModal(button, data);
        }
    }

    handleGenericButton(button, data) {
        const text = button.textContent.toLowerCase();
        
        // Handle common button patterns
        if (text.includes('learn more') || text.includes('explore')) {
            this.showInfoModal(button.textContent, 'More information coming soon!');
        } else if (text.includes('download') || text.includes('get')) {
            this.handleDownload(data);
        } else if (text.includes('share')) {
            this.handleShare(data);
        } else if (text.includes('copy')) {
            this.handleCopy(data, button);
        } else {
            // Default action - show coming soon or redirect
            console.log('Generic button clicked:', button.textContent);
        }
    }

    // Helper Methods
    findCourse(courseId) {
        if (typeof ENHANCED_COURSES === 'undefined') return null;
        
        for (const category of Object.values(ENHANCED_COURSES)) {
            const course = category.find(c => c.id === courseId);
            if (course) return course;
        }
        return null;
    }

    showAuthModal() {
        const existingModal = document.getElementById('auth-modal');
        if (existingModal) {
            existingModal.classList.remove('hidden');
        } else {
            this.createAuthModal();
        }
    }

    createAuthModal() {
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">Sign In to AxonFlow</h3>
                        <button onclick="this.closest('#auth-modal').classList.add('hidden')" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                        <button onclick="buttonManager.handleAuth({provider: 'google'})" class="w-full bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                        
                        <button onclick="buttonManager.handleAuth({provider: 'microsoft'})" class="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                            </svg>
                            <span>Continue with Microsoft</span>
                        </button>
                    </div>
                    
                    <p class="text-slate-400 text-xs text-center">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showEnrollmentForm(course) {
        if (typeof showEnrollmentForm === 'function') {
            showEnrollmentForm(course.id, course.title, course.price);
        } else {
            // Fallback enrollment
            const user = JSON.parse(localStorage.getItem('axonflow_user') || 'null');
            if (window.paymentSystem) {
                window.paymentSystem.showPaymentModal(
                    course.id, 
                    course.title, 
                    course.price, 
                    { name: user.name, email: user.email, phone: '' }
                );
            }
        }
    }

    accessCourse(courseId) {
        if (window.paymentSystem) {
            window.paymentSystem.accessCourse(courseId);
        } else {
            this.openAITeacher({ courseId });
        }
    }

    showInfoModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-white">${title}</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    <p class="text-slate-300">${content}</p>
                    <button onclick="this.closest('.fixed').remove()" class="w-full mt-4 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                        Got it
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => modal.remove(), 5000);
    }

    handleCopy(data, button) {
        const textToCopy = data.text || button.dataset.copyText || button.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    }

    makeAllButtonsWork() {
        // Ensure all buttons have proper event handling
        document.querySelectorAll('button, a[href], [role="button"]').forEach(button => {
            if (!button.onclick && !button.dataset.processed) {
                button.dataset.processed = 'true';
                
                // Add hover effects for buttons without them
                if (button.tagName === 'BUTTON' && !button.className.includes('hover:')) {
                    button.classList.add('hover:opacity-80', 'transition-opacity');
                }
            }
        });
    }

    // Form handling
    handleFormSubmit(e) {
        const form = e.target;
        const action = form.dataset.action || form.action;
        
        if (action === 'contact' || form.id === 'contact-form') {
            e.preventDefault();
            this.handleContactForm(form);
        } else if (action === 'auth' || form.id === 'auth-form') {
            e.preventDefault();
            this.handleAuthForm(form);
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Store contact submission
        const contacts = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        contacts.push({
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('contact_submissions', JSON.stringify(contacts));
        
        // Show success message
        this.showInfoModal('Message Sent!', 'Thank you for your message. We\'ll get back to you within 24 hours.');
        form.reset();
    }

    handleAuthForm(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (window.ssoAuth) {
            // Use existing auth system
            window.ssoAuth.signInWithEmail(email, password);
        } else {
            // Simple fallback auth
            const userData = {
                email: email,
                name: email.split('@')[0],
                uid: Date.now().toString(),
                provider: 'email'
            };
            localStorage.setItem('axonflow_user', JSON.stringify(userData));
            this.showInfoModal('Signed In!', 'Welcome to AxonFlow Academy!');
            document.getElementById('auth-modal')?.classList.add('hidden');
        }
    }
}

// Initialize Button Manager
document.addEventListener('DOMContentLoaded', () => {
    window.buttonManager = new ButtonManager();
});