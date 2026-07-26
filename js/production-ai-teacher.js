
// Production AI Teacher - Real NLP-based learning system
class ProductionAITeacher {
    constructor() {
        this.currentCourse = null;

        this.chatHistory = [];
        this.canvas = null;
        this.canvasCtx = null;
    }

    async startCourse(courseId) {
        const course = window.courseManager?.getCourse(courseId);
        if (!course) return;

        this.currentCourse = course;
        this.show();
    }

    show() {
        const modal = document.createElement('div');
        modal.id = 'ai-teacher-modal';
        modal.className = 'fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl w-full max-w-7xl h-[90vh] flex border border-purple-500/30 shadow-2xl">
                <div class="w-72 bg-slate-950/50 p-4 border-r border-slate-700 overflow-y-auto">
                    <h3 class="text-white font-bold mb-4 text-lg">🎓 ${this.currentCourse?.name || 'AI Teacher'}</h3>
                    <div class="space-y-2">
                        <button onclick="window.productionAI.switchMode('chat')" class="w-full text-left px-4 py-3 rounded-lg bg-purple-500/20 text-white font-medium">💬 Ask Questions</button>
                        <button onclick="window.productionAI.switchMode('canvas')" class="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-500/20 text-slate-300">🎨 Whiteboard</button>
                        <button onclick="window.productionAI.switchMode('quiz')" class="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-500/20 text-slate-300">📝 Take Quiz</button>
                        <button onclick="window.productionAI.switchMode('assignment')" class="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-500/20 text-slate-300">📋 Assignment</button>
                        <button onclick="window.productionAI.switchMode('progress')" class="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-500/20 text-slate-300">📊 Progress</button>
                    </div>
                </div>
                
                <div class="flex-1 flex flex-col">
                    <div class="bg-gradient-to-r from-purple-600 to-cyan-600 p-4 flex justify-between items-center">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center animate-pulse">
                                <span class="text-2xl">🤖</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">AI Teacher - Gemini Pro</h3>
                                <p class="text-purple-100 text-xs">Real-time NLP • Subject Expert</p>
                            </div>
                        </div>
                        <button onclick="window.productionAI.close()" class="text-white hover:text-gray-200 text-3xl font-bold">&times;</button>
                    </div>

                    <div id="ai-content-area" class="flex-1 overflow-y-auto p-6">
                        <div class="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                            <p class="text-white font-bold text-lg mb-3">👋 Welcome to ${this.currentCourse?.name || 'Your Course'}!</p>
                            <p class="text-gray-300 mb-4">I'm your AI teacher powered by Google's Gemini Pro. I provide:</p>
                            <ul class="text-gray-300 space-y-2">
                                <li>✅ Real-time answers to any question about this subject</li>
                                <li>✅ Visual explanations using the whiteboard</li>
                                <li>✅ Custom quizzes based on your learning</li>
                                <li>✅ Assignment help and feedback</li>
                                <li>✅ Progress tracking and recommendations</li>
                            </ul>
                            <p class="text-purple-300 mt-4 font-medium">Ask me anything about ${this.currentCourse?.name || 'this course'}!</p>
                        </div>
                    </div>

                    <div id="ai-input-area" class="p-4 border-t border-slate-700">
                        <div class="flex space-x-3">
                            <input type="text" id="ai-input" placeholder="Ask anything about ${this.currentCourse?.name || 'this course'}..." 
                                class="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-600 focus:border-purple-500 focus:outline-none"
                                onkeypress="if(event.key==='Enter') window.productionAI.sendMessage()">
                            <button onclick="window.productionAI.sendMessage()" 
                                class="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    close() {
        document.getElementById('ai-teacher-modal')?.remove();
    }

