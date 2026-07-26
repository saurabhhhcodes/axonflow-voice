// AxonFlow Academy Frontend Application
class AxonFlowApp {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token');
        this.user = null;
        this.sessionId = null;
        this.init();
    }

    async init() {
        await this.loadCourses();
        if (this.token) {
            await this.validateToken();
        }
    }

    // Authentication
    async signInWithGoogle() {
        // Simulate Google OAuth
        const userData = {
            email: 'demo@gmail.com',
            name: 'Demo User',
            provider: 'google'
        };
        await this.authenticate(userData);
    }

    async signInWithMicrosoft() {
        // Simulate Microsoft OAuth
        const userData = {
            email: 'demo@company.com',
            name: 'Demo User',
            provider: 'microsoft'
        };
        await this.authenticate(userData);
    }

    async signInWithEmail(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const userData = {
            email: email,
            name: email.split('@')[0],
            provider: 'email'
        };
        await this.authenticate(userData);
    }

    async authenticate(userData) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('token', this.token);
                this.updateAuthUI();
                this.closeAuthModal();
                this.showNotification('Successfully signed in!', 'success');
            } else {
                this.showNotification('Sign in failed', 'error');
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showNotification('Connection error', 'error');
        }
    }

    async validateToken() {
        if (!this.token) return;
        
        try {
            const response = await fetch(`${this.apiUrl}/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                this.updateAuthUI();
            } else {
                this.signOut();
            }
        } catch (error) {
            console.error('Token validation error:', error);
        }
    }

    signOut() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        this.updateAuthUI();
    }

    updateAuthUI() {
        const authSection = document.getElementById('auth-section');
        
        if (this.user) {
            authSection.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="text-slate-300">Welcome, ${this.user.name}</span>
                    <button onclick="app.signOut()" class="text-slate-400 hover:text-white">Sign Out</button>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <button onclick="showAuthModal()" class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Sign In
                </button>
            `;
        }
    }

    // Courses
    async loadCourses() {
        try {
            const response = await fetch(`${this.apiUrl}/courses`);
            const courses = await response.json();
            this.renderCourses(courses);
        } catch (error) {
            console.error('Error loading courses:', error);
            this.renderFallbackCourses();
        }
    }

    renderCourses(courses) {
        const grid = document.getElementById('courses-grid');
        
        grid.innerHTML = courses.map(course => `
            <div class="bg-slate-800 rounded-xl p-6 card-hover border border-slate-700">
                <div class="text-3xl mb-4">${this.getCourseIcon(course.course_id)}</div>
                <h3 class="text-xl font-semibold mb-3">${course.name}</h3>
                <p class="text-slate-300 mb-4">${course.description}</p>
                <div class="space-y-2 mb-6">
                    <div class="flex justify-between">
                        <span class="text-slate-400">Duration:</span>
                        <span class="text-white">${course.duration}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Price:</span>
                        <span class="text-cyan-400 font-semibold">₹${course.price.toLocaleString()}</span>
                    </div>
                </div>
                <button onclick="app.enrollCourse('${course.course_id}', '${course.name}', ${course.price})" 
                        class="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-medium transition-colors">
                    Enroll Now
                </button>
            </div>
        `).join('');
    }

    renderFallbackCourses() {
        const fallbackCourses = [
            { course_id: 'ai-agent', name: 'AI Agent Development', price: 25000, duration: '3 months', description: 'Master LLMs, RAG systems, and autonomous agents' },
            { course_id: 'fullstack', name: 'Full-Stack Development', price: 18000, duration: '3 months', description: 'Build modern web applications' },
            { course_id: 'testing', name: 'Testing & QA', price: 12000, duration: '2 months', description: 'Manual and automated testing' }
        ];
        this.renderCourses(fallbackCourses);
    }

    getCourseIcon(courseId) {
        const icons = {
            'ai-agent': '🤖',
            'fullstack': '💻',
            'testing': '🧪',
            'n8n': '⚡',
            'data-analysis': '📊',
            'database': '🗄️'
        };
        return icons[courseId] || '📚';
    }

    async enrollCourse(courseId, courseName, price) {
        if (!this.user) {
            this.showAuthModal();
            return;
        }

        const transactionId = prompt(`To enroll in ${courseName} (₹${price.toLocaleString()}), please pay via UPI to: saurabh@paytm\n\nEnter your transaction ID:`);
        
        if (!transactionId) return;

        try {
            const response = await fetch(`${this.apiUrl}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    course_id: courseId,
                    transaction_id: transactionId
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.showNotification(`Successfully enrolled in ${courseName}! You'll receive access within 2 hours.`, 'success');
            } else {
                this.showNotification(data.error || 'Enrollment failed', 'error');
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            this.showNotification('Connection error', 'error');
        }
    }

    // AI Teacher
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        if (!this.user) {
            this.showAuthModal();
            return;
        }

        // Add user message to chat
        this.addMessageToChat('user', message);
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await fetch(`${this.apiUrl}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId || `session_${Date.now()}`
                })
            });

            const data = await response.json();
            
            this.hideTypingIndicator();
            
            if (data.success) {
                this.sessionId = data.session_id;
                this.addMessageToChat('ai', data.response, data.model);
            } else {
                this.addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            console.error('AI chat error:', error);
            this.hideTypingIndicator();
            this.addMessageToChat('ai', 'Connection error. Please check your internet and try again.');
        }
    }

    addMessageToChat(type, message, model = '') {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        if (type === 'user') {
            messageDiv.className = 'bg-slate-700/50 rounded-lg p-4 ml-8';
            messageDiv.innerHTML = `
                <div class="flex items-center space-x-2 mb-2">
                    <span class="text-slate-400">👤</span>
                    <span class="font-medium text-slate-400">You</span>
                </div>
                <p class="text-white">${message}</p>
            `;
        } else {
            messageDiv.className = 'bg-cyan-500/10 rounded-lg p-4 mr-8 border border-cyan-500/20';
            messageDiv.innerHTML = `
                <div class="flex items-center space-x-2 mb-2">
                    <span class="text-cyan-400">🤖</span>
                    <span class="font-medium text-cyan-400">AI Teacher</span>
                    ${model ? `<span class="text-xs bg-slate-600 px-2 py-1 rounded">${model}</span>` : ''}
                </div>
                <div class="text-slate-300 whitespace-pre-line">${this.formatMessage(message)}</div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 rounded">$1</code>');
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'bg-cyan-500/10 rounded-lg p-4 mr-8 border border-cyan-500/20';
        typingDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-cyan-400">🤖</span>
                <span class="font-medium text-cyan-400">AI Teacher</span>
                <span class="text-slate-400">is typing...</span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    // UI Helpers
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions
function showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function tryAITeacher() {
    document.getElementById('ai-teacher-modal').classList.remove('hidden');
}

function closeAITeacher() {
    document.getElementById('ai-teacher-modal').classList.add('hidden');
}

function askQuestion(question) {
    document.getElementById('chat-input').value = question;
    app.sendMessage();
}

function sendMessage() {
    app.sendMessage();
}

function signInWithGoogle() {
    app.signInWithGoogle();
}

function signInWithMicrosoft() {
    app.signInWithMicrosoft();
}

function signInWithEmail(event) {
    app.signInWithEmail(event);
}

// Initialize app
const app = new AxonFlowApp();