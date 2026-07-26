// AI Teacher Agent - Tiered access with memory and RAG
class AITeacherAgent {
    constructor() {
        this.apiKey = 'AIzaSyAttFZJQ1mdp41Q_lkWdtHTrWsRc5leDLs';
        this.chatHistory = [];
        this.currentCourse = null;
        this.userTier = 'Free';
    }

    async initialize(userId, courseId) {
        this.currentCourse = await window.firestoreManager.getCourse(courseId);
        const subscription = await window.firestoreManager.getUserSubscription(userId);
        this.userTier = subscription.tier;
        
        // Load chat history
        this.chatHistory = await window.firestoreManager.getChatHistory(userId, courseId);
    }

    getModel() {
        // Tiered model selection
        if (this.userTier === 'Premium') {
            return 'gemini-pro';
        }
        return 'gemini-2.0-flash-exp'; // Free/Basic tier
    }

    async checkMessageLimit(userId) {
        if (this.userTier !== 'Free') return {allowed: true};
        
        const subscription = await window.firestoreManager.getUserSubscription(userId);
        if (subscription.messagesUsed >= subscription.messagesLimit) {
            return {allowed: false, message: 'Daily message limit reached. Upgrade to Basic for unlimited messages.'};
        }
        return {allowed: true};
    }

    async sendMessage(userId, message) {
        // Check message limit
        const limitCheck = await this.checkMessageLimit(userId);
        if (!limitCheck.allowed) {
            return {error: limitCheck.message};
        }

        // Add user message to history
        this.chatHistory.push({role: 'user', parts: [{text: message}]});
        
        // Save to Firestore
        await window.firestoreManager.saveChatMessage(userId, this.currentCourse.id, {
            role: 'user',
            content: message
        });

        // Prepare API request
        const systemInstruction = this.getSystemInstruction();
        const contents = this.chatHistory.slice(-10); // Last 10 messages for context

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.getModel()}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents,
                    systemInstruction: {parts: [{text: systemInstruction}]},
                    tools: [{googleSearch: {}}], // Enable Google Search grounding
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048
                    }
                })
            });

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error. Please try again.';

            // Add AI response to history
            this.chatHistory.push({role: 'model', parts: [{text: aiResponse}]});
            
            // Save to Firestore
            await window.firestoreManager.saveChatMessage(userId, this.currentCourse.id, {
                role: 'model',
                content: aiResponse
            });

            // Update message count for Free tier
            if (this.userTier === 'Free') {
                const subscription = await window.firestoreManager.getUserSubscription(userId);
                await window.firestoreManager.updateSubscription(userId, {
                    messagesUsed: (subscription.messagesUsed || 0) + 1
                });
            }

            return {response: aiResponse, groundingMetadata: data.candidates?.[0]?.groundingMetadata};
        } catch (e) {
            console.error('AI Teacher error:', e);
            return {error: 'Connection error. Please try again.'};
        }
    }

    getSystemInstruction() {
        const courseName = this.currentCourse?.name || 'this course';
        const courseDescription = this.currentCourse?.description || '';
        
        return `You are an expert AI tutor for "${courseName}". ${courseDescription}

Your role:
- Act as a friendly, patient, and knowledgeable teacher
- Provide clear, step-by-step explanations
- Use examples and analogies to clarify concepts
- Check for understanding by asking follow-up questions
- Encourage critical thinking and problem-solving
- Adapt your teaching style to the student's level
- Use the Google Search tool to provide up-to-date, accurate information
- When explaining code, provide working examples
- Break down complex topics into digestible parts

Teaching principles:
1. Start with fundamentals before advanced concepts
2. Use real-world examples and applications
3. Encourage hands-on practice
4. Provide constructive feedback
5. Celebrate progress and learning milestones

Always maintain a supportive, encouraging tone and focus on helping the student truly understand the material.`;
    }

    clearHistory() {
        this.chatHistory = [];
    }

    getMessageCount() {
        return this.chatHistory.filter(m => m.role === 'user').length;
    }
}

window.AITeacherAgent = AITeacherAgent;