    switchMode(mode) {
        const contentArea = document.getElementById('ai-content-area');
        const inputArea = document.getElementById('ai-input-area');

        // Update active button
        document.querySelectorAll('#ai-teacher-modal button').forEach(btn => {
            btn.className = btn.className.replace('bg-purple-500/20 text-white font-medium', 'hover:bg-purple-500/20 text-slate-300');
        });
        event.target.className = 'w-full text-left px-4 py-3 rounded-lg bg-purple-500/20 text-white font-medium';

        switch (mode) {
            case 'chat':
                inputArea.classList.remove('hidden');
                this.showChat();
                break;
            case 'canvas':
                inputArea.classList.add('hidden');
                this.showCanvas();
                break;
            case 'quiz':
                inputArea.classList.add('hidden');
                this.showQuiz();
                break;
            case 'assignment':
                inputArea.classList.add('hidden');
                this.showAssignment();
                break;
            case 'progress':
                inputArea.classList.add('hidden');
                this.showProgress();
                break;
        }
    }

    showChat() {
        const contentArea = document.getElementById('ai-content-area');
        contentArea.innerHTML = `
            <div class="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                <p class="text-white font-bold text-lg mb-3">💬 Ask Me Anything</p>
                <p class="text-gray-300">I'm ready to answer questions about ${this.currentCourse?.name || 'this course'}. Type your question below!</p>
            </div>
        `;

        // Restore chat history
        this.chatHistory.forEach(msg => {
            this.addMessage(msg.text, msg.sender);
        });
    }

    showCanvas() {
        const contentArea = document.getElementById('ai-content-area');
        contentArea.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="bg-slate-800 p-4 rounded-t-xl flex justify-between items-center">
                    <h3 class="text-white font-bold">🎨 Interactive Whiteboard</h3>
                    <div class="flex space-x-2">
                        <button onclick="window.productionAI.clearCanvas()" class="bg-red-500 text-white px-4 py-2 rounded-lg">Clear</button>
                        <button onclick="window.productionAI.askAIToDraw()" class="bg-purple-500 text-white px-4 py-2 rounded-lg">AI Draw</button>
                    </div>
                </div>
                <canvas id="whiteboard-canvas" class="flex-1 bg-white rounded-b-xl cursor-crosshair"></canvas>
            </div>
        `;

        setTimeout(() => this.initCanvas(), 100);
    }

    initCanvas() {
        this.canvas = document.getElementById('whiteboard-canvas');
        if (!this.canvas) return;

        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.canvasCtx = this.canvas.getContext('2d');

        let drawing = false;
        this.canvas.addEventListener('mousedown', () => drawing = true);
        this.canvas.addEventListener('mouseup', () => drawing = false);
        this.canvas.addEventListener('mousemove', (e) => {
            if (!drawing) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.canvasCtx.lineWidth = 3;
            this.canvasCtx.lineCap = 'round';
            this.canvasCtx.strokeStyle = '#8b5cf6';
            this.canvasCtx.lineTo(x, y);
            this.canvasCtx.stroke();
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(x, y);
        });
    }

    clearCanvas() {
        if (this.canvasCtx && this.canvas) {
            this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    async askAIToDraw() {
        const prompt = window.prompt('What should I draw? (e.g., "Draw a neural network diagram")');
        if (!prompt) return;

        this.showNotification('🎨 AI is generating visual explanation...', 'info');
        const response = await this.getGeminiResponse(`Create a text-based visual explanation for: ${prompt}. Use ASCII art or detailed description for ${this.currentCourse?.name}.`);

        // Draw text on canvas
        if (this.canvasCtx) {
            this.canvasCtx.fillStyle = '#000';
            this.canvasCtx.font = '14px monospace';
            const lines = response.split('\n');
            lines.forEach((line, i) => {
                this.canvasCtx.fillText(line, 10, 20 + i * 16);
            });
        }
    }

    async showQuiz() {
        const contentArea = document.getElementById('ai-content-area');
        contentArea.innerHTML = '<div class="flex items-center justify-center h-full"><div class="text-white text-lg">🔄 Generating quiz...</div></div>';

        const quizPrompt = `Generate a 5-question multiple choice quiz for ${this.currentCourse?.name}. Format as JSON: [{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0}]`;
        const response = await this.getGeminiResponse(quizPrompt);

        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            const quiz = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

            contentArea.innerHTML = `
                <div class="bg-slate-800 rounded-xl p-6">
                    <h3 class="text-white font-bold text-2xl mb-6">📝 Quiz: ${this.currentCourse?.name}</h3>
                    <div id="quiz-questions" class="space-y-6"></div>
                    <button onclick="window.productionAI.submitQuiz()" class="mt-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl">Submit Quiz</button>
                </div>
            `;

            const questionsDiv = document.getElementById('quiz-questions');
            quiz.forEach((q, i) => {
                questionsDiv.innerHTML += `
                    <div class="bg-slate-700 p-4 rounded-lg">
                        <p class="text-white font-medium mb-3">${i + 1}. ${q.question}</p>
                        <div class="space-y-2">
                            ${q.options.map((opt, j) => `
                                <label class="flex items-center text-gray-300 cursor-pointer hover:text-white">
                                    <input type="radio" name="q${i}" value="${j}" class="mr-2">
                                    ${opt}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `;
            });

            this.currentQuiz = quiz;
        } catch (e) {
            contentArea.innerHTML = '<div class="text-red-400 p-6">Failed to generate quiz. Please try again.</div>';
        }
    }

    submitQuiz() {
        if (!this.currentQuiz) return;

        let score = 0;
        this.currentQuiz.forEach((q, i) => {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (selected && parseInt(selected.value) === q.correct) score++;
        });

        const percentage = Math.round((score / this.currentQuiz.length) * 100);
        window.userStorage.saveQuizResult(this.currentCourse.id, { score: percentage, date: new Date().toISOString() });

        this.showNotification(`🎉 Quiz Complete! Score: ${score}/${this.currentQuiz.length} (${percentage}%)`, 'success');
        this.switchMode('progress');
    }

    showAssignment() {
        const contentArea = document.getElementById('ai-content-area');
        contentArea.innerHTML = `
            <div class="bg-slate-800 rounded-xl p-6">
                <h3 class="text-white font-bold text-2xl mb-6">📋 Submit Assignment</h3>
                <div class="space-y-4">
                    <div>
                        <label class="text-white font-medium block mb-2">Assignment Title</label>
                        <input type="text" id="assignment-title" class="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none" placeholder="Enter assignment title">
                    </div>
                    <div>
                        <label class="text-white font-medium block mb-2">Description</label>
                        <textarea id="assignment-desc" rows="4" class="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none" placeholder="Describe your work"></textarea>
                    </div>
                    <div>
                        <label class="text-white font-medium block mb-2">Project Link / GitHub URL</label>
                        <input type="url" id="assignment-link" class="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none" placeholder="https://github.com/...">
                    </div>
                    <button onclick="window.productionAI.submitAssignment()" class="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl">Submit Assignment</button>
                </div>
            </div>
        `;
    }

    submitAssignment() {
        const title = document.getElementById('assignment-title').value;
        const desc = document.getElementById('assignment-desc').value;
        const link = document.getElementById('assignment-link').value;

        if (!title || !desc) {
            this.showNotification('❌ Please fill in all fields', 'error');
            return;
        }

        window.courseManager.submitAssignment(this.currentCourse.id, { title, description: desc, link });
        this.showNotification('✅ Assignment submitted successfully!', 'success');
        this.switchMode('progress');
    }

    showProgress() {
        const progress = window.userStorage.getUserProgress(this.currentCourse.id);
        const quizResults = window.userStorage.getQuizResults(this.currentCourse.id);
        const assignments = window.userStorage.getAssignments(this.currentCourse.id);

        const contentArea = document.getElementById('ai-content-area');
        contentArea.innerHTML = `
            <div class="bg-slate-800 rounded-xl p-6">
                <h3 class="text-white font-bold text-2xl mb-6">📊 Your Progress</h3>
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-purple-500/20 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-purple-400">${this.currentCourse?.progress || 0}%</div>
                        <div class="text-sm text-gray-300">Course Progress</div>
                    </div>
                    <div class="bg-cyan-500/20 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-cyan-400">${quizResults.length}</div>
                        <div class="text-sm text-gray-300">Quizzes Taken</div>
                    </div>
                    <div class="bg-green-500/20 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-green-400">${assignments.length}</div>
                        <div class="text-sm text-gray-300">Assignments</div>
                    </div>
                </div>
                
                <div class="bg-slate-700 rounded-lg p-4 mb-4">
                    <h4 class="text-white font-bold mb-3">Recent Quiz Scores</h4>
                    ${quizResults.length ? quizResults.slice(-5).map(r => `
                        <div class="flex justify-between text-gray-300 mb-2">
                            <span>${new Date(r.date).toLocaleDateString()}</span>
                            <span class="font-bold ${r.score >= 70 ? 'text-green-400' : 'text-yellow-400'}">${r.score}%</span>
                        </div>
                    `).join('') : '<p class="text-gray-400">No quizzes taken yet</p>'}
                </div>
                
                <div class="bg-slate-700 rounded-lg p-4">
                    <h4 class="text-white font-bold mb-3">Submitted Assignments</h4>
                    ${assignments.length ? assignments.map(a => `
                        <div class="bg-slate-600 p-3 rounded mb-2">
                            <p class="text-white font-medium">${a.title}</p>
                            <p class="text-gray-400 text-sm">${new Date(a.submittedAt).toLocaleDateString()}</p>
                        </div>
                    `).join('') : '<p class="text-gray-400">No assignments submitted yet</p>'}
                </div>
            </div>
        `;
    }

    async sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatHistory.push({ text: message, sender: 'user' });
        input.value = '';
        this.showTyping();

        const contextPrompt = `You are an expert teacher for "${this.currentCourse?.name}". Student question: ${message}. Provide detailed, educational response with examples.`;
        const response = await this.getGeminiResponse(contextPrompt);

        this.hideTyping();
        this.addMessage(response, 'ai');
        this.chatHistory.push({ text: response, sender: 'ai' });
    }

    async getGeminiResponse(message) {
        try {
            // Use the backend API instead of direct Gemini call
            const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000/api/ai-teacher/chat'
                : '/api/ai-teacher/chat'; // Production relative path

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    course: this.currentCourse?.id || 'general'
                })
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            return data.response || 'I apologize, but I didn\'t get a response. Please try again.';
        } catch (e) {
            console.error('AI Error:', e);
            return 'I apologize, but I\'m having trouble connecting to the server. Please ensure the backend is running.';
        }
    }

    addMessage(text, sender) {
        const area = document.getElementById('ai-content-area');
        const div = document.createElement('div');
        div.className = sender === 'user' ? 'flex justify-end mb-4' : 'flex justify-start mb-4';
        div.innerHTML = sender === 'user'
            ? `<div class="bg-cyan-500 text-white rounded-xl px-4 py-3 max-w-[70%]"><p class="text-sm whitespace-pre-line">${text}</p></div>`
            : `<div class="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 max-w-[80%]"><div class="flex items-start space-x-3"><span class="text-xl">🤖</span><div class="text-gray-200 text-sm whitespace-pre-line">${text}</div></div></div>`;
        area.appendChild(div);
        area.scrollTop = area.scrollHeight;
    }

    showTyping() {
        const area = document.getElementById('ai-content-area');
        const div = document.createElement('div');
        div.id = 'typing';
        div.className = 'flex justify-start mb-4';
        div.innerHTML = '<div class="bg-purple-500/20 rounded-xl px-4 py-3"><div class="flex space-x-1"><div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay:0.1s"></div><div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay:0.2s"></div></div></div>';
        area.appendChild(div);
        area.scrollTop = area.scrollHeight;
    }

    hideTyping() {
        document.getElementById('typing')?.remove();
    }

    showNotification(message, type = 'info') {
        const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-[70] max-w-md`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
}

window.productionAI = new ProductionAITeacher();
